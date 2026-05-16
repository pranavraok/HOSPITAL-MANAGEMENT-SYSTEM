"use client";

import EmptyState from "@/components/ui/EmptyState";
import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";
import type { Patient } from "@/types";
import { useEffect, useMemo, useState } from "react";

export default function PatientsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Patient Care"
        title="Patients"
        description="Search, review, and open patient records from a clean list optimized for front-desk work."
        actions={<HeaderActionLink href="/patients/new">+ New Patient</HeaderActionLink>}
      />

      <PatientsList />
    </div>
  );
}

function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function fetchPatients() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/patients");
      if (!res.ok) throw new Error("Failed to fetch patients");
      const data = (await res.json()) as Patient[];
      setPatients(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const query = search.toLowerCase();
    return patients.filter((patient) => {
      return (
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        patient.phone.toLowerCase().includes(query)
      );
    });
  }, [patients, search]);

  if (loading) return <div>Loading patients...</div>;
  if (error)
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700 shadow-sm">
        {error}
      </div>
    );
  if (patients.length === 0)
    return (
      <EmptyState
        message="No patients found yet."
        action={
          <a className="text-cyan-700 hover:underline" href="/patients/new">
            Create the first patient
          </a>
        }
      />
    );

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur sm:p-6">
      <div className="flex gap-3">
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          placeholder="Search patients by name, email, or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredPatients.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-slate-500">
          No patients match your search.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">Gender</th>
                <th className="px-6 py-4 font-semibold">Created</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="transition hover:bg-slate-50/80">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                    {p.firstName} {p.lastName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">{p.email}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">{p.phone}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">{p.gender}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <a
                      className="font-medium text-cyan-700 hover:underline"
                      href={`/patients/${p.id}`}
                    >
                      View
                    </a>
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
