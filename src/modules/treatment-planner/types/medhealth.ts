export type MedHealthRecommendation = {
  medication: string;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
  indication?: string;
  monitoring?: string[];
  alternative_options?: string[];
  confidence: number;
};

export type MedHealthFlag = {
  type: string;
  description: string;
  severity: "Major" | "Moderate" | "Minor" | "Contraindicated";
  evidence?: string;
};

export type MedHealthOutput = {
  patient_id: string;
  timestamp: string;
  treatment_plan: {
    recommendations: MedHealthRecommendation[];
    non_pharmacologic?: string[];
  };
  risk_level: "Low" | "Medium" | "High" | "Critical";
  flagged_issues: MedHealthFlag[];
  rationale: string;
  confidence_score: number;
  raw_model_output?: string;
};

export type IntakePatient = {
  id: string;
  name: string;
  age: number;
  sex: "male" | "female" | "other";
  weight_kg?: number;
  height_cm?: number;
  bmi?: number;
  blood_pressure?: string;
  medical_history?: string[];
  allergies?: string[];
  current_medications?: { name: string; dose_mg?: number; frequency?: string; route?: string }[];
  lifestyle?: { smoking?: string; alcohol?: string; exercise?: string };
  primary_complaint?: string;
};
