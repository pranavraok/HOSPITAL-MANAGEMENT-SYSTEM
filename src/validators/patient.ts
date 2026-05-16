import { z } from "zod";

export const patientCreateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  address: z.string().optional().nullable(),
});

export const patientUpdateSchema = patientCreateSchema.partial();

export const patientResponseSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  address: z.string().nullable().optional(),
  createdAt: z.string(),
});

export type PatientCreate = z.infer<typeof patientCreateSchema>;
export type PatientUpdate = z.infer<typeof patientUpdateSchema>;
export type PatientResponse = z.infer<typeof patientResponseSchema>;
