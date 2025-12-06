'use client';

import { Pill, Stethoscope, Info } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AIResponse } from '../../types';

interface TreatmentPlanProps {
  data: AIResponse;
}

export function TreatmentPlan({ data }: TreatmentPlanProps) {
  const { treatmentPlan, confidenceScores } = data;

  return (
    <Card className="border-white/10 bg-white/5 p-5 text-white shadow-[0_15px_45px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-cyan-200" />
          <h3 className="text-lg font-semibold">Primary Medication</h3>
        </div>
        <Badge className="bg-white/10 text-white">Confidence {confidenceScores.treatmentConfidence}%</Badge>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xl font-semibold">{treatmentPlan.primaryMedication.name}</span>
          <Badge className="bg-cyan-500/20 text-cyan-100">{treatmentPlan.primaryMedication.dosage}</Badge>
          {treatmentPlan.primaryMedication.frequency ? (
            <Badge className="bg-purple-500/20 text-purple-100">{treatmentPlan.primaryMedication.frequency}</Badge>
          ) : null}
          {treatmentPlan.primaryMedication.duration ? (
            <Badge className="bg-pink-500/20 text-pink-100">{treatmentPlan.primaryMedication.duration}</Badge>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-slate-200">{treatmentPlan.primaryMedication.rationale}</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Info className="h-4 w-4 text-cyan-200" />
            Non-pharmacological
          </div>
          <ul className="mt-2 space-y-1 text-sm text-slate-200">
            {treatmentPlan.nonPharmacological.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Stethoscope className="h-4 w-4 text-cyan-200" />
            Alternatives
          </div>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            {treatmentPlan.alternativeMedications.map((med) => (
              <li key={med.name} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{med.name}</span>
                  <Badge className="bg-white/10 text-white">{med.dosage}</Badge>
                </div>
                <p className="text-xs text-slate-300">{med.rationale}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
