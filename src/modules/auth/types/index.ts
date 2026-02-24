export enum UserRole {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
}



