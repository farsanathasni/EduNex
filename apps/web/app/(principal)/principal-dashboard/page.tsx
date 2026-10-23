"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { getPrincipalDashboard } from "@/lib/principal";

type DashboardResponse = {
  success: boolean;
  message: string;
  data: {
    staffId: string;
    employeeId: string;
    role: "principal";
    designation: string | null;
  };
};

export default function PrincipalDashboardPage() {
  const router = useRouter();
  const { data: session, isPending: checkingSession } =
    authClient.useSession();

  useEffect(() => {
    if (!checkingSession && !session) {
      router.replace("/principal-login");
    }
  }, [checkingSession, session, router]);

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery<DashboardResponse>({
    queryKey: ["principal", "dashboard"],
    queryFn: getPrincipalDashboard,
    enabled: !!session && !checkingSession,
    retry: false,
  });

  if (checkingSession || (!session && !isError)) {
    return <p className="py-10 text-text-muted">Checking session...</p>;
  }

  if (!session) {
    return <p className="py-10 text-text-muted">Redirecting to login...</p>;
  }

  if (isPending) {
    return <p className="py-10 text-text-muted">Loading overview...</p>;
  }

  if (isError || !data?.data) {
    return (
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xl font-bold">Unable to load overview</h2>
        <p className="mt-2 text-sm text-text-muted">
          {error instanceof Error ? error.message : "Please try again."}
        </p>
        <button
          onClick={() => void refetch()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Retry
        </button>
      </section>
    );
  }

  const principal = data.data;

  const sections = [
    {
      title: "Staff Management",
      description: "Add HODs, manage staff accounts and assignments.",
      href: "/principal/staff",
    },
    {
      title: "Student Management",
      description: "Browse students by department and semester.",
      href: "/principal/students",
    },
    {
      title: "Departments",
      description: "View college departments and their details.",
      href: "/principal/departments",
    },
    {
      title: "College Events",
      description: "View college-wide event information.",
      href: "/principal/events",
    },
    {
      title: "Approvals",
      description: "Review requests that require Principal approval.",
      href: "/principal/approvals",
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Principal Workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Welcome, {session.user.name || "Principal"}
        </h1>

        <p className="mt-2 text-text-muted">
          {principal.designation || "Principal"} · Employee ID:{" "}
          {principal.employeeId}
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Administration overview</h2>
        <p className="mt-2 text-sm text-text-muted">
          Manage college staff, students, departments and events from
          one place.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Quick access</h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-semibold">{section.title}</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                {section.description}
              </p>
              <p className="mt-4 text-sm font-semibold text-primary">
                Open page →
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}