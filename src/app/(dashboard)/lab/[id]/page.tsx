"use client";

import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";
import type { LabReport } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LabReportPage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<LabReport | null>(null);

  useEffect(() => {
    async function load() {
      const response = await fetch(`/api/lab/${params.id}`);
      if (!response.ok) return;
      setReport((await response.json()) as LabReport);
    }

    load();
  }, [params.id]);

  if (!report) {
    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-sm backdrop-blur">
        <h1 className="text-2xl font-semibold text-slate-950">Lab report not found</h1>
        <Link href="/lab" className="mt-3 inline-block font-medium text-cyan-700 hover:underline">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Diagnostics"
        title={`Lab Report #${report.id}`}
        description="Review the test result, status, and notes in a focused detail view."
        actions={<HeaderActionLink href="/lab">Back to Lab</HeaderActionLink>}
      />

      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur space-y-3">
        <KeyValue label="Patient ID" value={String(report.patientId)} />
        <KeyValue label="Test" value={report.testName} />
        <KeyValue label="Result" value={report.result} />
        <KeyValue label="Status" value={report.status} />
        <KeyValue label="Date" value={new Date(report.testDate).toLocaleString()} />
        <KeyValue label="Notes" value={report.notes ?? "-"} />
      </div>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50/90 p-4 ring-1 ring-inset ring-slate-200/80">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 font-medium text-slate-900">{value}</div>
    </div>
  );
}
