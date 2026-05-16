"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("ADMIN");
  const [loading, setLoading] = useState(false);

  function handleLogin(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    document.cookie = `hms-role=${role}; path=/; max-age=${60 * 60 * 8}`;
    setTimeout(() => router.push("/"), 600);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c1a2e 100%)",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          left: "-120px",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.25), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          right: "-100px",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(8,145,178,0.2), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.12)",
          padding: "40px 36px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "linear-gradient(135deg, #2563eb, #0891b2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              boxShadow: "0 6px 20px rgba(37,99,235,0.5)",
              flexShrink: 0,
            }}
          >
            🏥
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
              HMS
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Hospital Management System</div>
          </div>
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 28, lineHeight: 1.6 }}>
          Select your role and sign in to access the dashboard.
        </p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "#94a3b8",
                marginBottom: 7,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Sign in as
            </label>
            <select
              style={{
                width: "100%",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.07)",
                color: "#f1f5f9",
                padding: "12px 16px",
                fontSize: 15,
                appearance: "none",
                cursor: "pointer",
              }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ADMIN" style={{ background: "#1e293b" }}>🔐 Admin</option>
              <option value="DOCTOR" style={{ background: "#1e293b" }}>⚕ Doctor</option>
              <option value="RECEPTIONIST" style={{ background: "#1e293b" }}>🖥 Receptionist</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              borderRadius: 12,
              background: loading
                ? "rgba(37,99,235,0.5)"
                : "linear-gradient(135deg, #2563eb, #0891b2)",
              padding: "14px",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 16px rgba(37,99,235,0.45)",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 4,
            }}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid #fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Signing in...
              </>
            ) : (
              "Sign In →"
            )}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </form>

        <div
          style={{
            marginTop: 24,
            padding: "12px 16px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.07)",
            fontSize: 12,
            color: "#475569",
            textAlign: "center",
          }}
        >
          Demo mode — select any role to explore
        </div>
      </div>
    </div>
  );
}
