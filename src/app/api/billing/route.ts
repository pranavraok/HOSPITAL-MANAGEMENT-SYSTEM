import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const billing = await prisma.billing.findMany({
      orderBy: { issuedAt: "desc" },
      include: { patient: true, appointment: true },
    });
    return NextResponse.json(billing);
  } catch (error) {
    console.error("[GET /api/billing]", error);
    return NextResponse.json({ error: "Failed to fetch billing records" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      patientId?: number | string;
      appointmentId?: number | string | null;
      consultationFee?: string | number;
      medicineCharges?: string | number;
      labCharges?: string | number;
      amount?: string | number;
      status?: "PENDING" | "PAID" | "VOID" | "REFUNDED";
    };

    console.log("[POST /api/billing] body:", JSON.stringify(body));

    const patientId = Number(body.patientId);
    if (!patientId || isNaN(patientId)) {
      return NextResponse.json({ error: "Valid patientId is required" }, { status: 400 });
    }

    const consultationFee = new Prisma.Decimal(Number(body.consultationFee ?? 0));
    const medicineCharges = new Prisma.Decimal(Number(body.medicineCharges ?? 0));
    const labCharges      = new Prisma.Decimal(Number(body.labCharges ?? 0));
    const total = body.amount
      ? new Prisma.Decimal(Number(body.amount))
      : consultationFee.add(medicineCharges).add(labCharges);

    const status = body.status ?? "PENDING";
    const now    = new Date();

    const billing = await prisma.billing.create({
      data: {
        patientId,
        appointmentId:  body.appointmentId ? Number(body.appointmentId) : null,
        consultationFee,
        medicineCharges,
        labCharges,
        amount:    total,
        currency:  "INR",
        status,
        issuedAt:  now,
        paidAt:    status === "PAID" ? now : null,
        createdAt: now,
        updatedAt: now,
      },
    });

    return NextResponse.json(billing, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[POST /api/billing] REAL ERROR:", msg);
    if (typeof error === "object" && error !== null && "code" in error) {
      const code = (error as { code: string }).code;
      if (code === "P2003" || code === "P2025") {
        return NextResponse.json({ error: "Patient or Appointment ID does not exist." }, { status: 400 });
      }
    }
    return NextResponse.json({ error: `Server error: ${msg}` }, { status: 500 });
  }
}
