'use client';

import { Sparkles } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { AIResponse } from '../../types';
import { formatPercent } from '../../utils';

interface AlternativeTreatmentsProps {
  data: AIResponse;
}

export function AlternativeTreatments({ data }: AlternativeTreatmentsProps) {
  return (
    <Card className="border-white/10 bg-white/5 p-5 text-white">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-300" />
        <h3 className="text-lg font-semibold">Alternative Treatments</h3>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {data.alternativeTreatments.map((alt) => (
          <div key={alt.approach} className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{alt.approach}</p>
              <span className="text-xs text-cyan-100">Suitability {formatPercent(alt.suitabilityScore)}</span>
            </div>
            <p className="mt-1 text-sm text-slate-200">{alt.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
