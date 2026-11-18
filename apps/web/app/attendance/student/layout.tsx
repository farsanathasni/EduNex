"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { RouteGuard } from "@/features/auth/components/route-guard";
import StudentHeader from "@/features/students/components/student-header";
import StudentSidebar from "@/features/students/components/student-sidebar";

import { authClient } from "@/lib/auth-client";
import { useAccess } from "@/lib/navigation/access";
import { useModeStore } from "@/stores/mode-store";

function StudentAttendanceLayoutContent({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { canSwitchMode } = useAccess();
  const setMode = useModeStore((state) => state.setMode);

  function handleSwitchMode() {
    setMode("coordinator");
    router.push("/club-coordinator/events");
  }

  async function handleLogout() {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await authClient.signOut();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsSigningOut(false);
    }
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