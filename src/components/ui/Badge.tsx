"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger" | "warning" | "info";
};

export function Badge({ children, variant = "default" }: Props) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide";
  const variants: Record<string, string> = {
    default: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
    success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    danger: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
    warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    info: "bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200",
  };

  return <span className={`${base} ${variants[variant] || variants.default}`}>{children}</span>;
}

export default Badge;
