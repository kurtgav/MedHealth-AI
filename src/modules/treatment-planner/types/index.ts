export type RiskLevel = "low" | "medium" | "high" | "critical";

export type FlaggedIssue = {
  type: "drug-drug" | "drug-condition" | "drug-allergy" | "dosage" | "other";
  severity: "minor" | "moderate" | "major" | "contraindicated";
  description: string;
  recommendation?: string;
  drugs?: string[];
};

export type Medication = {
  drugName: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  route: "oral" | "topical" | "injection" | "inhalation" | "other";
  duration: string;
  indication: string;
  instructions?: string;
};

export type NonPharm = {
  intervention: string;
  description: string;
  frequency: string;
};

export type FollowUp = {
  timeframe: string;
  tests: string[];
  monitoring: string[];
};

export type TreatmentPlan = {
  recommendedMedications: Medication[];
  nonPharmacological: NonPharm[];
  followUp: FollowUp;
};

export type TreatmentPlanBundle = {
  treatmentPlan: TreatmentPlan;
  safetyAssessment: {
    overallRiskScore: number;
    riskLevel: RiskLevel;
    flaggedIssues: FlaggedIssue[];
  };
  alternatives: {
    medication: string;
    rationale: string;
    safetyProfile: string;
  }[];
  rationale: {
    primaryRecommendation: string;
    evidenceLevel: "A" | "B" | "C" | "D";
    guidelines: string[];
    considerations: string[];
  };
  confidenceScore: number;
  alerts: {
    priority: "urgent" | "high" | "medium" | "low";
    message: string;
  }[];
};
