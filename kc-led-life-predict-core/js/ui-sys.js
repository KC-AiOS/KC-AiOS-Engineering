function loadCase() {
  const caseId = document.getElementById("caseSelect").value;
  if (!caseId) return;

  const c = CASE_LIBRARY[caseId];
  document.getElementById("caseDesc").textContent =
    "Loaded: " + c.name;

  // 套用 usage profile 到 UI
  document.getElementById("duty").value = c.usage.dutyCycle;
  document.getElementById("brightness").value = c.usage.brightnessRatio;
  document.getElementById("env").value = c.usage.environment;

  // 暫存給 runSystem 用
  window._caseBlu = c.blu;
}

function runSystem() {

  // LED core（之後可接 index.html）
  const ledResult = {
    valid: true,
    alpha: 1.2e-5
  };

  const bluResult = computeBLULife(
    ledResult,
    window._caseBlu || {}
  );

  const usage = {
    dutyCycle: Number(document.getElementById("duty").value),
    brightnessRatio: Number(document.getElementById("brightness").value),
    environment: document.getElementById("env").value
  };

  const sys = computeSystemLife(bluResult, usage);

  document.getElementById("sysOutput").textContent =
    JSON.stringify(sys, null, 2);
}

// ================================
// KC-K2-BLU-LIFE Kernel Mode (Judge UI)
// Minimal implementation v1.0
// ================================

// Internal state (simple lock)
let __pfDecision = {
  ok: false,
  boundary: null,   // B0/B1/B2/B3/B4
  pf: null,         // PF-S/PF-M/PF-L
  msg: "Not Evaluated"
};

function evaluateChange() {
  const changeType = document.getElementById("changeType").value;
  const changeTarget = document.getElementById("changeTarget").value;

  // Basic input guard
  if (!changeType || !changeTarget) {
    __pfDecision = { ok:false, boundary:null, pf:null, msg:"Please declare Change Type and Target first." };
    renderBoundaryDecision();
    return;
  }

  // ---- Boundary / PF-change mapping (Public Example) ----
  // You can refine this mapping later with your real Boundary Table.
  let boundary = "B3";
  let pf = "PF-S";
  let ok = true;
  let msg = "";

  // Simple deterministic rules:
  // - LED_CURRENT, POWER, USAGE are generally allowed but differ in severity by change type
  // - "Platform-breaking" examples should be rejected here (B1/B0). We'll keep minimal now.

  if (changeTarget === "LED_CURRENT") {
    boundary = "B4";
    pf = "PF-S";
    ok = true;
    msg = "Allowed: Parameter change (LED Current) → B4 / PF-S";
  } else if (changeTarget === "POWER") {
    boundary = "B2";
    pf = "PF-M";
    ok = true;
    msg = "Restricted: Functional module impact (BLU Power) → B2 / PF-M (validation required)";
  } else if (changeTarget === "USAGE") {
    boundary = "B3";
    pf = "PF-S";
    ok = true;
    msg = "Allowed: Usage profile variant → B3 / PF-S";
  }

  // If user declares TEMP_ENV and tries to treat it as small change, still PF-M (thermal/reliability impact)
  if (changeType === "TEMP_ENV") {
    if (boundary === "B4") {
      // still ok, but mark as PF-M because environment shift impacts reliability margin
      boundary = "B2";
      pf = "PF-M";
      msg = "Restricted: Environment temperature change impacts reliability → B2 / PF-M (validation required)";
    } else if (boundary === "B3") {
      boundary = "B2";
      pf = "PF-M";
      msg = "Restricted: Environment temperature change impacts reliability → B2 / PF-M (validation required)";
    }
  }

  // Save decision
  __pfDecision = { ok, boundary, pf, msg };
  renderBoundaryDecision();
}

function renderBoundaryDecision() {
  const boundaryResult = document.getElementById("boundaryResult");
  const pfDecision = document.getElementById("pfDecision");

  if (boundaryResult) boundaryResult.textContent = __pfDecision.msg || "Not Evaluated";
  if (pfDecision) {
    pfDecision.textContent =
      `Boundary: ${__pfDecision.boundary || "-"}\n` +
      `PF-change: ${__pfDecision.pf || "-"}\n` +
      `Gate: ${__pfDecision.ok ? "ALLOWED" : "REJECTED"}`;
  }

  // Reset verdict when re-evaluating change
  const sysVerdict = document.getElementById("sysVerdict");
  if (sysVerdict) sysVerdict.textContent = "Awaiting decision request...";
}

function pfDecisionReady() {
  return !!(__pfDecision && __pfDecision.ok);
}

// This is the wrapper that replaces direct "Calculate"
function requestDecision() {
  // 1) Gate check
  if (!pfDecisionReady()) {
    alert("Change not approved by Boundary. Please click 'Evaluate Change' first.");
    return;
  }

  // 2) Run your original compute core
  // IMPORTANT: runSystem() must already exist (in sys-life-stack.js or elsewhere).
  if (typeof runSystem !== "function") {
    alert("runSystem() not found. Please confirm sys-life-stack.js defines runSystem().");
    return;
  }

  runSystem(); // keep original behavior

  // 3) Apply Kernel-style verdict based on output text (minimal, deterministic rule)
  applyKernelVerdict();
}

function applyKernelVerdict() {
  const out = (document.getElementById("sysOutput")?.textContent || "").toLowerCase();
  const sysVerdict = document.getElementById("sysVerdict");

  // Minimal heuristic:
  // If your runSystem() already outputs a margin number, we can parse it later.
  // For now, interpret keywords if present; else default WARNING.
  let verdict = "WARNING";
  let reason = "No explicit margin found. Default to WARNING (requires review).";

  if (out.includes("fail") || out.includes("reject")) {
    verdict = "FAIL";
    reason = "Kernel detected FAIL signal from output.";
  } else if (out.includes("pass") || out.includes("approved")) {
    verdict = "PASS";
    reason = "Kernel detected PASS signal from output.";
  }

  // Compose final verdict text
  if (sysVerdict) {
    sysVerdict.textContent =
      `VERDICT: ${verdict}\n` +
      `Boundary: ${__pfDecision.boundary}\n` +
      `PF-change: ${__pfDecision.pf}\n` +
      `Reason: ${reason}\n` +
      `Action: ${verdict === "PASS" ? "APPROVED" : (verdict === "FAIL" ? "REJECT or ESCALATE PF" : "MITIGATION REQUIRED")}`;
  }
}

