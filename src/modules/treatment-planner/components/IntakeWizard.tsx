"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

import { fadeInUp, staggerContainer } from "../animations/variants";
import { IntakePatient } from "../types/medhealth";

type IntakeWizardProps = {
  patient: IntakePatient;
  onChange: (next: IntakePatient) => void;
  onAnalyze: () => void;
  onLoadSample: () => void;
  loading?: boolean;
  error?: string | null;
  validationError?: string | null;
  onRetry?: () => void;
};

const steps = ["Demographics", "History", "Complaint"];

export function IntakeWizard({
  patient,
  onChange,
  onAnalyze,
  onLoadSample,
  loading,
  error,
  validationError,
  onRetry,
}: IntakeWizardProps) {
  const [step, setStep] = useState(0);

  const update = (partial: Partial<IntakePatient>) => onChange({ ...patient, ...partial });

  return (
    <section className="section-padding space-y-4 rounded-2xl bg-white/80 shadow-lg">
      <header className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Intake wizard</p>
        <div className="flex flex-1 items-center gap-2">
          {steps.map((label, idx) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                  idx <= step ? "bg-[var(--primary-blue)] text-white" : "bg-muted text-[var(--text-secondary)]",
                )}
              >
                {idx + 1}
              </div>
              <p className={cn("text-sm", idx <= step ? "text-[var(--text-primary)] font-semibold" : "text-[var(--text-secondary)]")}>
                {label}
              </p>
              {idx < steps.length - 1 ? <div className="mx-2 h-px w-10 bg-muted" /> : null}
            </div>
          ))}
        </div>
        <button
          className="rounded-full border px-3 py-1 text-xs font-semibold text-[var(--text-primary)] hover:bg-muted"
          onClick={() => {
            onLoadSample();
            setStep(0);
          }}
        >
          Load sample
        </button>
      </header>

      {error ? (
        <div className="flex items-center gap-2 text-sm text-[var(--risk-high)]">
          <span>Error: {error}</span>
          {onRetry ? (
            <button
              className="rounded border border-[var(--risk-high)]/40 px-2 py-1 text-[11px] font-semibold text-[var(--risk-high)] hover:bg-[var(--risk-high)]/10"
              onClick={onRetry}
              disabled={loading}
            >
              Retry
            </button>
          ) : null}
        </div>
      ) : null}
      {validationError ? (
        <div className="flex items-center gap-2 text-sm text-[var(--risk-medium)]">
          <span>Validation: {validationError}</span>
          {onRetry ? (
            <button
              className="rounded border border-[var(--risk-medium)]/40 px-2 py-1 text-[11px] font-semibold text-[var(--risk-medium)] hover:bg-[var(--risk-medium)]/10"
              onClick={onRetry}
              disabled={loading}
            >
              Retry
            </button>
          ) : null}
        </div>
      ) : null}

      <motion.div
        key={step}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2"
      >
        {step === 0 && (
          <>
            <Field label="Full name">
              <input
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary-blue)]"
                value={patient.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="Maria Reyes"
              />
            </Field>
            <Field label="Sex">
              <select
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
                value={patient.sex}
                onChange={(e) => update({ sex: e.target.value as IntakePatient["sex"] })}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Age">
              <input
                type="number"
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
                value={patient.age}
                onChange={(e) => update({ age: Number(e.target.value) })}
              />
            </Field>
            <Field label="Weight (kg)">
              <input
                type="number"
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
                value={patient.weight_kg ?? ""}
                onChange={(e) => update({ weight_kg: Number(e.target.value) })}
              />
            </Field>
            <Field label="Height (cm)">
              <input
                type="number"
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
                value={patient.height_cm ?? ""}
                onChange={(e) => update({ height_cm: Number(e.target.value) })}
              />
            </Field>
            <Field label="Blood pressure">
              <input
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
                value={patient.blood_pressure ?? ""}
                onChange={(e) => update({ blood_pressure: e.target.value })}
              />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Medical history">
              <textarea
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
                rows={4}
                value={(patient.medical_history ?? []).join("\n")}
                onChange={(e) => update({ medical_history: e.target.value.split("\n").filter(Boolean) })}
                placeholder="Type 2 Diabetes\nCKD Stage 3\nIschemic heart disease"
              />
            </Field>
            <Field label="Allergies">
              <input
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
                value={(patient.allergies ?? []).join(", ")}
                onChange={(e) => update({ allergies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                placeholder="sulfa, penicillin"
              />
            </Field>
            <Field label="Current medications">
              <textarea
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
                rows={4}
                value={(patient.current_medications ?? []).map((m) => `${m.name} ${m.dose_mg ?? ""}mg ${m.frequency ?? ""}`).join("\n")}
                onChange={(e) =>
                  update({
                    current_medications: e.target.value
                      .split("\n")
                      .filter(Boolean)
                      .map((line) => {
                        const [name, ...rest] = line.split(" ");
                        return { name, dose_mg: undefined, frequency: rest.join(" "), route: "PO" };
                      }),
                  })
                }
                placeholder="Atorvastatin 40mg once daily"
              />
            </Field>
            <Field label="Lifestyle">
              <input
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
                value={`${patient.lifestyle?.smoking ?? ""}, ${patient.lifestyle?.alcohol ?? ""}, ${patient.lifestyle?.exercise ?? ""}`}
                onChange={(e) => {
                  const parts = e.target.value.split(",").map((p) => p.trim());
                  update({
                    lifestyle: {
                      smoking: parts[0] || patient.lifestyle?.smoking,
                      alcohol: parts[1] || patient.lifestyle?.alcohol,
                      exercise: parts[2] || patient.lifestyle?.exercise,
                    },
                  });
                }}
                placeholder="former, social, rare"
              />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Primary complaint">
              <input
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
                value={patient.primary_complaint ?? ""}
                onChange={(e) => update({ primary_complaint: e.target.value })}
                placeholder="Joint pain, considering NSAIDs"
              />
            </Field>
            <Field label="Notes">
              <textarea
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
                rows={4}
                value={patient.medical_history?.join("\n") ?? ""}
                onChange={(e) => update({ medical_history: e.target.value.split("\n").filter(Boolean) })}
              />
            </Field>
          </>
        )}
      </motion.div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-muted disabled:opacity-60"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || loading}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              className="rounded-lg bg-[var(--primary-blue)] px-4 py-2 text-sm font-semibold text-white shadow hover:translate-y-[-1px] disabled:opacity-60"
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              disabled={loading}
            >
              Next
            </button>
          ) : (
            <button
              className="rounded-lg bg-[var(--primary-purple)] px-4 py-2 text-sm font-semibold text-white shadow hover:translate-y-[-1px] disabled:opacity-60"
              onClick={onAnalyze}
              disabled={loading}
            >
              {loading ? "Running analysis..." : "Generate plan"}
            </button>
          )}
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          Steps cover demographics, history/allergies/meds, and complaint before AI analysis.
        </p>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div variants={fadeInUp} className="space-y-2">
      <p className="text-sm font-semibold text-[var(--text-primary)]">{label}</p>
      {children}
    </motion.div>
  );
}
