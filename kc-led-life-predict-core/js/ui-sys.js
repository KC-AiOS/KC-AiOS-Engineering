function runSystem() {

  // mock TM-21 result (之後可由 index.html 傳入)
  const ledResult = {
    valid: true,
    alpha: 1.2e-5
  };

  const bluResult = computeBLULife(ledResult, {
    K_temp: 2.0,
    K_current: 1.3,
    alpha_optical: 4e-6,
    lifeConfidence: "HIGH",
    lifeClaimStatus: "ALLOWED"
  });

  const usage = {
    dutyCycle: Number(document.getElementById("duty").value),
    brightnessRatio: Number(document.getElementById("brightness").value),
    environment: document.getElementById("env").value
  };

  const sys = computeSystemLife(bluResult, usage);

  document.getElementById("sysOutput").textContent =
    JSON.stringify(sys, null, 2);
}
