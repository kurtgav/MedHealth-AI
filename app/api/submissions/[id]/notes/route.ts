import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-server';
import { UserRole } from '@prisma/client';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: submissionId } = await params;
    const session = await requireAuth();
    const userRole = session.user.role as UserRole;

    // Only doctors can add notes
    if (userRole !== UserRole.DOCTOR) {
      return NextResponse.json(
        { error: 'Only doctors can add notes' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { note } = body;

    if (!note || typeof note !== 'string') {
      return NextResponse.json(
        { error: 'Invalid note' },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Append note to existing notes
    const timestamp = new Date().toISOString();
    const newNote = `[${timestamp}] ${session.user.name || 'Doctor'}: ${note}\n`;
    const updatedNotes = (submission.notes || '') + newNote;

    const updated = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        notes: updatedNotes,
        doctorId: session.user.id, // Assign doctor if not already assigned
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ submission: updated });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    );
  }
}

