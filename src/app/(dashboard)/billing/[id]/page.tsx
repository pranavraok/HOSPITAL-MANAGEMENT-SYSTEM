"use client";

import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";
import type { Billing } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BillingDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [billing, setBilling] = useState<Billing | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Billing["status"]>("PENDING");

  useEffect(() => {
    async function load() {
      const response = await fetch(`/api/billing/${params.id}`);
      if (!response.ok) {
        setBilling(null);
        setLoading(false);
        return;
      }

      const data = (await response.json()) as Billing;
      setBilling(data);
      setStatus(data.status);
      setLoading(false);
    }

    load();
  }, [params.id]);

  async function updateStatus() {
    if (!billing) return;

    const response = await fetch(`/api/billing/${billing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      router.refresh();
      const data = (await response.json()) as Billing;
      setBilling(data);
    }
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (!billing) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Billing record not found</h1>
        <Link href="/billing" className="text-blue-600 underline">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Finance"
        title={`Billing #${billing.id}`}
        description="Adjust payment state, review the cost breakdown, and keep the invoice current."
        actions={<HeaderActionLink href="/billing">Back to Billing</HeaderActionLink>}
      />

      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur space-y-3">
        <div className="text-sm text-slate-500">Patient ID</div>
        <div className="text-lg font-semibold text-slate-900">{billing.patientId}</div>
        <div className="grid gap-3 pt-2 md:grid-cols-2">
          <Cost label="Consultation Fee" value={Number(billing.consultationFee ?? 0).toFixed(2)} />
          <Cost label="Medicine Charges" value={Number(billing.medicineCharges ?? 0).toFixed(2)} />
          <Cost label="Lab Charges" value={Number(billing.labCharges ?? 0).toFixed(2)} />
          <Cost label="Total" value={Number(billing.amount).toFixed(2)} strong />
        </div>

        <label className="block space-y-2 pt-2">
          <span className="text-sm font-medium">Status</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as Billing["status"])}
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="VOID">Void</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </label>

        <button
          onClick={updateStatus}
          className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white shadow-sm"
        >
          Update Status
        </button>
      </div>
    </div>
  );
}

function Cost({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-4 ring-1 ring-inset ring-slate-200/80 ${strong ? "bg-cyan-50" : "bg-slate-50/90"}`}
    >
      <div className="text-sm text-slate-500">{label}</div>
      <div
        className={`mt-1 ${strong ? "text-2xl text-cyan-900" : "text-lg text-slate-900"} font-semibold`}
      >
        ₹{value}
      </div>
    </div>
  );
}
