'use client';

import { cn } from "@/lib/utils";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

import { fadeInUp, slideInRight, staggerContainer } from "../animations/variants";
import { GlassCard } from "./GlassCard";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-[var(--dark-card)] text-white">
      <div className="absolute inset-0 animate-gradient opacity-70" aria-hidden />
      <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-primary/40 blur-[120px]" aria-hidden />
      <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[var(--primary-purple)]/50 blur-[120px]" aria-hidden />

      <div className="relative grid gap-10 section-padding lg:grid-cols-2 lg:items-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium backdrop-blur"
          >
            <span className="h-2 w-2 rounded-full bg-[var(--accent-green)] shadow-[0_0_0_6px_rgba(16,185,129,0.25)]" />
            Live safety-first clinical assistant
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-3xl leading-tight sm:text-4xl lg:text-5xl lg:leading-tight"
          >
            AI-Powered Treatment Plans{" "}
            <span className="gradient-text font-semibold">Made Safe</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="max-w-2xl text-base text-slate-100/90 sm:text-lg">
            Supercharge clinical decisions with real-time interaction checks, contraindication alerts,
            and evidence-based recommendations.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3">
            <button className={cn("btn-primary ripple-effect", baseButtonClasses, "bg-primary text-white")}>
              Start Free Trial <ArrowRight className="size-4" />
            </button>
            <button
              className={cn(
                baseButtonClasses,
                "glass-surface glass-outline text-white hover:border-white/40 focus-visible:outline-white/60",
              )}
            >
              <Play className="size-4" />
              Watch Demo
            </button>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 text-sm text-slate-100/80">
            <Badge>PATIENT SAFETY FIRST</Badge>
            <Badge>HIPAA READY</Badge>
            <Badge>CLINICIAN-BUILT</Badge>
          </motion.div>
        </motion.div>

        <motion.div
          variants={slideInRight}
          initial="hidden"
          animate="visible"
          className="relative"
          transition={{ delay: 0.15 }}
        >
          <GlassCard className="relative overflow-hidden bg-white/80 text-foreground shadow-2xl backdrop-blur">
            <div className="absolute inset-0 pointer-events-none">
              <div className="floating-animation absolute right-6 top-6 h-20 w-20 rounded-full bg-[var(--primary-blue)]/20 blur-3xl" />
              <div className="floating-animation absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-[var(--primary-purple)]/15 blur-3xl" />
            </div>

            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Risk Indicator</p>
                  <p className="text-2xl font-semibold text-[var(--primary-blue)]">Medium Risk</p>
                  <p className="text-sm text-muted-foreground">Score: 52 / 100</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--primary-blue)] bg-[var(--primary-blue)]/10 text-[var(--primary-blue)] shadow-inner">
                  ✓
                </div>
              </div>

              <div className="grid gap-3 rounded-xl bg-white/70 p-4 text-sm backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Flagged Issues</p>
                  <span className="rounded-full bg-[var(--accent-coral)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent-coral)]">
                    3
                  </span>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p>⚠️ Drug-Drug Interaction</p>
                  <p>⚠️ CKD Stage 3 with NSAIDs</p>
                  <p>⚠️ Metformin dose vs GFR</p>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-[var(--primary-blue)] to-[var(--primary-purple)] px-4 py-3 text-white">
                <p className="text-sm font-semibold">Treatment Plan Snapshot</p>
                <p className="text-xs text-slate-100/90">Lisinopril, Atorvastatin, Lifestyle mods, 2w follow-up</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

const baseButtonClasses =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:translate-y-[-2px]";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide">
      {children}
    </span>
  );
}
