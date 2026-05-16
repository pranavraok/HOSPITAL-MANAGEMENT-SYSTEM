"use client";

import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import PageHeader from "@/components/ui/PageHeader";
import type { Patient, Room } from "@/types";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

const ROOM_TYPES = ["General", "Private", "ICU", "Semi-Private", "Emergency", "Operation Theatre", "Maternity", "Pediatric"];
const EMPTY_FORM = { roomNumber: "", roomType: "", capacity: "1" };

type RoomWithPatient = Room & { patient?: { firstName: string; lastName: string } | null };

export default function RoomsPage() {
  const [rooms,      setRooms]      = useState<RoomWithPatient[]>([]);
  const [patients,   setPatients]   = useState<Patient[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [error,      setError]      = useState<string | null>(null);
  const [success,    setSuccess]    = useState(false);

  async function loadRooms() {
    const r = await fetch("/api/rooms");
    if (r.ok) setRooms(await r.json() as RoomWithPatient[]);
  }

  useEffect(() => {
    Promise.all([fetch("/api/rooms"), fetch("/api/patients")])
      .then(async ([rr, pr]) => {
        if (rr.ok) setRooms(await rr.json() as RoomWithPatient[]);
        if (pr.ok) setPatients(await pr.json() as Patient[]);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.roomNumber.trim()) { setError("Room number is required."); return; }
    if (!form.roomType.trim())   { setError("Room type is required.");   return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomNumber: form.roomNumber.trim(), roomType: form.roomType, capacity: Number(form.capacity) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to add room");
      setForm(EMPTY_FORM);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await loadRooms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  async function assignRoom(roomId: number, patientId: number) {
    await fetch(`/api/rooms/${roomId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ patientId, isOccupied: true }) });
    await loadRooms();
  }

  async function vacateRoom(roomId: number) {
    await fetch(`/api/rooms/${roomId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ patientId: null, isOccupied: false }) });
    await loadRooms();
  }

  if (loading) return <Loader message="Loading rooms..." />;

  const occupied  = rooms.filter((r) => r.isOccupied).length;
  const available = rooms.filter((r) => !r.isOccupied).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader eyebrow="Operations" title="Rooms" description="Manage room assignments and occupancy status." />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
        {[
          { label: "Total Rooms", value: String(rooms.length), icon: "🏥", color: "#2563eb" },
          { label: "Occupied",    value: String(occupied),     icon: "🔴", color: "#dc2626" },
          { label: "Available",   value: String(available),    icon: "🟢", color: "#16a34a" },
        ].map((c) => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", padding: "20px 24px", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Add Room Form */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(15,23,42,0.07)", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🚪</span>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Add New Room</h2>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: "20px 24px", display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          <div>
            <label style={labelSt}>Room Number *</label>
            <input style={inputSt} placeholder="e.g. 101, ICU-3" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} required />
          </div>
          <div>
            <label style={labelSt}>Room Type *</label>
            <select style={inputSt} value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })} required>
              <option value="">— Select type —</option>
              {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelSt}>Capacity</label>
            <input style={inputSt} type="number" min="1" max="20" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
          </div>

          {error   && <div style={{ gridColumn: "1 / -1", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 16px", color: "#dc2626", fontSize: 13 }}>⚠️ {error}</div>}
          {success && <div style={{ gridColumn: "1 / -1", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 16px", color: "#15803d", fontSize: 13 }}>✅ Room added!</div>}

          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" disabled={submitting} style={{ borderRadius: 10, background: submitting ? "#94a3b8" : "linear-gradient(135deg,#2563eb,#0891b2)", padding: "11px 28px", fontSize: 14, fontWeight: 700, color: "#fff", border: "none", cursor: submitting ? "not-allowed" : "pointer", boxShadow: submitting ? "none" : "0 2px 10px rgba(37,99,235,0.3)" }}>
              {submitting ? "Saving..." : "+ Add Room"}
            </button>
          </div>
        </form>
      </div>

      {/* Room Cards Grid */}
      {rooms.length === 0 ? <EmptyState message="No rooms added yet." /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {rooms.map((room) => {
            const patientName = room.patient ? `${room.patient.firstName} ${room.patient.lastName}` : null;
            return (
              <div key={room.id} style={{ background: "#fff", borderRadius: 16, border: `2px solid ${room.isOccupied ? "#fecaca" : "#bbf7d0"}`, padding: 20, boxShadow: "0 1px 6px rgba(15,23,42,0.07)", display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Room header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>Room {room.roomNumber}</div>
                  <span style={{ background: room.isOccupied ? "#fef2f2" : "#f0fdf4", color: room.isOccupied ? "#dc2626" : "#16a34a", borderRadius: 99, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>
                    {room.isOccupied ? "🔴 Occupied" : "🟢 Available"}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: "#64748b" }}>{room.roomType} • Capacity: {room.capacity}</div>

                {/* Patient info */}
                {patientName && (
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 14px", fontSize: 13 }}>
                    <div style={{ fontWeight: 600, color: "#1e293b" }}>👤 {patientName}</div>
                  </div>
                )}

                {/* Actions */}
                {!room.isOccupied && (
                  <select
                    style={{ ...inputSt, fontSize: 13 }}
                    defaultValue=""
                    onChange={(e) => { if (e.target.value) assignRoom(room.id, Number(e.target.value)); }}
                  >
                    <option value="">Assign patient →</option>
                    {patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                  </select>
                )}
                {room.isOccupied && (
                  <button
                    type="button"
                    onClick={() => vacateRoom(room.id)}
                    style={{ borderRadius: 10, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                  >
                    Vacate Room
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const inputSt: React.CSSProperties = { width: "100%", borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", padding: "11px 14px", fontSize: 14, color: "#0f172a", outline: "none" };
const labelSt: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" };
