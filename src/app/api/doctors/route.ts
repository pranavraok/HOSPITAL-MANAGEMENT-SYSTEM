import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { createdAt: "desc" },
      include: { department: true },
    });
    return NextResponse.json(doctors);
  } catch (error) {
    console.error("[GET /api/doctors]", error);
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      specialty: string;
      licenseNumber: string;
      departmentId: number;
    };

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.licenseNumber || !body.specialty) {
      return NextResponse.json(
        { error: "firstName, lastName, email, specialty, and licenseNumber are required" },
        { status: 400 }
      );
    }

    if (!body.departmentId || isNaN(Number(body.departmentId))) {
      return NextResponse.json(
        { error: "A valid departmentId is required. Please create a Department first, then use its ID." },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctor.create({
      data: {
        firstName:     body.firstName.trim(),
        lastName:      body.lastName.trim(),
        email:         body.email.trim().toLowerCase(),
        phone:         body.phone?.trim() ?? null,
        specialty:     body.specialty.trim(),
        licenseNumber: body.licenseNumber.trim(),
        departmentId:  Number(body.departmentId),
      },
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/doctors]", error);
    // Prisma unique constraint
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A doctor with this email or license number already exists." },
        { status: 409 }
      );
    }
    // Prisma foreign key constraint (departmentId doesn't exist)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2003"
    ) {
      return NextResponse.json(
        { error: "Department not found. Make sure the Department ID exists in the database." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}
