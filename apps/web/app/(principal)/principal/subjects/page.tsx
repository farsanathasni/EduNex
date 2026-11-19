"use client";

import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import { useDepartment } from "@/features/departments/api/department-query";
import {
  useAssignSubjectFacultyMutation,
  useAvailableFacultyQuery,
  useCreateSubjectMutation,
  useDeleteSubjectMutation,
  useRemoveSubjectFacultyMutation,
  useSubjectFacultyQuery,
  useSubjectsQuery,
  useUpdateSubjectMutation,
} from "@/features/subjects/api/subjects-query";
import type { Subject } from "@/features/subjects/api/subjects";
import { useAccess } from "@/lib/navigation/access";

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const msg = (error.response?.data as { message?: string } | undefined)?.message;
    if (error.response?.status === 401) return "Please sign in to continue.";
    if (typeof msg === "string" && msg) return msg;
    if (error.response?.status === 403) return "You don't have access.";
  }
  return error instanceof Error ? error.message : "Something went wrong.";
}

function InlineBanner({
  message,
  tone = "error",
}: {
  message: string;
  tone?: "error" | "info";
}) {
  return (
    <div
      role="alert"
      className={`rounded-lg border px-4 py-3 text-sm ${
        tone === "error"
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-border bg-background text-text-muted"
      }`}
    >
      {message}
    </div>
  );
}

