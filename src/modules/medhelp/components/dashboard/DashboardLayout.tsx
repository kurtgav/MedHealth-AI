'use client';

import { Card } from '@/components/ui/card';
import { AIResponse, ValidationResult } from '../../types';
import { RiskOverview } from './RiskOverview';
import { CriticalAlerts } from './CriticalAlerts';
import { TreatmentPlan } from './TreatmentPlan';
import { FlaggedIssues } from './FlaggedIssues';
import { ClinicalRationale } from './ClinicalRationale';
import { AlternativeTreatments } from './AlternativeTreatments';

interface DashboardLayoutProps {
  data: AIResponse | null;
  validation?: ValidationResult | null;
  isLoading?: boolean;
}

export function DashboardLayout({ data, validation, isLoading }: DashboardLayoutProps) {
  if (!data && !isLoading) {
    return (
      <section id="dashboard" className="bg-slate-950 px-6 pb-16 text-slate-100">
        <div className="mx-auto max-w-6xl space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Clinical Dashboard</p>
          <Card className="border-white/10 bg-white/5 p-5 text-slate-200">
            Run an intake to see risk gauges, treatment plans, and flagged safety issues.
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="dashboard" className="bg-slate-950 px-6 pb-16 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Clinical Dashboard</p>
        {isLoading && !data ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="h-32 animate-pulse border-white/10 bg-white/5" />
            ))}
          </div>
        ) : null}
        {data ? (
          <>
            <RiskOverview data={data} validation={validation} />
            <CriticalAlerts data={data} />
            <div className="grid gap-4 md:grid-cols-2">
              <TreatmentPlan data={data} />
              <FlaggedIssues data={data} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <ClinicalRationale data={data} />
              <AlternativeTreatments data={data} />
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
