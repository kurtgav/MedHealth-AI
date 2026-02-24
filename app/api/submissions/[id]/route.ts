import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole, SubmissionStatus } from '@prisma/client';
import { requireAuth } from '@/lib/auth-server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id: submissionId } = await params;

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
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

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    const userRole = session.user.role as UserRole;

    // Patients can only view their own submissions
    if (userRole === UserRole.PATIENT && submission.patientId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id: submissionId } = await params;
    const userRole = session.user.role as UserRole;

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { status, notes, doctorId } = body;

    // Only doctors can update status and assign themselves
    if (userRole === UserRole.DOCTOR) {
      const updateData: any = {};

      if (status) {
        updateData.status = status as SubmissionStatus;
      }

      if (notes !== undefined) {
        updateData.notes = notes;
      }

      if (doctorId !== undefined) {
        updateData.doctorId = doctorId || null;
      }

      const updated = await prisma.submission.update({
        where: { id: submissionId },
        data: updateData,
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
    }

    // Patients can only update their own submissions (limited fields)
    if (userRole === UserRole.PATIENT && submission.patientId === session.user.id) {
      // Patients can only delete, not update
      return NextResponse.json(
        { error: 'Patients cannot update submissions' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    );
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id: submissionId } = await params;
    const userRole = session.user.role as UserRole;

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Only patients can delete their own submissions
    if (userRole === UserRole.PATIENT && submission.patientId === session.user.id) {
      await prisma.submission.delete({
        where: { id: submissionId },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    );
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    );
  }
}

