import { Submission, SubmissionFilters } from '../types';
import { SubmissionStatus } from '@prisma/client';

export async function fetchSubmissions(filters?: SubmissionFilters): Promise<Submission[]> {
  const params = new URLSearchParams();

  if (filters?.status) {
    params.append('status', filters.status);
  }
  if (filters?.patientId) {
    params.append('patientId', filters.patientId);
  }
  if (filters?.doctorId) {
    params.append('doctorId', filters.doctorId);
  }

  const response = await fetch(`/api/submissions?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch submissions');
  }

  const data = await response.json();
  return data.submissions;
}

export async function fetchSubmission(id: string): Promise<Submission> {
  const response = await fetch(`/api/submissions/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch submission');
  }

  const data = await response.json();
  return data.submission;
}

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus
): Promise<Submission> {
  const response = await fetch(`/api/submissions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update submission status');
  }

  const data = await response.json();
  return data.submission;
}

export async function assignSubmission(id: string, doctorId: string | null): Promise<Submission> {
  const response = await fetch(`/api/submissions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doctorId }),
  });

  if (!response.ok) {
    throw new Error('Failed to assign submission');
  }

  const data = await response.json();
  return data.submission;
}

export async function addNote(id: string, note: string): Promise<Submission> {
  const response = await fetch(`/api/submissions/${id}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note }),
  });

  if (!response.ok) {
    throw new Error('Failed to add note');
  }

  const data = await response.json();
  return data.submission;
}



