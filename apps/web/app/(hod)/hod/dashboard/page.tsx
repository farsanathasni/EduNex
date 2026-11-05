
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  UserCheck,
  CalendarCheck,
  Building2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { useHodDashboard } from "@/features/hod/api/hod-query";

export default function HodDashboardPage() {
  const router = useRouter();

  // Check logged-in session
  const {
    data: session,
    isPending: checkingSession,
  } = authClient.useSession();

  // Fetch HOD dashboard data
  const {
    data: dashboard,
    isPending,
    isError,
    error,
    refetch,
  } = useHodDashboard();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!checkingSession && !session?.user) {
      router.replace("/login");
    }
  }, [checkingSession, session, router]);

  // Session loading
  if (checkingSession) {
    return (
      <p className="py-10 text-text-muted">
        Checking session...
      </p>
    );
  }

  if (!session?.user) {
    return (
      <p className="py-10 text-text-muted">
        Redirecting to login...
      </p>
    );
  }

  // Dashboard loading
  if (isPending) {
    return (
      <p className="py-10 text-text-muted">
        Loading overview...
      </p>
    );
  }

  // Dashboard error
  if (isError || !dashboard) {
    return (
      <Card padding="lg">
        <h2 className="text-xl font-bold">
          Unable to load overview
        </h2>

        <p className="mt-2 text-sm text-text-muted">
          {error instanceof Error
            ? error.message
            : "Please try again."}
        </p>

        <Button
          variant="primary"
          className="mt-4"
          onClick={() => void refetch()}
        >
          Retry
        </Button>
      </Card>
    );
  }

  // Dashboard statistics
  const statistics = [
    {
      title: "Total Students",
      value: dashboard.totalStudents,
      icon: Users,
    },
    {
      title: "Total Staff",
      value: dashboard.totalStaff,
      icon: GraduationCap,
    },
    {
      title: "Total Coordinators",
      value: dashboard.totalCoordinators,
      icon: UserCheck,
    },
    {
      title: "Pending Approvals",
      value: dashboard.pendingApprovals,
      icon: CalendarCheck,
    },
  ];

  // Quick access sections
  const sections = [
    {
      title: "Student Management",
      description:
        "Browse students and filter by department and semester.",
      href: "/hod/students",
      icon: Users,
    },
    {
      title: "Coordinator Management",
      description:
        "Appoint student coordinators and view their assignments.",
      href: "/hod/coordinators",
      icon: UserCheck,
    },
    {
      title: "Club Management",
      description:
        "Create clubs and view existing college clubs.",
      href: "/hod/clubs",
      icon: Building2,
    },
    {
      title: "Event Approvals",
      description:
        "Review and manage event approval requests.",
      href: "/hod/approvals",
      icon: CalendarCheck,
    },
  ];

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <PageHeader
        eyebrow="HOD Workspace"
        title={`Welcome, ${session.user.name || "HOD"}`}
        description="Manage your department's students, clubs, coordinators, and event approvals."
      />

      {/* Assigned Department */}
      <Card padding="lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <Building2 size={24} />
            </div>

            <div>
              <p className="text-sm text-text-muted">
                Your Assigned Department
              </p>

              <h2 className="mt-1 text-xl font-bold">
                {dashboard.department?.name ||
                  "Department not assigned"}
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Department Code:{" "}
                {dashboard.department?.code || "—"}
              </p>
            </div>
          </div>

          {dashboard.departmentId && (
            <div className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-primary">
              Department ID: {dashboard.departmentId}
            </div>
          )}

        </div>
      </Card>

      {/* Department Statistics */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold">
          Department Overview
        </h2>

        <p className="mt-2 text-sm text-text-muted">
          Here's a summary of your department's activities.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-secondary p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-text-muted">
                    {item.title}
                  </p>

                  <Icon
                    size={20}
                    className="shrink-0 text-primary"
                  />
                </div>

                <p className="mt-3 text-2xl font-bold">
                  {item.value ?? "—"}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Access */}
      <section>
        <h2 className="mb-4 text-xl font-bold">
          Quick Access
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <Card
                key={section.href}
                padding="lg"
                className="transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon size={22} />
                </div>

                <h3 className="font-semibold">
                  {section.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-text-muted">
                  {section.description}
                </p>

                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => router.push(section.href)}
                >
                  Open page →
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

    </div>
  );
}
