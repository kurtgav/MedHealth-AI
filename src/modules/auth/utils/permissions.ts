import { UserRole } from '../types';

export function canAccessDoctorDashboard(role: UserRole | null | undefined): boolean {
  return role === UserRole.DOCTOR;
}

export function canAccessPatientDashboard(role: UserRole | null | undefined): boolean {
  return role === UserRole.PATIENT;
}

export function canViewAllSubmissions(role: UserRole | null | undefined): boolean {
  return role === UserRole.DOCTOR;
}

export function canCreateSubmission(role: UserRole | null | undefined): boolean {
  return role === UserRole.PATIENT;
}



