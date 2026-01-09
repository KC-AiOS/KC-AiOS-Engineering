const CASE_LIBRARY = {
  "CASE-AERO-001": {
    name: "Aerospace Display Baseline",
    blu: {
      K_temp: 2.0,
      K_current: 1.32,
      alpha_optical: 4e-6,
      lifeConfidence: "HIGH",
      lifeClaimStatus: "ALLOWED"
    },
    usage: {
      dutyCycle: 0.9,
      brightnessRatio: 0.8,
      environment: "AEROSPACE"
    }
  },

  "CASE-IND-001": {
    name: "Industrial HMI Standard",
    blu: {
      K_temp: 1.0,
      K_current: 1.0,
      alpha_optical: 3e-6,
      lifeConfidence: "HIGH",
      lifeClaimStatus: "ALLOWED"
    },
    usage: {
      dutyCycle: 0.5,
      brightnessRatio: 0.7,
      environment: "INDUSTRIAL"
    }
  },

  "CASE-AUTO-001": {
    name: "Automotive Cluster Typical",
    blu: {
      K_temp: 1.41,
      K_current: 1.22,
      alpha_optical: 3.5e-6,
      lifeConfidence: "MEDIUM",
      lifeClaimStatus: "ALLOWED"
    },
    usage: {
      dutyCycle: 0.3,
      brightnessRatio: 0.6,
      environment: "AUTOMOTIVE"
    }
  }
};
