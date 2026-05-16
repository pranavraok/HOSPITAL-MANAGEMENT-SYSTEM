"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  address?: string;
};

export function PatientForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "MALE",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to create patient");
      }

      // on success navigate back to list
      router.push("/patients");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
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
            onChange={(e) => update("firstName", e.target.value)}
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Last name</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
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
          onChange={(e) => update("email", e.target.value)}
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Phone</span>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Gender</span>
        <select
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          value={form.gender}
          onChange={(e) => update("gender", e.target.value as FormState["gender"])}
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Address</span>
        <textarea
          className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
        />
      </label>

      <div>
        <button
          type="submit"
          className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
          disabled={loading}
        >
          {loading ? "Saving..." : "Create Patient"}
        </button>
      </div>
    </form>
  );
}