function SubjectFormDialog({
  open,
  mode,
  initial,
  departments,
  defaultDepartmentId,
  errorMessage,
  saving,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Subject | null;
  departments: { id: number; name: string; code: string }[];
  defaultDepartmentId?: number;
  errorMessage: string | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: {
    name: string;
    code: string;
    semester: number;
    departmentId: number;
  }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [semester, setSemester] = useState(String(initial?.semester ?? ""));
  const [departmentId, setDepartmentId] = useState(
    String(initial?.departmentId ?? defaultDepartmentId ?? ""),
  );

  if (!open) return null;

  const sem = Number(semester);
  const dept = Number(departmentId);
  const canSubmit =
    name.trim().length >= 2 &&
    code.trim().length >= 2 &&
    Number.isFinite(sem) &&
    sem >= 1 &&
    sem <= 12 &&
    Number.isInteger(dept) &&
    dept > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="principal-subject-form-title"
        className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-xl"
      >
        <h2 id="principal-subject-form-title" className="text-xl font-semibold">
          {mode === "create" ? "Create subject" : "Edit subject"}
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          {mode === "create"
            ? "Add a subject to the selected department."
            : "Update subject details and department."}
        </p>

        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            onSubmit({
              name: name.trim(),
              code: code.trim(),
              semester: sem,
              departmentId: dept,
            });
          }}
        >
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Name</span>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Data Structures"
              required
              minLength={2}
              maxLength={150}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Code</span>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. CS201"
              required
              minLength={2}
              maxLength={30}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Semester</span>
            <Input
              type="number"
              min={1}
              max={12}
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="1 - 12"
              required
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Department</span>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary"
              required
            >
              <option value="">Select department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name} ({department.code})
                </option>
              ))}
            </select>
          </label>

          {errorMessage && <InlineBanner message={errorMessage} />}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit || saving}>
              {saving ? "Saving..." : mode === "create" ? "Create" : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteSubjectDialog({
  open,
  subject,
  errorMessage,
  deleting,
  onClose,
  onConfirm,
}: {
  open: boolean;
  subject: Subject | null;
  errorMessage: string | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open || !subject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="principal-delete-subject-title"
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl"
      >
        <h2 id="principal-delete-subject-title" className="text-xl font-semibold">
          Delete subject?
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          This will permanently delete <span className="font-medium text-text">{subject.name}</span>{" "}
          ({subject.code}). This cannot be undone.
        </p>

        {errorMessage && <div className="mt-4"><InlineBanner message={errorMessage} /></div>}

        <div className="mt-5 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function FacultyDialog({
  open,
  subject,
  canAssign,
  onClose,
}: {
  open: boolean;
  subject: Subject | null;
  canAssign: boolean;
  onClose: () => void;
}) {
  const [assignedSearch, setAssignedSearch] = useState("");
  const [availableSearch, setAvailableSearch] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const assignedParams = useMemo(
    () => ({ search: assignedSearch.trim() || undefined, page: 1, limit: 20 }),
    [assignedSearch],
  );
  const availableParams = useMemo(
    () => ({ search: availableSearch.trim() || undefined, page: 1, limit: 20 }),
    [availableSearch],
  );

  const assignedQuery = useSubjectFacultyQuery(subject?.id ?? null, assignedParams, open);
  const availableQuery = useAvailableFacultyQuery(subject?.id ?? null, availableParams, open);
  const assignMutation = useAssignSubjectFacultyMutation();
  const removeMutation = useRemoveSubjectFacultyMutation();

  if (!open || !subject) return null;

  const busy = assignMutation.isPending || removeMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="principal-faculty-dialog-title"
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <h2 id="principal-faculty-dialog-title" className="text-xl font-semibold">
              Faculty assignments
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {subject.name} ({subject.code}) · {subject.departmentName} · Semester {subject.semester}
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {actionError && <InlineBanner message={actionError} />}

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">Assigned faculty</h3>
                <span className="text-xs text-text-muted">
                  {assignedQuery.data?.pagination.total ?? 0}
                </span>
              </div>
              <div className="mt-3">
                <Input
                  type="search"
                  value={assignedSearch}
                  onChange={(e) => setAssignedSearch(e.target.value)}
                  placeholder="Search assigned faculty"
                  aria-label="Search assigned faculty"
                />
              </div>
              <div className="mt-3 space-y-2">
                {assignedQuery.isLoading ? (
                  <p className="text-sm text-text-muted">Loading...</p>
                ) : assignedQuery.isError ? (
                  <InlineBanner message={getErrorMessage(assignedQuery.error)} />
                ) : (assignedQuery.data?.faculty.length ?? 0) === 0 ? (
                  <p className="text-sm text-text-muted">No faculty assigned yet.</p>
                ) : (
                  assignedQuery.data!.faculty.map((f) => (
                    <div
                      key={f.staffId}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{f.name}</p>
                        <p className="truncate text-xs text-text-muted">
                          {f.employeeId} · {f.email}
                        </p>
                      </div>
                      {canAssign && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={busy}
                          onClick={async () => {
                            setActionError(null);
                            try {
                              await removeMutation.mutateAsync({
                                subjectId: subject.id,
                                staffId: f.staffId,
                              });
                            } catch (e) {
                              setActionError(getErrorMessage(e));
                            }
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">Available faculty</h3>
                <span className="text-xs text-text-muted">
                  {availableQuery.data?.pagination.total ?? 0}
                </span>
              </div>
              <div className="mt-3">
                <Input
                  type="search"
                  value={availableSearch}
                  onChange={(e) => setAvailableSearch(e.target.value)}
                  placeholder="Search available faculty"
                  aria-label="Search available faculty"
                />
              </div>
              <div className="mt-3 space-y-2">
                {availableQuery.isLoading ? (
                  <p className="text-sm text-text-muted">Loading...</p>
                ) : availableQuery.isError ? (
                  <InlineBanner message={getErrorMessage(availableQuery.error)} />
                ) : (availableQuery.data?.faculty.length ?? 0) === 0 ? (
                  <p className="text-sm text-text-muted">No available faculty found.</p>
                ) : (
                  availableQuery.data!.faculty.map((f) => (
                    <div
                      key={f.staffId}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{f.name}</p>
                        <p className="truncate text-xs text-text-muted">
                          {f.employeeId} · {f.email}
                        </p>
                      </div>
                      {canAssign && (
                        <Button
                          type="button"
                          size="sm"
                          disabled={busy}
                          onClick={async () => {
                            setActionError(null);
                            try {
                              await assignMutation.mutateAsync({
                                subjectId: subject.id,
                                staffId: f.staffId,
                              });
                            } catch (e) {
                              setActionError(getErrorMessage(e));
                            }
                          }}
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrincipalSubjectsPage() {
  const { can, isPending: accessPending } = useAccess();

  const canView = can("subject", "view");
  const canCreate = can("subject", "create");
  const canUpdate = can("subject", "update");
  const canDelete = can("subject", "delete");
  const canAssign = can("subject", "assign");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [semester, setSemester] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      semester: semester ? Number(semester) : undefined,
      departmentId: departmentId ? Number(departmentId) : undefined,
      page,
      limit: 10,
    }),
    [debouncedSearch, semester, departmentId, page],
  );

  const {
    data: departments,
    isError: departmentsError,
    error: departmentsErrorValue,
  } = useDepartment(canView);

  const { data, isLoading, isError, error, refetch } = useSubjectsQuery(
    queryParams,
    canView,
  );

  const createMutation = useCreateSubjectMutation();
  const updateMutation = useUpdateSubjectMutation();
  const deleteMutation = useDeleteSubjectMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Subject | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [facultyOpen, setFacultyOpen] = useState(false);
  const [facultySubject, setFacultySubject] = useState<Subject | null>(null);

  if (accessPending) {
    return <p className="text-text-muted">Checking access...</p>;
  }

  if (!canView) {
    return (
      <Card className="p-6">
        <h1 className="text-xl font-semibold">Subjects</h1>
        <p className="mt-2 text-text-muted">You don&apos;t have access.</p>
      </Card>
    );
  }

  const subjects = data?.subjects ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subjects</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage subjects and faculty assignments across departments.
          </p>
        </div>
        {canCreate && (
          <Button
            disabled={!departmentId}
            title={!departmentId ? "Select a department first" : undefined}
            onClick={() => {
              setFormMode("create");
              setEditing(null);
              setFormError(null);
              setFormOpen(true);
            }}
          >
            + Create subject
          </Button>
        )}
      </div>

      {departmentsError && (
        <InlineBanner message={getErrorMessage(departmentsErrorValue)} />
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or code"
          aria-label="Search subjects"
          className="sm:max-w-sm"
        />
        <select
          value={semester}
          onChange={(e) => {
            setSemester(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by semester"
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary sm:w-44"
        >
          <option value="">All semesters</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((s) => (
            <option key={s} value={s}>
              Semester {s}
            </option>
          ))}
        </select>
        <select
          value={departmentId}
          onChange={(e) => {
            setDepartmentId(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by department"
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary sm:w-64"
        >
          <option value="">All departments</option>
          {(departments ?? []).map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-border bg-surface"
            />
          ))}
        </div>
      ) : isError ? (
        <Card className="p-6">
          <InlineBanner message={getErrorMessage(error)} />
          <div className="mt-4">
            <Button onClick={() => void refetch()}>Try again</Button>
          </div>
        </Card>
      ) : subjects.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="font-medium">No subjects found</p>
          <p className="mt-2 text-sm text-text-muted">
            {debouncedSearch || semester || departmentId
              ? "Try a different search or filter."
              : "Select a department and create a subject to get started."}
          </p>
        </Card>
      ) : (
        <>
          <section className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full min-w-[840px] text-left text-sm">
              <thead className="border-b border-border bg-background text-xs uppercase text-text-muted">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Code</th>
                  <th className="p-4">Semester</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Faculty</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id} className="border-b border-border last:border-0">
                    <td className="p-4 font-medium">{subject.name}</td>
                    <td className="p-4 text-text-muted">{subject.code}</td>
                    <td className="p-4">{subject.semester}</td>
                    <td className="p-4">{subject.departmentName}</td>
                    <td className="p-4">{subject.facultyCount}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {canAssign && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setFacultySubject(subject);
                              setFacultyOpen(true);
                            }}
                          >
                            Faculty
                          </Button>
                        )}
                        {canUpdate && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setFormMode("edit");
                              setEditing(subject);
                              setFormError(null);
                              setFormOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setDeletingSubject(subject);
                              setDeleteError(null);
                              setDeleteOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-text-muted">
                Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {formOpen && (
        <SubjectFormDialog
          open={formOpen}
          mode={formMode}
          initial={editing}
          departments={departments ?? []}
          defaultDepartmentId={departmentId ? Number(departmentId) : undefined}
          errorMessage={formError}
          saving={createMutation.isPending || updateMutation.isPending}
          onClose={() => {
            if (createMutation.isPending || updateMutation.isPending) return;
            setFormOpen(false);
            setFormError(null);
          }}
          onSubmit={async (values) => {
            setFormError(null);
            try {
              if (formMode === "create") {
                await createMutation.mutateAsync(values);
              } else if (editing) {
                await updateMutation.mutateAsync({ id: editing.id, input: values });
              }
              setFormOpen(false);
              setEditing(null);
            } catch (e) {
              setFormError(getErrorMessage(e));
            }
          }}
        />
      )}

      <DeleteSubjectDialog
        open={deleteOpen}
        subject={deletingSubject}
        errorMessage={deleteError}
        deleting={deleteMutation.isPending}
        onClose={() => {
          if (deleteMutation.isPending) return;
          setDeleteOpen(false);
          setDeleteError(null);
        }}
        onConfirm={async () => {
          if (!deletingSubject) return;
          setDeleteError(null);
          try {
            await deleteMutation.mutateAsync(deletingSubject.id);
            setDeleteOpen(false);
            setDeletingSubject(null);
          } catch (e) {
            setDeleteError(getErrorMessage(e));
          }
        }}
      />

      {facultyOpen && (
        <FacultyDialog
          open={facultyOpen}
          subject={facultySubject}
          canAssign={canAssign}
          onClose={() => {
            setFacultyOpen(false);
            setFacultySubject(null);
          }}
        />
      )}
    </div>
  );
}
