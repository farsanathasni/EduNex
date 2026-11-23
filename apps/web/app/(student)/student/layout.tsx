
"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { RouteGuard } from "@/features/auth/components/route-guard";
import { useLogout } from "@/features/auth/hooks/use-logout";
import StudentHeader from "@/features/students/components/student-header";
import StudentSidebar from "../../../features/students/components/student-sidebar";
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

  const { canSwitchMode } = useAccess();
  const { logout: handleLogout, isSigningOut } = useLogout();
const setMode = useModeStore((state) => state.setMode);

function handleSwitchMode() {
  setMode("coordinator");
  router.push("/club-coordinator/events");
}

  const pageDetails: Record<
    string,
    { title: string; subtitle: string }
  > = {
    "/student/dashboard": {
      title: "Student dashboard",
      subtitle: "Your personal campus space",
    },
    "/student": {
      title: "Explore Clubs",
      subtitle: "Discover and join campus clubs",
    },
    "/student/events": {
      title: "Campus Events",
      subtitle: "Explore upcoming campus events",
    },
    "/student/my-memberships": {
      title: "My Memberships",
      subtitle: "Manage your club memberships",
    },
    "/student/study-materials": {
      title: "Study Materials",
      subtitle: "Resources shared by your faculty",
    },
    "/student/issues": {
      title: "My Issues",
      subtitle: "Raise a concern and track the response",
    },
    "/student/issues/new": {
      title: "New Issue",
      subtitle: "Raise a concern with the right person",
    },
    "/student/issues/detail": {
      title: "Issue Thread",
      subtitle: "Review replies and updates",
    },
    "/student/lost-found": {
      title: "Lost & Found",
      subtitle: "Browse campus lost and found items",
    },
    "/student/lost-found/new": {
      title: "Report Found Item",
      subtitle: "Add photos and verification questions",
    },
    "/student/lost-found/my-claims": {
      title: "My Claims",
      subtitle: "Track claims you submitted",
    },
    "/student/lost-found/detail": {
      title: "Item Details",
      subtitle: "Review the item and claim activity",
    },
    "/student/attendance": {
      title: "Event Attendance",
      subtitle: "View your event attendance records",
    },
    "/student/class-attendance": {
      title: "My Attendance",
      subtitle: "View your class attendance records",
    },
    "/student/notifications": {
      title: "Notifications",
      subtitle: "Stay up to date with campus activity",
    },
    "/student/profile": {
      title: "My Profile",
      subtitle: "View and manage your profile",
    },
  };

  const currentPage =
    pageDetails[pathname] ??
    (pathname.startsWith("/student/issues/")
      ? pageDetails["/student/issues/detail"]
      : pathname.startsWith("/student/lost-found/")
        ? pageDetails["/student/lost-found/detail"]
        : {
            title: "Student Portal",
            subtitle: "Your personal campus space",
          });
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
