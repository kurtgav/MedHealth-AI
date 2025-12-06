import { MedHealthOutput } from "../types/medhealth";
import { FlaggedIssue, RiskLevel, TreatmentPlanBundle } from "../types";
import { computeRiskScoreFromIssues, riskLevelFromScore } from "./riskScore";

const severityMap: Record<string, FlaggedIssue["severity"]> = {
  contraindicated: "contraindicated",
  contra: "contraindicated",
  major: "major",
  high: "major",
  moderate: "moderate",
  medium: "moderate",
  minor: "minor",
  low: "minor",
};

const riskMap: Record<string, RiskLevel> = {
  low: "low",
  "low risk": "low",
  medium: "medium",
  moderate: "medium",
  "medium risk": "medium",
  high: "high",
  "high risk": "high",
  critical: "critical",
  "critical risk": "critical",
};

const routeMap: Record<string, TreatmentPlanBundle["treatmentPlan"]["recommendedMedications"][number]["route"]> = {
  PO: "oral",
  Oral: "oral",
  IV: "injection",
  IM: "injection",
  SQ: "injection",
  Topical: "topical",
  Inhalation: "inhalation",
};

function normalizeRoute(route: string | undefined) {
  if (!route) return "other";
  const key = route.trim().toUpperCase();
  return routeMap[key] ?? routeMap[route] ?? "other";
}

function inferType(raw: string): FlaggedIssue["type"] {
  const lower = raw.toLowerCase();
  if (lower.includes("drug") && lower.includes("interaction")) return "drug-drug";
  if (lower.includes("allergy")) return "drug-allergy";
  if (lower.includes("contra")) return "drug-condition";
  if (lower.includes("dose") || lower.includes("dosing")) return "dosage";
  return "other";
}

function normalizeSeverity(raw: string | undefined): FlaggedIssue["severity"] {
  if (!raw) return "moderate";
  const key = raw.trim().toLowerCase();
  return severityMap[key] ?? "moderate";
}

function normalizeRisk(raw: string | undefined, fallbackScore: number): RiskLevel {
  if (raw) {
    const key = raw.trim().toLowerCase();
    if (riskMap[key]) return riskMap[key];
  }
  return riskLevelFromScore(fallbackScore);
}

export function transformMedHealthOutput(payload: MedHealthOutput): TreatmentPlanBundle {
  const flaggedIssues: FlaggedIssue[] = (payload.flagged_issues ?? []).map((issue) => ({
    type: inferType(issue.type),
    severity: normalizeSeverity(issue.severity),
    description: issue.description,
    recommendation: issue.evidence || "Review clinician recommendation",
    drugs: undefined,
  }));

  const computedScore = computeRiskScoreFromIssues(flaggedIssues, payload.confidence_score);
  const riskLevel = normalizeRisk(payload.risk_level, computedScore);

  const recommendations = payload.treatment_plan?.recommendations ?? [];
  const recommendedMedications = recommendations.map((rec) => ({
    drugName: rec.medication,
    genericName: rec.medication,
    dosage: rec.dose,
    frequency: rec.frequency,
    route: normalizeRoute(rec.route),
    duration: rec.duration,
    indication: rec.indication ?? "See rationale",
    instructions: rec.monitoring?.join("; "),
  }));

  const nonPharmacological =
    payload.treatment_plan?.non_pharmacologic?.map((text) => ({
      intervention: text.split(":")[0]?.trim() || text,
      description: text,
      frequency: "as recommended",
    })) ?? [];

  return {
    treatmentPlan: {
      recommendedMedications,
      nonPharmacological,
      followUp: {
        timeframe: "2-4 weeks",
        tests: ["Labs/monitoring per recs"],
        monitoring: recommendations.flatMap((r) => r.monitoring ?? []),
      },
    },
    safetyAssessment: {
      overallRiskScore: computedScore,
      riskLevel,
      flaggedIssues,
    },
    alternatives:
      recommendations.flatMap((r) =>
        (r.alternative_options ?? []).map((alt) => ({
          medication: alt,
          rationale: "Alternative provided by model",
          safetyProfile: "Requires clinician review",
        })),
      ) ?? [],
    rationale: {
      primaryRecommendation: payload.rationale,
      evidenceLevel: "B",
      guidelines: ["LLM-provided rationale"],
      considerations: payload.flagged_issues.map((f) => f.description),
    },
    confidenceScore: payload.confidence_score,
    alerts: flaggedIssues.map((issue) => ({
      priority:
        issue.severity === "contraindicated"
          ? "urgent"
          : issue.severity === "major"
            ? "high"
            : issue.severity === "moderate"
              ? "medium"
              : "low",
      message: issue.description,
    })),
  };
}
