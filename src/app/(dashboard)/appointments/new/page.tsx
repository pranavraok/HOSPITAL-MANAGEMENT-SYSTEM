"use client";

import Loader from "@/components/ui/Loader";
import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";
import type { Doctor, Patient } from "@/types";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

export default function NewAppointmentPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ patientId: "", doctorId: "", date: "", time: "", notes: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [pRes, dRes] = await Promise.all([fetch("/api/patients"), fetch("/api/doctors")]);
        const [pJson, dJson] = await Promise.all([pRes.json(), dRes.json()]);
        setPatients(Array.isArray(pJson) ? (pJson as Patient[]) : []);
        setDoctors(Array.isArray(dJson) ? (dJson as Doctor[]) : []);
      } catch (err) {
        setPatients([]);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.patientId || !form.doctorId || !form.date || !form.time) {
      setError("Please fill all required fields");
      return;
    }

    const scheduledAt = new Date(`${form.date}T${form.time}`);
    try {
      const res = await fetch(`/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: Number(form.patientId),
          doctorId: Number(form.doctorId),
          scheduledAt: scheduledAt.toISOString(),
          notes: form.notes,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to create appointment");
      }

      router.push("/appointments");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Scheduling"
        title="Book Appointment"
        description="Select the patient, doctor, date, and time in a guided, easy-to-scan form."
        actions={<HeaderActionLink href="/appointments">Back to Appointments</HeaderActionLink>}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur"
      >
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Patient</label>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
          >
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Doctor</label>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
          >
            <option value="">Select doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                Dr. {d.firstName} {d.lastName} — {d.specialty}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Date</label>
            <input
              type="date"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Time</label>
            <input
              type="time"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Reason / Notes</label>
          <textarea
            className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div>
          <button
            type="submit"
            className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white shadow-sm"
          >
            Book
          </button>
        </div>
      </form>
    </div>
  );
}
