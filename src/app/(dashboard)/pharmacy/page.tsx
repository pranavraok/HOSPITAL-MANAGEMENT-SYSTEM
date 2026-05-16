"use client";

import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import PageHeader from "@/components/ui/PageHeader";
import type { Medicine } from "@/types";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

const EMPTY_FORM = { name: "", stockQuantity: "", price: "", manufacturer: "", expiryDate: "" };

export default function PharmacyPage() {
  const [medicines,  setMedicines]  = useState<Medicine[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [error,      setError]      = useState<string | null>(null);
  const [success,    setSuccess]    = useState(false);

  async function load() {
    const r = await fetch("/api/pharmacy");
    if (r.ok) setMedicines(await r.json() as Medicine[]);
  }

  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const stats = useMemo(() => ({
    total:    medicines.length,
    lowStock: medicines.filter((m) => m.stockQuantity <= 10).length,
    value:    medicines.reduce((s, m) => s + Number(m.price) * m.stockQuantity, 0),
  }), [medicines]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim())         { setError("Medicine name is required.");  return; }
    if (!form.manufacturer.trim()) { setError("Manufacturer is required.");   return; }
    if (!form.expiryDate)          { setError("Expiry date is required.");     return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/pharmacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:          form.name.trim(),
          stockQuantity: Number(form.stockQuantity || 0),
          price:         Number(form.price || 0),
          manufacturer:  form.manufacturer.trim(),
          expiryDate:    form.expiryDate,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to add medicine");
      setForm(EMPTY_FORM);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loader message="Loading pharmacy inventory..." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader eyebrow="Inventory" title="Pharmacy" description="Track medicines, stock levels and expiry dates." />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {[
          { label: "Total Medicines",  value: String(stats.total),              icon: "💊", color: "#2563eb" },
          { label: "Low Stock",        value: String(stats.lowStock),           icon: "⚠️", color: "#d97706" },
          { label: "Inventory Value",  value: `₹${stats.value.toFixed(2)}`,    icon: "💰", color: "#16a34a" },
        ].map((c) => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", padding: "20px 24px", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Add Medicine Form */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(15,23,42,0.07)", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>💊</span>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Add Medicine</h2>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: "20px 24px", display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {[
            { key: "name"          as const, label: "Medicine Name *",  placeholder: "e.g. Paracetamol 500mg",  type: "text"   },
            { key: "manufacturer"  as const, label: "Manufacturer *",    placeholder: "e.g. Cipla Ltd",          type: "text"   },
            { key: "stockQuantity" as const, label: "Stock Quantity",    placeholder: "e.g. 100",                type: "number" },
            { key: "price"         as const, label: "Price (₹)",         placeholder: "e.g. 12.50",              type: "number" },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label style={labelSt}>{label}</label>
              <input style={inputSt} type={type} min="0" step={type === "number" ? "0.01" : undefined} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
          <div>
            <label style={labelSt}>Expiry Date *</label>
            <input style={inputSt} type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} required />
          </div>

          {error   && <div style={{ gridColumn: "1 / -1", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 16px", color: "#dc2626", fontSize: 13 }}>⚠️ {error}</div>}
          {success && <div style={{ gridColumn: "1 / -1", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 16px", color: "#15803d", fontSize: 13 }}>✅ Medicine added!</div>}

          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" disabled={submitting} style={{ borderRadius: 10, background: submitting ? "#94a3b8" : "linear-gradient(135deg,#2563eb,#0891b2)", padding: "11px 28px", fontSize: 14, fontWeight: 700, color: "#fff", border: "none", cursor: submitting ? "not-allowed" : "pointer", boxShadow: submitting ? "none" : "0 2px 10px rgba(37,99,235,0.3)" }}>
              {submitting ? "Saving..." : "+ Add Medicine"}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      {medicines.length === 0 ? <EmptyState message="No medicines in inventory yet." /> : (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(15,23,42,0.07)", overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>📦</span>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Inventory</h2>
            <span style={{ marginLeft: "auto", background: "#eff6ff", color: "#1d4ed8", borderRadius: 99, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{medicines.length} items</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Name", "Manufacturer", "Stock", "Price", "Expiry"].map((h) => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {medicines.map((m, i) => {
                  const isLow = m.stockQuantity <= 10;
                  const isExpired = new Date(m.expiryDate) < new Date();
                  return (
                    <tr key={m.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa")}>
                      <td style={{ padding: "13px 20px", fontWeight: 600, color: "#1e293b", borderBottom: "1px solid #f8fafc" }}>{m.name}</td>
                      <td style={{ padding: "13px 20px", color: "#64748b",  borderBottom: "1px solid #f8fafc" }}>{m.manufacturer}</td>
                      <td style={{ padding: "13px 20px", borderBottom: "1px solid #f8fafc" }}>
                        <span style={{ background: isLow ? "#fffbeb" : "#f0fdf4", color: isLow ? "#92400e" : "#065f46", borderRadius: 99, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{m.stockQuantity} {isLow ? "⚠️ Low" : ""}</span>
                      </td>
                      <td style={{ padding: "13px 20px", color: "#0f172a", fontWeight: 500, borderBottom: "1px solid #f8fafc" }}>₹{Number(m.price).toFixed(2)}</td>
                      <td style={{ padding: "13px 20px", borderBottom: "1px solid #f8fafc" }}>
                        <span style={{ color: isExpired ? "#dc2626" : "#64748b", fontWeight: isExpired ? 700 : 400 }}>{new Date(m.expiryDate).toLocaleDateString()} {isExpired ? "❌ Expired" : ""}</span>
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
