export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IssueSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IssueType = 'DRUG_INTERACTION' | 'CONTRAINDICATION' | 'DOSAGE_CONCERN' | 'ALLERGY_RISK';

export interface TreatmentMedication {
  name: string;
  dosage: string;
  frequency?: string;
  duration?: string;
  rationale?: string;
}

export interface TreatmentPlan {
  primaryMedication: TreatmentMedication;
  alternativeMedications: TreatmentMedication[];
  nonPharmacological: string[];
}

export interface FlaggedIssue {
  type: IssueType;
  severity: IssueSeverity;
  description: string;
  affectedDrugs: string[];
  recommendation: string;
}

export interface SafetyAssessment {
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  flaggedIssues: FlaggedIssue[];
}

export interface ClinicalRationale {
  diagnosisConsiderations: string[];
  treatmentJustification: string;
  monitoringRecommendations: string[];
  followUpSchedule: string;
}

export interface AlternativeTreatment {
  approach: string;
  description: string;
  suitabilityScore: number; // 0-100
}

export interface ConfidenceScores {
  overallConfidence: number;
  diagnosisConfidence: number;
  treatmentConfidence: number;
}

export interface AIResponse {
  treatmentPlan: TreatmentPlan;
  safetyAssessment: SafetyAssessment;
  clinicalRationale: ClinicalRationale;
  alternativeTreatments: AlternativeTreatment[];
  confidenceScores: ConfidenceScores;
}
