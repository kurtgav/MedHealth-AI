import { authOptions } from './auth';
import { UserRole } from '@/src/modules/auth/types';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

// Helper function to get server session in NextAuth v5 with database sessions
export async function getAuthSession() {
  try {
    // Get session token from cookies
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('next-auth.session-token')?.value || 
                        cookieStore.get('__Secure-next-auth.session-token')?.value;
    
    if (!sessionToken) return null;
    
    // Get session from database
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    });
    
    if (!session || new Date(session.expires) < new Date()) {
      return null;
    }
    
    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
      },
      expires: session.expires.toISOString(),
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getAuthSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireRole(requiredRole: UserRole) {
  const session = await requireAuth();
  if (session.user.role !== requiredRole) {
    throw new Error('Forbidden: Insufficient permissions');
  }
  return session;
}

