'use client';

import { AlertTriangle, CheckCircle2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AIResponse, FlaggedIssue } from '../../types';
import { formatRiskColor } from '../../utils';

interface FlaggedIssuesProps {
  data: AIResponse;
}

const issueLabels: Record<FlaggedIssue['type'], string> = {
  DRUG_INTERACTION: 'Drug Interaction',
  CONTRAINDICATION: 'Contraindication',
  DOSAGE_CONCERN: 'Dosage Concern',
  ALLERGY_RISK: 'Allergy Risk',
};

export function FlaggedIssues({ data }: FlaggedIssuesProps) {
  const { flaggedIssues } = data.safetyAssessment;

  return (
    <Card className="border-white/10 bg-white/5 p-5 text-white">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-300" />
        <h3 className="text-lg font-semibold">Flagged Issues</h3>
      </div>

      <div className="mt-4 space-y-3">
        {flaggedIssues.length === 0 ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
            <CheckCircle2 className="h-4 w-4" /> No issues surfaced.
          </div>
        ) : null}
        {flaggedIssues.map((issue, idx) => (
          <div key={`${issue.type}-${idx}`} className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge style={{ backgroundColor: `${formatRiskColor(issue.severity)}30`, color: formatRiskColor(issue.severity) }}>
                {issue.severity}
              </Badge>
              <Badge className="bg-white/10 text-white">{issueLabels[issue.type]}</Badge>
              <span className="text-sm text-slate-200">{issue.description}</span>
            </div>
            <div className="mt-2 text-xs text-slate-300">
              Affected: {issue.affectedDrugs.join(', ') || 'n/a'}
            </div>
            <p className="mt-1 text-sm text-cyan-100">Recommendation: {issue.recommendation}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
