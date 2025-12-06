import { PatientIntake, RiskLevel, SafetyAssessment, ValidationResult } from '../types';

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm) return 0;
  const meters = heightCm / 100;
  const bmi = weightKg / (meters * meters);
  return Number(bmi.toFixed(1));
}

export function deriveRiskScore(
  intake: PatientIntake,
  safety?: SafetyAssessment,
  validation?: ValidationResult
): number {
  const ageWeight = Math.min(intake.personal.age / 100, 0.3);
  const bmiWeight = calculateBMI(intake.personal.weightKg, intake.personal.heightCm) / 50;
  const conditionWeight = Math.min(intake.history.conditions.length * 0.08, 0.4);
  const severityWeight = (intake.complaint.severity || 0) / 20;

  const flaggedHigh = safety?.flaggedIssues.filter((i) => i.severity === 'HIGH' || i.severity === 'CRITICAL').length ?? 0;
  const missedHigh = validation?.missedInteractions.length ?? 0;

  const interactionWeight = Math.min(flaggedHigh * 0.12 + missedHigh * 0.2, 0.5);
  const score = (ageWeight + bmiWeight + conditionWeight + severityWeight + interactionWeight) * 100;
  return Math.min(100, Number(score.toFixed(0)));
}

export function deriveRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}
