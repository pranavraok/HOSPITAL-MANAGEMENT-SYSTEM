"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-4 py-3 sm:px-6"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid #e6e9ee",
        backgroundColor: "#ffffff",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>
          Hospital Management System
        </div>
        <div style={{ fontSize: 13, color: "#64748b" }}>Logged in as {role}</div>
      </div>
      <button
        onClick={logout}
        style={{
          borderRadius: 8,
          backgroundColor: "#0891b2",
          padding: "8px 14px",
          fontSize: 14,
          color: "#fff",
          border: "none",
        }}
      >
        Logout
      </button>
    </header>
  );
}
