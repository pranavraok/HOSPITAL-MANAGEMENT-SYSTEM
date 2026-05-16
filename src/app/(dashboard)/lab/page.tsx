"use client";

import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import PageHeader from "@/components/ui/PageHeader";
import type { LabReport, Patient } from "@/types";
import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

const statusStyle: Record<string, { bg: string; color: string }> = {
  PENDING:   { bg: "#fffbeb", color: "#92400e" },
  COMPLETED: { bg: "#f0fdf4", color: "#065f46" },
  REVIEWED:  { bg: "#eff6ff", color: "#1e40af" },
};

const EMPTY_FORM = { patientId: "", testName: "", result: "", status: "PENDING", notes: "" };

export default function LabPage() {
  const [reports, setReports]   = useState<LabReport[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);

  async function loadReports() {
    const r = await fetch("/api/lab");
    const data = await r.json();
    if (r.ok) setReports(data as LabReport[]);
  }

  useEffect(() => {
    Promise.all([fetch("/api/lab"), fetch("/api/patients")])
      .then(async ([rr, pr]) => {
        const [reportData, patientData] = await Promise.all([rr.json(), pr.json()]);
        if (rr.ok) setReports(reportData as LabReport[]);
        if (pr.ok) setPatients(patientData as Patient[]);
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.patientId || !form.testName || !form.result) {
      setError("Patient, Test Name, and Result are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, patientId: Number(form.patientId) }),
      });
      if (!res.ok) throw new Error("Failed to create report");
      setForm(EMPTY_FORM);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await loadReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loader message="Loading lab reports..." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader
        eyebrow="Diagnostics"
        title="Laboratory"
        description="Create and track patient-linked lab reports."
      />

      {/* Add Report Form */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #f1f5f9",
          boxShadow: "0 1px 6px rgba(15,23,42,0.07)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>🔬</span>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Add New Lab Report</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "20px 24px", display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>

          {/* Patient select — full width */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Patient *</label>
            <select
              style={inputStyle}
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              required
            >
              <option value="">— Select a patient —</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} ({p.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Test Name *</label>
            <input
              style={inputStyle}
              placeholder="e.g. Blood CBC, Urine Routine"
              value={form.testName}
              onChange={(e) => setForm({ ...form, testName: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Result *</label>
            <input
              style={inputStyle}
              placeholder="e.g. Normal, 12.4 g/dL"
              value={form.result}
              onChange={(e) => setForm({ ...form, result: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select
              style={inputStyle}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="REVIEWED">Reviewed</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Notes</label>
            <input
              style={inputStyle}
              placeholder="Optional notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          {/* Error / Success */}
          {error && (
            <div style={{ gridColumn: "1 / -1", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 16px", color: "#dc2626", fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{ gridColumn: "1 / -1", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 16px", color: "#15803d", fontSize: 13 }}>
              ✅ Lab report created successfully!
            </div>
          )}

          <div style={{ gridColumn: "1 / -1" }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 10,
                background: submitting ? "#94a3b8" : "linear-gradient(135deg, #2563eb, #0891b2)",
                padding: "11px 28px",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: submitting ? "none" : "0 2px 10px rgba(37,99,235,0.35)",
              }}
            >
              {submitting ? "Saving..." : "+ Add Report"}
            </button>
          </div>
        </form>
      </div>

      {/* Reports Table */}
      {reports.length === 0 ? (
        <EmptyState message="No lab reports found yet." />
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 6px rgba(15,23,42,0.07)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>📊</span>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>All Reports</h2>
            <span
              style={{
                marginLeft: "auto",
                background: "#eff6ff",
                color: "#1d4ed8",
                borderRadius: 99,
                padding: "2px 10px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {reports.length} total
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Patient", "Test Name", "Result", "Status", "Date", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 20px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        borderBottom: "1px solid #f1f5f9",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((report, i) => {
                  const sc = statusStyle[report.status] ?? { bg: "#f1f5f9", color: "#475569" };
                  const patientName = report.patient
                    ? `${report.patient.firstName} ${report.patient.lastName}`
                    : `Patient #${report.patientId}`;
                  return (
                    <tr
                      key={report.id}
                      style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa")}
                    >
                      <td style={{ padding: "13px 20px", borderBottom: "1px solid #f8fafc" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #2563eb, #0891b2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#fff",
                              flexShrink: 0,
                            }}
                          >
                            {patientName[0].toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: "#1e293b" }}>{patientName}</span>
                        </div>
                      </td>
                      <td style={{ padding: "13px 20px", color: "#1e293b", fontWeight: 500, borderBottom: "1px solid #f8fafc" }}>
                        {report.testName}
                      </td>
                      <td style={{ padding: "13px 20px", color: "#64748b", borderBottom: "1px solid #f8fafc" }}>
                        {report.result}
                      </td>
                      <td style={{ padding: "13px 20px", borderBottom: "1px solid #f8fafc" }}>
                        <span
                          style={{
                            display: "inline-block",
                            background: sc.bg,
                            color: sc.color,
                            borderRadius: 99,
                            padding: "3px 10px",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td style={{ padding: "13px 20px", color: "#94a3b8", fontSize: 12, borderBottom: "1px solid #f8fafc", whiteSpace: "nowrap" }}>
                        {new Date(report.testDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "13px 20px", borderBottom: "1px solid #f8fafc" }}>
                        <Link
                          href={`/lab/${report.id}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            background: "linear-gradient(135deg, #2563eb, #0891b2)",
                            color: "#fff",
                            borderRadius: 8,
                            padding: "6px 14px",
                            fontSize: 12,
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  padding: "11px 14px",
  fontSize: 14,
  color: "#0f172a",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#64748b",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
};
