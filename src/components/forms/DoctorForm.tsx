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

export function DoctorForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: initial?.firstName ?? "",
    lastName: initial?.lastName ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    specialty: initial?.specialty ?? "",
    licenseNumber: initial?.licenseNumber ?? "",
    departmentId: initial?.departmentId ? String(initial.departmentId) : "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.firstName || !form.lastName || !form.email || !form.licenseNumber) {
      setError("Please fill required fields");
      return;
    }

    setLoading(true);
    try {
      const payload: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        specialty: string;
        licenseNumber: string;
        departmentId?: number;
      } = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        specialty: form.specialty,
        licenseNumber: form.licenseNumber,
        departmentId: form.departmentId ? Number(form.departmentId) : undefined,
      };

      let res;
      if (initial?.id) {
        res = await fetch(`/api/doctors/${initial.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/doctors`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to save doctor");
      }

      router.push("/doctors");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur"
    >
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">First name</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Last name</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Email</span>
        <input
          type="email"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Phone</span>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Specialty</span>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          value={form.specialty}
          onChange={(e) => setForm({ ...form, specialty: e.target.value })}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">License number</span>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          value={form.licenseNumber}
          onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Department ID</span>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          value={form.departmentId}
          onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
        />
      </label>

      <div>
        <button
          type="submit"
          className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
