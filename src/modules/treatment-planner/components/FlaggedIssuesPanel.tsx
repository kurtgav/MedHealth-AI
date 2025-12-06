'use client';

import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { motion } from "framer-motion";

import { fadeInUp, staggerContainer } from "../animations/variants";
import { FlaggedIssue } from "../types";

interface FlaggedIssuesPanelProps {
  issues: FlaggedIssue[];
  onDecision?: (action: "accept" | "override", description: string, note?: string) => void;
}

export function FlaggedIssuesPanel({ issues, onDecision }: FlaggedIssuesPanelProps) {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="glass-surface glass-outline rounded-2xl p-6 shadow-lg"
    >
      <motion.div variants={fadeInUp} className="mb-4 flex items-center gap-2">
        <AlertTriangle className="size-5 text-[var(--risk-high)]" />
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Flagged Issues</p>
          <p className="text-xs text-[var(--text-secondary)]">Safety-first: highest severity first</p>
        </div>
      </motion.div>

      <div className="space-y-3">
        {issues.map((issue, i) => (
          <motion.div
            key={issue.description}
            variants={fadeInUp}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "rounded-xl border px-4 py-3 shadow-sm",
              severityClass(issue.severity),
              "hover-lift",
            )}
          >
            <div className="flex items-start gap-3">
              {iconForSeverity(issue.severity)}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-[var(--text-primary)]">{issue.type}</p>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold uppercase", pillClass(issue.severity))}>
                    {issue.severity}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{issue.description}</p>
                {issue.recommendation ? (
                  <p className="text-xs font-semibold text-[var(--text-primary)]">
                    Recommendation: <span className="font-normal text-[var(--text-secondary)]">{issue.recommendation}</span>
                  </p>
                ) : null}
                {issue.drugs?.length ? (
                  <p className="text-xs text-[var(--text-secondary)]">Drugs: {issue.drugs.join(", ")}</p>
                ) : null}
                {onDecision ? (
                  <div className="flex gap-2 pt-1">
                    <button
                      className="rounded border border-[var(--border)] px-2 py-1 text-[11px] font-semibold text-[var(--text-primary)] hover:bg-muted"
                      onClick={() => onDecision("accept", issue.description)}
                    >
                      Accept
                    </button>
                    <button
                      className="rounded border border-[var(--risk-medium)]/50 px-2 py-1 text-[11px] font-semibold text-[var(--risk-medium)] hover:bg-[var(--risk-medium)]/10"
                      onClick={() => {
                        const note = typeof window !== "undefined" ? window.prompt("Add justification for override") || "" : "";
                        onDecision("override", issue.description, note || undefined);
                      }}
                    >
                      Override
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function severityClass(severity: FlaggedIssue["severity"]) {
  switch (severity) {
    case "contraindicated":
      return "border-[var(--risk-critical)]/30 bg-[var(--risk-critical)]/5";
    case "major":
      return "border-[var(--risk-high)]/30 bg-[var(--risk-high)]/5";
    case "moderate":
      return "border-[var(--risk-medium)]/30 bg-[var(--risk-medium)]/5";
    case "minor":
    default:
      return "border-[var(--accent-green)]/30 bg-[var(--accent-green)]/5";
  }
}

function pillClass(severity: FlaggedIssue["severity"]) {
  switch (severity) {
    case "contraindicated":
      return "bg-[var(--risk-critical)]/15 text-[var(--risk-critical)]";
    case "major":
      return "bg-[var(--risk-high)]/15 text-[var(--risk-high)]";
    case "moderate":
      return "bg-[var(--risk-medium)]/15 text-[var(--risk-medium)]";
    case "minor":
    default:
      return "bg-[var(--accent-green)]/15 text-[var(--accent-green)]";
  }
}

function iconForSeverity(severity: FlaggedIssue["severity"]) {
  switch (severity) {
    case "contraindicated":
      return <AlertTriangle className="mt-0.5 size-5 text-[var(--risk-critical)]" />;
    case "major":
      return <AlertTriangle className="mt-0.5 size-5 text-[var(--risk-high)]" />;
    case "moderate":
      return <Info className="mt-0.5 size-5 text-[var(--risk-medium)]" />;
    case "minor":
    default:
      return <CheckCircle2 className="mt-0.5 size-5 text-[var(--accent-green)]" />;
  }
}
