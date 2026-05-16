"use client";

import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";
import type { AppointmentRecord } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppointmentDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [appointment, setAppointment] = useState<AppointmentRecord | null>(null);
  const [status, setStatus] = useState<AppointmentRecord["status"]>("SCHEDULED");

  useEffect(() => {
    async function load() {
      const response = await fetch(`/api/appointments/${params.id}`);
      if (!response.ok) return;
      const data = (await response.json()) as AppointmentRecord;
      setAppointment(data);
      setStatus(data.status);
    }

    load();
  }, [params.id]);

  async function updateStatus() {
    if (!appointment) return;
    const response = await fetch(`/api/appointments/${appointment.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      const updated = (await response.json()) as AppointmentRecord;
      setAppointment(updated);
      router.refresh();
    }
  }

  async function cancelAppointment() {
    if (!appointment) return;
    if (!confirm("Cancel this appointment?")) return;
    await fetch(`/api/appointments/${appointment.id}`, { method: "DELETE" });
    router.push("/appointments");
  }

  if (!appointment) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Appointment not found</h1>
        <Link href="/appointments" className="text-blue-600 underline">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Scheduling"
        title="Appointment Details"
        description="Review the booking, then update status or cancel if the visit changes."
        actions={<HeaderActionLink href="/appointments">Back to Appointments</HeaderActionLink>}
      />

      <div className="grid gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur md:grid-cols-2">
        <Info label="When" value={new Date(appointment.scheduledAt).toLocaleString()} />
        <Info
          label="Patient"
          value={`${appointment.patient?.firstName ?? ""} ${appointment.patient?.lastName ?? ""}`}
        />
        <Info
          label="Doctor"
          value={`Dr. ${appointment.doctor?.firstName ?? ""} ${appointment.doctor?.lastName ?? ""}`}
        />
        <Info label="Specialty" value={appointment.doctor?.specialty ?? "-"} />
        <Info label="Notes" value={appointment.notes ?? "-"} />
        <Info label="Status" value={appointment.status} />
      </div>

      <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Update status</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as AppointmentRecord["status"])}
          >
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No show</option>
          </select>
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={updateStatus}
            className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white shadow-sm"
          >
            Save Status
          </button>
          <button
            type="button"
            onClick={cancelAppointment}
            className="rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm"
          >
            Cancel Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50/90 p-4 ring-1 ring-inset ring-slate-200/80">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 font-medium text-slate-900">{value}</div>
    </div>
  );
}
