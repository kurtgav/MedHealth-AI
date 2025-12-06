'use client';

import { AlertOctagon } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIResponse, FlaggedIssue } from '../../types';
import { formatRiskColor } from '../../utils';

interface CriticalAlertsProps {
  data: AIResponse;
}

export function CriticalAlerts({ data }: CriticalAlertsProps) {
  const critical = data.safetyAssessment.flaggedIssues.filter(
    (issue) => issue.severity === 'HIGH' || issue.severity === 'CRITICAL'
  );

  if (!critical.length) return null;

  return (
    <Card className="border-red-400/30 bg-red-500/10 p-5 text-white">
      <div className="flex items-center gap-2">
        <AlertOctagon className="h-5 w-5 text-red-200" />
        <h3 className="text-lg font-semibold">Critical Alerts</h3>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {critical.map((issue: FlaggedIssue, idx: number) => (
          <div key={`${issue.type}-${idx}`} className="rounded-2xl border border-white/20 bg-black/30 p-3">
            <div className="flex items-center gap-2">
              <Badge style={{ backgroundColor: `${formatRiskColor(issue.severity)}30`, color: formatRiskColor(issue.severity) }}>
                {issue.severity}
              </Badge>
              <span className="text-sm font-semibold">{issue.type.replace('_', ' ')}</span>
            </div>
            <p className="mt-2 text-sm text-slate-100">{issue.description}</p>
            <p className="text-xs text-slate-200">Recommendation: {issue.recommendation}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
