import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const medicines = await prisma.medicine.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(medicines);
  } catch (error) {
    console.error("[GET /api/pharmacy]", error);
    return NextResponse.json({ error: "Failed to fetch medicines" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name?: string;
      stockQuantity?: number | string;
      price?: string | number;
      manufacturer?: string;
      expiryDate?: string;
    };

    console.log("[POST /api/pharmacy] body:", JSON.stringify(body));

    const name         = (body.name ?? "").trim();
    const manufacturer = (body.manufacturer ?? "").trim();
    const stockQuantity = Number(body.stockQuantity ?? 0);
    const price        = Number(body.price ?? 0);
    const expiryDate   = body.expiryDate ? new Date(body.expiryDate) : null;

    if (!name)         return NextResponse.json({ error: "Medicine name is required" }, { status: 400 });
    if (!manufacturer) return NextResponse.json({ error: "Manufacturer is required" },  { status: 400 });
    if (!expiryDate || isNaN(expiryDate.getTime())) {
      return NextResponse.json({ error: "Valid expiry date is required" }, { status: 400 });
    }

    const now = new Date();
    const medicine = await prisma.medicine.create({
      data: {
        name,
        stockQuantity,
        price:      new Prisma.Decimal(price),
        manufacturer,
        expiryDate,
        createdAt:  now,
        updatedAt:  now,
      },
    });

    return NextResponse.json(medicine, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[POST /api/pharmacy] REAL ERROR:", msg);
    if (typeof error === "object" && error !== null && "code" in error && (error as {code:string}).code === "P2002") {
      return NextResponse.json({ error: "A medicine with this name already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: `Server error: ${msg}` }, { status: 500 });
  }
}
