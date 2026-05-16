"use client";

import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import PageHeader from "@/components/ui/PageHeader";
import type { Doctor, MedicalRecord, Patient } from "@/types";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

type MedicalRecordView = MedicalRecord & {
  patient?: Pick<Patient, "id" | "firstName" | "lastName">;
  doctor?: Pick<Doctor, "id" | "firstName" | "lastName" | "specialty">;
};

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecordView[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  });

  useEffect(() => {
    async function load() {
      const [recordResponse, patientResponse, doctorResponse] = await Promise.all([
        fetch("/api/medical-records"),
        fetch("/api/patients"),
        fetch("/api/doctors"),
      ]);

      setRecords((await recordResponse.json()) as MedicalRecordView[]);
      setPatients((await patientResponse.json()) as Patient[]);
      setDoctors((await doctorResponse.json()) as Doctor[]);
      setLoading(false);
    }

    load();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/medical-records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        patientId: Number(form.patientId),
        doctorId: Number(form.doctorId),
      }),
    });
    const response = await fetch("/api/medical-records");
    setRecords((await response.json()) as MedicalRecordView[]);
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Clinical Notes"
        title="Medical Records"
        description="Document diagnoses, treatments, and notes in a layout that stays readable as it grows."
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur md:grid-cols-2"
      >
        <select
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:col-span-2"
          value={form.patientId}
          onChange={(e) => setForm({ ...form, patientId: e.target.value })}
        >
          <option value="">Select patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.firstName} {patient.lastName}
            </option>
          ))}
        </select>
        <select
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:col-span-2"
          value={form.doctorId}
          onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
        >
          <option value="">Select doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty}
            </option>
          ))}
        </select>
        <input
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          placeholder="Diagnosis"
          value={form.diagnosis}
          onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
        />
        <input
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          placeholder="Treatment"
          value={form.treatment}
          onChange={(e) => setForm({ ...form, treatment: e.target.value })}
        />
        <textarea
          className="min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:col-span-2"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button
          className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white shadow-sm md:col-span-2"
          type="submit"
        >
          Save Record
        </button>
      </form>

      {records.length === 0 ? (
        <EmptyState message="No medical records found" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {records.map((record) => (
            <div
              key={record.id}
              className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur"
            >
              <div className="font-semibold text-slate-950">{record.diagnosis}</div>
              <div className="text-sm text-slate-500">
                {record.patient?.firstName} {record.patient?.lastName} • Dr.{" "}
                {record.doctor?.firstName} {record.doctor?.lastName}
              </div>
              <div className="mt-3 text-sm text-slate-700">{record.treatment ?? "-"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
