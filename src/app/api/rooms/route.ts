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
    console.error("[GET /api/rooms]", error);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      roomNumber?: string;
      roomType?: string;
      capacity?: number | string;
      departmentId?: number | string | null;
    };

    console.log("[POST /api/rooms] body:", JSON.stringify(body));

    const roomNumber = (body.roomNumber ?? "").trim();
    const roomType   = (body.roomType   ?? "").trim();
    const capacity   = Number(body.capacity ?? 1);

    if (!roomNumber) return NextResponse.json({ error: "Room number is required" }, { status: 400 });
    if (!roomType)   return NextResponse.json({ error: "Room type is required" },   { status: 400 });

    const now = new Date();
    const room = await prisma.room.create({
      data: {
        roomNumber,
        roomType,
        capacity,
        isOccupied:   false,
        departmentId: body.departmentId ? Number(body.departmentId) : null,
        createdAt:    now,
        updatedAt:    now,
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[POST /api/rooms] REAL ERROR:", msg);
    if (typeof error === "object" && error !== null && "code" in error && (error as {code:string}).code === "P2002") {
      return NextResponse.json({ error: "A room with this number already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: `Server error: ${msg}` }, { status: 500 });
  }
}
