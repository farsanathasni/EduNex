"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

import {
  getHodDashboard,
  getHodStudents,
  type HodDashboardResponse,
  type HodStudent,
} from "@/lib/hod";

type Tab =
  | "Overview"
  | "Students"
  | "Coordinators"
  | "Event Approvals";

export default function HODDashboardPage() {
  const router = useRouter();

  const {
    data: session,
    isPending: isSessionPending,
  } = authClient.useSession();

  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [semester, setSemester] = useState("");

  const {
    data: dashboardResponse,
    isPending: isDashboardPending,
    isError,
    error,
    refetch,
  } = useQuery<HodDashboardResponse>({
    queryKey: ["hod", "dashboard"],
    queryFn: getHodDashboard,
    enabled: !!session && !isSessionPending,
    retry: false,
  });

  const {
    data: studentsResponse,
    isPending: isStudentsPending,
    isError: isStudentsError,
    error: studentsError,
    refetch: refetchStudents,
  } = useQuery({
    queryKey: ["hod", "students", semester],
    queryFn: () =>
      getHodStudents(
        semester === "" ? undefined : Number(semester)
      ),
    enabled:
      !!session &&
      !isSessionPending &&
      !!dashboardResponse?.data &&
      activeTab === "Students",
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
    const status = (
      error as (Error & { status?: number }) | null
    )?.status;

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

          <p className="mt-3 text-sm text-text-muted">
            {message}
          </p>

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
  const students: HodStudent[] = studentsResponse?.data ?? [];

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
      description: "Approved events",
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
        </section>

        <nav className="mb-8 flex flex-wrap gap-2 border-b border-border pb-3">
          {(
            [
              "Overview",
              "Students",
              "Coordinators",
              "Event Approvals",
            ] as Tab[]
          ).map((tab) => (
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
              Overview
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => (
                <article
                  key={stat.title}
                  className="rounded-xl border border-border bg-surface p-5"
                >
                  <p className="text-sm text-text-muted">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-3xl font-bold">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-sm text-text-muted">
                    {stat.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-border bg-surface p-6">
              <h3 className="font-semibold">Quick overview</h3>

              <p className="mt-2 text-sm leading-6 text-text-muted">
                Your dashboard is connected to the backend.
                Coordinator information, event counts, and approval
                statistics will be added when those APIs are implemented.
              </p>
            </div>
          </section>
        )}

        {activeTab === "Students" && (
          <section>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Students
                </h3>

                <p className="mt-1 text-sm text-text-muted">
                  View and manage student records.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label
                  htmlFor="semester"
                  className="text-sm font-medium"
                >
                  Semester
                </label>

                <select
                  id="semester"
                  value={semester}
                  onChange={(event) =>
                    setSemester(event.target.value)
                  }
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                >
                  <option value="">All semesters</option>

                  {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                    <option key={number} value={number}>
                      Semester {number}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isStudentsPending && (
              <div className="rounded-xl border border-border bg-surface p-6">
                <p className="text-sm text-text-muted">
                  Loading students...
                </p>
              </div>
            )}

            {isStudentsError && (
              <div className="rounded-xl border border-border bg-surface p-6">
                <p className="text-sm text-red-500">
                  {studentsError instanceof Error
                    ? studentsError.message
                    : "Unable to load students."}
                </p>

                <button
                  type="button"
                  onClick={() => void refetchStudents()}
                  className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Try again
                </button>
              </div>
            )}

            {!isStudentsPending &&
              !isStudentsError &&
              students.length === 0 && (
                <div className="rounded-xl border border-border bg-surface p-8 text-center">
                  <h4 className="font-semibold">
                    No students found
                  </h4>

                  <p className="mt-2 text-sm text-text-muted">
                    No students match the selected semester.
                  </p>
                </div>
              )}

            {!isStudentsPending &&
              !isStudentsError &&
              students.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border bg-background">
                      <tr>
                        <th className="px-4 py-3 font-semibold">
                          Name
                        </th>

                        <th className="px-4 py-3 font-semibold">
                          Admission Number
                        </th>

                        <th className="px-4 py-3 font-semibold">
                          Semester
                        </th>

                        <th className="px-4 py-3 font-semibold">
                          Phone
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map((student) => (
                        <tr
                          key={student.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-4 py-3">
                            {student.name}
                          </td>

                          <td className="px-4 py-3">
                            {student.admissionNumber}
                          </td>

                          <td className="px-4 py-3">
                            {student.semester}
                          </td>

                          <td className="px-4 py-3">
                            {student.phone || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
            <h3 className="text-lg font-semibold">
              Event Approvals
            </h3>

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