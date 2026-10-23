
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  useHodDashboard,
  useHodDepartments,
  useHodStudents,
} from "../../hodQuery";

import { useForm, type SubmitHandler } from "react-hook-form";

import {
  useCoordinatorAssignments,
  useCreateCoordinator,
} from "../../coordinatorsQuery";

type Tab = "Overview" | "Students" | "Coordinators" | "Event Approvals";

const tabs: Tab[] = [
  "Overview",
  "Students",
  "Coordinators",
  "Event Approvals",
];

type CoordinatorFormInput = {
  studentId: number;
  clubId: number;
};

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

const studentsTabEnabled =
  !!session &&
  !isSessionPending &&
  (activeTab === "Students" || activeTab === "Coordinators");


const departmentsEnabled =
  !!session && !isSessionPending && activeTab === "Students";

  const {
    data: departments = [],
    isPending: isDepartmentsPending,
    isError: isDepartmentsError,
    refetch: refetchDepartments,
  } = useHodDepartments(departmentsEnabled);

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
    studentsTabEnabled,
  );

  const {
  data: coordinatorAssignments = [],
  isPending: isCoordinatorsPending,
  isError: isCoordinatorsError,
  error: coordinatorsError,
  refetch: refetchCoordinators,
} = useCoordinatorAssignments();

const createCoordinatorMutation = useCreateCoordinator();

const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<CoordinatorFormInput>({
  defaultValues: {
    studentId: 0,
    clubId: 0,
  },
});

