import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth-server';
import { UserRole } from '@/src/modules/auth/types';
import { PatientDashboard } from '@/src/modules/patient-dashboard/components/PatientDashboard';

export default async function PatientDashboardPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== UserRole.PATIENT) {
    redirect('/dashboard/doctor');
  }

  return <PatientDashboard />;
}

