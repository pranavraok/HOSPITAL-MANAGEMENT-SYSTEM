import { prisma } from "@/lib/prisma";
import { patientCreateSchema } from "@/validators/patient";
import { NextResponse } from "next/server";

export async function GET(_request: Request) {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = patientCreateSchema.parse(body);

    const patient = await prisma.patient.create({
      data: {
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email,
        phone: parsed.phone,
        gender: parsed.gender,
        address: parsed.address ?? null,
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
