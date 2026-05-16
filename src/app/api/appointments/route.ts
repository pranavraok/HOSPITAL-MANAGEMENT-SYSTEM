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
    console.error("[GET /api/appointments]", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      patientId?: number | string;
      doctorId?: number | string;
      scheduledAt?: string;
      notes?: string;
    };

    console.log("[POST /api/appointments] body:", JSON.stringify(body));

    const patientId  = Number(body.patientId);
    const doctorId   = Number(body.doctorId);
    const scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;

    if (!patientId  || isNaN(patientId))  return NextResponse.json({ error: "Valid patientId is required" },  { status: 400 });
    if (!doctorId   || isNaN(doctorId))   return NextResponse.json({ error: "Valid doctorId is required" },   { status: 400 });
    if (!scheduledAt || isNaN(scheduledAt.getTime())) return NextResponse.json({ error: "Valid scheduledAt date is required" }, { status: 400 });

    // Check doctor double-booking
    const existing = await prisma.appointment.findFirst({
      where: { doctorId, scheduledAt },
    });
    if (existing) {
      return NextResponse.json({ error: "Doctor already has an appointment at that exact time" }, { status: 409 });
    }

    const now = new Date();
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        scheduledAt,
        notes:     body.notes ?? null,
        status:    "SCHEDULED",
        createdAt: now,
        updatedAt: now,
      },
    });

    console.log("[POST /api/appointments] created:", appointment.id);
    return NextResponse.json(appointment, { status: 201 });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[POST /api/appointments] REAL ERROR:", msg);

    if (typeof error === "object" && error !== null && "code" in error) {
      const code = (error as { code: string }).code;
      if (code === "P2003" || code === "P2025") {
        return NextResponse.json({ error: "Patient or Doctor ID does not exist in the database." }, { status: 400 });
      }
    }
    return NextResponse.json({ error: `Server error: ${msg}` }, { status: 500 });
  }
}
