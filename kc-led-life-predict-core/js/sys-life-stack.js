// KC-SYS-LIFE-STACK core
// BLU alpha -> System life with usage profile

function computeSystemLife(bluResult, usage) {

  if (!bluResult || bluResult.valid !== true) {
    return {
      valid: false,
      verdict: "FAIL",
      reason: "BLU life not valid or denied"
    };
  }

  const {
    alpha_BLU,
    lifeClaimStatus,
    lifeConfidence
  } = bluResult;

  if (lifeClaimStatus === "DENIED") {
    return {
      valid: false,
      verdict: "FAIL",
      reason: "Life claim denied at BLU level"
    };
  }

  // --- usage factors ---
  const K_duty = usage.dutyCycle; // 0~1

  const K_brightness = Math.pow(
    usage.brightnessRatio,
    usage.brightnessExponent || 1.5
  );

  const envTable = {
    "INDOOR": 1.0,
    "INDUSTRIAL": 1.2,
    "AUTOMOTIVE": 1.4,
    "AEROSPACE": 1.8
  };

  const K_environment =
    envTable[usage.environment] || 1.5;

  const alpha_sys =
    alpha_BLU *
    K_duty *
    K_brightness *
    K_environment;

  const L70_sys =
    -Math.log(0.7) / alpha_sys;

  // --- governance claim level ---
  let claimLevel = "INTERNAL_REFERENCE";

  if (lifeConfidence === "HIGH" && usage.environment === "INDOOR") {
    claimLevel = "SYSTEM_DATASHEET";
  } else if (lifeConfidence !== "LOW") {
    claimLevel = "PROJECT_SPEC_ONLY";
  }

  // ============================
  // KERNEL DECISION EXTENSION
  // ============================

  // Platform target life (example policy)
  const targetLifeTable = {
    "INDOOR": 30000,
    "INDUSTRIAL": 25000,
    "AUTOMOTIVE": 20000,
    "AEROSPACE": 15000
  };

  const targetLife =
    targetLifeTable[usage.environment] || 20000;

  const lifeMargin =
    (L70_sys - targetLife) / targetLife; // ratio

  let verdict = "PASS";
  let kernelReason = "Life margin acceptable";

  if (lifeMargin < -0.1) {
    verdict = "FAIL";
    kernelReason = "Life margin below -10% target";
  } else if (lifeMargin < 0) {
    verdict = "WARNING";
    kernelReason = "Life margin below target, mitigation required";
  }

  // --- FINAL KERNEL OUTPUT ---
  return {
    valid: true,
    verdict,               // PASS / WARNING / FAIL
    kernelReason,          // system-readable
    alpha_sys,
    L70_sys,
    targetLife,
    lifeMargin,            // 핵심：Kernel 判斷依據
    claimLevel,
    factors: {
      K_duty,
      K_brightness,
      K_environment
    }
  };
}
