import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request2: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const room = await prisma.room.findUnique({ where: { id }, include: { patient: true } });
    if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(room);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const body = (await request.json()) as {
      roomNumber?: string;
      roomType?: string;
      capacity?: number;
      departmentId?: number | null;
      patientId?: number | null;
      isOccupied?: boolean;
    };
    const room = await prisma.room.update({
      where: { id },
      data: {
        ...(body.roomNumber ? { roomNumber: body.roomNumber } : {}),
        ...(body.roomType ? { roomType: body.roomType } : {}),
        ...(body.capacity !== undefined ? { capacity: body.capacity } : {}),
        ...(body.departmentId !== undefined ? { departmentId: body.departmentId } : {}),
        ...(body.patientId !== undefined ? { patientId: body.patientId } : {}),
        ...(body.isOccupied !== undefined ? { isOccupied: body.isOccupied } : {}),
      },
    });
    return NextResponse.json(room);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
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

    await prisma.room.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 });
  }
}
