'use client';

import { useEffect, useState } from 'react';

import { Hero } from './Hero';
import { Navigation } from './Navigation';
import { FeatureGrid } from './FeatureGrid';
import { IntakeWizard } from '../intake/IntakeWizard';
import { AnalysisStatus } from './AnalysisStatus';
import { useAIAnalysis } from '../../hooks/useAIAnalysis';
import { DashboardLayout } from '../dashboard/DashboardLayout';
import { logClinicalAction } from '../../services/audit.service';

export function LandingPage() {
  const { startAnalysis, progress, response, validation, error, isLoading } = useAIAnalysis();
  const [patientId, setPatientId] = useState<string>('');

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
    }
  }, [response, patientId]);

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
