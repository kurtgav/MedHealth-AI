'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Submission } from '../types';
import { SubmissionStatus } from '@prisma/client';
import { updateSubmissionStatus, addNote, assignSubmission } from '../services/submissionService';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface SubmissionDetailModalProps {
  submission: Submission;
  open: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export function SubmissionDetailModal({
  submission,
  open,
  onClose,
  onUpdate,
}: SubmissionDetailModalProps) {
  const { data: session } = useSession();
  const [note, setNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: SubmissionStatus) => {
    setIsUpdating(true);
    try {
      await updateSubmissionStatus(submission.id, newStatus);
      toast.success('Status updated successfully');
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignToMe = async () => {
    if (!session?.user?.id) return;
    setIsUpdating(true);
    try {
      await assignSubmission(submission.id, session.user.id);
      toast.success('Submission assigned to you');
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to assign submission');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    setIsUpdating(true);
    try {
      await addNote(submission.id, note);
      setNote('');
      toast.success('Note added successfully');
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setIsUpdating(false);
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-white/10 bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Submission Details</DialogTitle>
          <DialogDescription className="text-slate-400">
            Review patient intake and add notes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header Info */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Patient</p>
              <p className="font-semibold text-white">
                {submission.patient.name || submission.patient.email || 'Unknown'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Status</p>
              <div className="mt-1">{getStatusBadge(submission.status)}</div>
            </div>
          </div>

          {/* Status Actions */}
          <div className="flex gap-2">
            {submission.status !== SubmissionStatus.IN_REVIEW && (
              <Button
                onClick={() => handleStatusUpdate(SubmissionStatus.IN_REVIEW)}
                disabled={isUpdating}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Clock className="mr-2 h-4 w-4" />
                Mark In Review
              </Button>
            )}
            {submission.status !== SubmissionStatus.COMPLETED && (
              <Button
                onClick={() => handleStatusUpdate(SubmissionStatus.COMPLETED)}
                disabled={isUpdating}
                size="sm"
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Completed
              </Button>
            )}
            {!submission.doctorId && (
              <Button
                onClick={handleAssignToMe}
                disabled={isUpdating}
                size="sm"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                Assign to Me
              </Button>
            )}
          </div>

          {/* Intake Data */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Patient Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm text-slate-300">
                {JSON.stringify(submission.intakeData, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Analysis Result */}
          {submission.analysisResult && (
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">Analysis Result</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm text-slate-300">
                  {JSON.stringify(submission.analysisResult, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {submission.notes && (
                <div className="rounded-md bg-slate-800/50 p-3">
                  <pre className="whitespace-pre-wrap text-sm text-slate-300">
                    {submission.notes}
                  </pre>
                </div>
              )}
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="border-white/20 bg-white/5 text-white placeholder:text-slate-400"
                  rows={3}
                />
                <Button
                  onClick={handleAddNote}
                  disabled={!note.trim() || isUpdating}
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white"
                >
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}



