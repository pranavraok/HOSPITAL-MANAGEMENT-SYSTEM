"use client";

import { Badge } from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";
import type { Medicine } from "@/types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function PharmacyPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/pharmacy");
      setMedicines((await response.json()) as Medicine[]);
      setLoading(false);
    }

    load();
  }, []);

  const lowStock = useMemo(
    () => medicines.filter((medicine) => medicine.stockQuantity <= 10).length,
    [medicines]
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inventory"
        title="Pharmacy Inventory"
        description="Track stock levels, value, and expiry dates in a calm inventory dashboard."
        actions={<HeaderActionLink href="/pharmacy/new">+ Add Medicine</HeaderActionLink>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Medicines" value={String(medicines.length)} />
        <Card title="Low Stock" value={String(lowStock)} />
        <Card
          title="Inventory Value"
          value={`₹${medicines.reduce((sum, item) => sum + Number(item.price) * item.stockQuantity, 0).toFixed(2)}`}
        />
      </div>

      {medicines.length === 0 ? (
        <EmptyState message="No medicines found" />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Expiry</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicines.map((medicine) => (
                <tr key={medicine.id} className="transition hover:bg-slate-50/80">
                  <td className="px-6 py-4 font-medium text-slate-900">{medicine.name}</td>
                  <td className="px-6 py-4">
                    <Badge variant={medicine.stockQuantity <= 10 ? "warning" : "success"}>
                      {medicine.stockQuantity}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-700">₹{Number(medicine.price).toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-700">
                    {new Date(medicine.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      className="font-medium text-cyan-700 hover:underline"
                      href={`/pharmacy/${medicine.id}`}
                    >
                      Edit
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

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur">
      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
        {title}
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</div>
    </div>
  );
}
