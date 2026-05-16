"use client";

import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";
import type { Patient } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

type PatientFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Patient["gender"];
  address: string;
};

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState<PatientFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "MALE",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const response = await fetch(`/api/patients/${params.id}`);
      if (!response.ok) {
        setError("Patient not found or invalid ID");
        setLoading(false);
        return;
      }

      const data = (await response.json()) as Patient;
      setPatient(data);
      setForm({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        address: data.address ?? "",
      });
      setLoading(false);
    }

    load();
  }, [params.id]);

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!patient) return;

    const response = await fetch(`/api/patients/${patient.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      const updated = (await response.json()) as Patient;
      setPatient(updated);
    }
  }

  async function handleDelete() {
    if (!patient) return;
    if (!confirm("Delete this patient?")) return;

    await fetch(`/api/patients/${patient.id}`, { method: "DELETE" });
    router.push("/patients");
  }

  if (loading) {
    return <div className="p-8">Loading patient...</div>;
  }

  if (error || !patient) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Patient not found</h1>
        <Link href="/patients" className="text-blue-600 underline">
          Back to patients
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Patients"
        title={`${patient.firstName} ${patient.lastName}`}
        description="Edit the record, review core demographics, and keep the profile up to date."
        actions={<HeaderActionLink href="/patients">Back to Patients</HeaderActionLink>}
      />

      <form
        onSubmit={handleSave}
        className="grid gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur md:grid-cols-2"
      >
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">First name</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Last name</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Phone</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Gender</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value as Patient["gender"] })}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Address</span>
          <textarea
            className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </label>

        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-slate-950 px-5 py-3 font-semibold text-white shadow-sm"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm"
            onClick={handleDelete}
          >
            Delete Patient
          </button>
        </div>
      </form>

      <div className="grid gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur md:grid-cols-2">
        <Info label="Created" value={new Date(patient.createdAt).toLocaleString()} />
        <Info label="Gender" value={patient.gender} />
        <Info label="Email" value={patient.email} />
        <Info label="Phone" value={patient.phone} />
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
