import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const reports = await prisma.labReport.findMany({
      orderBy: { testDate: "desc" },
      include: { patient: true },
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch lab reports" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      patientId: number;
      testName: string;
      result: string;
      status?: string;
      notes?: string;
    };
    const report = await prisma.labReport.create({
      data: {
        patientId: body.patientId,
        testName: body.testName,
        result: body.result,
        status: body.status ?? "PENDING",
        notes: body.notes ?? null,
      },
    });
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create lab report" }, { status: 500 });
  }
}
