"use client";

import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";
import useDoctors from "@/hooks/useDoctors";
import type { Doctor } from "@/types";

export default function DoctorsPage() {
  const { doctors, isLoading, isError, invalidate } = useDoctors();

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700 shadow-sm">
        Failed to load doctors
      </div>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Clinical Team"
        title="Doctors"
        description="See the current clinician roster, open profiles, and manage records quickly."
        actions={<HeaderActionLink href="/doctors/new">+ Add Doctor</HeaderActionLink>}
      />

      {!doctors || doctors.length === 0 ? (
        <EmptyState
          message="No doctors found"
          action={
            <a className="text-cyan-700 hover:underline" href="/doctors/new">
              Add the first doctor
            </a>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Specialty</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctors.map((d: Doctor) => (
                <tr key={d.id} className="transition hover:bg-slate-50/80">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                    Dr. {d.firstName} {d.lastName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">{d.email}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">{d.specialty}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <a
                      className="mr-4 font-medium text-cyan-700 hover:underline"
                      href={`/doctors/${d.id}`}
                    >
                      View
                    </a>
                    <a
                      className="font-medium text-rose-600"
                      href="#"
                      onClick={async (e) => {
                        e.preventDefault();
                        if (!confirm("Delete doctor?")) return;
                        await fetch(`/api/doctors/${d.id}`, { method: "DELETE" });
                        invalidate();
                      }}
                    >
                      Delete
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
