import { FlaggedIssue } from "../types";

export function computeRiskScoreFromIssues(issues: FlaggedIssue[], confidenceScore?: number) {
  const weights: Record<FlaggedIssue["severity"], number> = {
    contraindicated: 35,
    major: 20,
    moderate: 10,
    minor: 4,
  };

  const base = issues.reduce((sum, issue) => sum + (weights[issue.severity] ?? 0), 0);

  // Scale with count to avoid empty arrays returning high scores
  const count = issues.length || 1;
  const normalized = Math.min(100, Math.round((base / count) * 1.4));

  // Blend with confidence if provided (lower confidence nudges risk up slightly)
  const confidence = confidenceScore ?? 70;
  const confidenceFactor = (100 - confidence) * 0.15; // up to +15 for very low confidence

  return Math.min(100, Math.max(0, normalized + confidenceFactor));
}

export function riskLevelFromScore(score: number): "low" | "medium" | "high" | "critical" {
  if (score >= 85) return "critical";
  if (score >= 65) return "high";
  if (score >= 40) return "medium";
  return "low";
}
