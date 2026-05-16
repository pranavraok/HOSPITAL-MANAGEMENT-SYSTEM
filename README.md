# Hospital Management System

A professional Hospital Management System built with Next.js App Router, TypeScript, TailwindCSS, Prisma ORM, MySQL, TanStack Query, Zod, and PNPM.

## Features

- Role-based login UI
- Protected dashboard routes
- Patients, Doctors, Appointments, Billing, Pharmacy, Lab, Rooms, and Medical Records modules
- Prisma-backed MySQL persistence
- Responsive admin dashboard UI
- Reusable components, hooks, and validation

## Tech Stack

- Next.js App Router
- TypeScript
- TailwindCSS
- Prisma ORM
- MySQL
- TanStack Query
- Zod
- PNPM

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables in `.env`:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

3. Generate Prisma client:

```bash
pnpm db:generate
```

4. Push the schema to MySQL:

```bash
pnpm db:push
```

5. Start the dev server:

```bash
pnpm dev
```

6. Build for production:

```bash
pnpm build
```

## Main Routes

- `/login`
- `/`
- `/patients`
- `/patients/new`
- `/patients/[id]`
- `/doctors`
- `/doctors/new`
- `/doctors/[id]`
- `/appointments`
- `/appointments/new`
- `/appointments/[id]`
- `/billing`
- `/billing/new`
- `/billing/[id]`
- `/pharmacy`
- `/pharmacy/new`
- `/pharmacy/[id]`
- `/lab`
- `/lab/[id]`
- `/rooms`
- `/medical-records`

## API Routes

- `GET /api/dashboard`
- `GET /api/patients`
- `POST /api/patients`
- `GET /api/patients/[id]`
- `PUT /api/patients/[id]`
- `DELETE /api/patients/[id]`
- `GET /api/doctors`
- `POST /api/doctors`
- `GET /api/doctors/[id]`
- `PUT /api/doctors/[id]`
- `DELETE /api/doctors/[id]`
- `GET /api/appointments`
- `POST /api/appointments`
- `GET /api/appointments/[id]`
- `PUT /api/appointments/[id]`
- `DELETE /api/appointments/[id]`
- `GET /api/billing`
- `POST /api/billing`
- `GET /api/billing/[id]`
- `PUT /api/billing/[id]`
- `DELETE /api/billing/[id]`
- `GET /api/pharmacy`
- `POST /api/pharmacy`
- `GET /api/pharmacy/[id]`
- `PUT /api/pharmacy/[id]`
- `DELETE /api/pharmacy/[id]`
- `GET /api/lab`
- `POST /api/lab`
- `GET /api/lab/[id]`
- `PUT /api/lab/[id]`
- `DELETE /api/lab/[id]`
- `GET /api/rooms`
- `POST /api/rooms`
- `GET /api/rooms/[id]`
- `PUT /api/rooms/[id]`
- `DELETE /api/rooms/[id]`
- `GET /api/medical-records`
- `POST /api/medical-records`
- `GET /api/medical-records/[id]`
- `PUT /api/medical-records/[id]`
- `DELETE /api/medical-records/[id]`

## How to Test

### Login and Route Protection

1. Visit `/login`.
2. Select a role and sign in.
3. Confirm protected dashboard routes are accessible.

### Patients

- Create a patient at `/patients/new`.
- Search and filter on `/patients`.
- Edit/delete in `/patients/[id]`.

### Doctors

- Add a doctor at `/doctors/new`.
- View/edit/delete from `/doctors` and `/doctors/[id]`.

### Appointments

- Book an appointment at `/appointments/new`.
- Confirm doctor double-booking is blocked.
- Update status and cancel from `/appointments/[id]`.

### Billing

- Generate a bill at `/billing/new`.
- Open `/billing/[id]` to update payment status.
- Check revenue summaries on `/billing`.

### Pharmacy

- Add medicines at `/pharmacy/new`.
- Edit/delete at `/pharmacy/[id]`.
- Confirm low stock alerts on `/pharmacy`.

### Lab

- Add lab reports on `/lab`.
- Open `/lab/[id]` for details.

### Rooms

- Create rooms on `/rooms`.
- Assign and vacate patients.

### Medical Records

- Add diagnosis and treatment records on `/medical-records`.

### Dashboard

- Open `/` to verify stats, recent activity, and appointment status analytics.

## Database Flow

Patient -> Appointment -> Doctor -> Billing -> Pharmacy -> Lab -> Room

The dashboard aggregates operational data across these modules and renders summary metrics and recent activity from MySQL through Prisma.

## Notes

- The project uses the existing Prisma client from `src/lib/prisma.ts`.
- All CRUD routes are implemented in the existing `src/app/api` structure.
- The project builds successfully with `pnpm build`.
