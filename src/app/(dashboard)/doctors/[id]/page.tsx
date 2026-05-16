import { DoctorForm } from "@/components/forms/DoctorForm";
import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DoctorDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Invalid doctor ID</h1>
        <Link href="/doctors" className="text-blue-600 underline">
          Back
        </Link>
      </div>
    );
  }

  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (!doctor) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Doctor not found</h1>
        <Link href="/doctors" className="text-blue-600 underline">
          Back
        </Link>
      </div>
    );
  }

  // Render a client-side editable form by passing initial values
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Clinical Team"
        title={`Dr. ${doctor.firstName} ${doctor.lastName}`}
        description="Update clinician details and keep scheduling information accurate."
        actions={<HeaderActionLink href="/doctors">Back to Doctors</HeaderActionLink>}
      />

      <DoctorForm
        initial={{
          id: doctor.id,
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          email: doctor.email,
          phone: doctor.phone ?? undefined,
          specialty: doctor.specialty,
          licenseNumber: doctor.licenseNumber,
          departmentId: doctor.departmentId,
        }}
      />
    </div>
  );
}
