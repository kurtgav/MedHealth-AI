'use client';

import { usePatientSubmissions } from '../hooks/usePatientSubmissions';
import { SubmissionHistory } from './SubmissionHistory';
import { NewSubmissionButton } from './NewSubmissionButton';
import { Card, CardContent } from '@/components/ui/card';

export function PatientDashboard() {
  const { submissions, loading, error, refresh } = usePatientSubmissions();

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Submissions</h1>
            <p className="mt-2 text-slate-400">View and manage your medical submissions</p>
          </div>
          <NewSubmissionButton />
        </div>

        {error && (
          <Card className="border-red-500/20 bg-red-500/10">
            <CardContent className="pt-6">
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        <SubmissionHistory
          submissions={submissions}
          loading={loading}
          onRefresh={refresh}
        />
      </div>
    </div>
  );
}



