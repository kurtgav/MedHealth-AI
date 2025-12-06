'use client';

import { ListChecks, HeartPulse } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { AIResponse } from '../../types';

interface ClinicalRationaleProps {
  data: AIResponse;
}

export function ClinicalRationale({ data }: ClinicalRationaleProps) {
  const { clinicalRationale } = data;

  return (
    <Card className="border-white/10 bg-white/5 p-5 text-white">
      <div className="flex items-center gap-2">
        <HeartPulse className="h-5 w-5 text-cyan-200" />
        <h3 className="text-lg font-semibold">Clinical Rationale</h3>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-2xl border border-white/10 bg-black/30 p-3">
          <p className="text-sm font-semibold text-white">Diagnosis considerations</p>
          <ul className="space-y-1 text-sm text-slate-200">
            {clinicalRationale.diagnosisConsiderations.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2 rounded-2xl border border-white/10 bg-black/30 p-3">
          <p className="text-sm font-semibold text-white">Monitoring recommendations</p>
          <ul className="space-y-1 text-sm text-slate-200">
            {clinicalRationale.monitoringRecommendations.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3">
        <p className="text-sm font-semibold text-white">Treatment justification</p>
        <p className="text-sm text-slate-200">{clinicalRationale.treatmentJustification}</p>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-cyan-100">
        <ListChecks className="h-4 w-4" />
        Follow-up schedule: {clinicalRationale.followUpSchedule}
      </div>
    </Card>
  );
}
