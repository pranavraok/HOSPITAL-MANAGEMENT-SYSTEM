import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request2: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const billing = await prisma.billing.findUnique({
      where: { id },
      include: { patient: true, appointment: true },
    });

    if (!billing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(billing);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch billing record" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const body = (await request.json()) as {
      status?: "PENDING" | "PAID" | "VOID" | "REFUNDED";
      consultationFee?: string | number;
      medicineCharges?: string | number;
      labCharges?: string | number;
    };

    const consultationFee =
      body.consultationFee !== undefined ? new Prisma.Decimal(body.consultationFee) : undefined;
    const medicineCharges =
      body.medicineCharges !== undefined ? new Prisma.Decimal(body.medicineCharges) : undefined;
    const labCharges =
      body.labCharges !== undefined ? new Prisma.Decimal(body.labCharges) : undefined;

    const updated = await prisma.billing.update({
      where: { id },
      data: {
        ...(body.status
          ? { status: body.status, paidAt: body.status === "PAID" ? new Date() : null }
          : {}),
        ...(consultationFee ? { consultationFee } : {}),
        ...(medicineCharges ? { medicineCharges } : {}),
        ...(labCharges ? { labCharges } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update billing record" }, { status: 500 });
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

    await prisma.billing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete billing record" }, { status: 500 });
  }
}
