import { PatientForm } from "@/components/forms/PatientForm";
import PageHeader, { HeaderActionLink } from "@/components/ui/PageHeader";

export default function NewPatientPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Patients"
        title="Add New Patient"
        description="Create a clean patient record with contact details and demographics in one place."
        actions={<HeaderActionLink href="/patients">Back to Patients</HeaderActionLink>}
      />
      <PatientForm />
    </div>
  );
}
