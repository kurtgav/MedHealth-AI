'use client';

import { useState } from 'react';
import { useSubmissions } from '../hooks/useSubmissions';
import { SubmissionFilters } from '../types';
import { StatsOverview } from './StatsOverview';
import { SubmissionFilters as SubmissionFiltersComponent } from './SubmissionFilters';
import { SubmissionsList } from './SubmissionsList';
import { Card, CardContent } from '@/components/ui/card';

export function DoctorDashboard() {
  const [filters, setFilters] = useState<SubmissionFilters>({});
  const { submissions, loading, error, refresh, stats } = useSubmissions(filters);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Doctor Dashboard</h1>
          <p className="mt-2 text-slate-400">Review and manage patient submissions</p>
        </div>

        <StatsOverview stats={stats} />

        <SubmissionFiltersComponent filters={filters} onFiltersChange={setFilters} />

        {error && (
          <Card className="border-red-500/20 bg-red-500/10">
            <CardContent className="pt-6">
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        <SubmissionsList
          submissions={submissions}
          loading={loading}
          onRefresh={refresh}
        />
      </div>
    </div>
  );
}



