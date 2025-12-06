import { TreatmentPlanBundle } from "../types";

export const highRiskDemoPlan: TreatmentPlanBundle = {
  treatmentPlan: {
    recommendedMedications: [
      {
        drugName: "Lisinopril",
        genericName: "Lisinopril",
        dosage: "20mg",
        frequency: "once daily",
        route: "oral",
        duration: "chronic",
        indication: "Hypertension",
        instructions: "Take in the morning; monitor BP and potassium.",
      },
      {
        drugName: "Atorvastatin",
        genericName: "Atorvastatin",
        dosage: "20mg",
        frequency: "once daily at bedtime",
        route: "oral",
        duration: "chronic",
        indication: "Hyperlipidemia",
        instructions: "Avoid grapefruit juice; monitor CK if muscle pain.",
      },
    ],
    nonPharmacological: [
      {
        intervention: "Sodium reduction",
        description: "DASH-style diet with sodium <1.5g/day.",
        frequency: "Daily",
      },
      {
        intervention: "Exercise",
        description: "Moderate-intensity aerobic exercise 30 min",
        frequency: "5x/week",
      },
      {
        intervention: "Stress management",
        description: "Mindfulness/CBT to reduce stress-related BP elevation.",
        frequency: "Daily",
      },
    ],
    followUp: {
      timeframe: "2 weeks",
      tests: ["BMP (potassium, creatinine)", "Blood pressure log", "CK if statin symptoms"],
      monitoring: ["BP twice daily", "Assess dizziness or syncope", "Monitor muscle aches/weakness"],
    },
  },
  safetyAssessment: {
    overallRiskScore: 78,
    riskLevel: "high",
    flaggedIssues: [
      {
        type: "drug-drug",
        severity: "contraindicated",
        description: "NSAIDs with warfarin markedly increase bleeding risk.",
        recommendation: "Avoid systemic NSAIDs; prefer topical options or non-NSAID analgesics.",
        drugs: ["Warfarin", "NSAIDs"],
      },
      {
        type: "drug-condition",
        severity: "major",
        description: "NSAIDs in CKD stage 3 risk nephrotoxicity and further GFR decline.",
        recommendation: "Avoid chronic NSAIDs; consider alternative pain control and nephrology input.",
        drugs: ["NSAIDs"],
      },
      {
        type: "dosage",
        severity: "moderate",
        description: "Metformin with GFR 42 may need dose reduction and renal monitoring.",
        recommendation: "Review metformin dosing; monitor renal function.",
        drugs: ["Metformin"],
      },
    ],
  },
  alternatives: [
    {
      medication: "Topical NSAIDs",
      rationale: "Lower systemic exposure while addressing joint pain.",
      safetyProfile: "Reduced bleeding risk compared to oral NSAIDs.",
    },
    {
      medication: "Tramadol (short course)",
      rationale: "Non-NSAID analgesic if pain uncontrolled; monitor sedation.",
      safetyProfile: "Avoid with other serotonergic agents; adjust in renal impairment.",
    },
    {
      medication: "Physical therapy",
      rationale: "Improves mobility and pain control without pharmacologic risk.",
      safetyProfile: "No systemic adverse effects; reinforce adherence.",
    },
  ],
  rationale: {
    primaryRecommendation: "Optimize cardiometabolic control and avoid nephrotoxic/bleeding-risk combinations.",
    evidenceLevel: "B",
    guidelines: [
      "ACC/AHA Hypertension Guidelines",
      "KDIGO CKD recommendations",
      "Clinical pharmacology contraindication references",
    ],
    considerations: [
      "Monitor renal function and electrolytes",
      "Avoid NSAIDs with anticoagulation",
      "Encourage lifestyle changes to lower BP and lipid risk",
    ],
  },
  confidenceScore: 82,
  alerts: [
    {
      priority: "high",
      message: "Avoid systemic NSAIDs with warfarin (major bleed risk).",
    },
    {
      priority: "medium",
      message: "Reassess metformin dose with GFR ~42; monitor every 3 months.",
    },
    {
      priority: "medium",
      message: "Check lipid panel and CK if muscle pain on statin.",
    },
  ],
};
