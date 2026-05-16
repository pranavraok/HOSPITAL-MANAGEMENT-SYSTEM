"use client";

import type { Medicine } from "@/types";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

export default function EditMedicinePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    stockQuantity: "0",
    price: "0",
    manufacturer: "",
    expiryDate: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const response = await fetch(`/api/pharmacy/${params.id}`);
      const medicine = (await response.json()) as Medicine;
      setForm({
        name: medicine.name,
        stockQuantity: String(medicine.stockQuantity),
        price: String(medicine.price),
        manufacturer: medicine.manufacturer,
        expiryDate: medicine.expiryDate.slice(0, 10),
      });
      setLoading(false);
    }

    load();
  }, [params.id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch(`/api/pharmacy/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        stockQuantity: Number(form.stockQuantity),
        price: form.price,
      }),
    });
    router.push("/pharmacy");
  }

  async function handleDelete() {
    if (!confirm("Delete this medicine?")) return;
    await fetch(`/api/pharmacy/${params.id}`, { method: "DELETE" });
    router.push("/pharmacy");
  }

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Edit Medicine</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        <input
          className="w-full rounded-lg border px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full rounded-lg border px-3 py-2"
          type="number"
          value={form.stockQuantity}
          onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
        />
        <input
          className="w-full rounded-lg border px-3 py-2"
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          className="w-full rounded-lg border px-3 py-2"
          value={form.manufacturer}
          onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
        />
        <input
          className="w-full rounded-lg border px-3 py-2"
          type="date"
          value={form.expiryDate}
          onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
        />
        <div className="flex gap-3">
          <button type="submit" className="rounded-lg bg-black px-4 py-2 text-white">
            Save
          </button>
          <button type="button" onClick={handleDelete} className="rounded-lg border px-4 py-2">
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
