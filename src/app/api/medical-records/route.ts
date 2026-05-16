import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const records = await prisma.medicalRecord.findMany({
      orderBy: { recordDate: "desc" },
      include: { patient: true, doctor: true },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch medical records" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      patientId: number;
      doctorId: number;
      diagnosis: string;
      treatment?: string;
      notes?: string;
    };
    const record = await prisma.medicalRecord.create({
      data: {
        patientId: body.patientId,
        doctorId: body.doctorId,
        diagnosis: body.diagnosis,
        treatment: body.treatment ?? null,
        notes: body.notes ?? null,
      },
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create medical record" }, { status: 500 });
  }
}
