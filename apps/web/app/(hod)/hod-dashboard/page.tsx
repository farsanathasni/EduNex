"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ElementType } from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  GraduationCap,
  RefreshCw,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";

import {
  useHodDashboard,
  useHodDepartments,
  useHodStudents,
} from "../hodQuery";

import {
  useCoordinatorAssignments,
  useCreateCoordinator,
  useClubs
} from "../coordinatorsQuery";

import {
  coordinatorSchema,
  type CoordinatorFormInput,
} from "@/validation/coordinator-schema";

type Section =
  | "dashboard"
  | "students"
  | "coordinators"
  | "approvals";

type SidebarItemProps = {
  icon: ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
};

function SidebarItem({
  icon: Icon,
  label,
  active,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
        active
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon size={19} />
      <span>{label}</span>
    </button>
  );
}

type SummaryCardProps = {
  title: string;
  value: string | number;
  icon: ElementType;
  description?: string;
};

function SummaryCard({
  title,
  value,
  icon: Icon,
  description,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {value}
          </h2>

          {description && (
            <p className="mt-1 text-xs text-gray-500">
              {description}
            </p>
          )}
        </div>

        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function LoadingMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 py-8 text-sm text-gray-500">
      <RefreshCw size={17} className="animate-spin" />
      {message}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
      {message}
    </div>
  );
}

function EmptyMessage({ message }: { message: string }) {
  return (
    <div className="py-8 text-center text-sm text-gray-500">
      {message}
    </div>
  );
}

