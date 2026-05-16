"use client";

import Link from "next/link";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/patients", label: "Patients" },
  { href: "/doctors", label: "Doctors" },
  { href: "/appointments", label: "Appointments" },
  { href: "/billing", label: "Billing" },
  { href: "/pharmacy", label: "Pharmacy" },
  { href: "/lab", label: "Lab" },
  { href: "/rooms", label: "Rooms" },
];

export function Sidebar() {
  return (
    <aside
      className="flex w-64 flex-col border-r bg-white text-slate-800"
      style={{
        width: 280,
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e6e9ee",
        color: "#0f172a",
      }}
    >
      <div style={{ borderBottom: "1px solid #eef2f6", padding: "18px" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.12em",
            color: "#0ea5a9",
            textTransform: "uppercase",
          }}
        >
          Hospital
        </div>
        <div style={{ marginTop: 8, fontSize: 22, fontWeight: 600 }}>HMS</div>
        <p style={{ marginTop: 8, fontSize: 13, color: "#64748b" }}>
          Friendly care operations dashboard
        </p>
      </div>
      <nav style={{ flex: 1, padding: "12px 12px" }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: "block",
              borderRadius: 8,
              padding: "8px 10px",
              fontSize: 14,
              color: "#334155",
              textDecoration: "none",
              marginBottom: 6,
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
