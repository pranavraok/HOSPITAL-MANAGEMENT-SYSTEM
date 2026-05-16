# 🏥 HMS — Hospital Management System

A full-stack Hospital Management System built with **Next.js 15**, **Prisma ORM**, **MySQL**, and **TypeScript**. Features role-based dashboards for Admin, Doctor, Receptionist, and Patient — all without a real auth backend (cookie-based demo roles).

---

## ✨ Features

| Module | What it does |
|---|---|
| 🔐 **Auth (Demo)** | Role selector at login — sets a cookie, no real auth needed |
| 👤 **Patients** | Add, view and manage patient records |
| ⚕ **Doctors** | Add doctors with specialty, license, department |
| 📅 **Appointments** | Schedule and track appointments per patient/doctor |
| 💳 **Billing** | Create bills with consultation, medicine & lab charges |
| 💊 **Pharmacy** | Medicine inventory with stock levels and expiry tracking |
| 🔬 **Lab** | Create and track patient-linked lab reports |
| 🏥 **Rooms** | Manage hospital rooms — type, occupancy, department |
| 📊 **Dashboard** | Role-specific stats, analytics and quick actions |

---

## 🧑‍💻 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database** | MySQL (local) |
| **ORM** | Prisma 5 |
| **Package Manager** | pnpm |
| **Styling** | Inline styles + Tailwind CSS |
| **Runtime** | Node.js 18+ |

---

## 🗂️ Project Structure

```
hospital-management-system/
├── prisma/
│   └── schema.prisma          # All DB models (Patient, Doctor, Billing, etc.)
├── src/
│   ├── app/
│   │   ├── (auth)/login/      # Login page (role selector)
│   │   ├── (dashboard)/       # All dashboard pages
│   │   │   ├── page.tsx       # Role-specific home dashboard
│   │   │   ├── patients/
│   │   │   ├── doctors/
│   │   │   ├── appointments/
│   │   │   ├── billing/
│   │   │   ├── pharmacy/
│   │   │   ├── lab/
│   │   │   └── rooms/
│   │   └── api/               # Next.js API routes (REST)
│   │       ├── dashboard/
│   │       ├── patients/
│   │       ├── doctors/
│   │       ├── appointments/
│   │       ├── billing/
│   │       ├── pharmacy/
│   │       ├── lab/
│   │       └── rooms/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx    # Role-aware sidebar nav
│   │   │   └── Header.tsx     # Role badge + logout
│   │   └── ui/
│   └── lib/
│       └── prisma.ts          # Prisma client singleton
├── middleware.ts               # Redirects unauthenticated users to /login
├── .env                        # DATABASE_URL (not committed)
└── .env.example
```

---

## 🚀 Setup — From Scratch

