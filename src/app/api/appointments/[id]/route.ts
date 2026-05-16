import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { patient: true, doctor: true },
    });

    if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const body = await request.json();

    const updateData: any = {};
    if (body.status) updateData.status = body.status;
    if (body.scheduledAt) updateData.scheduledAt = new Date(body.scheduledAt);
    if (body.notes !== undefined) updateData.notes = body.notes;

    // If updating scheduledAt or doctorId, check double-booking
    if (updateData.scheduledAt || body.doctorId) {
      const appointment = await prisma.appointment.findUnique({ where: { id } });
      if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });

      const doctorId = body.doctorId ?? appointment.doctorId;
      const scheduledAt = updateData.scheduledAt ?? appointment.scheduledAt;

      const existing = await prisma.appointment.findFirst({
        where: { doctorId, scheduledAt, NOT: { id } },
      });

      if (existing)
        return NextResponse.json({ error: "Doctor already booked at that time" }, { status: 409 });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { ...updateData, doctorId: body.doctorId ?? undefined },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
  }
}
