'use client';

import { cn } from "@/lib/utils";
import { Check, Pill, Stethoscope, Timer, Utensils, Workflow } from "lucide-react";
import { motion } from "framer-motion";

import { fadeInUp, staggerContainer } from "../animations/variants";
import { TreatmentPlan } from "../types";

interface TreatmentPlanCardProps {
  plan: TreatmentPlan;
}

export function TreatmentPlanCard({ plan }: TreatmentPlanCardProps) {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="glass-surface glass-outline rounded-2xl p-6 shadow-lg"
    >
      <motion.div variants={fadeInUp} className="mb-4 flex items-center gap-2">
        <Stethoscope className="size-5 text-[var(--primary-blue)]" />
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Recommended Treatment Plan</p>
          <p className="text-xs text-[var(--text-secondary)]">Medications, lifestyle, and follow-up</p>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={fadeInUp} className="space-y-3">
          <Header label="Medications" icon={<Pill className="size-4" />} accent="from-[var(--primary-blue)] to-[var(--primary-purple)]" />
          <div className="space-y-2">
            {plan.recommendedMedications.map((med) => (
              <div
                key={med.drugName + med.dosage}
                className="rounded-lg border border-[var(--border)] bg-white/80 px-3 py-3 text-sm shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{med.drugName}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{med.genericName}</p>
                  </div>
                  <span className="rounded-full bg-[var(--primary-blue)]/10 px-2 py-1 text-[11px] font-semibold text-[var(--primary-blue)] uppercase">
                    {med.route}
                  </span>
                </div>
                <p className="mt-1 text-[var(--text-secondary)]">
                  {med.dosage} • {med.frequency} • {med.duration}
                </p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">Indication: {med.indication}</p>
                {med.instructions ? (
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">Instructions: {med.instructions}</p>
                ) : null}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="space-y-4">
          <div className="space-y-3">
            <Header label="Non-pharmacological" icon={<Utensils className="size-4" />} accent="from-[var(--accent-green)] to-[var(--primary-teal)]" />
            <div className="space-y-2">
              {plan.nonPharmacological.map((item) => (
                <div
                  key={item.intervention}
                  className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-white/80 px-3 py-3 text-sm shadow-sm"
                >
                  <Check className="mt-0.5 size-4 text-[var(--accent-green)]" />
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{item.intervention}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{item.description}</p>
                    <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">Freq: {item.frequency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-[var(--border)] bg-white/85 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <Timer className="size-4" /> Follow-up
            </div>
            <p className="text-sm text-[var(--text-secondary)]">Timeframe: {plan.followUp.timeframe}</p>
            <LabeledList label="Tests" items={plan.followUp.tests} />
            <LabeledList label="Monitoring" items={plan.followUp.monitoring} />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function Header({
  label,
  icon,
  accent,
}: {
  label: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("flex items-center justify-center rounded-lg bg-gradient-to-br p-2 text-white shadow", accent)}>
        {icon}
      </span>
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]">{label}</p>
    </div>
  );
}

function LabeledList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="space-y-1 text-sm">
      <p className="font-semibold text-[var(--text-primary)]">{label}</p>
      <ul className="space-y-1 text-[var(--text-secondary)]">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Workflow className="mt-0.5 size-3.5 text-[var(--primary-blue)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
