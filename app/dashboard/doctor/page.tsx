import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth-server';
import { UserRole } from '@/src/modules/auth/types';
import { DoctorDashboard } from '@/src/modules/doctor-dashboard/components/DoctorDashboard';

export default async function DoctorDashboardPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== UserRole.DOCTOR) {
    redirect('/dashboard/patient');
  }

  return <DoctorDashboard />;
}

