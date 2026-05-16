"use client";

import PageHeader from "@/components/ui/PageHeader";
import type { Appointment, Patient } from "@/types";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type DashboardStats = {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalRevenue: string | number;
  totalMedicines: number;
  totalRooms: number;
  lowStockMedicines: number;
  appointmentStatusGroups: Array<{ status: Appointment["status"]; _count: { status: number } }>;
  recentPatients: Patient[];
  recentAppointments: Appointment[];
};

// ─── Role-specific config ────────────────────────────────────────────────────
const ROLE_META: Record<string, { title: string; description: string; eyebrow: string; color: string }> = {
  ADMIN: {
    eyebrow: "Overview",
    title: "Hospital Dashboard",
    description: "Full operational snapshot — patients, doctors, revenue, rooms and inventory.",
    color: "#2563eb",
  },
  DOCTOR: {
    eyebrow: "Clinical",
    title: "Doctor Dashboard",
    description: "Your scheduled appointments, recent patients and pending lab reports.",
    color: "#16a34a",
  },
  RECEPTIONIST: {
    eyebrow: "Front Office",
    title: "Reception Dashboard",
    description: "Manage patient check-ins, appointments and billing from one place.",
    color: "#ca8a04",
  },
};

const STATS_BY_ROLE: Record<string, { key: string; label: string; icon: string; color: string; bg: string; prefix?: string }[]> = {
  ADMIN: [
    { key: "totalPatients",    label: "Patients",      icon: "👤", color: "#2563eb", bg: "#eff6ff" },
    { key: "totalDoctors",     label: "Doctors",       icon: "⚕",  color: "#059669", bg: "#f0fdf4" },
    { key: "totalAppointments",label: "Appointments",  icon: "📅", color: "#d97706", bg: "#fffbeb" },
    { key: "totalRevenue",     label: "Revenue",       icon: "💳", color: "#7c3aed", bg: "#faf5ff", prefix: "₹" },
    { key: "totalMedicines",   label: "Medicines",     icon: "💊", color: "#0891b2", bg: "#ecfeff" },
    { key: "totalRooms",       label: "Rooms",         icon: "🏥", color: "#db2777", bg: "#fdf2f8" },
    { key: "lowStockMedicines",label: "Low Stock",     icon: "⚠️", color: "#dc2626", bg: "#fef2f2" },
  ],
  DOCTOR: [
    { key: "totalPatients",    label: "Total Patients",    icon: "👤", color: "#2563eb", bg: "#eff6ff" },
    { key: "totalAppointments",label: "My Appointments",   icon: "📅", color: "#16a34a", bg: "#f0fdf4" },
  ],
  RECEPTIONIST: [
    { key: "totalPatients",    label: "Patients",      icon: "👤", color: "#2563eb", bg: "#eff6ff" },
    { key: "totalAppointments",label: "Appointments",  icon: "📅", color: "#d97706", bg: "#fffbeb" },
    { key: "totalRevenue",     label: "Revenue Today", icon: "💳", color: "#7c3aed", bg: "#faf5ff", prefix: "₹" },
    { key: "totalRooms",       label: "Rooms",         icon: "🏥", color: "#db2777", bg: "#fdf2f8" },
  ],
};

