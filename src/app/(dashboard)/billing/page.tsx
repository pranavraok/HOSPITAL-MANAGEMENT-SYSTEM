"use client";

import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import PageHeader from "@/components/ui/PageHeader";
import type { Billing, Patient } from "@/types";
import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  PENDING:  { bg: "#fffbeb", color: "#92400e" },
  PAID:     { bg: "#f0fdf4", color: "#065f46" },
  VOID:     { bg: "#fef2f2", color: "#991b1b" },
  REFUNDED: { bg: "#eff6ff", color: "#1e40af" },
};

const EMPTY_FORM = { patientId: "", consultationFee: "", medicineCharges: "", labCharges: "", status: "PENDING" as const };

type BillingWithPatient = Billing & { patient?: { firstName: string; lastName: string } | null };

export default function BillingPage() {
  const [billing,    setBilling]    = useState<BillingWithPatient[]>([]);
  const [patients,   setPatients]   = useState<Patient[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [error,      setError]      = useState<string | null>(null);
  const [success,    setSuccess]    = useState(false);

  async function loadBilling() {
    const r = await fetch("/api/billing");
    if (r.ok) setBilling(await r.json() as BillingWithPatient[]);
  }

  useEffect(() => {
    Promise.all([fetch("/api/billing"), fetch("/api/patients")])
      .then(async ([br, pr]) => {
        if (br.ok) setBilling(await br.json() as BillingWithPatient[]);
        if (pr.ok) setPatients(await pr.json() as Patient[]);
      })
      .finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => ({
    revenue: billing.reduce((t, b) => t + Number(b.amount), 0),
    paid:    billing.filter((b) => b.status === "PAID").length,
    pending: billing.filter((b) => b.status === "PENDING").length,
  }), [billing]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.patientId) { setError("Please select a patient."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId:       Number(form.patientId),
          consultationFee: Number(form.consultationFee  || 0),
          medicineCharges: Number(form.medicineCharges || 0),
          labCharges:      Number(form.labCharges      || 0),
          status:          form.status,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to create bill");
      setForm(EMPTY_FORM);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await loadBilling();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loader message="Loading billing records..." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader eyebrow="Finance" title="Billing" description="Generate invoices and track payment status." />

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {[
          { label: "Total Revenue",   value: `₹${summary.revenue.toFixed(2)}`, icon: "💰", color: "#2563eb" },
          { label: "Paid Invoices",   value: String(summary.paid),             icon: "✅", color: "#16a34a" },
          { label: "Pending Invoices",value: String(summary.pending),          icon: "⏳", color: "#d97706" },
        ].map((c) => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", padding: "20px 24px", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Add Bill Form */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(15,23,42,0.07)", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🧾</span>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Generate New Bill</h2>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: "20px 24px", display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelSt}>Patient *</label>
            <select style={inputSt} value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} required>
              <option value="">— Select patient —</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
            </select>
          </div>

          {[
            { key: "consultationFee" as const, label: "Consultation Fee (₹)" },
            { key: "medicineCharges" as const, label: "Medicine Charges (₹)" },
            { key: "labCharges"      as const, label: "Lab Charges (₹)" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label style={labelSt}>{label}</label>
              <input style={inputSt} type="number" min="0" step="0.01" placeholder="0.00" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}

          <div>
            <label style={labelSt}>Status</label>
            <select style={inputSt} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as typeof form.status })}>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="VOID">Void</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>

          {error   && <div style={{ gridColumn: "1 / -1", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 16px", color: "#dc2626", fontSize: 13 }}>⚠️ {error}</div>}
          {success && <div style={{ gridColumn: "1 / -1", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 16px", color: "#15803d", fontSize: 13 }}>✅ Bill created!</div>}

          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" disabled={submitting} style={{ borderRadius: 10, background: submitting ? "#94a3b8" : "linear-gradient(135deg,#2563eb,#0891b2)", padding: "11px 28px", fontSize: 14, fontWeight: 700, color: "#fff", border: "none", cursor: submitting ? "not-allowed" : "pointer", boxShadow: submitting ? "none" : "0 2px 10px rgba(37,99,235,0.3)" }}>
              {submitting ? "Saving..." : "+ Generate Bill"}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      {billing.length === 0 ? <EmptyState message="No billing records yet." /> : (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(15,23,42,0.07)", overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>📋</span>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>All Bills</h2>
            <span style={{ marginLeft: "auto", background: "#eff6ff", color: "#1d4ed8", borderRadius: 99, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{billing.length} total</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Patient", "Consult", "Medicine", "Lab", "Total", "Status", "Issued", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {billing.map((item, i) => {
                  const sc = STATUS_STYLE[item.status] ?? { bg: "#f1f5f9", color: "#475569" };
                  const patientName = item.patient ? `${item.patient.firstName} ${item.patient.lastName}` : `Patient #${item.patientId}`;
                  return (
                    <tr key={item.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa")}>
                      <td style={{ padding: "12px 18px", fontWeight: 600, color: "#1e293b", borderBottom: "1px solid #f8fafc" }}>{patientName}</td>
                      <td style={{ padding: "12px 18px", color: "#64748b", borderBottom: "1px solid #f8fafc" }}>₹{Number(item.consultationFee ?? 0).toFixed(2)}</td>
                      <td style={{ padding: "12px 18px", color: "#64748b", borderBottom: "1px solid #f8fafc" }}>₹{Number(item.medicineCharges ?? 0).toFixed(2)}</td>
                      <td style={{ padding: "12px 18px", color: "#64748b", borderBottom: "1px solid #f8fafc" }}>₹{Number(item.labCharges ?? 0).toFixed(2)}</td>
                      <td style={{ padding: "12px 18px", fontWeight: 700, color: "#0f172a", borderBottom: "1px solid #f8fafc" }}>₹{Number(item.amount).toFixed(2)}</td>
                      <td style={{ padding: "12px 18px", borderBottom: "1px solid #f8fafc" }}><span style={{ background: sc.bg, color: sc.color, borderRadius: 99, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{item.status}</span></td>
                      <td style={{ padding: "12px 18px", color: "#94a3b8", fontSize: 12, borderBottom: "1px solid #f8fafc", whiteSpace: "nowrap" }}>{new Date(item.issuedAt).toLocaleDateString()}</td>
                      <td style={{ padding: "12px 18px", borderBottom: "1px solid #f8fafc" }}>
                        <Link href={`/billing/${item.id}`} style={{ background: "linear-gradient(135deg,#2563eb,#0891b2)", color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>View →</Link>
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

const inputSt: React.CSSProperties = { width: "100%", borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", padding: "11px 14px", fontSize: 14, color: "#0f172a", outline: "none" };
const labelSt: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" };