export default function HodDashboardPage() {
  const router = useRouter();
  const clubsQuery = useClubs();

  const [activeSection, setActiveSection] =
    useState<Section>("dashboard");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [departmentId, setDepartmentId] = useState<number | undefined>();
  const [semester, setSemester] = useState<number | undefined>();

  const sessionQuery = authClient.useSession();

  const dashboardQuery = useHodDashboard();

  const studentsTabEnabled =
    !sessionQuery.isPending &&
    !!sessionQuery.data?.user &&
    (activeSection === "students" ||
      activeSection === "coordinators");

  const departmentsQuery = useHodDepartments(
    studentsTabEnabled
  );

  const studentsQuery = useHodStudents(
    departmentId,
    semester,
    studentsTabEnabled
  );

  const coordinatorsQuery = useCoordinatorAssignments();

  const createCoordinatorMutation = useCreateCoordinator();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CoordinatorFormInput>({
    resolver: zodResolver(coordinatorSchema),
    defaultValues: {
      studentId: 0,
      clubId: 0,
    },
  });

  useEffect(() => {
    if (!sessionQuery.isPending && !sessionQuery.data?.user) {
      router.replace("/hod-login");
    }
  }, [
    sessionQuery.isPending,
    sessionQuery.data,
    router,
  ]);

  const onAppointCoordinator = async (
    values: CoordinatorFormInput
  ) => {
    try {
      await createCoordinatorMutation.mutateAsync({
        studentId: values.studentId,
        clubId: values.clubId,
      });

      reset();

      await coordinatorsQuery.refetch();
    } catch {
      // The mutation error is displayed in the form.
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/hod-login");
  };

  if (sessionQuery.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingMessage message="Checking your session..." />
      </div>
    );
  }

  if (!sessionQuery.data?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingMessage message="Redirecting to login..." />
      </div>
    );
  }

  const dashboard = dashboardQuery.data;
  const students = studentsQuery.data ?? [];
  const departments = departmentsQuery.data ?? [];
  const assignments = coordinatorsQuery.data ?? [];

  const sectionTitle: Record<Section, string> = {
    dashboard: "Dashboard",
    students: "Students",
    coordinators: "Coordinator Management",
    approvals: "Event Approvals",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-blue-700" size={27} />
          <span className="text-lg font-bold text-gray-900">
            EduNex
          </span>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <div className="flex min-h-screen">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          <div className="flex h-20 items-center gap-3 border-b border-gray-100 px-6">
            <GraduationCap size={32} className="text-blue-700" />

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                EduNex
              </h1>
              <p className="text-xs text-gray-500">
                College Management
              </p>
            </div>
          </div>

          <div className="px-5 py-5">
            <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              HOD Workspace
            </p>

            <nav className="space-y-1">
              <SidebarItem
                icon={LayoutDashboard}
                label="Dashboard"
                active={activeSection === "dashboard"}
                onClick={() => {
                  setActiveSection("dashboard");
                  setSidebarOpen(false);
                }}
              />

              <SidebarItem
                icon={Users}
                label="Students"
                active={activeSection === "students"}
                onClick={() => {
                  setActiveSection("students");
                  setSidebarOpen(false);
                }}
              />

              <SidebarItem
                icon={UserCheck}
                label="Coordinators"
                active={activeSection === "coordinators"}
                onClick={() => {
                  setActiveSection("coordinators");
                  setSidebarOpen(false);
                }}
              />

              <SidebarItem
                icon={CalendarCheck}
                label="Event Approvals"
                active={activeSection === "approvals"}
                onClick={() => {
                  setActiveSection("approvals");
                  setSidebarOpen(false);
                }}
              />
            </nav>
          </div>

          <div className="mt-auto border-t border-gray-100 p-5">
            <div className="mb-4 rounded-lg bg-blue-50 p-3">
              <p className="text-sm font-semibold text-blue-900">
                Head of Department
              </p>
              <p className="mt-1 truncate text-xs text-blue-700">
                {sessionQuery.data.user.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <header className="hidden items-center justify-between border-b border-gray-200 bg-white px-8 py-5 lg:flex">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {sectionTitle[activeSection]}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your department through EduNex.
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">
                {sessionQuery.data.user.name ||
                  sessionQuery.data.user.email}
              </p>
              <p className="text-xs text-gray-500">
                HOD Account
              </p>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Dashboard */}
            {activeSection === "dashboard" && (
              <section>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Welcome back!
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Here is an overview of your department.
                  </p>
                </div>

                {dashboardQuery.isPending ? (
                  <LoadingMessage message="Loading dashboard..." />
                ) : dashboardQuery.isError ? (
                  <ErrorMessage message="Unable to load dashboard information. Please try again." />
                ) : (
                  <>
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
  <SummaryCard
    title="Total Students"
    value={dashboard?.totalStudents ?? "—"}
    icon={Users}
    description="Across all departments"
  />

  <SummaryCard
    title="Total Staff"
    value={dashboard?.totalStaff ?? "—"}
    icon={GraduationCap}
    description="Registered staff members"
  />

  <SummaryCard
    title="Total Coordinators"
    value={dashboard?.totalCoordinators ?? "—"}
    icon={UserCheck}
    description="Coordinator assignments"
  />

  <SummaryCard
    title="Pending Approvals"
    value={dashboard?.pendingApprovals ?? "—"}
    icon={CalendarCheck}
    description="Events awaiting approval"
  />
</div>

                    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Quick Actions
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Choose a section to manage your department.
                      </p>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveSection("students")
                          }
                          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          View Students
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveSection("coordinators")
                          }
                          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Manage Coordinators
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveSection("approvals")
                          }
                          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Event Approvals
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </section>
            )}

            {/* Students */}
            {activeSection === "students" && (
              <section>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Students
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    View students and filter by department and semester.
                  </p>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="departmentFilter"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Department
                    </label>

                    <select
                      id="departmentFilter"
                      value={departmentId ?? ""}
                      onChange={(event) => {
                        const value = event.target.value;

                        setDepartmentId(
                          value ? Number(value) : undefined
                        );
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">All departments</option>

                      {departments.map((department) => (
                        <option
                          key={department.id}
                          value={department.id}
                        >
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="semesterFilter"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Semester
                    </label>

                    <select
                      id="semesterFilter"
                      value={semester ?? ""}
                      onChange={(event) => {
                        const value = event.target.value;

                        setSemester(
                          value ? Number(value) : undefined
                        );
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">All semesters</option>

                      {[1, 2, 3, 4, 5, 6].map((number) => (
                        <option key={number} value={number}>
                          Semester {number}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    <h3 className="font-semibold text-gray-900">
                      Student List
                    </h3>

                    <span className="text-sm text-gray-500">
                      {students.length} students
                    </span>
                  </div>

                  {departmentsQuery.isError ? (
                    <div className="p-5">
                      <ErrorMessage message="Unable to load departments." />
                    </div>
                  ) : studentsQuery.isPending ? (
                    <div className="p-5">
                      <LoadingMessage message="Loading students..." />
                    </div>
                  ) : studentsQuery.isError ? (
                    <div className="p-5">
                      <ErrorMessage message="Unable to load students. Please try again." />
                    </div>
                  ) : students.length === 0 ? (
                    <EmptyMessage message="No students found for the selected filters." />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                          <tr>
                            <th className="px-5 py-3 font-semibold">
                              Student
                            </th>
                            <th className="px-5 py-3 font-semibold">
                              Admission No.
                            </th>
                            <th className="px-5 py-3 font-semibold">
                              Department
                            </th>
                            <th className="px-5 py-3 font-semibold">
                              Semester
                            </th>
                            <th className="px-5 py-3 font-semibold">
                              Email
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                          {students.map((student) => (
                            <tr
                              key={student.id}
                              className="hover:bg-gray-50"
                            >
                              <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                                {student.name}
                              </td>

                              <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                                {student.admissionNumber}
                              </td>

                              <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                                {student.departmentName}
                              </td>

                              <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                                {student.semester}
                              </td>

                              <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                                {student.email}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Coordinator management */}
            {activeSection === "coordinators" && (
              <section>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Coordinator Management
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Appoint an existing student as a club coordinator.
                  </p>
                </div>

                <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Appoint Coordinator
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Select a student and enter the club ID for the assignment.
                  </p>

                  <form
                    onSubmit={handleSubmit(onAppointCoordinator)}
                    className="mt-5 space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="studentId"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Student
                      </label>

                      <select
                        id="studentId"
                        {...register("studentId", {
                          valueAsNumber: true,
                        })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value={0}>
                          Select a student
                        </option>

                        {students.map((student) => (
                          <option
                            key={student.id}
                            value={student.id}
                          >
                            {student.name} — {student.admissionNumber}
                          </option>
                        ))}
                      </select>

                      {errors.studentId && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.studentId.message}
                        </p>
                      )}
                    </div>

<div>
  <label
    htmlFor="clubId"
    className="mb-2 block text-sm font-medium text-gray-700"
  >
    Club
  </label>

  <select
    id="clubId"
    {...register("clubId", {
      valueAsNumber: true,
    })}
    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  >
    <option value={0}>Select a club</option>

    {clubsQuery.data?.map((club) => (
      <option key={club.id} value={club.id}>
        {club.name}
      </option>
    ))}
  </select>

  {errors.clubId && (
    <p className="mt-1 text-sm text-red-600">
      {errors.clubId.message}
    </p>
  )}
</div>

                    {createCoordinatorMutation.isError && (
                      <ErrorMessage
                        message={
                          createCoordinatorMutation.error instanceof Error
                            ? createCoordinatorMutation.error.message
                            : "Unable to appoint the coordinator."
                        }
                      />
                    )}

                    {createCoordinatorMutation.isSuccess && (
                      <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        Coordinator appointed successfully.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={createCoordinatorMutation.isPending}
                      className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {createCoordinatorMutation.isPending
                        ? "Appointing..."
                        : "Appoint Coordinator"}
                    </button>
                  </form>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    <h3 className="font-semibold text-gray-900">
                      Coordinator Assignments
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        coordinatorsQuery.refetch()
                      }
                      className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      <RefreshCw size={15} />
                      Refresh
                    </button>
                  </div>

                  {coordinatorsQuery.isPending ? (
                    <div className="p-5">
                      <LoadingMessage message="Loading coordinator assignments..." />
                    </div>
                  ) : coordinatorsQuery.isError ? (
                    <div className="p-5">
                      <ErrorMessage message="Unable to load coordinator assignments." />
                    </div>
                  ) : assignments.length === 0 ? (
                    <EmptyMessage message="No coordinator assignments found." />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                          <tr>
                            <th className="px-5 py-3 font-semibold">
                              Student
                            </th>
                            <th className="px-5 py-3 font-semibold">
                              Club
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                          {assignments.map((assignment, index) => (
                            <tr
                              key={`${assignment.studentId}-${assignment.clubId}-${index}`}
                              className="hover:bg-gray-50"
                            >
                              <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                                {assignment.studentName}
                              </td>

                              <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                                {assignment.clubName}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Event approvals */}
            {activeSection === "approvals" && (
              <section>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Event Approvals
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Review and manage event approval requests.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                  <CalendarCheck
                    size={42}
                    className="mx-auto text-blue-600"
                  />

                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    Event Approvals
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                    This section is ready for the event approval
                    functionality to be connected.
                  </p>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}