const statusColors: Record<string, { bar: string; bg: string; text: string }> = {
  SCHEDULED: { bar: "#2563eb", bg: "#eff6ff", text: "#1e40af" },
  COMPLETED: { bar: "#059669", bg: "#f0fdf4", text: "#065f46" },
  CANCELLED: { bar: "#dc2626", bg: "#fef2f2", text: "#991b1b" },
  NO_SHOW:   { bar: "#f59e0b", bg: "#fffbeb", text: "#92400e" },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [role,  setRole]  = useState("ADMIN");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )hms-role=([^;]+)/);
    setRole(match ? decodeURIComponent(match[1]) : "ADMIN");
  }, []);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); setStats({ totalPatients: 0, totalDoctors: 0, totalAppointments: 0, totalRevenue: 0, totalMedicines: 0, totalRooms: 0, lowStockMedicines: 0, appointmentStatusGroups: [], recentPatients: [], recentAppointments: [] }); }
        else { setError(null); setStats(data); }
      })
      .catch(() => setStats({ totalPatients: 0, totalDoctors: 0, totalAppointments: 0, totalRevenue: 0, totalMedicines: 0, totalRooms: 0, lowStockMedicines: 0, appointmentStatusGroups: [], recentPatients: [], recentAppointments: [] }));
  }, []);

  if (!stats) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="skeleton" style={{ height: 100, borderRadius: 16 }} />
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16 }} />)}
        </div>
      </div>
    );
  }

  const meta      = ROLE_META[role]      ?? ROLE_META.ADMIN;
  const statCfg   = STATS_BY_ROLE[role] ?? STATS_BY_ROLE.ADMIN;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {error && (
        <div style={{ borderRadius: 12, background: "#fffbeb", border: "1px solid #fde68a", padding: "12px 18px", color: "#92400e", fontSize: 13 }}>⚠️ {error}</div>
      )}

      {/* Role-specific welcome banner */}
      <div style={{ borderRadius: 16, background: `linear-gradient(135deg, ${meta.color}18, ${meta.color}08)`, border: `1px solid ${meta.color}30`, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${meta.color}, #0891b2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: `0 4px 14px ${meta.color}44`, flexShrink: 0 }}>
          {role === "DOCTOR" ? "⚕" : role === "RECEPTIONIST" ? "🖥" : "🏥"}
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: meta.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{meta.eyebrow}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>{meta.title}</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{meta.description}</div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
        {statCfg.map((cfg) => {
          const raw = stats[cfg.key as keyof DashboardStats];
          const value = cfg.prefix ? `${cfg.prefix}${Number(raw).toFixed(2)}` : String(raw);
          return (
            <div key={cfg.key} style={{ borderRadius: 16, background: "#fff", padding: "20px", boxShadow: "0 1px 6px rgba(15,23,42,0.07)", border: "1px solid #f1f5f9" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>{cfg.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>{value}</div>
              <div style={{ marginTop: 4, fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent panels — always show for all roles */}
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        <Panel title="Recent Patients" icon="👤">
          {stats.recentPatients.length === 0 ? <EmptyRow text="No recent patients" /> : (
            stats.recentPatients.map((p) => (
              <Row key={p.id} title={`${p.firstName} ${p.lastName}`} subtitle={p.email} avatar={p.firstName?.[0]} />
            ))
          )}
        </Panel>

        <Panel title="Recent Appointments" icon="📅">
          {stats.recentAppointments.length === 0 ? <EmptyRow text="No recent appointments" /> : (
            stats.recentAppointments.map((a) => (
              <Row key={a.id} title={`Appointment #${a.id}`} subtitle={new Date(a.scheduledAt).toLocaleString()} />
            ))
          )}
        </Panel>
      </div>

      {/* Appointment analytics — Admin + Receptionist only */}
      {(role === "ADMIN" || role === "RECEPTIONIST") && (
        <Panel title="Appointment Status Breakdown" icon="📊">
          {stats.appointmentStatusGroups.length === 0 ? <EmptyRow text="No appointment data" /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 4 }}>
              {stats.appointmentStatusGroups.map((g) => {
                const total = Math.max(stats.totalAppointments, 1);
                const pct   = Math.max((g._count.status / total) * 100, 6);
                const c     = statusColors[g.status] ?? { bar: "#2563eb", bg: "#eff6ff", text: "#1e40af" };
                return (
                  <div key={g.status}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: c.bg, color: c.text, borderRadius: 99, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>{g.status}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{g._count.status}</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 99, background: "#f1f5f9", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: c.bar, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      )}

      {/* Doctor-only quick action panel */}
      {role === "DOCTOR" && (
        <Panel title="Quick Actions" icon="⚡">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
            {[
              { label: "Add Lab Report",    href: "/lab",          icon: "🔬", color: "#0891b2" },
              { label: "View Appointments", href: "/appointments", icon: "📅", color: "#16a34a" },
              { label: "Patient Records",   href: "/patients",     icon: "👤", color: "#2563eb" },
            ].map((a) => (
              <a key={a.href} href={a.href} style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "14px 16px", textDecoration: "none", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}>
                <span style={{ fontSize: 22 }}>{a.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{a.label}</span>
              </a>
            ))}
          </div>
        </Panel>
      )}

      {/* Receptionist quick actions */}
      {role === "RECEPTIONIST" && (
        <Panel title="Quick Actions" icon="⚡">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
            {[
              { label: "New Appointment", href: "/appointments/new", icon: "📅", color: "#d97706" },
              { label: "Add Patient",     href: "/patients/new",     icon: "👤", color: "#2563eb" },
              { label: "Generate Bill",   href: "/billing",          icon: "💳", color: "#7c3aed" },
              { label: "Manage Rooms",    href: "/rooms",            icon: "🏥", color: "#db2777" },
            ].map((a) => (
              <a key={a.href} href={a.href} style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "14px 16px", textDecoration: "none", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fffbeb")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}>
                <span style={{ fontSize: 22 }}>{a.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{a.label}</span>
              </a>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon?: string; children: ReactNode }) {
  return (
    <div style={{ borderRadius: 16, background: "#fff", padding: "20px 24px", boxShadow: "0 1px 6px rgba(15,23,42,0.07)", border: "1px solid #f1f5f9" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Row({ title, subtitle, avatar }: { title: string; subtitle: string; avatar?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: "#f8fafc", border: "1px solid #f1f5f9", marginBottom: 8 }}>
      {avatar && (
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #0891b2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
          {avatar.toUpperCase()}
        </div>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</div>
      </div>
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>{text}</div>;
}
