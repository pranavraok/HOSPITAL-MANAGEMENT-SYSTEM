"use client";

import { Badge } from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import PageHeader from "@/components/ui/PageHeader";
import type { Patient, Room } from "@/types";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ roomNumber: "", roomType: "", capacity: "1" });

  useEffect(() => {
    async function load() {
      const [roomsResponse, patientsResponse] = await Promise.all([
        fetch("/api/rooms"),
        fetch("/api/patients"),
      ]);
      setRooms((await roomsResponse.json()) as Room[]);
      setPatients((await patientsResponse.json()) as Patient[]);
      setLoading(false);
    }

    load();
  }, []);

  async function refresh() {
    const response = await fetch("/api/rooms");
    setRooms((await response.json()) as Room[]);
  }

  async function createRoom(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, capacity: Number(form.capacity) }),
    });
    await refresh();
  }

  async function vacateRoom(roomId: number) {
    await fetch(`/api/rooms/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId: null, isOccupied: false }),
    });
    await refresh();
  }

  async function assignRoom(roomId: number, patientId: number) {
    await fetch(`/api/rooms/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, isOccupied: true }),
    });
    await refresh();
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations"
        title="Rooms"
        description="Create rooms, assign patients, and keep occupancy status visible at a glance."
      />

      <form
        onSubmit={createRoom}
        className="grid gap-3 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur md:grid-cols-3"
      >
        <input
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          placeholder="Room number"
          value={form.roomNumber}
          onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
        />
        <input
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          placeholder="Room type"
          value={form.roomType}
          onChange={(e) => setForm({ ...form, roomType: e.target.value })}
        />
        <input
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          type="number"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        />
        <button
          className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white shadow-sm md:col-span-3"
          type="submit"
        >
          Add Room
        </button>
      </form>

      {rooms.length === 0 ? (
        <EmptyState message="No rooms found" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="space-y-3 rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <div className="text-xl font-semibold text-slate-950">Room {room.roomNumber}</div>
                <Badge variant={room.isOccupied ? "danger" : "success"}>
                  {room.isOccupied ? "Occupied" : "Available"}
                </Badge>
              </div>
              <div className="text-sm text-slate-500">
                {room.roomType} • Capacity {room.capacity}
              </div>
              <div className="text-sm text-slate-700">Patient: {room.patientId ?? "-"}</div>
              <div className="flex flex-wrap gap-2">
                {!room.isOccupied ? (
                  <select
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                    onChange={(e) => e.target.value && assignRoom(room.id, Number(e.target.value))}
                    defaultValue=""
                  >
                    <option value="">Assign patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                      </option>
                    ))}
                  </select>
                ) : null}
                {room.isOccupied ? (
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 shadow-sm"
                    onClick={() => vacateRoom(room.id)}
                  >
                    Vacate
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
