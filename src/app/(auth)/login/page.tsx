"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("ADMIN");

  function handleLogin(event: FormEvent) {
    event.preventDefault();
    document.cookie = `hms-role=${role}; path=/; max-age=${60 * 60 * 8}`;
    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_24%),linear-gradient(180deg,#09111f_0%,#0f172a_55%,#eaf2fb_100%)]" />
      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/92 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-10">
        <div className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
          HMS Access
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Hospital Management Login
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Choose a role to preview the dashboard with a clean, user-friendly admin shell.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Role</span>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ADMIN">Admin</option>
              <option value="DOCTOR">Doctor</option>
              <option value="RECEPTIONIST">Receptionist</option>
            </select>
          </label>

          <button
            className="w-full rounded-2xl bg-slate-950 px-4 py-3.5 font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
            type="submit"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
