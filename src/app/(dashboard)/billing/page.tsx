"use client";

import { Badge } from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";
import type { Billing } from "@/types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function BillingPage() {
  const [billing, setBilling] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/billing");
        if (!response.ok) throw new Error("Failed to load billing records");
        const data = (await response.json()) as Billing[];
        setBilling(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const summary = useMemo(() => {
    const revenue = billing.reduce((total, item) => total + Number(item.amount), 0);
    const paid = billing.filter((item) => item.status === "PAID").length;
    const unpaid = billing.filter((item) => item.status === "PENDING").length;
    return { revenue, paid, unpaid };
  }, [billing]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finance"
        title="Billing"
        description="Review invoices, revenue, and payment status from a calmer, more readable workspace."
        actions={<HeaderActionLink href="/billing/new">+ Generate Bill</HeaderActionLink>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Total Revenue" value={`₹${summary.revenue.toFixed(2)}`} />
        <SummaryCard title="Paid Invoices" value={String(summary.paid)} />
        <SummaryCard title="Pending Invoices" value={String(summary.unpaid)} />
      </div>

      {billing.length === 0 ? (
        <EmptyState message="No billing records found" />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Issued</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {billing.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50/80">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.patientId}</td>
                  <td className="px-6 py-4 text-slate-700">₹{Number(item.amount).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <Status value={item.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {new Date(item.issuedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/billing/${item.id}`}
                      className="font-medium text-cyan-700 hover:underline"
                    >
                      View
                    </Link>
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

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur">
      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
        {title}
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</div>
    </div>
  );
}

function Status({ value }: { value: Billing["status"] }) {
  const variant =
    value === "PAID"
      ? "success"
      : value === "PENDING"
        ? "warning"
        : value === "VOID"
          ? "danger"
          : "info";
  return <Badge variant={variant}>{value}</Badge>;
}
