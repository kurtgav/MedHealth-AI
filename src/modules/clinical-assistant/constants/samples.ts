import { PatientIntake } from "../types";

export const highRiskSample: PatientIntake = {
  id: "rx-demo-01",
  name: "Jordan Miller",
  sex: "male",
  complaint: "Chest discomfort with exertion; requests erectile dysfunction meds",
  conditions: ["CAD", "hypertension", "hyperlipidemia"],
  allergies: ["penicillin"],
  medications: [
    {
      name: "Nitroglycerin",
      dosage: "0.4 mg SL PRN",
      frequency: "Every 5 minutes as needed for angina",
      indication: "Angina",
    },
    {
      name: "Atorvastatin",
      dosage: "40 mg",
      frequency: "Nightly",
      indication: "Hyperlipidemia",
    },
    {
      name: "Metoprolol tartrate",
      dosage: "50 mg",
      frequency: "Twice daily",
      indication: "Hypertension",
    },
  ],
  lifestyle: {
    smokingStatus: "former",
    alcoholUse: "social",
    exerciseFrequency: "light",
  },
  metrics: {
    age: 62,
    weightKg: 94,
    heightCm: 178,
    bmi: 29.7,
    bloodPressure: "146/92",
  },
  notes:
    "Mild exertional chest discomfort, wants ED medication; no recent stress test.",
};

export const lowerRiskSample: PatientIntake = {
  id: "rx-demo-02",
  name: "Priya Raman",
  sex: "female",
  complaint: "Hair loss and fatigue",
  conditions: ["hypothyroidism (controlled)"],
  allergies: [],
  medications: [
    {
      name: "Levothyroxine",
      dosage: "75 mcg",
      frequency: "Daily",
      indication: "Hypothyroidism",
    },
  ],
  lifestyle: {
    smokingStatus: "never",
    alcoholUse: "none",
    exerciseFrequency: "moderate",
  },
  metrics: {
    age: 34,
    weightKg: 63,
    heightCm: 165,
    bmi: 23.1,
    bloodPressure: "112/72",
  },
  notes: "No pregnancy; considering topical minoxidil.",
};

