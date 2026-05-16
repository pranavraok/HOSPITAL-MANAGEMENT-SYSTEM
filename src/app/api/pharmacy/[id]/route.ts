import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request2: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const medicine = await prisma.medicine.findUnique({ where: { id } });
    if (!medicine) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(medicine);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch medicine" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const body = (await request.json()) as {
      name?: string;
      stockQuantity?: number;
      price?: string | number;
      manufacturer?: string;
      expiryDate?: string;
    };

    const updated = await prisma.medicine.update({
      where: { id },
      data: {
        ...(body.name ? { name: body.name } : {}),
        ...(body.stockQuantity !== undefined ? { stockQuantity: body.stockQuantity } : {}),
        ...(body.price !== undefined ? { price: new Prisma.Decimal(body.price) } : {}),
        ...(body.manufacturer ? { manufacturer: body.manufacturer } : {}),
        ...(body.expiryDate ? { expiryDate: new Date(body.expiryDate) } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update medicine" }, { status: 500 });
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

    await prisma.medicine.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete medicine" }, { status: 500 });
  }
}
