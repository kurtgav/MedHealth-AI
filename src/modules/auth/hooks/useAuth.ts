'use client';

import { useSession } from 'next-auth/react';
import { UserRole } from '../types';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    role: session?.user?.role as UserRole | undefined,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
  };
}



