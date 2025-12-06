"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { fadeInUp, scaleIn, staggerContainer } from "../animations/variants";
import { GlassCard } from "./GlassCard";

const FEATURES = [
  {
    icon: "⚡",
    title: "Lightning Fast Analysis",
    description: "Comprehensive treatment plans in under five seconds.",
    accent: "from-[var(--primary-blue)] to-[var(--primary-purple)]",
  },
  {
    icon: "🛡️",
    title: "Safety First",
    description: "Drug interactions, contraindications, and allergy checks by default.",
    accent: "from-[var(--accent-green)] to-[var(--primary-teal)]",
  },
  {
    icon: "🎯",
    title: "Evidence-Based",
    description: "Recommendations align to clinical guidelines and best practices.",
    accent: "from-[var(--primary-purple)] to-[var(--accent-pink)]",
  },
  {
    icon: "📊",
    title: "Smart Analytics",
    description: "Risk scoring, confidence levels, and decision support signals.",
    accent: "from-[var(--accent-coral)] to-[var(--primary-blue)]",
  },
];

export function FeatureGrid() {
  return (
    <section className="section-padding space-y-6">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--text-secondary)]">
          Built for clinicians
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-[var(--text-primary)] md:text-4xl">
          Safety-forward experiences
        </h2>
        <p className="mt-3 max-w-2xl text-base text-[var(--text-secondary)]">
          Modern clinical UI with micro-interactions, shimmer states, and motion that guides focus without
          sacrificing performance.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {FEATURES.map((feature, index) => (
          <GlassCard
            key={feature.title}
            variants={scaleIn}
            transition={{ delay: 0.05 * index }}
            className="hover-lift relative overflow-hidden bg-card/70"
          >
            <div
              className={cn(
                "absolute inset-x-0 top-0 h-1.5 w-full bg-gradient-to-r opacity-80",
                feature.accent,
              )}
              aria-hidden
            />
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-lg shadow-inner",
                  feature.accent,
                )}
                aria-hidden
              >
                {feature.icon}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{feature.description}</p>
              </div>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full w-3/4 rounded-full bg-gradient-to-r",
                  feature.accent,
                  "animate-[shimmer_2s_infinite_linear]",
                )}
                aria-hidden
              />
            </div>
          </GlassCard>
        ))}
      </motion.div>
    </section>
  );
}

export default FeatureGrid;
