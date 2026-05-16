"use client";

import { DoctorForm } from "@/components/forms/DoctorForm";
import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";

export default function NewDoctorPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Doctors"
        title="Add New Doctor"
        description="Register a clinician with the details needed for scheduling and patient assignments."
        actions={<HeaderActionLink href="/doctors">Back to Doctors</HeaderActionLink>}
      />
      <DoctorForm />
    </div>
  );
}
