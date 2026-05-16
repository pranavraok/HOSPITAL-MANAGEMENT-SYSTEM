import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { createdAt: "desc" },
      include: { patient: true },
    });
    return NextResponse.json(rooms);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      roomNumber: string;
      roomType: string;
      capacity?: number;
      departmentId?: number | null;
    };
    const room = await prisma.room.create({
      data: {
        roomNumber: body.roomNumber,
        roomType: body.roomType,
        capacity: body.capacity ?? 1,
        departmentId: body.departmentId ?? null,
      },
    });
    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
