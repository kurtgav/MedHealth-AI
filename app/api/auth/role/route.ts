import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/src/modules/auth/types';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role } = await req.json();

    if (!role || !Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Check if user already has a role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role && user.role !== UserRole.PATIENT) {
      return NextResponse.json({ error: 'Role already set' }, { status: 400 });
    }

    // Update user role
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: role as UserRole },
    });

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error('Error setting role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

