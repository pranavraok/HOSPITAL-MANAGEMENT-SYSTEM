import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const medicines = await prisma.medicine.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(medicines);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch medicines" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name: string;
      stockQuantity: number;
      price: string | number;
      manufacturer: string;
      expiryDate: string;
    };

    const medicine = await prisma.medicine.create({
      data: {
        name: body.name,
        stockQuantity: body.stockQuantity,
        price: new Prisma.Decimal(body.price),
        manufacturer: body.manufacturer,
        expiryDate: new Date(body.expiryDate),
      },
    });

    return NextResponse.json(medicine, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create medicine" }, { status: 500 });
  }
}
