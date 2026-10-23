
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  useHodDepartments,
  useHodStudents,
  useUpdateStudent,
  useDeleteStudent,
} from "../../hodQuery";

import {
  studentUpdateSchema,
  type StudentUpdateInput,
} from "@/validation/student-validation";

import type { HodStudent } from "@/lib/hod";

export default function HODStudentsPage() {
  const router = useRouter();

  // Better Auth session
  const {
    data: session,
    isPending: isSessionPending,
  } = authClient.useSession();

  // Search and filter states
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [semester, setSemester] = useState("");

  // Selected student and dialog states
  const [selectedStudent, setSelectedStudent] =
    useState<HodStudent | null>(null);

  const [editingStudent, setEditingStudent] =
    useState<HodStudent | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState<HodStudent | null>(null);

  // Messages
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // React Query mutations
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  // React Hook Form + Zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentUpdateInput>({
    resolver: zodResolver(studentUpdateSchema),
    defaultValues: {
      name: "",
      admissionNumber: "",
      departmentId: "",
      semester: "",
      phone: "",
    },
  });

  // Convert filters into numbers for the API
  const departmentId =
    selectedDepartment === ""
      ? undefined
      : Number(selectedDepartment);

  const semesterNumber =
    semester === ""
      ? undefined
      : Number(semester);

  // Fetch departments
  const {
    data: departments = [],
    isPending: isDepartmentsPending,
    isError: isDepartmentsError,
    refetch: refetchDepartments,
  } = useHodDepartments(!!session && !isSessionPending);

  // Fetch students
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

  // Search students by name, email, admission number or department
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

  // Start editing a student
  const handleEditClick = (student: HodStudent) => {
    setFormError("");
    setSuccessMessage("");
    setEditingStudent(student);

    reset({
      name: student.name,
      admissionNumber: student.admissionNumber,
      departmentId:
        student.departmentId != null
          ? String(student.departmentId)
          : "",
      semester: String(student.semester),
      phone: student.phone ?? "",
    });
  };

  // Update student using React Hook Form and React Query
  const onUpdateStudent = async (data: StudentUpdateInput) => {
    if (!editingStudent) {
      return;
    }

    setFormError("");
    setSuccessMessage("");

    try {
      await updateMutation.mutateAsync({
        studentId: Number(editingStudent.id),
        data,
      });

      // Update the details panel if this student was selected
      if (selectedStudent?.id === editingStudent.id) {
        setSelectedStudent({
          ...selectedStudent,
          name: data.name.trim(),
          admissionNumber: data.admissionNumber.trim(),
          semester: Number(data.semester),
          phone: data.phone.trim(),
        });
      }

      setEditingStudent(null);
      reset();

      setSuccessMessage("Student details updated successfully.");
    } catch (error: unknown) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to update student. Please try again.",
      );
    }
  };

  // Open the delete confirmation dialog
  const handleDeleteClick = (student: HodStudent) => {
    setDeleteError("");
    setSuccessMessage("");
    setShowDeleteConfirm(student);
  };

  // Delete student using React Query
  const handleDeleteStudent = async () => {
    if (!showDeleteConfirm) {
      return;
    }

    setDeleteError("");
    setSuccessMessage("");

    try {
      await deleteMutation.mutateAsync(
        Number(showDeleteConfirm.id),
      );

      if (selectedStudent?.id === showDeleteConfirm.id) {
        setSelectedStudent(null);
      }

      setShowDeleteConfirm(null);

      setSuccessMessage("Student deleted successfully.");
    } catch (error: unknown) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Unable to delete student. Please try again.",
      );
    }
  };

  // Loading state while Better Auth checks the session
  if (isSessionPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-text-muted">
          Checking your session...
        </p>
      </main>
    );
  }

  // Ask unauthenticated users to sign in
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <section className="mb-8">
          <h2 className="mt-2 text-3xl font-bold">
            Student Directory
          </h2>

          <p className="mt-2 text-sm text-text-muted">
            Search students and filter them by department and semester.
          </p>
        </section>

        {/* Success message */}
        {successMessage && (
          <div
            role="status"
            className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700"
          >
            <div className="flex items-center justify-between gap-3">
              <p>{successMessage}</p>

              <button
                type="button"
                onClick={() => setSuccessMessage("")}
                className="font-medium underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Search and filters */}
        <section className="mb-6 rounded-xl border border-border bg-surface p-5">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
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
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Name, email or admission number"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Department filter */}
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

            {/* Semester filter */}
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

        {/* Students table */}
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
                    <th className="px-4 py-3 font-semibold">
                      Student
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Admission Number
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Department
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Semester
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Actions
                    </th>
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
                          <p className="font-medium">
                            {student.name}
                          </p>

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
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedStudent(student)
                              }
                              className="font-medium text-primary underline underline-offset-4"
                            >
                              View
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEditClick(student)}
                              className="rounded-lg border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteClick(student)}
                              className="rounded-lg border border-red-600 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Student details */}
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
                <p className="text-sm text-text-muted">
                  Semester
                </p>

                <p className="mt-1 font-medium">
                  {selectedStudent.semester}
                </p>
              </div>

              <div>
                <p className="text-sm text-text-muted">
                  Student ID
                </p>

                <p className="mt-1 font-medium">
                  {selectedStudent.id}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Edit student dialog */}
        {editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-student-title"
              className="my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-surface p-6 shadow-xl"
            >
              <h3
                id="edit-student-title"
                className="text-xl font-bold"
              >
                Edit Student
              </h3>

              <p className="mt-2 text-sm text-text-muted">
                Update the students details and save your changes.
              </p>

              <form
                onSubmit={handleSubmit(onUpdateStudent)}
                className="mt-5 space-y-4"
              >
                {/* Student name */}
                <div>
                  <label
                    htmlFor="edit-name"
                    className="mb-1 block text-sm font-medium"
                  >
                    Student Name
                  </label>

                  <input
                    id="edit-name"
                    {...register("name")}
                    aria-invalid={!!errors.name}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  />

                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Admission number */}
                <div>
                  <label
                    htmlFor="edit-admission"
                    className="mb-1 block text-sm font-medium"
                  >
                    Admission Number
                  </label>

                  <input
                    id="edit-admission"
                    {...register("admissionNumber")}
                    aria-invalid={!!errors.admissionNumber}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  />

                  {errors.admissionNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.admissionNumber.message}
                    </p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label
                    htmlFor="edit-department"
                    className="mb-1 block text-sm font-medium"
                  >
                    Department
                  </label>

                  <select
                    id="edit-department"
                    {...register("departmentId")}
                    aria-invalid={!!errors.departmentId}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  >
                    <option value="">Select department</option>

                    {departments.map((department) => (
                      <option
                        key={department.id}
                        value={department.id}
                      >
                        {department.name} ({department.code})
                      </option>
                    ))}
                  </select>

                  {errors.departmentId && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.departmentId.message}
                    </p>
                  )}
                </div>

                {/* Semester */}
                <div>
                  <label
                    htmlFor="edit-semester"
                    className="mb-1 block text-sm font-medium"
                  >
                    Semester
                  </label>

                  <select
                    id="edit-semester"
                    {...register("semester")}
                    aria-invalid={!!errors.semester}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  >
                    <option value="">Select semester</option>

                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                      <option key={number} value={number}>
                        Semester {number}
                      </option>
                    ))}
                  </select>

                  {errors.semester && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.semester.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="edit-phone"
                    className="mb-1 block text-sm font-medium"
                  >
                    Phone
                  </label>

                  <input
                    id="edit-phone"
                    type="tel"
                    {...register("phone")}
                    aria-invalid={!!errors.phone}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  />

                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* API error */}
                {formError && (
                  <p role="alert" className="text-sm text-red-500">
                    {formError}
                  </p>
                )}

                {/* Form buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    disabled={isSubmitting || updateMutation.isPending}
                    onClick={() => {
                      setEditingStudent(null);
                      setFormError("");
                      reset();
                    }}
                    className="rounded-lg border border-border px-4 py-2 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting || updateMutation.isPending
                    }
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
                  >
                    {isSubmitting || updateMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        {/* Delete confirmation dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-student-title"
              className="w-full max-w-md rounded-xl bg-surface p-6 shadow-xl"
            >
              <h3
                id="delete-student-title"
                className="text-xl font-bold"
              >
                Delete Student?
              </h3>

              <p className="mt-3 text-sm text-text-muted">
                Are you sure you want to delete{" "}
                <strong>{showDeleteConfirm.name}</strong>?
              </p>

              <p className="mt-2 text-sm text-text-muted">
                This action will remove the student from the active
                student directory.
              </p>

              {deleteError && (
                <p role="alert" className="mt-3 text-sm text-red-500">
                  {deleteError}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    setShowDeleteConfirm(null);
                    setDeleteError("");
                  }}
                  className="rounded-lg border border-border px-4 py-2 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={() => void handleDeleteStudent()}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"
                >
                  {deleteMutation.isPending
                    ? "Deleting..."
                    : "Confirm Delete"}
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
