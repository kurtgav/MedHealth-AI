import { PatientIntake } from './patient';
import { AIResponse } from './treatment';

export interface AIAnalysisRequest {
  patientData: PatientIntake;
}

export interface AIAnalysisProgress {
  step:
    | 'idle'
    | 'preparing'
    | 'analyzing-medications'
    | 'checking-interactions'
    | 'generating-recommendations'
    | 'validating'
    | 'completed'
    | 'error';
  message?: string;
}

export interface AIAnalysisResult {
  response?: AIResponse;
  validation?: ValidationResult;
  errors?: string[];
}

export interface AuditLogEntry {
  timestamp: string;
  userId: string;
  patientId: string;
  action: 'VIEW' | 'APPROVE' | 'MODIFY' | 'REJECT' | 'REQUEST_SECOND_OPINION';
  treatmentPlanId: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
}

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'minor' | 'moderate' | 'major';
  description: string;
  mechanism: string;
  clinicalEffects: string[];
  management: string;
}

export interface ValidationResult {
  missedInteractions: DrugInteraction[];
  matchedInteractions: DrugInteraction[];
}
