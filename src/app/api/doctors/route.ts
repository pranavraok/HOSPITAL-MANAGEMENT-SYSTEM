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
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      specialty?: string;
      licenseNumber?: string;
      departmentId?: number | string;
    };

    console.log("[POST /api/doctors] body received:", JSON.stringify(body));

    const firstName     = (body.firstName     ?? "").trim();
    const lastName      = (body.lastName      ?? "").trim();
    const email         = (body.email         ?? "").trim().toLowerCase();
    const phone         = (body.phone         ?? "").trim() || null;
    const specialty     = (body.specialty     ?? "").trim();
    const licenseNumber = (body.licenseNumber ?? "").trim();
    const departmentId  = Number(body.departmentId);

    if (!firstName)     return NextResponse.json({ error: "First name is required" },     { status: 400 });
    if (!lastName)      return NextResponse.json({ error: "Last name is required" },      { status: 400 });
    if (!email)         return NextResponse.json({ error: "Email is required" },          { status: 400 });
    if (!specialty)     return NextResponse.json({ error: "Specialty is required" },      { status: 400 });
    if (!licenseNumber) return NextResponse.json({ error: "License number is required" },{ status: 400 });
    if (!departmentId || isNaN(departmentId)) {
      return NextResponse.json({ error: "A valid Department ID (number) is required" }, { status: 400 });
    }

    const now = new Date();

    const doctor = await prisma.doctor.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        specialty,
        licenseNumber,
        departmentId,
        createdAt: now,
        updatedAt: now,
      },
    });

    console.log("[POST /api/doctors] created:", doctor.id);
    return NextResponse.json(doctor, { status: 201 });

  } catch (error: unknown) {
    // Always log the real error
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[POST /api/doctors] REAL ERROR:", msg);

    if (typeof error === "object" && error !== null && "code" in error) {
      const code = (error as { code: string }).code;
      if (code === "P2002") {
        return NextResponse.json({ error: "A doctor with this email or license number already exists." }, { status: 409 });
      }
      if (code === "P2003" || code === "P2025") {
        return NextResponse.json({ error: "Department ID does not exist in the database. Please insert the department first." }, { status: 400 });
      }
    }

    // Return the REAL error message so you can see it in the UI
    return NextResponse.json({ error: `Server error: ${msg}` }, { status: 500 });
  }
}
