"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

export default function NewMedicinePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    stockQuantity: "0",
    price: "0",
    manufacturer: "",
    expiryDate: "",
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const response = await fetch("/api/pharmacy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        stockQuantity: Number(form.stockQuantity),
        price: form.price,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body?.error || "Failed to save medicine");
      return;
    }

    router.push("/pharmacy");
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Medicine</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        {error && <div className="text-red-600">{error}</div>}
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Medicine name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Stock quantity"
          type="number"
          value={form.stockQuantity}
          onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
        />
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Manufacturer"
          value={form.manufacturer}
          onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
        />
        <input
          className="w-full rounded-lg border px-3 py-2"
          type="date"
          value={form.expiryDate}
          onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
        />
        <button type="submit" className="rounded-lg bg-black px-4 py-2 text-white">
          Save
        </button>
      </form>
    </div>
  );
}
