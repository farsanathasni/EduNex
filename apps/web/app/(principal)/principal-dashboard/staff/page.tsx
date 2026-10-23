"use client";

import { useState } from "react";
import AddHodForm from "./AddHodForm";

type StaffTab = "all" | "faculty" | "hod" | "add";

export default function StaffManagementPage() {
  const [activeTab, setActiveTab] = useState<StaffTab>("add");

  const tabs: { label: string; value: StaffTab }[] = [
    { label: "All Staff", value: "all" },
    { label: "Faculty", value: "faculty" },
    { label: "HODs", value: "hod" },
    { label: "Add Staff", value: "add" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <p className="mt-2 text-sm text-text-muted">
          Manage college staff, faculty members and Heads of Department.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-surface text-text-muted hover:bg-background"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "add" && <AddHodForm />}

      {activeTab === "all" && (
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">All Staff</h2>
          <p className="mt-2 text-sm text-text-muted">
            The staff listing will appear here when the staff-list API
            is connected.
          </p>
        </section>
      )}

      {activeTab === "faculty" && (
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Faculty</h2>
          <p className="mt-2 text-sm text-text-muted">
            Faculty accounts will appear here when the staff-list API
            is connected.
          </p>
        </section>
      )}

      {activeTab === "hod" && (
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Heads of Department</h2>
          <p className="mt-2 text-sm text-text-muted">
            HOD accounts and their department assignments will appear
            here when the staff-list API is connected.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("add")}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Add HOD
          </button>
        </section>
      )}
    </div>
  );
}