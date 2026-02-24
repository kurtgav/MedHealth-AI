'use client';

import { SubmissionStatusCard } from './SubmissionStatusCard';
import { Submission } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

interface SubmissionHistoryProps {
  submissions: Submission[];
  loading?: boolean;
  onRefresh?: () => void;
}

export function SubmissionHistory({
  submissions,
  loading,
  onRefresh,
}: SubmissionHistoryProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  if (loading) {
    return (
      <Card className="border-white/10 bg-white/5 text-white">
        <CardContent className="pt-6">
          <div className="text-center text-slate-400">Loading submissions...</div>
        </CardContent>
      </Card>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card className="border-white/10 bg-white/5 text-white">
        <CardContent className="pt-6">
          <div className="text-center text-slate-400">
            <p className="mb-2">No submissions yet</p>
            <p className="text-sm">Create your first submission to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {submissions.map((submission) => (
          <SubmissionStatusCard
            key={submission.id}
            submission={submission}
            onDelete={onRefresh}
            onView={setSelectedSubmission}
          />
        ))}
      </div>

      {selectedSubmission && (
        <Dialog
          open={!!selectedSubmission}
          onOpenChange={() => setSelectedSubmission(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-white/10 bg-slate-900 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Submission Details</DialogTitle>
              <DialogDescription className="text-slate-400">
                View your submission details and analysis
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Intake Data</h3>
                <pre className="whitespace-pre-wrap text-sm text-slate-300 bg-slate-800/50 p-4 rounded-md">
                  {JSON.stringify(selectedSubmission.intakeData, null, 2)}
                </pre>
              </div>

              {selectedSubmission.analysisResult && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Analysis Result</h3>
                  <pre className="whitespace-pre-wrap text-sm text-slate-300 bg-slate-800/50 p-4 rounded-md">
                    {JSON.stringify(selectedSubmission.analysisResult, null, 2)}
                  </pre>
                </div>
              )}

              {selectedSubmission.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Doctor's Notes</h3>
                  <div className="bg-slate-800/50 p-4 rounded-md">
                    <pre className="whitespace-pre-wrap text-sm text-slate-300">
                      {selectedSubmission.notes}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}



