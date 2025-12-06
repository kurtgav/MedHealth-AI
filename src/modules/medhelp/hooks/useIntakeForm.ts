'use client';

import { useEffect, useMemo } from 'react';
import { useFieldArray, useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { calculateBMI } from '../utils';
import { defaultIntakeValues, patientIntakeSchema, PatientIntakeForm, toPatientIntake } from '../constants/intakeSchema';

const DRAFT_KEY = 'medhelp-intake-draft';

export function useIntakeForm() {
  const form = useForm<PatientIntakeForm>({
    resolver: zodResolver(patientIntakeSchema) as Resolver<PatientIntakeForm>,
    defaultValues: defaultIntakeValues,
    mode: 'onChange',
  });

  const { control, setValue, reset } = form;
  const medicationsArray = useFieldArray({ control, name: 'medications' });
  const watchedValues = useWatch<PatientIntakeForm>({ control });
  const values = (watchedValues ?? defaultIntakeValues) as PatientIntakeForm;

  // Load draft on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const draft = window.localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft) as PatientIntakeForm;
        reset(parsed);
      } catch (error) {
        console.warn('Failed to parse intake draft', error);
      }
    }
  }, [reset]);

  // Persist draft + derive BMI when weight/height change
  useEffect(() => {
    if (!values) return;

    const bmi = calculateBMI(values.personal.weightKg, values.personal.heightCm);
    if (Number.isFinite(bmi) && bmi !== values.personal.bmi) {
      setValue('personal.bmi', bmi, { shouldDirty: false, shouldValidate: false });
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(values ?? defaultIntakeValues));
    }
  }, [values, setValue]);

  const clearDraft = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(DRAFT_KEY);
    }
    reset(defaultIntakeValues);
  };

  const derivedIntake = useMemo(
    () => toPatientIntake(values ?? defaultIntakeValues),
    [values]
  );

  return {
    form,
    medicationsArray,
    derivedIntake,
    clearDraft,
  };
}
