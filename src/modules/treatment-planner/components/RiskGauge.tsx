'use client';

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { riskGaugeVariant } from "../animations/variants";
import { RiskLevel } from "../types";

const RISK_COLORS: Record<RiskLevel, string> = {
  low: "var(--risk-low)",
  medium: "var(--risk-medium)",
  high: "var(--risk-high)",
  critical: "var(--risk-critical)",
};

interface RiskGaugeProps {
  score: number; // 0-100
  level: RiskLevel;
  flaggedCount: number;
}

export function RiskGauge({ score, level, flaggedCount }: RiskGaugeProps) {
  const stroke = RISK_COLORS[level];
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const circumference = 2 * Math.PI * 56;
  const dash = (normalizedScore / 100) * circumference;

  return (
    <div className="glass-surface glass-outline relative overflow-hidden rounded-2xl p-6 shadow-lg">
      <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[var(--primary-purple)]/10 blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-[var(--primary-blue)]/10 blur-3xl" />

      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Risk Indicator
            </p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{levelLabel(level)}</p>
          </div>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold uppercase",
              levelPillClass(level),
            )}
          >
            {level}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative h-32 w-32">
            <svg width="128" height="128" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="rgba(100,116,139,0.15)"
                strokeWidth="12"
                strokeDasharray={`${circumference} ${circumference}`}
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke={stroke}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
                transform="rotate(-90 64 64)"
                variants={riskGaugeVariant}
                initial="hidden"
                animate="visible"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <p className="text-3xl font-bold text-[var(--text-primary)]">{normalizedScore}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">/ 100</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--risk-high)] shadow-[0_0_0_8px_rgba(239,68,68,0.12)]" />
              <p className="text-[var(--text-secondary)]">Auto-flags life-threatening interactions first</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--primary-blue)] shadow-[0_0_0_8px_rgba(37,99,235,0.12)]" />
              <p className="text-[var(--text-secondary)]">Uses dose, organ function, and allergies</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-green)] shadow-[0_0_0_8px_rgba(16,185,129,0.12)]" />
              <p className="text-[var(--text-secondary)]">Flagged issues: {flaggedCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function levelLabel(level: RiskLevel) {
  switch (level) {
    case "low":
      return "Low Risk";
    case "medium":
      return "Medium Risk";
    case "high":
      return "High Risk";
    case "critical":
      return "Critical Risk";
  }
}

function levelPillClass(level: RiskLevel) {
  return {
    low: "bg-[var(--risk-low)]/15 text-[var(--risk-low)]",
    medium: "bg-[var(--risk-medium)]/15 text-[var(--risk-medium)]",
    high: "bg-[var(--risk-high)]/15 text-[var(--risk-high)]",
    critical: "bg-[var(--risk-critical)]/15 text-[var(--risk-critical)]",
  }[level];
}
