"use client";

import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";

import { RouteGuard } from "@/features/auth/components/route-guard";
import StudentSidebar from "@/features/students/components/student-sidebar";

export default function StudentAttendanceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RouteGuard roles={["student"]}>
      <div className="min-h-screen bg-background text-text">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center border-b border-border bg-surface px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isSidebarOpen}
            className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-secondary lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <p className="text-xs text-text-muted">
              Student Portal / Attendance
            </p>
            <h1 className="text-lg font-bold text-text">
              My Attendance
            </h1>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-76px)]">
          <StudentSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main className="min-w-0 flex-1">
            {children}
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}