### Prerequisites
Make sure you have these installed:
- [Node.js 18+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) — `npm install -g pnpm`
- [MySQL](https://dev.mysql.com/downloads/) (local server running)
- [Git](https://git-scm.com/)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/pranavraok/HOSPITAL-MANAGEMENT-SYSTEM.git
cd HOSPITAL-MANAGEMENT-SYSTEM
```

---

### Step 2 — Install Dependencies

```bash
pnpm install
```

---

### Step 3 — Create Your MySQL Database

Open MySQL CLI or MySQL Workbench and run:

```sql
CREATE DATABASE hospital_management_system;
```

---

### Step 4 — Configure Environment Variables

Copy the example env file:

```bash
copy .env.example .env
```

Open `.env` and fill in your MySQL credentials:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/hospital_management_system"
```

> Replace `root` and `YOUR_PASSWORD` with your actual MySQL username and password.

---

### Step 5 — Set Up Database Tables

Since this project was built without Prisma migrations, you need to create tables manually.

#### Option A — Use Prisma db push (recommended)
```bash
npx prisma db push
```

#### Option B — Manual SQL (if db push fails)
Run each of these in MySQL:

```sql
-- Run in order

CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) UNIQUE NOT NULL,
  description VARCHAR(191),
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3)
);

CREATE TABLE doctor (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(191) NOT NULL,
  lastName VARCHAR(191) NOT NULL,
  email VARCHAR(191) UNIQUE NOT NULL,
  phone VARCHAR(191),
  specialty VARCHAR(191) NOT NULL,
  licenseNumber VARCHAR(191) UNIQUE NOT NULL,
  departmentId INT NOT NULL,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3),
  FOREIGN KEY (departmentId) REFERENCES department(id)
);

CREATE TABLE patient (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(191) NOT NULL,
  lastName VARCHAR(191) NOT NULL,
  email VARCHAR(191) UNIQUE NOT NULL,
  phone VARCHAR(191) NOT NULL,
  gender ENUM('MALE','FEMALE','OTHER') NOT NULL,
  address VARCHAR(191),
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE TABLE appointment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patientId INT NOT NULL,
  doctorId INT NOT NULL,
  scheduledAt DATETIME(3) NOT NULL,
  status ENUM('SCHEDULED','COMPLETED','CANCELLED','NO_SHOW') DEFAULT 'SCHEDULED',
  notes TEXT,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3),
  FOREIGN KEY (patientId) REFERENCES patient(id),
  FOREIGN KEY (doctorId) REFERENCES doctor(id)
);

CREATE TABLE billing (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patientId INT NOT NULL,
  appointmentId INT,
  consultationFee DECIMAL(10,2),
  medicineCharges DECIMAL(10,2),
  labCharges DECIMAL(10,2),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(191) DEFAULT 'INR',
  status ENUM('PENDING','PAID','VOID','REFUNDED') DEFAULT 'PENDING',
  issuedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  paidAt DATETIME(3),
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3),
  FOREIGN KEY (patientId) REFERENCES patient(id),
  FOREIGN KEY (appointmentId) REFERENCES appointment(id)
);

CREATE TABLE medicine (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) UNIQUE NOT NULL,
  stockQuantity INT DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  manufacturer VARCHAR(191) NOT NULL,
  expiryDate DATETIME(3) NOT NULL,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3)
);

CREATE TABLE room (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roomNumber VARCHAR(191) UNIQUE NOT NULL,
  roomType VARCHAR(191) NOT NULL,
  capacity INT DEFAULT 1,
  isOccupied BOOLEAN DEFAULT false,
  departmentId INT,
  patientId INT UNIQUE,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3),
  FOREIGN KEY (departmentId) REFERENCES department(id),
  FOREIGN KEY (patientId) REFERENCES patient(id)
);

CREATE TABLE medicalrecord (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patientId INT NOT NULL,
  doctorId INT NOT NULL,
  diagnosis TEXT NOT NULL,
  treatment TEXT,
  notes TEXT,
  recordDate DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3),
  FOREIGN KEY (patientId) REFERENCES patient(id),
  FOREIGN KEY (doctorId) REFERENCES doctor(id)
);

CREATE TABLE prescription (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patientId INT NOT NULL,
  doctorId INT NOT NULL,
  medicationName VARCHAR(191) NOT NULL,
  dosage VARCHAR(191) NOT NULL,
  instructions TEXT,
  prescribedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3),
  FOREIGN KEY (patientId) REFERENCES patient(id),
  FOREIGN KEY (doctorId) REFERENCES doctor(id)
);

CREATE TABLE labreport (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patientId INT NOT NULL,
  testName VARCHAR(255) NOT NULL,
  result TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  testDate DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  notes TEXT,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES patient(id)
);
```

---

### Step 6 — Generate Prisma Client

```bash
npx prisma generate
```

---

### Step 7 — Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Role-Based Access

No real authentication — just select a role on the login screen. A cookie (`hms-role`) is set for 8 hours.

| Role | Access |
|---|---|
| 🔐 **Admin** | Full access — all 8 modules + full analytics |
| ⚕ **Doctor** | Patients, Appointments, Lab Reports |
| 🖥 **Receptionist** | Patients, Appointments, Billing, Rooms |
| 🧑‍⚕️ **Patient** | My Appointments, My Bills, My Lab Reports |

Each role gets a **different sidebar**, **different dashboard stats**, and **different quick action cards**.

---

## 📦 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
npx prisma studio # Open Prisma visual DB editor
npx prisma generate # Regenerate Prisma client after schema changes
```

---

## ⚠️ Important Notes

- **Windows MySQL**: All table names are lowercase (`patient`, `labreport`, etc.) because Windows MySQL is case-insensitive. The `schema.prisma` uses `@@map()` on every model to handle this.
- **No migrations folder**: Tables were created manually. Always run `npx prisma generate` after any schema change.
- **Never commit `.env`** — it contains your database password. It's already in `.gitignore`.

---

## 🛠️ Built With

- [Next.js](https://nextjs.org/) — React framework with App Router
- [Prisma](https://www.prisma.io/) — Type-safe ORM
- [MySQL](https://www.mysql.com/) — Relational database
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [pnpm](https://pnpm.io/) — Fast package manager

---

## 📄 License

MIT — free to use and modify.
