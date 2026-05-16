"use client";

import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";
import type { Patient } from "@/types";
import { useEffect, useMemo, useState } from "react";

export default function PatientsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeader
        eyebrow="Patient Care"
        title="Patients"
        description="Search, review, and manage patient records."
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

  useEffect(() => {
    setLoading(true);
    fetch("/api/patients")
      .then((r) => { if (!r.ok) throw new Error("Failed to fetch patients"); return r.json(); })
      .then((data) => { setPatients(data); setError(null); })
      .catch((e) => { setError(e.message); setPatients([]); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return patients.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q)
    );
  }, [patients, search]);

  if (loading) return <Loader message="Loading patients..." />;

  if (error)
    return (
      <div
        style={{
          borderRadius: 12,
          background: "#fef2f2",
          border: "1px solid #fecaca",
          padding: "16px 20px",
          color: "#dc2626",
          fontSize: 14,
        }}
      >
        ⚠️ {error}
      </div>
    );

  if (patients.length === 0)
    return (
      <EmptyState
        message="No patients found yet."
        action={<a style={{ color: "#fff", textDecoration: "none" }} href="/patients/new">Create the first patient</a>}
      />
    );

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 6px rgba(15,23,42,0.07)",
        overflow: "hidden",
      }}
    >
      {/* Search bar */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
        <input
          style={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            padding: "10px 16px",
            fontSize: 14,
            color: "#0f172a",
            outline: "none",
          }}
          placeholder="🔍  Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
          No patients match your search.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Name", "Email", "Phone", "Gender", "Created", "Actions"].map((h) => (
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
              {filtered.map((p, i) => (
                <tr
                  key={p.id}
                  style={{
                    background: i % 2 === 0 ? "#fff" : "#fafafa",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa")}
                >
                  <td style={{ padding: "13px 20px", borderBottom: "1px solid #f8fafc" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
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
                        {p.firstName?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, color: "#1e293b" }}>
                        {p.firstName} {p.lastName}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 20px", color: "#64748b", borderBottom: "1px solid #f8fafc" }}>{p.email}</td>
                  <td style={{ padding: "13px 20px", color: "#64748b", borderBottom: "1px solid #f8fafc", whiteSpace: "nowrap" }}>{p.phone}</td>
                  <td style={{ padding: "13px 20px", borderBottom: "1px solid #f8fafc" }}>
                    <span
                      style={{
                        display: "inline-block",
                        background: p.gender === "MALE" ? "#eff6ff" : p.gender === "FEMALE" ? "#fdf2f8" : "#f1f5f9",
                        color: p.gender === "MALE" ? "#1d4ed8" : p.gender === "FEMALE" ? "#be185d" : "#64748b",
                        borderRadius: 99,
                        padding: "3px 10px",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {p.gender}
                    </span>
                  </td>
                  <td style={{ padding: "13px 20px", color: "#94a3b8", fontSize: 12, borderBottom: "1px solid #f8fafc", whiteSpace: "nowrap" }}>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "13px 20px", borderBottom: "1px solid #f8fafc" }}>
                    <a
                      href={`/patients/${p.id}`}
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
