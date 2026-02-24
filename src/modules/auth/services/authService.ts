import { getAuthSession, requireAuth, requireRole as requireRoleHelper } from '@/lib/auth-server';
import { UserRole } from '../types';

export async function getSessionWithRole() {
  return await getAuthSession();
}

export { requireAuth, requireRoleHelper as requireRole };

