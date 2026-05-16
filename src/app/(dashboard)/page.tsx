"use client";

import PageHeader from "@/components/ui/PageHeader";
import type { Appointment, Patient } from "@/types";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type DashboardStats = {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalRevenue: string | number;
  totalMedicines: number;
  totalRooms: number;
  lowStockMedicines: number;
  appointmentStatusGroups: Array<{ status: Appointment["status"]; _count: { status: number } }>;
  recentPatients: Patient[];
  recentAppointments: Appointment[];
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchStats() {
    const res = await fetch("/api/dashboard");
    const data = await res.json();

    if (!res.ok || data.error) {
      setError(data.error || "Failed to load dashboard data");
      setStats({
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
      });
      return;
    }

    setError(null);
    setStats(data);
  }

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) {
    return <div className="p-10">Loading...</div>;
  }

  const cards = [
    {
      title: "Patients",
      value: stats.totalPatients,
    },
    {
      title: "Doctors",
      value: stats.totalDoctors,
    },
    {
      title: "Appointments",
      value: stats.totalAppointments,
    },
    {
      title: "Revenue",
      value: `₹${Number(stats.totalRevenue).toFixed(2)}`,
    },
    {
      title: "Medicines",
      value: stats.totalMedicines,
    },
    {
      title: "Rooms",
      value: stats.totalRooms,
    },
    {
      title: "Low Stock",
      value: stats.lowStockMedicines,
    },
  ];

  return (
    <div className="space-y-8">
      {error ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50/90 p-4 text-amber-900 shadow-sm">
          Dashboard data is partially unavailable: {error}
        </div>
      ) : null}

      <PageHeader
        eyebrow="Overview"
        title="Hospital Dashboard"
        description="A quick, readable snapshot of operations, patient flow, revenue, and active work."
      />

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              borderRadius: 24,
              border: "1px solid #e6e9ee",
              backgroundColor: "#ffffff",
              padding: 20,
              boxShadow: "0 1px 6px rgba(2,6,23,0.06)",
            }}
          >
            <h2
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#64748b",
              }}
            >
              {card.title}
            </h2>

            <p style={{ marginTop: 12, fontSize: 28, fontWeight: 700, color: "#0f172a" }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Recent Patients">
          {stats.recentPatients.map((patient) => (
            <Item
              key={patient.id}
              title={`${patient.firstName} ${patient.lastName}`}
              subtitle={patient.email}
            />
          ))}
        </Panel>

        <Panel title="Recent Appointments">
          {stats.recentAppointments.map((appointment) => (
            <Item
              key={appointment.id}
              title={`Appointment #${appointment.id}`}
              subtitle={new Date(appointment.scheduledAt).toLocaleString()}
            />
          ))}
        </Panel>
      </div>

      <Panel title="Appointment Status Analytics">
        <div className="space-y-4">
          {stats.appointmentStatusGroups.map((group) => {
            const total = Math.max(stats.totalAppointments, 1);
            const width = Math.max((group._count.status / total) * 100, 8);

            return (
              <div key={group.status} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{group.status}</span>
                  <span>{group._count.status}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-950"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      style={{
        borderRadius: 24,
        border: "1px solid #e6e9ee",
        backgroundColor: "#ffffff",
        padding: 20,
        boxShadow: "0 1px 6px rgba(2,6,23,0.06)",
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>{title}</h2>
      <div style={{ marginTop: 12, display: "block", gap: 12 }}>{children}</div>
    </section>
  );
}

function Item({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        borderRadius: 12,
        backgroundColor: "#f8fafc",
        padding: 12,
        border: "1px solid #eef2f6",
      }}
    >
      <div style={{ fontWeight: 600, color: "#0f172a" }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>{subtitle}</div>
    </div>
  );
}
