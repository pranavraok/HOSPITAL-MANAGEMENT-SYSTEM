"use client";

import { Badge } from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";
import useAppointments from "@/hooks/useAppointments";
import type { AppointmentRecord } from "@/types";

export default function AppointmentsPage() {
  const { appointments, isLoading, isError, invalidate } = useAppointments();

  if (isLoading) return <Loader />;
  if (isError) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700 shadow-sm">
        Failed to load appointments
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Scheduling"
        title="Appointments"
        description="Track upcoming visits, status changes, and cancellations from a single list."
        actions={<HeaderActionLink href="/appointments/new">+ Book Appointment</HeaderActionLink>}
      />

      {!appointments || appointments.length === 0 ? (
        <EmptyState
          message="No appointments found"
          action={
            <a className="text-cyan-700 hover:underline" href="/appointments/new">
              Book the first appointment
            </a>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">When</th>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Doctor</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((a: AppointmentRecord) => (
                <tr key={a.id} className="transition hover:bg-slate-50/80">
                  <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                    {new Date(a.scheduledAt).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-900">
                    {a.patient?.firstName} {a.patient?.lastName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-900">
                    Dr. {a.doctor?.firstName} {a.doctor?.lastName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Badge
                      variant={
                        a.status === "SCHEDULED"
                          ? "info"
                          : a.status === "COMPLETED"
                            ? "success"
                            : "warning"
                      }
                    >
                      {a.status}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <a
                      className="mr-4 font-medium text-cyan-700 hover:underline"
                      href={`/appointments/${a.id}`}
                    >
                      View
                    </a>
                    <button
                      className="font-medium text-rose-600"
                      onClick={async () => {
                        if (!confirm("Cancel this appointment?")) return;
                        await fetch(`/api/appointments/${a.id}`, { method: "DELETE" });
                        invalidate();
                      }}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
