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
        display: "flex",
        flexDirection: "row",
        gap: 12,
        borderRadius: 8,
        border: "1px solid #e6e9ee",
        backgroundColor: "#ffffff",
        padding: 12,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ maxWidth: 720 }}>
        {eyebrow ? (
          <div
            style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#0ea5a9" }}
          >
            {eyebrow}
          </div>
        ) : null}
        <h1 style={{ marginTop: 6, fontSize: 20, fontWeight: 600, color: "#0f172a" }}>{title}</h1>
        {description ? (
          <p style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>{description}</p>
        ) : null}
      </div>
      {actions ? <div style={{ display: "flex", gap: 8 }}>{actions}</div> : null}
    </div>
  );
}

export function HeaderActionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
    >
      {children}
    </Link>
  );
}
