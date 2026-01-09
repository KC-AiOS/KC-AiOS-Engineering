// KC-SYS-LIFE-STACK core
// BLU alpha -> System life with usage profile

function computeSystemLife(bluResult, usage) {

  if (!bluResult || bluResult.valid !== true) {
    return {
      valid: false,
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

  // --- governance ---
  let claimLevel = "INTERNAL_REFERENCE";

  if (lifeConfidence === "HIGH" && usage.environment === "INDOOR") {
    claimLevel = "SYSTEM_DATASHEET";
  } else if (lifeConfidence !== "LOW") {
    claimLevel = "PROJECT_SPEC_ONLY";
  }

  return {
    valid: true,
    alpha_sys,
    L70_sys,
    claimLevel,
    factors: {
      K_duty,
      K_brightness,
      K_environment
    }
  };
}
