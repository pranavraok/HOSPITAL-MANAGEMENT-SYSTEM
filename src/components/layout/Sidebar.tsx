"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_BY_ROLE: Record<string, { href: string; label: string; icon: string }[]> = {
  ADMIN: [
    { href: "/",            label: "Dashboard",    icon: "⊞" },
    { href: "/patients",    label: "Patients",     icon: "👤" },
    { href: "/doctors",     label: "Doctors",      icon: "⚕" },
    { href: "/appointments",label: "Appointments", icon: "📅" },
    { href: "/billing",     label: "Billing",      icon: "💳" },
    { href: "/pharmacy",    label: "Pharmacy",     icon: "💊" },
    { href: "/lab",         label: "Lab",          icon: "🔬" },
    { href: "/rooms",       label: "Rooms",        icon: "🏥" },
  ],
  DOCTOR: [
    { href: "/",            label: "My Dashboard", icon: "⊞" },
    { href: "/patients",    label: "Patients",     icon: "👤" },
    { href: "/appointments",label: "Appointments", icon: "📅" },
    { href: "/lab",         label: "Lab Reports",  icon: "🔬" },
  ],
  RECEPTIONIST: [
    { href: "/",            label: "Dashboard",    icon: "⊞" },
    { href: "/patients",    label: "Patients",     icon: "👤" },
    { href: "/appointments",label: "Appointments", icon: "📅" },
    { href: "/billing",     label: "Billing",      icon: "💳" },
    { href: "/rooms",       label: "Rooms",        icon: "🏥" },
  ],
};

const ROLE_LABELS: Record<string, { label: string; subtitle: string; color: string }> = {
  ADMIN:        { label: "Admin Panel",       subtitle: "Full access",         color: "#2563eb" },
  DOCTOR:       { label: "Doctor Portal",     subtitle: "Clinical access",     color: "#16a34a" },
  RECEPTIONIST: { label: "Reception Desk",    subtitle: "Front-office access", color: "#ca8a04" },
};

export function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState("ADMIN");

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )hms-role=([^;]+)/);
    setRole(match ? decodeURIComponent(match[1]) : "ADMIN");
  }, []);

  const links = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.ADMIN;
  const meta  = ROLE_LABELS[role] ?? ROLE_LABELS.ADMIN;

  return (
    <aside style={{ width: 260, minWidth: 260, background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)", display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.06)", height: "100vh", position: "sticky", top: 0, overflow: "hidden" }}>

      {/* Brand */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${meta.color}, #0891b2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: `0 4px 12px ${meta.color}66`, flexShrink: 0 }}>🏥</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.01em" }}>HMS</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>Hospital Management</div>
          </div>
        </div>

        {/* Role pill */}
        <div style={{ marginTop: 14, background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{meta.label}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{meta.subtitle}</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 10px 8px" }}>Navigation</div>
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href} style={{ display: "flex", alignItems: "center", gap: 12, borderRadius: 10, padding: "10px 12px", fontSize: 14, fontWeight: isActive ? 600 : 400, color: isActive ? "#ffffff" : "#94a3b8", background: isActive ? `linear-gradient(90deg, ${meta.color}, ${meta.color}cc)` : "transparent", marginBottom: 2, transition: "all 0.15s ease", textDecoration: "none", boxShadow: isActive ? `0 2px 8px ${meta.color}55` : "none" }}>
              <span style={{ fontSize: 16, width: 22, textAlign: "center", flexShrink: 0 }}>{link.icon}</span>
              <span>{link.label}</span>
              {isActive && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#93c5fd" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", fontSize: 11, color: "#475569" }}>
        HMS v1.0 &nbsp;·&nbsp; All rights reserved
      </div>
    </aside>
  );
}
