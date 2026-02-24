'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Submission } from '../types';
import { SubmissionStatus } from '@prisma/client';
import { Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { SubmissionDetailModal } from './SubmissionDetailModal';

interface SubmissionsListProps {
  submissions: Submission[];
  loading?: boolean;
  onRefresh?: () => void;
}

export function SubmissionsList({ submissions, loading, onRefresh }: SubmissionsListProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case SubmissionStatus.NEW:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            <AlertCircle className="mr-1 h-3 w-3" />
            New
          </Badge>
        );
      case SubmissionStatus.IN_REVIEW:
        return (
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            <Clock className="mr-1 h-3 w-3" />
            In Review
          </Badge>
        );
      case SubmissionStatus.COMPLETED:
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
          <div className="text-center text-slate-400">No submissions found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Patient Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-slate-300">Patient</TableHead>
                <TableHead className="text-slate-300">Date</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Primary Complaint</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow
                  key={submission.id}
                  className="border-white/10 hover:bg-white/5 cursor-pointer"
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <TableCell className="font-medium text-white">
                    {submission.patient.name || submission.patient.email || 'Unknown'}
                  </TableCell>
                  <TableCell className="text-slate-300">{formatDate(submission.createdAt)}</TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell className="text-slate-300">
                    {submission.intakeData?.complaint?.primary || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSubmission(submission);
                      }}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          open={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onUpdate={onRefresh}
        />
      )}
    </>
  );
}



