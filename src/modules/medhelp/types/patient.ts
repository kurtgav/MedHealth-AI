export type SmokingStatus = 'never' | 'former' | 'current';

export interface PersonalInfo {
  fullName: string;
  age: number;
  weightKg: number;
  heightCm: number;
  bmi?: number;
  gender?: 'male' | 'female' | 'other' | 'unspecified';
  bloodPressure?: string;
  heartRate?: number;
}

export interface MedicalHistory {
  conditions: string[];
  allergies: string[];
  surgeries?: string[];
  familyHistory?: string[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
}

export interface LifestyleFactors {
  smoking: SmokingStatus;
  packYears?: number;
  alcoholPerWeek?: number;
  exerciseDaysPerWeek?: number;
  exerciseIntensity?: 'low' | 'moderate' | 'high';
  dietType?: string;
  sleepHours?: number;
}

export interface Complaint {
  primary: string;
  duration: string;
  severity: number; // 1-10
  treatmentsTried?: string;
}

export interface PatientIntake {
  personal: PersonalInfo;
  history: MedicalHistory;
  medications: Medication[];
  lifestyle: LifestyleFactors;
  complaint: Complaint;
}
