'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import { FormProvider } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { PatientIntake } from '../../types';
import { PatientIntakeForm, toPatientIntake } from '../../constants/intakeSchema';
import { useIntakeForm } from '../../hooks/useIntakeForm';
import { useStepController } from '../../hooks/useStepController';
import { PersonalInfoStep } from './PersonalInfoStep';
import { MedicalHistoryStep } from './MedicalHistoryStep';
import { MedicationsStep } from './MedicationsStep';
import { LifestyleStep } from './LifestyleStep';
import { ComplaintStep } from './ComplaintStep';
import { examplePatients } from '../../data/examplePatients';

const stepVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

interface IntakeWizardProps {
  onComplete?: (intake: PatientIntake) => void;
}

export function IntakeWizard({ onComplete }: IntakeWizardProps) {
  const { form, medicationsArray, clearDraft } = useIntakeForm();
  const { step, next, back, progress } = useStepController(5);

  const steps = useMemo(
    () => [
      {
        id: 'personal',
        label: 'Personal Info',
        fields: [
          'personal.fullName',
          'personal.age',
          'personal.weightKg',
          'personal.heightCm',
          'personal.gender',
          'personal.bloodPressure',
          'personal.heartRate',
        ],
        content: <PersonalInfoStep />,
      },
      {
        id: 'history',
        label: 'Medical History',
        fields: [
          'history.conditions',
          'history.allergies',
          'history.surgeries',
          'history.familyHistory',
        ],
        content: <MedicalHistoryStep />,
      },
      {
        id: 'meds',
        label: 'Medications',
        fields: ['medications'],
        content: <MedicationsStep medicationsArray={medicationsArray} />,
      },
      {
        id: 'lifestyle',
        label: 'Lifestyle',
        fields: [
          'lifestyle.smoking',
          'lifestyle.alcoholPerWeek',
          'lifestyle.exerciseDaysPerWeek',
          'lifestyle.sleepHours',
        ],
        content: <LifestyleStep />,
      },
      {
        id: 'complaint',
        label: 'Primary Complaint',
        fields: ['complaint.primary', 'complaint.duration', 'complaint.severity'],
        content: <ComplaintStep />,
      },
    ],
    [medicationsArray]
  );

  const handleNext = async () => {
    const valid = await form.trigger(steps[step].fields as (keyof PatientIntakeForm)[], { shouldFocus: true });
    if (valid) next();
  };

  const handleSubmit = form.handleSubmit((values) => {
    const parsed = toPatientIntake(values);
    if (onComplete) {
      onComplete(parsed);
    }
  });

  return (
    <FormProvider {...form}>
      <section className="relative bg-slate-950 px-6 py-12 text-white" id="intake">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Step {step + 1} of {steps.length}</p>
              <h3 className="text-2xl font-semibold">Patient Intake Wizard</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-cyan-200" type="button" onClick={() => clearDraft()}>
              Reset draft
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200">
            <span className="mr-2 text-slate-300">Quick-load sample:</span>
            {examplePatients.map((sample) => (
              <Button
                key={sample.personal.fullName}
                type="button"
                size="sm"
                variant="outline"
                className="border-white/20 bg-white/5 text-white"
                onClick={() => form.reset(sample)}
              >
                {sample.personal.fullName}
              </Button>
            ))}
          </div>

          <Progress value={progress} className="h-2 bg-white/10" />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            {steps.map((item, idx) => (
              <div
                key={item.id}
                className={`rounded-xl border px-3 py-2 text-sm ${idx === step ? 'border-cyan-400 bg-cyan-400/10 text-white' : 'border-white/10 bg-white/5 text-slate-200'}`}
              >
                {item.label}
              </div>
            ))}
          </div>

          <Card className="border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={steps[step].id}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {steps[step].content}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                className="text-cyan-100"
                onClick={() => back()}
                disabled={step === 0}
              >
                Back
              </Button>
              <div className="flex items-center gap-2">
                {step < steps.length - 1 ? (
                  <Button type="button" onClick={handleNext} className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white">
                    Next step
                  </Button>
                ) : (
                  <Button type="button" onClick={() => handleSubmit()} className="bg-gradient-to-r from-cyan-400 to-pink-500 text-white">
                    Review & continue
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </section>
    </FormProvider>
  );
}
