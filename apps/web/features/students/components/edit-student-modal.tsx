"use client";

import { useState } from "react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useDepartment } from "@/features/departments/api/department-query";
import type { Department } from "@/features/departments/api/department";
import { retryUnlessAuthError, useCoordinatorAssignments, useCreateCoordinator } from "@/features/coordinator/api/coordinator-query";
import { useClubsQuery } from "@/features/clubs/api/club-query";
import type { StudentListItem } from "@/features/students/api/student";
import { useUpdateStudent } from "@/features/students/api/student-query";
import { studentEditSchema } from "@/features/students/validation/student-management-schema";

export default function EditStudentModal({
  student,
  canChangeDepartment,
  canAssignCoordinator,
  departments = [],
  onClose,
  onUpdated,
}: {
  student: StudentListItem;
  canChangeDepartment: boolean;
  canAssignCoordinator: boolean;
  departments?: Department[];
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [name, setName] = useState(student.name);
  const [admissionNumber, setAdmissionNumber] = useState(student.admissionNumber);
  const [departmentId, setDepartmentId] = useState(String(student.departmentId));
  const [semester, setSemester] = useState(String(student.semester));
  const [phone, setPhone] = useState(student.phone ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateMutation = useUpdateStudent(student.id);
  const departmentQuery = useDepartment(canChangeDepartment);

  const clearFieldError = (field: string) => {
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
    updateMutation.reset();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = studentEditSchema.safeParse({
      name,
      admissionNumber,
      departmentId,
      semester,
      phone,
    });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") nextErrors[field] ??= issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    updateMutation.mutate(
      {
        name: parsed.data.name,
        admissionNumber: parsed.data.admissionNumber,
        ...(canChangeDepartment ? { departmentId: Number(parsed.data.departmentId) } : {}),
        semester: Number(parsed.data.semester),
        phone: parsed.data.phone || null,
      },
      { onSuccess: onUpdated },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="edit-student-title" className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
        <header className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 id="edit-student-title" className="text-xl font-semibold">Edit Student</h2>
            <p className="mt-1 text-sm text-text-muted">Update {student.name}&apos;s student profile.</p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} aria-label="Close edit student dialog">×</Button>
        </header>

        <div className="space-y-5 overflow-y-auto p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Student name" error={errors.name}>
              <Input value={name} onChange={(event) => { setName(event.target.value); clearFieldError("name"); }} maxLength={100} disabled={updateMutation.isPending} aria-invalid={!!errors.name} />
            </FormField>
            <FormField label="Admission number" error={errors.admissionNumber}>
              <Input value={admissionNumber} onChange={(event) => { setAdmissionNumber(event.target.value); clearFieldError("admissionNumber"); }} maxLength={30} disabled={updateMutation.isPending} aria-invalid={!!errors.admissionNumber} />
            </FormField>
            {canChangeDepartment && (
              <FormField label="Department" error={errors.departmentId}>
                <select
                  value={departmentId}
                  onChange={(event) => { setDepartmentId(event.target.value); clearFieldError("departmentId"); }}
                  disabled={departmentQuery.isPending || departmentQuery.isError || updateMutation.isPending}
                  aria-invalid={!!errors.departmentId}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 disabled:opacity-50"
                >
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>{department.name} ({department.code})</option>
                  ))}
                  {(departmentQuery.data ?? []).filter((department) => !departments.some((current) => current.id === department.id)).map((department) => (
                    <option key={department.id} value={department.id}>{department.name} ({department.code})</option>
                  ))}
                </select>
                {departmentQuery.isError && (
                  <span className="block text-xs font-normal text-red-600">
                    Unable to load departments. {departmentQuery.error instanceof Error ? departmentQuery.error.message : ""}{" "}
                    <button type="button" onClick={() => void departmentQuery.refetch()} className="underline">Try again</button>
                  </span>
                )}
              </FormField>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Semester" error={errors.semester}>
                <select value={semester} onChange={(event) => { setSemester(event.target.value); clearFieldError("semester"); }} disabled={updateMutation.isPending} aria-invalid={!!errors.semester} className="w-full rounded-lg border border-border bg-background px-3 py-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => <option key={item} value={item}>Semester {item}</option>)}
                </select>
              </FormField>
              <FormField label="Phone number (optional)" error={errors.phone}>
                <Input type="tel" value={phone} onChange={(event) => { setPhone(event.target.value); clearFieldError("phone"); }} placeholder="Include country code" disabled={updateMutation.isPending} aria-invalid={!!errors.phone} />
              </FormField>
            </div>

            {updateMutation.error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {updateMutation.error.message || "Unable to update student."}
              </p>
            )}
            <footer className="flex justify-end gap-3 border-t border-border pt-4">
              <Button variant="outline" onClick={onClose} disabled={updateMutation.isPending}>Cancel</Button>
              <Button type="submit" disabled={updateMutation.isPending || (canChangeDepartment && departmentQuery.isPending)}>
                {updateMutation.isPending ? "Saving..." : "Save changes"}
              </Button>
            </footer>
          </form>

          {canAssignCoordinator && (
            <CoordinatorAssignmentPanel student={student} />
          )}
        </div>
      </section>
    </div>
  );
}

