import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const doctors = await prisma.doctor.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(doctors);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const doctor = await prisma.doctor.create({ data: body });
    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}
