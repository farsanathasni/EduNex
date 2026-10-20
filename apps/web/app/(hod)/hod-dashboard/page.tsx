"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  useHodDashboard,
  useHodDepartments,
  useHodStudents,
} from "../hodQuery";

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
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const {
    data: hod,
    isPending: isDashboardPending,
    isError: isDashboardError,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useHodDashboard();

  const {
    data: departments = [],
    isPending: isDepartmentsPending,
    isError: isDepartmentsError,
    refetch: refetchDepartments,
  } = useHodDepartments(
    !!session && !isSessionPending && activeTab === "Students",
  );

  const departmentId =
    selectedDepartment === ""
      ? undefined
      : Number(selectedDepartment);

  const semesterNumber =
    semester === "" ? undefined : Number(semester);

  const {
    data: students = [],
    isPending: isStudentsPending,
    isError: isStudentsError,
    error: studentsError,
    refetch: refetchStudents,
  } = useHodStudents(
    departmentId,
    semesterNumber,
    !!session && !isSessionPending && activeTab === "Students",
  );

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
        <div className="text-center">
          <p className="text-text-muted">Redirecting to login...</p>
          <button
            type="button"
            onClick={() => router.replace("/hod-login")}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            Go to login
          </button>
        </div>
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

  if (isDashboardError || !hod) {
    const status = (
      dashboardError as (Error & { status?: number }) | null
    )?.status;

    const message =
      status === 403
        ? "Access denied. This account does not have active HOD permissions."
        : status === 401
          ? "Your session is not authorized. Please sign in again."
          : dashboardError instanceof Error
            ? dashboardError.message
            : "Unable to load the HOD dashboard.";

    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <section className="w-full max-w-md rounded-xl border border-border bg-surface p-6">
          <h1 className="text-xl font-bold">HOD Dashboard</h1>
          <p className="mt-3 text-sm text-text-muted">{message}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (status === 401) {
                  router.replace("/hod-login");
                } else {
                  void refetchDashboard();
                }
              }}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              {status === 401 ? "Go to login" : "Try again"}
            </button>

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
            <h3 className="mb-4 text-lg font-semibold">Overview</h3>

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
                Coordinator information, event counts, and approval
                statistics will appear here when their APIs are implemented.
              </p>
            </div>
          </section>
        )}

        {activeTab === "Students" && (
          <section className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold">Students</h3>
              <p className="mt-1 text-sm text-text-muted">
                Filter students by department, semester, or both.
              </p>
            </div>

            <div className="grid gap-4 rounded-xl border border-border bg-surface p-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="department"
                  className="mb-2 block text-sm font-medium"
                >
                  Department
                </label>

                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={(event) =>
                    setSelectedDepartment(event.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                >
                  <option value="">All Departments</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name} ({department.code})
                    </option>
                  ))}
                </select>

                {isDepartmentsPending && (
                  <p className="mt-2 text-sm text-text-muted">
                    Loading departments...
                  </p>
                )}

                {isDepartmentsError && (
                  <div className="mt-2 text-sm text-red-500">
                    <p>Unable to load departments.</p>
                    <button
                      type="button"
                      onClick={() => void refetchDepartments()}
                      className="mt-1 underline"
                    >
                      Try again
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="semester"
                  className="mb-2 block text-sm font-medium"
                >
                  Semester
                </label>

                <select
                  id="semester"
                  value={semester}
                  onChange={(event) => setSemester(event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                >
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                    <option key={number} value={number}>
                      Semester {number}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isStudentsPending ? (
              <div className="rounded-xl border border-border bg-surface p-6">
                <p className="text-sm text-text-muted">
                  Loading students...
                </p>
              </div>
            ) : isStudentsError ? (
              <div className="rounded-xl border border-border bg-surface p-6">
                <p className="text-sm text-red-500">
                  {studentsError instanceof Error
                    ? studentsError.message
                    : "Unable to load students."}
                </p>

                <button
                  type="button"
                  onClick={() => void refetchStudents()}
                  className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-background">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold">
                        Admission Number
                      </th>
                      <th className="px-4 py-3 font-semibold">
                        Department
                      </th>
                      <th className="px-4 py-3 font-semibold">Semester</th>
                      <th className="px-4 py-3 font-semibold">Phone</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-text-muted"
                        >
                          No students match the selected filters.
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr
                          key={student.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-4 py-3">{student.name}</td>
                          <td className="px-4 py-3">{student.email}</td>
                          <td className="px-4 py-3">
                            {student.admissionNumber}
                          </td>
                          <td className="px-4 py-3">
                            {student.departmentName}
                          </td>
                          <td className="px-4 py-3">{student.semester}</td>
                          <td className="px-4 py-3">
                            {student.phone || "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                <p className="px-4 py-3 text-sm text-text-muted">
                  Total students: {students.length}
                </p>
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
              Coordinator details will appear here after the coordinators API
              is connected.
            </p>
          </section>
        )}

        {activeTab === "Event Approvals" && (
          <section className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-lg font-semibold">Event Approvals</h3>
            <p className="mt-2 text-sm text-text-muted">
              Event requests and approval actions will appear here after the
              event approval API is connected.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}