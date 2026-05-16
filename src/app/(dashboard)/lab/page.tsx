"use client";

import { Badge } from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";
import type { LabReport, Patient } from "@/types";
import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

export default function LabPage() {
  const [reports, setReports] = useState<LabReport[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    patientId: "",
    testName: "",
    result: "",
    status: "PENDING",
    notes: "",
  });

  useEffect(() => {
    async function load() {
      const [reportResponse, patientResponse] = await Promise.all([
        fetch("/api/lab"),
        fetch("/api/patients"),
      ]);
      setReports((await reportResponse.json()) as LabReport[]);
      setPatients((await patientResponse.json()) as Patient[]);
      setLoading(false);
    }

    load();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/lab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, patientId: Number(form.patientId) }),
    });
    const response = await fetch("/api/lab");
    setReports((await response.json()) as LabReport[]);
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Diagnostics"
        title="Laboratory"
        description="Create and track patient-linked reports in a cleaner, easier-to-scan workspace."
        actions={<HeaderActionLink href="/lab">Refresh Reports</HeaderActionLink>}
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur md:grid-cols-2"
      >
        <select
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:col-span-2"
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
        <input
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          placeholder="Test name"
          value={form.testName}
          onChange={(e) => setForm({ ...form, testName: e.target.value })}
        />
        <input
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          placeholder="Result"
          value={form.result}
          onChange={(e) => setForm({ ...form, result: e.target.value })}
        />
        <select
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="PENDING">PENDING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="REVIEWED">REVIEWED</option>
        </select>
        <input
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button
          type="submit"
          className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white shadow-sm md:col-span-2"
        >
          Add Report
        </button>
      </form>

      {reports.length === 0 ? (
        <EmptyState message="No lab reports found" />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Test</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="transition hover:bg-slate-50/80">
                  <td className="px-6 py-4 font-medium text-slate-900">{report.patientId}</td>
                  <td className="px-6 py-4 text-slate-700">{report.testName}</td>
                  <td className="px-6 py-4">
                    <Badge variant={report.status === "COMPLETED" ? "success" : "warning"}>
                      {report.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {new Date(report.testDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      className="font-medium text-cyan-700 hover:underline"
                      href={`/lab/${report.id}`}
                    >
                      View
                    </Link>
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
