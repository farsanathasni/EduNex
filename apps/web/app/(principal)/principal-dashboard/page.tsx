
"use client";

import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import AddHodForm from "./AddHodForm";

import { getPrincipalDashboard } from "@/lib/principal";

type Tab = "Overview" | "Events" | "Approvals" | "Add HOD"

type PrincipalDashboardData = {
  staffId: string;
  employeeId: string;
  role: "principal";
  designation: string | null;
};

type PrincipalDashboardResponse = {
  success: boolean;
  message: string;
  data: PrincipalDashboardData;
};


export default function PrincipalDashboardPage() {
  const router = useRouter();

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [isSigningOut, setIsSigningOut] = useState(false);

useEffect(() => {
  if (!isSessionPending && !session) {
    router.replace("/principal-login");
  }
}, [isSessionPending, session, router]);

  const {
    data: dashboardResponse,
    isPending: isDashboardPending,
    isError,
    error,
    refetch,
  } = useQuery<PrincipalDashboardResponse>({
    queryKey: ["principal", "dashboard"],
    queryFn: getPrincipalDashboard,
    enabled: !!session && !isSessionPending,
    retry: false,
  });

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await authClient.signOut();
      router.replace("/principal-login");
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

if (!isSessionPending && !session) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <p>Redirecting to login...</p>
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
    const status = (
      error as Error & { status?: number } | null
    )?.status;

    const message =
      status === 403
        ? "Access denied. This account does not have active Principal permissions."
        : status === 401
          ? "Your session is not authorized. Please sign in again."
          : error instanceof Error
            ? error.message
            : "Unable to load the Principal dashboard.";

    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <section className="w-full max-w-md rounded-xl border border-border bg-surface p-6">
          <h1 className="text-xl font-bold">Principal Dashboard</h1>

          <p className="mt-3 text-sm text-text-muted">{message}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {status === 401 ? (
              <button
                type="button"
                onClick={() => router.replace("/principal-login")}
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

  const principal = dashboardResponse.data;

  const stats = [
    {
      title: "Total Events",
      value: "—",
      description: "College events",
    },
    {
      title: "Pending Approvals",
      value: "—",
      description: "Requests awaiting review",
    },
    {
      title: "Departments",
      value: "—",
      description: "College departments",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-text">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold">EduNex</h1>
            <p className="text-sm text-text-muted">
              Principal Administration Portal
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
            PRINCIPAL WORKSPACE
          </p>

          <h2 className="mt-2 text-3xl font-bold">
  Welcome, {session?.user?.name ?? "Principal"}
</h2>

          <p className="mt-2 text-text-muted">
            {principal.designation || "Principal"} · Employee ID:{" "}
            {principal.employeeId}
          </p>
        </section>

        <nav className="mb-8 flex flex-wrap gap-2 border-b border-border pb-3">
          {(["Overview", "Events", "Approvals" , "Add HOD"] as Tab[]).map((tab) => (
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
          ))}
        </nav>

        {activeTab === "Overview" && (
          <section>
            <h3 className="mb-4 text-lg font-semibold">
              College Overview
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
              <h3 className="font-semibold">Administration overview</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                Your dashboard is connected to the Principal backend.
                College-wide event information, department statistics,
                and approval details can be added when the corresponding
                APIs are available.
              </p>
            </div>
          </section>
        )}

        {activeTab === "Events" && (
          <section className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-lg font-semibold">College Events</h3>
            <p className="mt-2 text-sm text-text-muted">
              College-wide event records will appear here when we connect
              the events API.
            </p>
          </section>
        )}

        {activeTab === "Approvals" && (
          <section className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-lg font-semibold">Pending Approvals</h3>
            <p className="mt-2 text-sm text-text-muted">
              Event requests and approval actions will appear here when
              we connect the Principal approval API.
            </p>
          </section>
        )}

        {activeTab === "Add HOD" && (
  <AddHodForm />
)}
      </div>
    </main>
  );
}
