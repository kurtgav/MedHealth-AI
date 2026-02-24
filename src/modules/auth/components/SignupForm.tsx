'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RoleSelectionStep } from './RoleSelectionStep';
import { UserRole } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export function SignupForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role && session.user.role !== UserRole.PATIENT) {
      // User already has a role set, redirect to appropriate dashboard
      if (session.user.role === UserRole.DOCTOR) {
        router.push('/dashboard/doctor');
      } else {
        router.push('/dashboard/patient');
      }
    }
  }, [session, status, router]);

  const handleRoleSelection = async (role: UserRole) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to set role');
      }

      // Redirect to appropriate dashboard
      if (role === UserRole.DOCTOR) {
        router.push('/dashboard/doctor');
      } else {
        router.push('/dashboard/patient');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <Card className="w-full max-w-2xl border-white/10 bg-white/5 text-white shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/70 via-purple-500/70 to-pink-500/70 shadow-lg shadow-cyan-400/30">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-semibold">Complete Your Profile</CardTitle>
          <CardDescription className="text-slate-300">
            Welcome, {session.user.name || session.user.email}! Please select your role to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <RoleSelectionStep onSelectRole={handleRoleSelection} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}



