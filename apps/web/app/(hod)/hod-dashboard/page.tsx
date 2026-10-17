"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

type Tab = "Overview" | "Coordinators" | "Event Approvals";

type HodDashboardData = {
  staffId: string;
  employeeId: string;
  role: "hod";
  departmentId: string | null;
  designation: string | null;
};

type HodDashboardResponse = {
  success: boolean;
  message: string;
  data: HodDashboardData;
};

async function fetchHodDashboard(): Promise<HodDashboardResponse> {
  const response = await fetch(
    "http://localhost:5000/api/hod/dashboard",
    {
      method: "GET",
      credentials: "include",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(
      result.message || "Failed to load HOD dashboard.",
    ) as Error & { status?: number };

    error.status = response.status;
    throw error;
  }

  return result as HodDashboardResponse;
}

export default function HODDashboardPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const {
    data: dashboardResponse,
    isPending: isDashboardPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["hod", "dashboard"],
    queryFn: fetchHodDashboard,
    enabled: !!session && !isSessionPending,
    retry: false,
  });

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await authClient.signOut();
      router.replace("/hod-login");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isSessionPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-text-muted">Checking your session...</p>
      </main>
    );
  }

  if (!session) {
    router.replace("/hod-login");

    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-text-muted">Redirecting to login...</p>
      </main>
    );
  }

  if (isDashboardPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-text-muted">Loading your dashboard...</p>
      </main>
    );
  }

  if (isError || !dashboardResponse?.data) {
    const status = (error as Error & { status?: number } | null)?.status;

    const message =
      status === 403
        ? "Access denied. This account does not have active HOD permissions."
        : status === 401
          ? "Your session is not authorized. Please sign in again."
          : error instanceof Error
            ? error.message
            : "Unable to load the HOD dashboard.";

    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <section className="w-full max-w-md rounded-xl border border-border bg-surface p-6">
          <h1 className="text-xl font-bold">HOD Dashboard</h1>

          <p className="mt-3 text-sm text-text-muted">{message}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {status === 401 ? (
              <button
                type="button"
                onClick={() => router.replace("/hod-login")}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Go to login
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Try again
              </button>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium disabled:opacity-60"
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </section>
      </main>
    );
  }

  const hod = dashboardResponse.data;

  const stats = [
    {
      title: "Department Coordinators",
      value: "—",
      description: "Coordinator records",
    },
    {
      title: "Pending Approvals",
      value: "—",
      description: "Events awaiting review",
    },
    {
      title: "Approved Events",
      value: "—",
      description: "Approved department events",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-text">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold">EduNex</h1>
            <p className="text-sm text-text-muted">
              Head of Department Portal
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-background disabled:opacity-60"
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <p className="text-sm font-medium text-text-muted">
            HOD WORKSPACE
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Welcome, {session.user.name}
          </h2>

          <p className="mt-2 text-text-muted">
            {hod.designation || "Head of Department"} · Employee ID:{" "}
            {hod.employeeId}
          </p>

          <p className="mt-1 text-sm text-text-muted">
            Department ID: {hod.departmentId || "Not assigned"}
          </p>
        </section>

        <nav className="mb-8 flex flex-wrap gap-2 border-b border-border pb-3">
          {(["Overview", "Coordinators", "Event Approvals"] as Tab[]).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-text-muted hover:bg-surface"
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </nav>

        {activeTab === "Overview" && (
          <section>
            <h3 className="mb-4 text-lg font-semibold">
              Department Overview
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => (
                <article
                  key={stat.title}
                  className="rounded-xl border border-border bg-surface p-5"
                >
                  <p className="text-sm text-text-muted">{stat.title}</p>
                  <p className="mt-3 text-3xl font-bold">{stat.value}</p>
                  <p className="mt-2 text-sm text-text-muted">
                    {stat.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-border bg-surface p-6">
              <h3 className="font-semibold">Quick overview</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                Your dashboard is connected to the backend. Coordinator
                information, event counts, and approval statistics will be
                added when those APIs are implemented.
              </p>
            </div>
          </section>
        )}

        {activeTab === "Coordinators" && (
          <section className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-lg font-semibold">
              Department Coordinators
            </h3>
            <p className="mt-2 text-sm text-text-muted">
              Coordinator details will appear here after we connect the
              coordinators API.
            </p>
          </section>
        )}

        {activeTab === "Event Approvals" && (
          <section className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-lg font-semibold">Event Approvals</h3>
            <p className="mt-2 text-sm text-text-muted">
              Event requests and approval actions will appear here after we
              connect the event approval API.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}