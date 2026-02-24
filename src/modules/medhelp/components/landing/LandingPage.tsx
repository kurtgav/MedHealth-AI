'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

import { Hero } from './Hero';
import { Navigation } from './Navigation';
import { FeatureGrid } from './FeatureGrid';
import { IntakeWizard } from '../intake/IntakeWizard';
import { AnalysisStatus } from './AnalysisStatus';
import { useAIAnalysis } from '../../hooks/useAIAnalysis';
import { DashboardLayout } from '../dashboard/DashboardLayout';
import { logClinicalAction } from '../../services/audit.service';
import { createSubmissionFromIntake } from '../../services/submissionService';
import { UserRole } from '@/src/modules/auth/types';

export function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { startAnalysis, progress, response, validation, error, isLoading } = useAIAnalysis();
  const [patientId, setPatientId] = useState<string>('');
  const [currentIntake, setCurrentIntake] = useState<any>(null);

  useEffect(() => {
    if (response && patientId) {
      logClinicalAction({
        timestamp: new Date().toISOString(),
        userId: 'demo-clinician',
        patientId,
        action: 'VIEW',
        treatmentPlanId: response.treatmentPlan.primaryMedication.name || 'plan',
        ipAddress: '127.0.0.1',
      });

      // If user is authenticated as PATIENT, create submission
      if (session?.user && session.user.role === UserRole.PATIENT && currentIntake) {
        createSubmissionFromIntake(currentIntake, response)
          .then(() => {
            toast.success('Submission created successfully!');
            // Redirect to patient dashboard after a short delay
            setTimeout(() => {
              router.push('/dashboard/patient');
            }, 2000);
          })
          .catch((err) => {
            console.error('Failed to create submission:', err);
            toast.error('Failed to create submission. Please try again.');
          });
      }
    }
  }, [response, patientId, session, currentIntake, router]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <Navigation />
      <main className="pt-20">
        <Hero />
        <FeatureGrid />
        <div className="bg-slate-950 px-6 pb-12">
          <div className="mx-auto max-w-6xl space-y-4">
            <IntakeWizard
              onComplete={(intake) => {
                setPatientId(intake.personal.fullName || 'patient');
                setCurrentIntake(intake);
                startAnalysis({ patientData: intake });
              }}
            />
            <AnalysisStatus progress={progress} isLoading={isLoading} error={error} response={response} validation={validation} />
          </div>
        </div>
        <DashboardLayout data={response} validation={validation} isLoading={isLoading} />
      </main>
    </div>
  );
}
