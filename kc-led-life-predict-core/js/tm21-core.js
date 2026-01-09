function computeTM21(data, options) {
  // build R and lnR
  const baseFlux = data[0].value;
  const points = data
    .filter(d => d.time > 0)
    .map(d => {
      const R = d.isR ? d.value : d.value / baseFlux;
      return { time: d.time, R, lnR: Math.log(R) };
    });

  if (points.length < 3) {
    return { valid: false, reason: "Not enough data" };
  }

  // fit window
  const maxTime = Math.max(...points.map(p => p.time));
  let fitStart = 1000;
  if (options.fitMode === "LAST_5000H") {
    fitStart = Math.max(1000, maxTime - 5000);
  } else if (options.fitMode === "LAST_HALF") {
    fitStart = Math.max(1000, Math.round(maxTime / 2));
  }

  const fit = points.filter(p => p.time >= fitStart);

  // regression
  const n = fit.length;
  const sumX = fit.reduce((a, b) => a + b.time, 0);
  const sumY = fit.reduce((a, b) => a + b.lnR, 0);
  const sumXX = fit.reduce((a, b) => a + b.time * b.time, 0);
  const sumXY = fit.reduce((a, b) => a + b.time * b.lnR, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  if (slope >= 0) {
    return { valid: false, reason: "Slope >= 0 (invalid decay)" };
  }

  // life calculation
  const L70_raw = (Math.log(0.7) - intercept) / slope;
  const L80_raw = (Math.log(0.8) - intercept) / slope;

  // TM-21 cap
  let multiplier = null;
  if (options.sampleSize >= 20) multiplier = 6;
  else if (options.sampleSize >= 10) multiplier = 5.5;
  else return { valid: false, reason: "Sample size < 10" };

  const lifeCap = options.testHours * multiplier;

  return {
    valid: true,
    slope,
    alpha: -slope,
    fitStart,
    fitEnd: maxTime,
    L70_raw,
    L70_report: Math.min(L70_raw, lifeCap),
    L80_raw,
    L80_report: Math.min(L80_raw, lifeCap),
    lifeCap
  };
}
