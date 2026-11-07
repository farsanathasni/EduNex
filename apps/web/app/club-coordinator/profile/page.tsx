"use client";

import { useState } from "react";
import CoordinatorLayout from "@/features/coordinator/components/coordinator-layout";
import { useAccess } from "@/lib/navigation/access";

export default function CoordinatorProfilePage() {
  const [editing, setEditing] = useState(false);
  const { me } = useAccess();
  const user = me?.user;
  const coordinatedClubs = me?.coordinatedClubs ?? [];
  const initials = user?.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "CC";

  return (
    <CoordinatorLayout>
      <div className="mb-7">
        <p className="text-sm font-medium text-indigo-600">Your account</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">My Profile</h1>
        <p className="mt-2 text-sm text-slate-500">View your coordinator and assigned club information.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-36 bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-500 sm:h-44" />
        <div className="px-5 pb-7 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-indigo-100 text-3xl font-bold text-indigo-700 shadow-sm sm:h-28 sm:w-28">{initials}</div>
            <button onClick={() => setEditing(!editing)} className="rounded-xl border border-indigo-200 px-5 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
              {editing ? "Cancel editing" : "Edit Profile"}
            </button>
          </div>
          <div className="mt-5">
            <h2 className="text-2xl font-bold text-slate-900">{user?.name ?? "Coordinator"}</h2>
            <p className="mt-1 text-sm text-slate-500">Club Coordinator</p>
            <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Active account</span>
          </div>
          {editing && <div role="status" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Profile editing is a UI preview only. Changes are not saved.</div>}

          <div className="mt-8 border-t border-slate-100 pt-7">
            <h3 className="font-semibold text-slate-900">Personal Information</h3>
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[{ label: "Full Name", value: user?.name ?? "Not available" }, { label: "Email Address", value: user?.email ?? "Not available" }].map((item) => (
                <div key={item.label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{item.label}</p>
                  <p className="mt-2 break-words text-sm font-medium text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-7">
            <h3 className="font-semibold text-slate-900">Assigned Clubs</h3>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {coordinatedClubs.length === 0 ? (
                <div className="sm:col-span-2 rounded-xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">No clubs are currently assigned to your coordinator account.</div>
              ) : coordinatedClubs.map((club) => (
                <div key={club.id} className="rounded-xl border border-slate-100 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Assigned club</p>
                  <p className="mt-2 text-sm font-medium text-slate-800">{club.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CoordinatorLayout>
  );
}
