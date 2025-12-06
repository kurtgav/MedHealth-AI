export type LifestyleFactors = {
  smokingStatus: "never" | "former" | "current";
  alcoholUse: "none" | "social" | "regular";
  exerciseFrequency: "none" | "light" | "moderate" | "intense";
};

export type Medication = {
  name: string;
  dosage: string;
  frequency: string;
  route?: string;
  indication?: string;
};

export type HealthMetrics = {
  age: number;
  weightKg: number;
  heightCm?: number;
  bmi?: number;
  bloodPressure?: string;
};

export type PatientIntake = {
  id?: string;
  name: string;
  sex: "male" | "female" | "other";
  complaint: string;
  conditions: string[];
  allergies: string[];
  medications: Medication[];
  lifestyle: LifestyleFactors;
  metrics: HealthMetrics;
  notes?: string;
};

export type SafetyIssue = {
  type: "interaction" | "contraindication" | "dosage" | "allergy" | "other";
  severity: "low" | "medium" | "high";
  message: string;
  detail?: string;
};

export type TreatmentRecommendation = {
  medication: string;
  dosage: string;
  frequency: string;
  duration?: string;
  rationale: string;
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  alternatives?: string[];
};

export type TreatmentPlan = {
  riskScore: "low" | "medium" | "high";
  issues: SafetyIssue[];
  recommendations: TreatmentRecommendation[];
  summary: string;
  alternatives?: string[];
};

export type AIRequestPayload = {
  intake: PatientIntake;
  instructions?: string;
};

export type AIResponse = TreatmentPlan & {
  rawModelText?: string;
};

