'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Submission } from '../types';
import { SubmissionStatus } from '@prisma/client';
import { Clock, CheckCircle, AlertCircle, Eye, Trash2 } from 'lucide-react';
import { deleteSubmission } from '../services/submissionService';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

interface SubmissionStatusCardProps {
  submission: Submission;
  onDelete?: () => void;
  onView?: (submission: Submission) => void;
}

export function SubmissionStatusCard({
  submission,
  onDelete,
  onView,
}: SubmissionStatusCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteSubmission(submission.id);
      toast.success('Submission deleted');
      onDelete?.();
    } catch (error) {
      toast.error('Failed to delete submission');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {submission.intakeData?.complaint?.primary || 'Medical Submission'}
          </CardTitle>
          {getStatusBadge(submission.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-slate-300">
          <p>Submitted: {formatDate(submission.createdAt)}</p>
          {submission.doctor && (
            <p className="mt-1">Reviewed by: {submission.doctor.name || submission.doctor.email}</p>
          )}
        </div>

        {submission.notes && (
          <div className="rounded-md bg-slate-800/50 p-3">
            <p className="text-xs text-slate-400 mb-1">Doctor's Notes:</p>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">{submission.notes}</p>
          </div>
        )}

        <div className="flex gap-2">
          {onView && (
            <Button
              onClick={() => onView(submission)}
              variant="outline"
              size="sm"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          )}
          {submission.status === SubmissionStatus.NEW && (
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="outline"
              size="sm"
              className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}



