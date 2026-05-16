import PageHeader from "@/components/ui/PageHeader";

const departments = [
  { name: "Emergency", description: "24/7 triage and urgent care" },
  { name: "Outpatient", description: "Consultations and follow-up visits" },
  { name: "Surgery", description: "Operating theatre and perioperative care" },
  { name: "Diagnostics", description: "Lab and imaging coordination" },
];

export default function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Hospital Structure"
        title="Departments"
        description="A simple overview of the core hospital departments and what each one handles."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {departments.map((department) => (
          <div
            key={department.name}
            className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur"
          >
            <div className="text-lg font-semibold text-slate-950">{department.name}</div>
            <div className="mt-2 text-sm leading-6 text-slate-600">{department.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
