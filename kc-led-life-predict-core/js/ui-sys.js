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
