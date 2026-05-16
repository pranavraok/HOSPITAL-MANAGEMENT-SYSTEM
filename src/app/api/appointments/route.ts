import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { scheduledAt: "desc" },
      include: { patient: true, doctor: true },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { patientId, doctorId, scheduledAt, notes } = body as {
      patientId: number;
      doctorId: number;
      scheduledAt: string;
      notes?: string;
    };

    if (!patientId || !doctorId || !scheduledAt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const date = new Date(scheduledAt);
    if (Number.isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    // Prevent doctor double-booking: no appointment with same doctor at exact same time
    const existing = await prisma.appointment.findFirst({
      where: { doctorId, scheduledAt: date },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Doctor already has an appointment at that time" },
        { status: 409 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        scheduledAt: date,
        notes: notes ?? null,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
