
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  UserCheck,
  CalendarCheck,

} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useHodDashboard } from "../../hodQuery";

import Button from "@/app/ui/button";
import Card from "@/app/ui/card";
import PageHeader from "@/app/ui/pageHeader";

export default function HodDashboardPage() {
  const router = useRouter();

  const {
    data: session,
    isPending: checkingSession,
  } = authClient.useSession();

  const {
    data: dashboard,
    isPending,
    isError,
    error,
    refetch,
  } = useHodDashboard();

  useEffect(() => {
    if (!checkingSession && !session?.user) {
      router.replace("/hod-login");
    }
  }, [checkingSession, session, router]);

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

  if (isPending) {
    return (
      <p className="py-10 text-text-muted">
        Loading overview...
      </p>
    );
  }

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



  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="HOD Workspace"
        title={`Welcome, ${session.user.name || "HOD"}`}
        description="Manage your department's students, clubs, coordinators, and event approvals."
      />

      <Card padding="lg">
        <h2 className="text-lg font-semibold">
          Department Overview
        </h2>

        <p className="mt-2 text-sm text-text-muted">
          Heres a summary of your departments activities.
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


    </div>
  );
}
