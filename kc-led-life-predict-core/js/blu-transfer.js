function computeBLULife(ledResult, bluParams) {

  if (!ledResult || ledResult.valid !== true) {
    return { valid: false };
  }

  const K_temp = bluParams.K_temp || 1.0;
  const K_current = bluParams.K_current || 1.0;
  const alpha_optical = bluParams.alpha_optical || 0;

  const alpha_BLU =
    ledResult.alpha *
    K_temp *
    K_current +
    alpha_optical;

  const L70_BLU =
    -Math.log(0.7) / alpha_BLU;

  return {
    valid: true,
    alpha_BLU,
    L70_BLU,
    lifeConfidence: bluParams.lifeConfidence || "MEDIUM",
    lifeClaimStatus: bluParams.lifeClaimStatus || "ALLOWED"
  };
}
