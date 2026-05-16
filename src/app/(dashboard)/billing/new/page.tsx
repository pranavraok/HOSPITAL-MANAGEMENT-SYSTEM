"use client";

import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";
import type { Appointment, Billing, Patient } from "@/types";
import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

type FormState = {
  patientId: string;
  appointmentId: string;
  consultationFee: string;
  medicineCharges: string;
  labCharges: string;
  status: Billing["status"];
};

export default function NewBillingPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState<FormState>({
    patientId: "",
    appointmentId: "",
    consultationFee: "0",
    medicineCharges: "0",
    labCharges: "0",
    status: "PENDING",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [patientResponse, appointmentResponse] = await Promise.all([
        fetch("/api/patients"),
        fetch("/api/appointments"),
      ]);
      setPatients((await patientResponse.json()) as Patient[]);
      setAppointments((await appointmentResponse.json()) as Appointment[]);
    }

    load();
  }, []);

  const total = useMemo(() => {
    return [form.consultationFee, form.medicineCharges, form.labCharges].reduce(
      (sum, value) => sum + Number(value || 0),
      0
    );
  }, [form.consultationFee, form.medicineCharges, form.labCharges]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.patientId) {
      setError("Patient is required");
      return;
    }

    const response = await fetch("/api/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: Number(form.patientId),
        appointmentId: form.appointmentId ? Number(form.appointmentId) : null,
        consultationFee: form.consultationFee,
        medicineCharges: form.medicineCharges,
        labCharges: form.labCharges,
        amount: total,
        status: form.status,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body?.error || "Failed to create bill");
      return;
    }

    router.push("/billing");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Finance"
        title="Generate Bill"
        description="Create a clear invoice from patient and appointment details with line-item totals."
        actions={<HeaderActionLink href="/billing">Back to Billing</HeaderActionLink>}
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
        <Field label="Patient">
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
          >
            <option value="">Select patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Appointment">
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={form.appointmentId}
            onChange={(e) => setForm({ ...form, appointmentId: e.target.value })}
          >
            <option value="">Optional appointment</option>
            {appointments.map((appointment) => (
              <option key={appointment.id} value={appointment.id}>
                #{appointment.id} - {new Date(appointment.scheduledAt).toLocaleString()}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Consultation fee">
            <input
              className="w-full rounded-lg border px-3 py-2"
              type="number"
              step="0.01"
              value={form.consultationFee}
              onChange={(e) => setForm({ ...form, consultationFee: e.target.value })}
            />
          </Field>
          <Field label="Medicine charges">
            <input
              className="w-full rounded-lg border px-3 py-2"
              type="number"
              step="0.01"
              value={form.medicineCharges}
              onChange={(e) => setForm({ ...form, medicineCharges: e.target.value })}
            />
          </Field>
          <Field label="Lab charges">
            <input
              className="w-full rounded-lg border px-3 py-2"
              type="number"
              step="0.01"
              value={form.labCharges}
              onChange={(e) => setForm({ ...form, labCharges: e.target.value })}
            />
          </Field>
        </div>

        <div className="rounded-2xl bg-cyan-50 p-4 text-lg font-semibold text-cyan-900">
          Total: ₹{total.toFixed(2)}
        </div>

        <Field label="Payment status">
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Billing["status"] })}
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="VOID">Void</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </Field>

        <button
          type="submit"
          className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white shadow-sm"
        >
          Create Bill
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