const onSubmit: SubmitHandler<CoordinatorFormInput> = async (values) => {
  try {
    await createCoordinatorMutation.mutateAsync({
      studentId: values.studentId,
      clubId: values.clubId,
    });

    reset();
  } catch {
    // The mutation error is displayed in the form below.
  }
};

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
        <p className="text-sm text-text-muted">
          Checking your session...
        </p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
          <h1 className="text-xl font-semibold">Session expired</h1>
          <p className="mt-2 text-sm text-text-muted">
            Please sign in to access the HOD dashboard.
          </p>

          <button
            type="button"
            onClick={() => router.replace("/hod-login")}
            className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Go to login
          </button>
        </section>
      </main>
    );
  }

  if (isDashboardPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-text-muted">
          Loading your dashboard...
        </p>
      </main>
    );
  }

  if (isDashboardError || !hod) {
    const status = (
      dashboardError as (Error & { status?: number }) | null
    )?.status;

    const message =
      status === 403
        ? "This account does not have active HOD permissions."
        : status === 401
          ? "Your session is not authorized. Please sign in again."
          : dashboardError instanceof Error
            ? dashboardError.message
            : "Unable to load the HOD dashboard.";

    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-7">
          <p className="text-sm font-medium text-text-muted">
            EDUNEX
          </p>

          <h1 className="mt-3 text-xl font-semibold">
            Unable to load dashboard
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            {message}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                if (status === 401) {
                  router.replace("/hod-login");
                } else {
                  void refetchDashboard();
                }
              }}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
            >
              {status === 401 ? "Go to login" : "Try again"}
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-60"
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
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              EduNex
            </h1>
            <p className="mt-0.5 text-xs text-text-muted">
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

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        {/* Welcome section */}
        <section className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            HOD Workspace
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome, {session.user.name}
          </h2>

          <p className="mt-2 text-sm text-text-muted">
            {hod.designation || "Head of Department"} · Employee ID:{" "}
            {hod.employeeId}
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-text-muted">
            Manage department students, review coordinator information,
            and keep track of event approvals from one place.
          </p>
        </section>

        {/* Navigation */}
        <nav
          aria-label="HOD dashboard navigation"
          className="mb-8 flex gap-1 overflow-x-auto border-b border-border"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              aria-current={activeTab === tab ? "page" : undefined}
              className={`-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Overview */}
        {activeTab === "Overview" && (
          <section>
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Overview</h3>
              <p className="mt-1 text-sm text-text-muted">
                A quick look at your department management workspace.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => (
                <article
                  key={stat.title}
                  className="rounded-xl border border-border bg-surface p-5 transition hover:border-primary/40"
                >
                  <p className="text-sm font-medium text-text-muted">
                    {stat.title}
                  </p>

                  <p className="mt-5 text-3xl font-semibold tracking-tight">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-xs text-text-muted">
                    {stat.description}
                  </p>
                </article>
              ))}
            </div>

            <section className="mt-6 rounded-xl border border-border bg-surface p-6">
              <h3 className="font-semibold">Quick overview</h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                Use the navigation above to view students, manage
                coordinators, and access event approvals. Coordinator
                counts and event statistics will be connected when
                their APIs are available.
              </p>

              <button
                type="button"
                onClick={() => setActiveTab("Students")}
                className="mt-5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                View students
              </button>
            </section>
          </section>
        )}

        {/* Students */}
        {activeTab === "Students" && (
          <section>
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Students</h3>
              <p className="mt-1 text-sm text-text-muted">
                Browse students and filter by department or semester.
              </p>
            </div>

            {/* Filters */}
            <div className="mb-6 grid gap-5 rounded-xl border border-border bg-surface p-5 sm:grid-cols-2">
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
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="">All Departments</option>

                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name} ({department.code})
                    </option>
                  ))}
                </select>

                {isDepartmentsPending && (
                  <p className="mt-2 text-xs text-text-muted">
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
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
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

            {/* Students table */}
            <section className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
                <div>
                  <h4 className="font-semibold">Student directory</h4>
                  <p className="mt-1 text-xs text-text-muted">
                    Students matching your selected filters
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void refetchStudents()}
                  disabled={isStudentsPending}
                  className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-background disabled:opacity-60"
                >
                  Refresh
                </button>
              </div>

              {isStudentsPending ? (
                <p className="p-6 text-sm text-text-muted">
                  Loading students...
                </p>
              ) : isStudentsError ? (
                <div className="p-6">
                  <p className="text-sm text-red-500">
                    {studentsError instanceof Error
                      ? studentsError.message
                      : "Unable to load students."}
                  </p>

                  <button
                    type="button"
                    onClick={() => void refetchStudents()}
                    className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-border bg-background">
                        <tr>
                          <th className="px-5 py-3 font-medium text-text-muted">
                            Name
                          </th>
                          <th className="px-5 py-3 font-medium text-text-muted">
                            Email
                          </th>
                          <th className="px-5 py-3 font-medium text-text-muted">
                            Admission Number
                          </th>
                          <th className="px-5 py-3 font-medium text-text-muted">
                            Department
                          </th>
                          <th className="px-5 py-3 font-medium text-text-muted">
                            Semester
                          </th>
                          <th className="px-5 py-3 font-medium text-text-muted">
                            Phone
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {students.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-5 py-12 text-center text-sm text-text-muted"
                            >
                              No students match the selected filters.
                            </td>
                          </tr>
                        ) : (
                          students.map((student) => (
                            <tr
                              key={student.id}
                              className="border-b border-border last:border-0 transition hover:bg-background/60"
                            >
                              <td className="whitespace-nowrap px-5 py-4 font-medium">
                                {student.name}
                              </td>
                              <td className="whitespace-nowrap px-5 py-4 text-text-muted">
                                {student.email}
                              </td>
                              <td className="whitespace-nowrap px-5 py-4 text-text-muted">
                                {student.admissionNumber}
                              </td>
                              <td className="whitespace-nowrap px-5 py-4">
                                {student.departmentName}
                              </td>
                              <td className="whitespace-nowrap px-5 py-4 text-text-muted">
                                {student.semester}
                              </td>
                              <td className="whitespace-nowrap px-5 py-4 text-text-muted">
                                {student.phone || "—"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-border px-5 py-3">
                    <p className="text-xs text-text-muted">
                      Total students: {students.length}
                    </p>
                  </div>
                </>
              )}
            </section>
          </section>
        )}

        {/* Coordinators */}
{/* Coordinators */}
{activeTab === "Coordinators" && (
  <section className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold">
        Department Coordinators
      </h3>

      <p className="mt-1 text-sm text-text-muted">
        View current coordinator assignments and appoint students
        to manage clubs.
      </p>
    </div>

    {/* Appoint coordinator form */}
    <section className="rounded-xl border border-border bg-surface p-5">
      <h4 className="font-semibold">Appoint a Coordinator</h4>

      <p className="mt-1 text-sm text-text-muted">
        Select a student and enter the ID of the club they will manage.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 grid gap-5 sm:grid-cols-2"
      >
        <div>
          <label
            htmlFor="studentId"
            className="mb-2 block text-sm font-medium"
          >
            Student
          </label>

          <select
            id="studentId"
            {...register("studentId", {
              valueAsNumber: true,
              required: "Please select a student.",
              min: {
                value: 1,
                message: "Please select a valid student.",
              },
            })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value={0}>Select a student</option>

            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.admissionNumber})
              </option>
            ))}
          </select>

          {errors.studentId && (
            <p className="mt-1 text-sm text-red-500">
              {errors.studentId.message}
            </p>
          )}

          {studentsTabEnabled && isStudentsPending && (
            <p className="mt-1 text-xs text-text-muted">
              Loading students...
            </p>
          )}

          {isStudentsError && (
            <p className="mt-1 text-sm text-red-500">
              Unable to load students. Open the Students tab and retry.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="clubId"
            className="mb-2 block text-sm font-medium"
          >
            Club ID
          </label>

          <input
            id="clubId"
            type="number"
            min={1}
            {...register("clubId", {
              valueAsNumber: true,
              required: "Please enter a club ID.",
              min: {
                value: 1,
                message: "Club ID must be greater than zero.",
              },
              validate: (value) =>
                Number.isInteger(value) ||
                "Club ID must be a whole number.",
            })}
            placeholder="Enter club ID"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />

          {errors.clubId && (
            <p className="mt-1 text-sm text-red-500">
              {errors.clubId.message}
            </p>
          )}
        </div>

        {createCoordinatorMutation.isError && (
          <p className="text-sm text-red-500 sm:col-span-2">
            {createCoordinatorMutation.error instanceof Error
              ? createCoordinatorMutation.error.message
              : "Unable to appoint the coordinator. Please try again."}
          </p>
        )}

        {createCoordinatorMutation.isSuccess && (
          <p className="text-sm text-green-600 sm:col-span-2">
            Coordinator appointed successfully.
          </p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={createCoordinatorMutation.isPending}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createCoordinatorMutation.isPending
              ? "Appointing..."
              : "Appoint Coordinator"}
          </button>
        </div>
      </form>
    </section>

    {/* Existing coordinator assignments */}
    <section className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h4 className="font-semibold">Current Assignments</h4>
          <p className="mt-1 text-xs text-text-muted">
            {coordinatorAssignments.length} assignment(s)
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refetchCoordinators()}
          disabled={isCoordinatorsPending}
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-background disabled:opacity-60"
        >
          Refresh
        </button>
      </div>

      {isCoordinatorsPending ? (
        <p className="p-6 text-sm text-text-muted">
          Loading coordinator assignments...
        </p>
      ) : isCoordinatorsError ? (
        <div className="p-6">
          <p className="text-sm text-red-500">
            {coordinatorsError instanceof Error
              ? coordinatorsError.message
              : "Unable to load coordinator assignments."}
          </p>

          <button
            type="button"
            onClick={() => void refetchCoordinators()}
            className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
        </div>
      ) : coordinatorAssignments.length === 0 ? (
        <div className="p-8 text-center">
          <h5 className="font-medium">No coordinators appointed yet</h5>
          <p className="mt-2 text-sm text-text-muted">
            Use the form above to appoint the first coordinator.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w- text-left text-sm">
            <thead className="border-b border-border bg-background">
              <tr>
                <th className="px-5 py-3 font-medium text-text-muted">
                  Student
                </th>
                <th className="px-5 py-3 font-medium text-text-muted">
                  Admission Number
                </th>
                <th className="px-5 py-3 font-medium text-text-muted">
                  Club
                </th>
                <th className="px-5 py-3 font-medium text-text-muted">
                  Appointed By
                </th>
                <th className="px-5 py-3 font-medium text-text-muted">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {coordinatorAssignments.map((assignment) => (
                <tr
                  key={assignment.id}
                  className="border-b border-border last:border-0 transition hover:bg-background/60"
                >
                  <td className="whitespace-nowrap px-5 py-4 font-medium">
                    {assignment.studentName}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-text-muted">
                    {assignment.admissionNumber}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    {assignment.clubName}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-text-muted">
                    {assignment.appointedBy}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-text-muted">
                    {new Date(assignment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  </section>
)}

        {/* Event approvals */}
        {activeTab === "Event Approvals" && (
          <section className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-lg font-semibold">Event Approvals</h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
              Review event requests and manage approval decisions here
              once the event approval API is connected.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
