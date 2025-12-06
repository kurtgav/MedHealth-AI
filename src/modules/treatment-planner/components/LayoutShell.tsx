'use client';

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import { fadeInUp } from "../animations/variants";
import { usePlannerState } from "../hooks/usePlannerState";
import { AnimationProvider, PageTransition } from "./AnimationProvider";
import { Dashboard } from "./Dashboard";
import { FeatureGrid } from "./FeatureGrid";
import { HeroSection } from "./HeroSection";
import { IntakeWizard } from "./IntakeWizard";

export function LayoutShell() {
  const {
    patient,
    setPatient,
    plan,
    loading,
    error,
    validationError,
    circuitOpenUntil,
    runAnalysis,
    loadSample,
    auditLog,
    recordAudit,
  } = usePlannerState();

  return (
    <AnimationProvider>
      <PageTransition className="bg-[var(--light-bg)]">
        <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10 md:px-10 md:py-14 lg:py-16">
          <TopNav />
          <HeroSection />
          <FeatureGrid />
          <IntakeWizard
            patient={patient}
            onChange={setPatient}
            onAnalyze={runAnalysis}
            onLoadSample={loadSample}
            loading={loading}
            error={error}
            validationError={validationError}
            onRetry={runAnalysis}
          />
          <Dashboard
            data={plan}
            loading={loading}
            error={error}
            validationError={validationError}
            onRetry={runAnalysis}
            patient={patient}
            onIssueDecision={(action, description, note) =>
              recordAudit({
                action: action === "override" ? "issue_overridden" : "issue_accepted",
                detail: `${description}${note ? ` | note: ${note}` : ""}`,
              })
            }
            onCopyJson={() => {
              if (!plan) return;
              navigator.clipboard?.writeText(JSON.stringify(plan, null, 2)).catch(() => {});
            }}
          />
          <AuditLog auditLog={auditLog} circuitOpenUntil={circuitOpenUntil} />
        </main>
      </PageTransition>
    </AnimationProvider>
  );
}

function AuditLog({
  auditLog,
  circuitOpenUntil,
}: {
  auditLog: { timestamp: string; action: string; detail?: string }[];
  circuitOpenUntil: number | null;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (!auditLog.length) return null;
  return (
    <section className="rounded-2xl bg-white/70 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">Audit log (session)</h3>
      {circuitOpenUntil && circuitOpenUntil > now ? (
        <p className="text-xs text-[var(--risk-medium)]">
          Circuit breaker active until {new Date(circuitOpenUntil).toLocaleTimeString()} due to repeated failures.
        </p>
      ) : null}
      <ul className="mt-2 space-y-1 text-xs text-[var(--text-secondary)]">
        {auditLog.map((entry, idx) => (
          <li key={entry.timestamp + idx} className="rounded bg-muted px-2 py-1">
            <span className="font-semibold text-[var(--text-primary)]">{entry.action}</span> — {entry.detail || "n/a"} (
            {new Date(entry.timestamp).toLocaleTimeString()})
          </li>
        ))}
      </ul>
    </section>
  );
}

function TopNav() {
  return (
    <motion.header
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/70 px-5 py-4 shadow-sm backdrop-blur"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary-blue)] to-[var(--primary-purple)] text-white shadow-lg">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">MedHealth AI</p>
          <p className="text-xs text-[var(--text-secondary)]">Clinical treatment plan assistant</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge className="bg-[var(--accent-green)]/15 text-[var(--accent-green)]">HIPAA-ready</Badge>
        <Badge className="bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]">Beta</Badge>
      </div>
    </motion.header>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        "border border-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}
