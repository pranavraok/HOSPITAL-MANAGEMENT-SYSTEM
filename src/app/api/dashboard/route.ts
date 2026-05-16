import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalRooms,
      totalBillings,
      recentPatients,
      recentAppointments,
      appointmentStatusGroups,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.appointment.count(),
      prisma.room.count(),
      prisma.billing.aggregate({
        _sum: {
          amount: true,
        },
      }),
      prisma.patient.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.appointment.findMany({
        orderBy: { scheduledAt: "desc" },
        take: 5,
        include: { patient: true, doctor: true },
      }),
      prisma.appointment.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
    ]);

    let totalMedicines = 0;
    let lowStockMedicines = 0;

    try {
      totalMedicines = await prisma.medicine.count();
      lowStockMedicines = await prisma.medicine.count({
        where: { stockQuantity: { lte: 10 } },
      });
    } catch (medicineError) {
      console.warn("Medicine metrics unavailable", medicineError);
    }

    return NextResponse.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalRevenue: totalBillings._sum.amount || 0,
      totalMedicines,
      totalRooms,
      lowStockMedicines,
      appointmentStatusGroups,
      recentPatients,
      recentAppointments,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard data",
        totalPatients: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        totalRevenue: 0,
        totalMedicines: 0,
        totalRooms: 0,
        lowStockMedicines: 0,
        appointmentStatusGroups: [],
        recentPatients: [],
        recentAppointments: [],
      },
      { status: 200 }
    );
  }
}
