export const AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD_DOCTOR: '/dashboard/doctor',
  DASHBOARD_PATIENT: '/dashboard/patient',
} as const;

export const PROTECTED_ROUTES = ['/dashboard'] as const;



