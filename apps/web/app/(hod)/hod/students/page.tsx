"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  useHodDepartments,
  useHodStudents,
} from "../../hodQuery";
import type { HodStudent } from "@/lib/hod";

export default function HODStudentsPage() {
  const router = useRouter();

  const {
    data: session,
    isPending: isSessionPending,
  } = authClient.useSession();

  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<HodStudent | null>(null);

  const departmentId =
    selectedDepartment === ""
      ? undefined
      : Number(selectedDepartment);

  const semesterNumber =
    semester === ""
      ? undefined
      : Number(semester);

  const {
    data: departments = [],
    isPending: isDepartmentsPending,
    isError: isDepartmentsError,
    refetch: refetchDepartments,
  } = useHodDepartments(!!session && !isSessionPending);

  const {
    data: students = [],
    isPending: isStudentsPending,
    isError: isStudentsError,
    error: studentsError,
    refetch: refetchStudents,
  } = useHodStudents(
    departmentId,
    semesterNumber,
    !!session && !isSessionPending,
  );

  const filteredStudents = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return students;
    }

    return students.filter((student) =>
      [
        student.name,
        student.email,
        student.admissionNumber,
        student.departmentName,
      ].some((value) =>
        value?.toLowerCase().includes(searchText),
      ),
    );
  }, [students, search]);

  if (isSessionPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-text-muted">
          Checking your session...
        </p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-text-muted">
            Please sign in to view the HOD student directory.
          </p>

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
            onClick={() => router.push("/hod/dashboard")}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-background"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <p className="text-sm font-medium text-text-muted">
            HOD WORKSPACE
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Student Directory
          </h2>

          <p className="mt-2 text-sm text-text-muted">
            Search students and filter them by department and semester.
          </p>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-text-muted">
              Students Retrieved
            </p>
            <p className="mt-2 text-3xl font-bold">
              {students.length}
            </p>
          </article>

          <article className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-text-muted">
              Matching Students
            </p>
            <p className="mt-2 text-3xl font-bold">
              {filteredStudents.length}
            </p>
          </article>
        </section>

        <section className="mb-6 rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-4 font-semibold">
            Search and Filters
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="student-search"
                className="mb-2 block text-sm font-medium"
              >
                Search Students
              </label>

              <input
                id="student-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, email or admission number"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

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
                onChange={(event) => {
                  setSelectedDepartment(event.target.value);
                  setSelectedStudent(null);
                }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
              >
                <option value="">All Departments</option>

                {departments.map((department) => (
                  <option
                    key={department.id}
                    value={department.id}
                  >
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
                onChange={(event) => {
                  setSemester(event.target.value);
                  setSelectedStudent(null);
                }}
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

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedDepartment("");
              setSemester("");
              setSelectedStudent(null);
            }}
            className="mt-4 rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-background"
          >
            Clear Filters
          </button>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
            <h3 className="font-semibold">Students</h3>
            <p className="text-sm text-text-muted">
              {filteredStudents.length} student(s) found
            </p>
          </div>

          {isStudentsPending ? (
            <div className="p-8 text-center text-text-muted">
              Loading students...
            </div>
          ) : isStudentsError ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-500">
                {studentsError instanceof Error
                  ? studentsError.message
                  : "Unable to load students."}
              </p>

              <button
                type="button"
                onClick={() => void refetchStudents()}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-background">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Student</th>
                    <th className="px-4 py-3 font-semibold">
                      Admission Number
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Department
                    </th>
                    <th className="px-4 py-3 font-semibold">Semester</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-text-muted"
                      >
                        No students match your search or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className={`border-b border-border last:border-0 ${
                          selectedStudent?.id === student.id
                            ? "bg-background"
                            : "hover:bg-background"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium">{student.name}</p>
                          <p className="mt-1 text-xs text-text-muted">
                            {student.email}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          {student.admissionNumber}
                        </td>

                        <td className="px-4 py-3">
                          {student.departmentName}
                        </td>

                        <td className="px-4 py-3">
                          {student.semester}
                        </td>

                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setSelectedStudent(student)}
                            className="font-medium text-primary underline underline-offset-4"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selectedStudent && (
          <section className="mt-6 rounded-xl border border-border bg-surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-text-muted">
                  STUDENT DETAILS
                </p>
                <h3 className="mt-1 text-xl font-bold">
                  {selectedStudent.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-background"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm text-text-muted">
                  Admission Number
                </p>
                <p className="mt-1 font-medium">
                  {selectedStudent.admissionNumber}
                </p>
              </div>

              <div>
                <p className="text-sm text-text-muted">Email</p>
                <p className="mt-1 break-all font-medium">
                  {selectedStudent.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-text-muted">Phone</p>
                <p className="mt-1 font-medium">
                  {selectedStudent.phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-text-muted">
                  Department
                </p>
                <p className="mt-1 font-medium">
                  {selectedStudent.departmentName}
                  {selectedStudent.departmentCode
                    ? ` (${selectedStudent.departmentCode})`
                    : ""}
                </p>
              </div>

              <div>
                <p className="text-sm text-text-muted">Semester</p>
                <p className="mt-1 font-medium">
                  {selectedStudent.semester}
                </p>
              </div>

              <div>
                <p className="text-sm text-text-muted">Student ID</p>
                <p className="mt-1 font-medium">
                  {selectedStudent.id}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}