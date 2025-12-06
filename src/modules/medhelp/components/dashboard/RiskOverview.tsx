'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { AIResponse, ValidationResult } from '../../types';
import { formatPercent, formatRiskColor } from '../../utils';

interface RiskOverviewProps {
  data: AIResponse;
  validation?: ValidationResult | null;
}

export function RiskOverview({ data, validation }: RiskOverviewProps) {
  const { safetyAssessment } = data;
  const score = safetyAssessment.riskScore ?? 0;
  const color = formatRiskColor(safetyAssessment.riskLevel);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-0 opacity-20 blur-3xl" style={{ background: `radial-gradient(circle at 20% 20%, ${color}, transparent 50%)` }} />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Risk overview</p>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/10 text-white">Flagged issues: {safetyAssessment.flaggedIssues.length}</Badge>
            <Badge style={{ backgroundColor: `${color}20`, color }}>{safetyAssessment.riskLevel}</Badge>
          </div>
          <p className="text-slate-200">Pulse animation indicates elevated risk states.</p>
          {validation ? (
            <p className="text-xs text-cyan-100">
              Cross-check: {validation.matchedInteractions.length} matched, {validation.missedInteractions.length} missed interactions vs DB.
            </p>
          ) : null}
        </div>
        <motion.div
          className="relative grid aspect-square w-40 place-items-center rounded-full border border-white/20 bg-black/30"
          animate={{ boxShadow: [`0 0 0 0 rgba(239,68,68,0.35)`, `0 0 0 16px rgba(0,0,0,0)`] }}
          transition={{ repeat: safetyAssessment.riskLevel === 'HIGH' || safetyAssessment.riskLevel === 'CRITICAL' ? Infinity : 0, duration: 1.8 }}
        >
          <div
            className="absolute inset-4 rounded-full"
            style={{
              background: `conic-gradient(${color} ${score}%, rgba(255,255,255,0.08) ${score}%)`,
            }}
          />
          <div className="relative flex h-full w-full items-center justify-center rounded-full bg-black/60">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-100">Risk Score</p>
              <p className="text-3xl font-semibold">{formatPercent(score)}</p>
              <Shield className="mx-auto mt-2 h-5 w-5 text-cyan-200" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
