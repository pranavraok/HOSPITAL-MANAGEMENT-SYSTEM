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
  const [doctors,  setDoctors]  = useState<Doctor[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ patientId: "", doctorId: "", date: "", time: "", notes: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetch("/api/patients"), fetch("/api/doctors")])
      .then(async ([pRes, dRes]) => {
        const [pJson, dJson] = await Promise.all([pRes.json(), dRes.json()]);
        setPatients(Array.isArray(pJson) ? pJson as Patient[] : []);
        setDoctors(Array.isArray(dJson)  ? dJson  as Doctor[]  : []);
      })
      .catch(() => { setPatients([]); setDoctors([]); })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.patientId) { setError("Please select a patient.");         return; }
    if (!form.doctorId)  { setError("Please select a doctor.");          return; }
    if (!form.date)      { setError("Please pick a date.");              return; }
    if (!form.time)      { setError("Please pick a time.");              return; }

    const scheduledAt = new Date(`${form.date}T${form.time}`);
    if (isNaN(scheduledAt.getTime())) { setError("Invalid date or time."); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId:   Number(form.patientId),
          doctorId:    Number(form.doctorId),
          scheduledAt: scheduledAt.toISOString(),
          notes:       form.notes || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to book appointment");
      router.push("/appointments");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loader message="Loading patients and doctors..." />;

  return (
    <div style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader
        eyebrow="Scheduling"
        title="Book Appointment"
        description="Select patient, doctor, date and time to schedule a visit."
        actions={<HeaderActionLink href="/appointments">← Back</HeaderActionLink>}
      />

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #f1f5f9",
          boxShadow: "0 1px 6px rgba(15,23,42,0.07)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>📅</span>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>New Appointment</h2>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Error */}
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 14, display: "flex", gap: 8 }}>
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          {/* Patient */}
          <Field label="Patient *">
            <select style={inputSt} value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} required>
              <option value="">— Select a patient —</option>
              {patients.length === 0 && <option disabled>No patients found — add one first</option>}
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.email})</option>
              ))}
            </select>
          </Field>

          {/* Doctor */}
          <Field label="Doctor *">
            <select style={inputSt} value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} required>
              <option value="">— Select a doctor —</option>
              {doctors.length === 0 && <option disabled>No doctors found — add one first</option>}
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} — {d.specialty}</option>
              ))}
            </select>
          </Field>

          {/* Date + Time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Date *">
              <input
                style={inputSt}
                type="date"
                value={form.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </Field>
            <Field label="Time *">
              <input
                style={inputSt}
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />
            </Field>
          </div>

          {/* Notes */}
          <Field label="Reason / Notes">
            <textarea
              style={{ ...inputSt, minHeight: 100, resize: "vertical" }}
              placeholder="Optional reason for visit or notes..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </Field>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 10,
                background: submitting ? "#94a3b8" : "linear-gradient(135deg, #2563eb, #0891b2)",
                padding: "12px 32px",
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: submitting ? "none" : "0 2px 10px rgba(37,99,235,0.35)",
              }}
            >
              {submitting ? "Booking..." : "📅 Book Appointment"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputSt: React.CSSProperties = {
  width: "100%",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  padding: "11px 14px",
  fontSize: 14,
  color: "#0f172a",
  outline: "none",
};
