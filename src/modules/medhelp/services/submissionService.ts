import { PatientIntake } from '../types';

/**
 * Creates a submission from patient intake data and optional analysis result
 * @param intakeData - The patient intake form data
 * @param analysisResult - Optional AI analysis result
 * @returns Promise resolving to the created submission with id
 */
export async function createSubmissionFromIntake(
  intakeData: PatientIntake,
  analysisResult?: any
): Promise<{ id: string }> {
  const response = await fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intakeData,
      analysisResult: analysisResult || null,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create submission');
  }

  const data = await response.json();
  return data.submission;
}

