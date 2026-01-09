function generateProjectText(result) {
  if (!result || !result.L70_report) {
    return "Calculation not completed or insufficient data.";
  }

  return `
Based on LM-80 test data and TM-21 projection,
using the last half of the measured data,
the estimated L70 lifetime is approximately
${Math.round(result.L70_report)} hours.

This estimation is intended for project-level
design and specification reference only.
`;
}
