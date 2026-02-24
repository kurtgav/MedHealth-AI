import { SubmissionStatus } from '@prisma/client';
import { PatientIntake } from '@/src/modules/medhelp/types';

export interface Submission {
  id: string;
  patientId: string;
  doctorId: string | null;
  status: SubmissionStatus;
  intakeData: PatientIntake;
  analysisResult: any | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  patient: {
    id: string;
    name: string | null;
    email: string | null;
  };
  doctor: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}

