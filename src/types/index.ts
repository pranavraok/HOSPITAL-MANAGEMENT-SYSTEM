// Type definitions for the application

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  address?: string | null;
  createdAt: string;
}

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  specialty: string;
  departmentId?: number | null;
  createdAt: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  scheduledAt: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  notes?: string | null;
  createdAt: string;
}

export interface AppointmentRecord extends Appointment {
  patient?: Pick<Patient, "id" | "firstName" | "lastName" | "email">;
  doctor?: Pick<Doctor, "id" | "firstName" | "lastName" | "specialty">;
}

export interface Billing {
  id: number;
  patientId: number;
  appointmentId?: number | null;
  consultationFee?: string | null;
  medicineCharges?: string | null;
  labCharges?: string | null;
  amount: string;
  currency: string;
  status: "PENDING" | "PAID" | "VOID" | "REFUNDED";
  issuedAt: string;
  paidAt?: string | null;
  createdAt: string;
}

export interface Medicine {
  id: number;
  name: string;
  stockQuantity: number;
  price: string;
  manufacturer: string;
  expiryDate: string;
  createdAt: string;
}

export interface LabReport {
  id: number;
  patientId: number;
  testName: string;
  result: string;
  status: string;
  testDate: string;
  notes?: string | null;
  createdAt: string;
  // Included via API relation
  patient?: Pick<Patient, "id" | "firstName" | "lastName" | "email"> | null;
}

export interface Room {
  id: number;
  roomNumber: string;
  roomType: string;
  capacity: number;
  isOccupied: boolean;
  departmentId?: number | null;
  patientId?: number | null;
  createdAt: string;
}

export interface MedicalRecord {
  id: number;
  patientId: number;
  doctorId: number;
  diagnosis: string;
  treatment?: string | null;
  notes?: string | null;
  recordDate: string;
  createdAt: string;
}
