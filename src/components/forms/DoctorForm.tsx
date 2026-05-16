"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  initial?: {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    specialty?: string;
    licenseNumber?: string;
    departmentId?: number | null;
  };
};

const SPECIALTIES = [
  "General Medicine",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Gynecology",
  "Dermatology",
  "Ophthalmology",
  "ENT",
  "Radiology",
  "Pathology",
  "Anesthesiology",
  "Oncology",
  "Psychiatry",
  "Urology",
  "Other",
];

export function DoctorForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName:     initial?.firstName     ?? "",
    lastName:      initial?.lastName      ?? "",
    email:         initial?.email         ?? "",
    phone:         initial?.phone         ?? "",
    specialty:     initial?.specialty     ?? "",
    licenseNumber: initial?.licenseNumber ?? "",
    departmentId:  initial?.departmentId  ? String(initial.departmentId) : "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First name and last name are required."); return;
    }
    if (!form.email.trim()) {
      setError("Email is required."); return;
    }
    if (!form.specialty.trim()) {
      setError("Specialty is required."); return;
    }
    if (!form.licenseNumber.trim()) {
      setError("License number is required."); return;
    }
    if (!form.departmentId || isNaN(Number(form.departmentId))) {
      setError("Department ID is required. Enter the numeric ID of an existing Department (e.g. 1)."); return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName:     form.firstName.trim(),
        lastName:      form.lastName.trim(),
        email:         form.email.trim(),
        phone:         form.phone.trim(),
        specialty:     form.specialty.trim(),
        licenseNumber: form.licenseNumber.trim(),
        departmentId:  Number(form.departmentId),
      };

      const res = initial?.id
        ? await fetch(`/api/doctors/${initial.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/doctors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to save doctor");

      router.push("/doctors");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const f = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [field]: e.target.value });

  return (
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
      <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>⚕️</span>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
          {initial?.id ? "Edit Doctor" : "New Doctor"}
        </h2>
      </div>

      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 18 }}>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 14, display: "flex", gap: 8 }}>
            <span>⚠️</span><span>{error}</span>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="First Name *">
            <input style={inputSt} value={form.firstName} onChange={f("firstName")} placeholder="e.g. Rajesh" required />
          </Field>
          <Field label="Last Name *">
            <input style={inputSt} value={form.lastName} onChange={f("lastName")} placeholder="e.g. Kumar" required />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Email *">
            <input style={inputSt} type="email" value={form.email} onChange={f("email")} placeholder="doctor@hospital.com" required />
          </Field>
          <Field label="Phone">
            <input style={inputSt} value={form.phone} onChange={f("phone")} placeholder="+91 98765 43210" />
          </Field>
        </div>

        <Field label="Specialty *">
          <select style={inputSt} value={form.specialty} onChange={f("specialty")} required>
            <option value="">— Select specialty —</option>
            {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>

        <Field label="License Number *">
          <input style={inputSt} value={form.licenseNumber} onChange={f("licenseNumber")} placeholder="e.g. MCI-2024-001234" required />
        </Field>

        <Field
          label="Department ID *"
          hint="Enter the numeric ID of an existing Department. Example: if Cardiology was created first, enter 1."
        >
          <input
            style={inputSt}
            type="number"
            min="1"
            value={form.departmentId}
            onChange={f("departmentId")}
            placeholder="e.g. 1"
            required
          />
        </Field>

        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 10,
            padding: "12px 16px",
            fontSize: 13,
            color: "#1d4ed8",
            lineHeight: 1.6,
          }}
        >
          <strong>💡 Tip:</strong> You must create a Department in MySQL first before adding a doctor.
          Run: <code style={{ background: "#dbeafe", borderRadius: 4, padding: "1px 6px" }}>INSERT INTO Department (name, description, createdAt, updatedAt) VALUES ('General Medicine', '', NOW(), NOW());</code> then use that row ID here.
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 10,
              background: loading ? "#94a3b8" : "linear-gradient(135deg, #2563eb, #0891b2)",
              padding: "12px 28px",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 2px 10px rgba(37,99,235,0.35)",
            }}
          >
            {loading ? "Saving..." : initial?.id ? "Update Doctor" : "Add Doctor"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em" }}>
        {label}
      </label>
      {children}
      {hint && <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{hint}</div>}
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
