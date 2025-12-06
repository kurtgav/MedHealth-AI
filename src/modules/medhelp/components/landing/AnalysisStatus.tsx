'use client';

import { CheckCircle2, Loader2, ShieldAlert, TriangleAlert } from 'lucide-react';

import { AIAnalysisProgress, AIResponse, ValidationResult } from '../../types';

interface AnalysisStatusProps {
  progress: AIAnalysisProgress;
  isLoading: boolean;
  error: string | null;
  response: AIResponse | null;
  validation?: ValidationResult | null;
}

export function AnalysisStatus({ progress, isLoading, error, response, validation }: AnalysisStatusProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white shadow-inner">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-cyan-300" /> : <ShieldAlert className="h-4 w-4 text-cyan-200" />}
          <p className="text-sm text-cyan-100">
            {progress.message ?? 'Idle'}
          </p>
        </div>
        <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wide text-cyan-100">
          {progress.step}
        </span>
      </div>

      {error ? (
        <div className="mt-3 flex items-center gap-2 text-sm text-amber-200">
          <TriangleAlert className="h-4 w-4" />
          {error}
        </div>
      ) : null}

      {response ? (
        <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-black/30 p-3 text-sm">
          <div className="flex items-center gap-2 text-cyan-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            AI analysis complete — ready for dashboard rendering.
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-200">
            <span className="rounded-full bg-white/5 px-3 py-1">Risk: {response.safetyAssessment.riskLevel}</span>
            <span className="rounded-full bg-white/5 px-3 py-1">Score: {response.safetyAssessment.riskScore}</span>
            <span className="rounded-full bg-white/5 px-3 py-1">
              Primary med: {response.treatmentPlan.primaryMedication.name || 'Pending'}
            </span>
          </div>
          {validation ? (
            <div className="text-xs text-slate-200">
              Cross-check: {validation.matchedInteractions.length} matched, {validation.missedInteractions.length} missed interactions vs DB.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
