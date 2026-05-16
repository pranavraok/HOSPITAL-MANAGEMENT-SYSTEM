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
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch billing records" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      patientId: number;
      appointmentId?: number | null;
      consultationFee?: string | number;
      medicineCharges?: string | number;
      labCharges?: string | number;
      amount?: string | number;
      status?: "PENDING" | "PAID" | "VOID" | "REFUNDED";
    };

    if (!body.patientId) {
      return NextResponse.json({ error: "Patient is required" }, { status: 400 });
    }

    const consultationFee = new Prisma.Decimal(body.consultationFee ?? 0);
    const medicineCharges = new Prisma.Decimal(body.medicineCharges ?? 0);
    const labCharges = new Prisma.Decimal(body.labCharges ?? 0);
    const total = body.amount
      ? new Prisma.Decimal(body.amount)
      : consultationFee.add(medicineCharges).add(labCharges);

    const billing = await prisma.billing.create({
      data: {
        patientId: body.patientId,
        appointmentId: body.appointmentId ?? null,
        consultationFee,
        medicineCharges,
        labCharges,
        amount: total,
        status: body.status ?? "PENDING",
        paidAt: body.status === "PAID" ? new Date() : null,
      },
    });

    return NextResponse.json(billing, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create billing record" }, { status: 500 });
  }
}
