"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const roleColors: Record<string, { bg: string; text: string; dot: string }> = {
  ADMIN: { bg: "#eff6ff", text: "#1d4ed8", dot: "#2563eb" },
  DOCTOR: { bg: "#f0fdf4", text: "#15803d", dot: "#16a34a" },
  RECEPTIONIST: { bg: "#fefce8", text: "#a16207", dot: "#ca8a04" },
  GUEST: { bg: "#f8fafc", text: "#475569", dot: "#94a3b8" },
};

export function Header() {
  const router = useRouter();
  const [role, setRole] = useState<string>("GUEST");

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )hms-role=([^;]+)/);
    setRole(match ? decodeURIComponent(match[1]) : "GUEST");
  }, []);

  function logout() {
    document.cookie = "hms-role=; path=/; max-age=0";
    router.push("/login");
  }

  const colors = roleColors[role] || roleColors.GUEST;
  const initials = role.slice(0, 2).toUpperCase();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: 64,
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        gap: 16,
      }}
    >
      {/* Left - breadcrumb area */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontSize: 14, color: "#94a3b8" }}>🏥</div>
        <div style={{ fontSize: 14, color: "#94a3b8" }}>/</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Dashboard</div>
      </div>

      {/* Right - user info + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Role badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: colors.bg,
            color: colors.text,
            borderRadius: 99,
            padding: "5px 12px",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: colors.dot,
              flexShrink: 0,
            }}
          />
          {role}
        </div>

        {/* Avatar */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2563eb, #0891b2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            borderRadius: 9,
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            transition: "opacity 0.15s",
            boxShadow: "0 2px 8px rgba(220,38,38,0.3)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
