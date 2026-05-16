import Link from "next/link";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
};

export default function PageHeader({ title, description, eyebrow, actions }: PageHeaderProps) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        borderRadius: 16,
        padding: "28px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        boxShadow: "0 4px 24px rgba(15,23,42,0.15)",
        flexWrap: "wrap",
      }}
    >
      <div style={{ maxWidth: 640 }}>
        {eyebrow ? (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(37,99,235,0.2)",
              color: "#93c5fd",
              borderRadius: 99,
              padding: "3px 12px",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 10,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#f8fafc",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {description ? (
          <p style={{ marginTop: 8, fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>{actions}</div> : null}
    </div>
  );
}

export function HeaderActionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        borderRadius: 10,
        background: "linear-gradient(135deg, #2563eb, #0891b2)",
        padding: "10px 20px",
        fontSize: 14,
        fontWeight: 600,
        color: "#fff",
        textDecoration: "none",
        boxShadow: "0 2px 10px rgba(37,99,235,0.4)",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Link>
  );
}
