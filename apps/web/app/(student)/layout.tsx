
"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { RouteGuard } from "@/features/auth/components/route-guard";
import StudentHeader from "@/features/students/components/student-header";
import { authClient } from "@/lib/auth-client";
import StudentSidebar from "../../features/students/components/student-sidebar";
import { useAccess } from "@/lib/navigation/access";
import { useModeStore } from "@/stores/mode-store";

function StudentLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { canSwitchMode } = useAccess();
const setMode = useModeStore((state) => state.setMode);

function handleSwitchMode() {
  setMode("coordinator");
  router.push("/dashboard");
}

  const pageDetails: Record<
    string,
    { title: string; subtitle: string }
  > = {
    "/studentDashboard": {
      title: "Student dashboard",
      subtitle: "Your personal campus space",
    },
    "/student": {
      title: "Explore Clubs",
      subtitle: "Discover and join campus clubs",
    },
    "/studentEvents": {
      title: "Campus Events",
      subtitle: "Explore upcoming campus events",
    },
    "/student/my-memberships": {
      title: "My Memberships",
      subtitle: "Manage your club memberships",
    },
    "/student/attendance": {
    title: "My Attendance",
    subtitle: "View your event attendance records",
  },
    "/studentprofile": {
      title: "My Profile",
      subtitle: "View and manage your profile",
    },
  };

  const currentPage = pageDetails[pathname] ?? {
    title: "Student Portal",
    subtitle: "Your personal campus space",
  };

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
    <div className="min-h-screen bg-background">
      <StudentHeader
  title={currentPage.title}
  subtitle={currentPage.subtitle}
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

export default function StudentRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard roles={["student"]}>
      <StudentLayoutContent>{children}</StudentLayoutContent>
    </RouteGuard>
  );
}
