import { Submission } from '../types';

export async function fetchPatientSubmissions(): Promise<Submission[]> {
  const response = await fetch('/api/submissions');
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

export async function deleteSubmission(id: string): Promise<void> {
  const response = await fetch(`/api/submissions/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete submission');
  }
}