function CoordinatorAssignmentPanel({ student }: { student: StudentListItem }) {
  const [clubId, setClubId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const clubsQuery = useClubsQuery(retryUnlessAuthError);
  const assignmentsQuery = useCoordinatorAssignments({
    search: student.admissionNumber,
    page: 1,
    limit: 100,
  });
  const createMutation = useCreateCoordinator();

  const assignments = (assignmentsQuery.data ?? []).filter(
    (assignment) => assignment.studentId === student.id,
  );
  const assignedClubIds = new Set(assignments.map((assignment) => assignment.clubId));
  const availableClubs = (clubsQuery.data ?? []).filter(
    (club) => club.departmentId === student.departmentId && !assignedClubIds.has(club.id),
  );

  return (
    <section className="space-y-3 rounded-xl border border-border p-4">
      <div>
        <h3 className="font-semibold">Club Coordinator Assignment</h3>
        <p className="mt-1 text-sm text-text-muted">
          Assign this student to a club in {student.departmentName}.
        </p>
      </div>

      {assignmentsQuery.isPending || clubsQuery.isPending ? (
        <p className="text-sm text-text-muted">Loading clubs and current assignments...</p>
      ) : assignmentsQuery.isError || clubsQuery.isError ? (
        <div role="alert" className="text-sm text-red-600">
          <p>Unable to load coordinator options.</p>
          <button
            type="button"
            onClick={() => { void assignmentsQuery.refetch(); void clubsQuery.refetch(); }}
            className="mt-1 underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {assignments.length > 0 && (
            <div className="text-sm text-text-muted">
              <p>Already assigned to:</p>
              <ul className="mt-1 list-inside list-disc">
                {assignments.map((assignment) => <li key={assignment.id}>{assignment.clubName}</li>)}
              </ul>
            </div>
          )}
          {availableClubs.length > 0 ? (
            <div className="flex flex-wrap items-end gap-3">
              <label className="min-w-56 flex-1 space-y-1.5 text-sm font-medium">
                <span>Club</span>
                <select value={clubId} onChange={(event) => { setClubId(event.target.value); setSuccessMessage(""); createMutation.reset(); }} disabled={createMutation.isPending} className="w-full rounded-lg border border-border bg-background px-3 py-2">
                  <option value="">Select a club</option>
                  {availableClubs.map((club) => <option key={club.id} value={club.id}>{club.name}</option>)}
                </select>
              </label>
              <Button
                type="button"
                disabled={!clubId || createMutation.isPending}
                onClick={() => createMutation.mutate(
                  { studentId: student.id, clubId: Number(clubId) },
                  { onSuccess: () => { setSuccessMessage("Coordinator assigned successfully."); setClubId(""); } },
                )}
              >
                {createMutation.isPending ? "Assigning..." : "Assign coordinator"}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-text-muted">No unassigned clubs are available in this student&apos;s department.</p>
          )}
          {createMutation.error && (
            <p role="alert" className="text-sm text-red-600">{createMutation.error.message || "Unable to assign coordinator."}</p>
          )}
          {successMessage && <p role="status" className="text-sm text-green-700">{successMessage}</p>}
        </>
      )}
    </section>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-sm font-medium">
      <span>{label}</span>
      {children}
      {error && <span className="block text-xs font-normal text-red-600">{error}</span>}
    </label>
  );
}
