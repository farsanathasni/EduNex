"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { RouteGuard } from "@/features/auth/components/route-guard";
import { useLogout } from "@/features/auth/hooks/use-logout";
import StudentHeader from "@/features/students/components/student-header";
import StudentSidebar from "@/features/students/components/student-sidebar";

import { useAccess } from "@/lib/navigation/access";
import { useModeStore } from "@/stores/mode-store";

function StudentAttendanceLayoutContent({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { canSwitchMode } = useAccess();
  const { logout: handleLogout, isSigningOut } = useLogout();
  const setMode = useModeStore((state) => state.setMode);

  function handleSwitchMode() {
    setMode("coordinator");
    router.push("/club-coordinator/events");
  }
  return (
    <div className="min-h-screen bg-background text-text">
      <StudentHeader
        title="Event Attendance"
        subtitle="View your event attendance records"
        onOpenMobileMenu={() => setIsSidebarOpen(true)}
        onLogout={handleLogout}
        isSigningOut={isSigningOut}
        canSwitchMode={canSwitchMode}
        onSwitchMode={handleSwitchMode}
      />

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
  );
}

export default function StudentAttendanceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RouteGuard roles={["student"]}>
      <StudentAttendanceLayoutContent>
        {children}
      </StudentAttendanceLayoutContent>
    </RouteGuard>
  );
}