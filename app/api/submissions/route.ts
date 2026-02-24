import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole, SubmissionStatus } from '@prisma/client';
import { requireAuth } from '@/lib/auth-server';

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const userRole = session.user.role as UserRole;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as SubmissionStatus | null;
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');

    const where: any = {};

    // Patients can only see their own submissions
    if (userRole === UserRole.PATIENT) {
      where.patientId = session.user.id;
    }

    // Doctors can filter by patient or doctor
    if (userRole === UserRole.DOCTOR) {
      if (patientId) {
        where.patientId = patientId;
      }
      if (doctorId) {
        where.doctorId = doctorId;
      }
    }

    if (status) {
      where.status = status;
    }

    const submissions = await prisma.submission.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const userRole = session.user.role as UserRole;

    // Only patients can create submissions
    if (userRole !== UserRole.PATIENT) {
      return NextResponse.json(
        { error: 'Only patients can create submissions' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { intakeData, analysisResult } = body;

    if (!intakeData) {
      return NextResponse.json(
        { error: 'Missing intakeData' },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        patientId: session.user.id,
        status: SubmissionStatus.NEW,
        intakeData,
        analysisResult: analysisResult || null,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}

