import { z } from 'zod';

import { PatientIntake } from '../types';
import { calculateBMI } from '../utils';

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  age: z.coerce.number().min(0).max(120),
  weightKg: z.coerce.number().positive(),
  heightCm: z.coerce.number().positive(),
  bmi: z.number().optional(),
  gender: z.enum(['male', 'female', 'other', 'unspecified']).optional(),
  bloodPressure: z.string().optional(),
  heartRate: z.coerce.number().min(20).max(220).optional(),
});

export const medicalHistorySchema = z.object({
  conditions: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  surgeries: z.array(z.string()).default([]),
  familyHistory: z.array(z.string()).default([]),
});

export const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().optional(),
});

export const lifestyleSchema = z.object({
  smoking: z.enum(['never', 'former', 'current']),
  packYears: z.coerce.number().min(0).optional(),
  alcoholPerWeek: z.coerce.number().min(0).max(50).optional(),
  exerciseDaysPerWeek: z.coerce.number().min(0).max(7).optional(),
  exerciseIntensity: z.enum(['low', 'moderate', 'high']).optional(),
  dietType: z.string().optional(),
  sleepHours: z.coerce.number().min(0).max(16).optional(),
});

export const complaintSchema = z.object({
  primary: z.string().min(3, 'Chief complaint required'),
  duration: z.string().min(2, 'Duration required'),
  severity: z.coerce.number().min(1).max(10),
  treatmentsTried: z.string().optional(),
});

export const patientIntakeSchema = z.object({
  personal: personalInfoSchema,
  history: medicalHistorySchema,
  medications: z.array(medicationSchema).default([]),
  lifestyle: lifestyleSchema,
  complaint: complaintSchema,
});

export type PatientIntakeForm = z.infer<typeof patientIntakeSchema>;

export const defaultIntakeValues: PatientIntakeForm = {
  personal: {
    fullName: '',
    age: 35,
    weightKg: 70,
    heightCm: 170,
    bmi: calculateBMI(70, 170),
    gender: 'unspecified',
    bloodPressure: '',
    heartRate: undefined,
  },
  history: {
    conditions: [],
    allergies: [],
    surgeries: [],
    familyHistory: [],
  },
  medications: [
    { name: '', dosage: '', frequency: '', duration: '' },
  ],
  lifestyle: {
    smoking: 'never',
    packYears: 0,
    alcoholPerWeek: 0,
    exerciseDaysPerWeek: 3,
    exerciseIntensity: 'moderate',
    dietType: 'Mediterranean',
    sleepHours: 7,
  },
  complaint: {
    primary: '',
    duration: '',
    severity: 5,
    treatmentsTried: '',
  },
};

export function toPatientIntake(values: PatientIntakeForm): PatientIntake {
  return {
    personal: {
      ...values.personal,
      bmi: values.personal.bmi ?? calculateBMI(values.personal.weightKg, values.personal.heightCm),
    },
    history: values.history,
    medications: values.medications.filter((m) => m.name || m.dosage),
    lifestyle: values.lifestyle,
    complaint: values.complaint,
  };
}
