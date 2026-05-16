"use client";

import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";
import Loader from "@/components/ui/Loader";
import type { LabReport } from "@/types";
import Link from "next/link";
import { use, useEffect, useState } from "react";

const statusStyle: Record<string, { bg: string; color: string }> = {
  PENDING:   { bg: "#fffbeb", color: "#92400e" },
  COMPLETED: { bg: "#f0fdf4", color: "#065f46" },
  REVIEWED:  { bg: "#eff6ff", color: "#1e40af" },
};

export default function LabReportPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15 — params is a Promise, must use React.use()
  const { id } = use(params);
  const [report, setReport] = useState<LabReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/lab/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => { if (data) setReport(data as LabReport); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader message="Loading lab report..." />;

  if (notFound || !report) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #f1f5f9",
          padding: "48px 32px",
          textAlign: "center",
          boxShadow: "0 1px 6px rgba(15,23,42,0.07)",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔬</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Lab Report Not Found</h1>
        <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20 }}>This report may have been deleted or the ID is invalid.</p>
        <Link
          href="/lab"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "linear-gradient(135deg, #2563eb, #0891b2)",
            color: "#fff",
            borderRadius: 10,
            padding: "10px 22px",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          ← Back to Lab
        </Link>
      </div>
    );
  }

  const patientName = report.patient
    ? `${report.patient.firstName} ${report.patient.lastName}`
    : `Patient #${report.patientId}`;
  const sc = statusStyle[report.status] ?? { bg: "#f1f5f9", color: "#475569" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 800 }}>
      <PageHeader
        eyebrow="Diagnostics"
        title={`Lab Report #${report.id}`}
        description="Detailed view of the lab test result and patient info."
        actions={<HeaderActionLink href="/lab">← Back to Lab</HeaderActionLink>}
      />

      {/* Status badge prominent */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: sc.bg,
          color: sc.color,
          borderRadius: 99,
          padding: "7px 18px",
          fontSize: 13,
          fontWeight: 700,
          alignSelf: "flex-start",
          border: `1px solid ${sc.color}30`,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: sc.color,
            flexShrink: 0,
          }}
        />
        {report.status}
      </div>

      {/* Details Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #f1f5f9",
          boxShadow: "0 1px 6px rgba(15,23,42,0.07)",
          overflow: "hidden",
        }}
      >
        {[
          { label: "Patient",   value: patientName,                                   icon: "👤" },
          { label: "Test Name", value: report.testName,                               icon: "🔬" },
          { label: "Result",    value: report.result,                                 icon: "📋" },
          { label: "Status",    value: report.status,                                 icon: "🔵" },
          { label: "Test Date", value: new Date(report.testDate).toLocaleString(),    icon: "📅" },
          { label: "Notes",     value: report.notes ?? "—",                           icon: "📝" },
          { label: "Created",   value: new Date(report.createdAt).toLocaleString(),   icon: "⏰" },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              padding: "16px 24px",
              borderBottom: i < arr.length - 1 ? "1px solid #f8fafc" : "none",
              background: i % 2 === 0 ? "#fff" : "#fafafa",
            }}
          >
            <span style={{ fontSize: 18, width: 24, flexShrink: 0 }}>{row.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                {row.label}
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, color: "#0f172a" }}>{row.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
