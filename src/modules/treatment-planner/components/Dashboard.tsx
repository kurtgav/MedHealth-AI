'use client';

import { cn } from "@/lib/utils";
import { BookOpenCheck, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { fadeInUp } from "../animations/variants";
import { highRiskDemoPlan } from "../constants/demoPlan";
import { TreatmentPlanBundle } from "../types";
import { IntakePatient } from "../types/medhealth";
import { exportPlanToPdf } from "../utils/pdf";
import { FlaggedIssuesPanel } from "./FlaggedIssuesPanel";
import { GlassCard } from "./GlassCard";
import { RiskGauge } from "./RiskGauge";
import { TreatmentPlanCard } from "./TreatmentPlanCard";

interface DashboardProps {
  data?: TreatmentPlanBundle | null;
  loading?: boolean;
  error?: string | null;
  onIssueDecision?: (action: "accept" | "override", description: string, note?: string) => void;
  onCopyJson?: () => void;
  validationError?: string | null;
  onRetry?: () => void;
  patient?: IntakePatient;
}

export function Dashboard({
  data = highRiskDemoPlan,
  loading,
  error,
  validationError,
  onRetry,
  onIssueDecision,
  onCopyJson,
  patient,
}: DashboardProps) {
  const bundle = data ?? highRiskDemoPlan;
  const { treatmentPlan, safetyAssessment, alternatives, rationale, confidenceScore } = bundle;

  return (
    <section className="section-padding space-y-6">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex flex-wrap items-center gap-3">
        <h2 className="text-3xl font-semibold text-[var(--text-primary)]">Safety-checked Dashboard</h2>
        <span className="rounded-full bg-[var(--primary-blue)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary-blue)]">
          Confidence: {confidenceScore}%
        </span>
        <span className="rounded-full bg-[var(--risk-high)]/10 px-3 py-1 text-xs font-semibold text-[var(--risk-high)]">
          Risk: {safetyAssessment.riskLevel.toUpperCase()}
        </span>
        {loading ? <span className="text-xs text-[var(--text-secondary)]">Loading plan...</span> : null}
        {error ? (
          <span className="text-xs text-[var(--risk-high)]">
            Error: {error}{" "}
            {onRetry ? (
              <button
                className="ml-2 rounded border border-[var(--risk-high)]/40 px-2 py-0.5 text-[10px] font-semibold text-[var(--risk-high)] hover:bg-[var(--risk-high)]/10"
                onClick={onRetry}
                disabled={loading}
              >
                Retry
              </button>
            ) : null}
          </span>
        ) : null}
        {validationError ? (
          <span className="text-xs text-[var(--risk-medium)]">
            Validation: {validationError}{" "}
            {onRetry ? (
              <button
                className="ml-2 rounded border border-[var(--risk-medium)]/40 px-2 py-0.5 text-[10px] font-semibold text-[var(--risk-medium)] hover:bg-[var(--risk-medium)]/10"
                onClick={onRetry}
                disabled={loading}
              >
                Retry
              </button>
            ) : null}
          </span>
        ) : null}
        <div className="ml-auto flex gap-2">
          <button
            className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)] hover:bg-muted"
            onClick={onCopyJson}
          >
            Copy JSON
          </button>
          <button
            className="rounded-lg bg-[var(--primary-blue)] px-3 py-1 text-xs font-semibold text-white shadow hover:translate-y-[-1px]"
            onClick={() => {
              exportPlanToPdf(bundle, patient ?? { id: "patient", name: "", age: 0, sex: "other" });
            }}
          >
            Export / PDF
          </button>
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RiskGauge
          score={safetyAssessment.overallRiskScore}
          level={safetyAssessment.riskLevel}
          flaggedCount={safetyAssessment.flaggedIssues.length}
        />
        <div className="lg:col-span-2">
          <FlaggedIssuesPanel
            issues={safetyAssessment.flaggedIssues}
            onDecision={onIssueDecision}
          />
        </div>
      </div>

      <TreatmentPlanCard plan={treatmentPlan} />

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="bg-white/85" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="size-5 text-[var(--accent-coral)]" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">Alternatives</p>
          </div>
          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            {alternatives.map((alt) => (
              <div
                key={alt.medication}
                className="rounded-lg border border-[var(--border)] bg-white/80 px-3 py-3 shadow-sm"
              >
                <p className="font-semibold text-[var(--text-primary)]">{alt.medication}</p>
                <p>{alt.rationale}</p>
                <p className="text-xs text-[var(--text-secondary)]">Safety: {alt.safetyProfile}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="bg-white/85" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-3 flex items-center gap-2">
            <BookOpenCheck className="size-5 text-[var(--primary-purple)]" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">Clinical rationale</p>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">{rationale.primaryRecommendation}</p>
          <div className="mt-3 text-xs text-[var(--text-secondary)]">
            <p className="font-semibold text-[var(--text-primary)]">Guidelines</p>
            <ul className="list-disc space-y-1 pl-4">
              {rationale.guidelines.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          <div className="mt-3 text-xs text-[var(--text-secondary)]">
            <p className="font-semibold text-[var(--text-primary)]">Considerations</p>
            <ul className="list-disc space-y-1 pl-4">
              {rationale.considerations.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </GlassCard>
      </div>

      <GlassCard
        className="bg-[var(--dark-card)] text-white"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Shield className="size-5 text-[var(--accent-green)]" />
          <p className="text-sm font-semibold">Alerts</p>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {bundle.alerts.map((alert) => (
            <div
              key={alert.message}
              className={cn(
                "rounded-lg border px-3 py-3 text-sm backdrop-blur",
                alert.priority === "urgent"
                  ? "border-[var(--risk-critical)]/40 bg-[var(--risk-critical)]/10"
                  : alert.priority === "high"
                    ? "border-[var(--risk-high)]/40 bg-[var(--risk-high)]/10"
                    : alert.priority === "medium"
                      ? "border-[var(--risk-medium)]/40 bg-[var(--risk-medium)]/10"
                      : "border-[var(--accent-green)]/40 bg-[var(--accent-green)]/10",
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-wide">{alert.priority}</p>
              <p className="text-sm text-slate-100">{alert.message}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}
