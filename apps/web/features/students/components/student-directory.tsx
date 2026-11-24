"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useRegisterHeaderSearch } from "@/components/layout/header-search";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { ResponsiveDataTable, type DataTableColumn } from "@/components/ui/data-table";
import Select from "@/components/ui/select";
import { useDepartment } from "@/features/departments/api/department-query";
import CreateStudentModal from "@/features/students/components/create-student-modal";
import DeleteStudentDialog from "@/features/students/components/delete-student-dialog";
import EditStudentModal from "@/features/students/components/edit-student-modal";
import { useStudents } from "@/features/students/api/student-query";
import type { StudentListItem } from "@/features/students/api/student";

const PAGE_SIZE = 10;
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function StudentDirectory({
  showDepartmentFilter,
  title = "Student Directory",
  canEdit = false,
  canDelete = false,
  canChangeDepartment = false,
  canAssignCoordinator = false,
  canCreate = false,
}: {
  showDepartmentFilter: boolean;
  title?: string;
  canEdit?: boolean;
  canDelete?: boolean;
  canChangeDepartment?: boolean;
  canAssignCoordinator?: boolean;
  canCreate?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [semester, setSemester] = useState("");
  const [page, setPage] = useState(1);
  const [editingStudent, setEditingStudent] = useState<StudentListItem | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<StudentListItem | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [creatingStudent, setCreatingStudent] = useState(false);

  useRegisterHeaderSearch({
    value: search,
    onChange: (value) => {
      setSearch(value);
      setPage(1);
    },
    placeholder: "Name, admission number, or email",
  });

  const departmentQuery = useDepartment(showDepartmentFilter);
  const studentsQuery = useStudents({
    search: search.trim(),
    ...(showDepartmentFilter && departmentId ? { departmentId: Number(departmentId) } : {}),
    ...(semester ? { semester: Number(semester) } : {}),
    page,
    limit: PAGE_SIZE,
  });

  const students = studentsQuery.data?.students ?? [];
  const pagination = studentsQuery.data?.pagination;
  const totalPages = pagination?.totalPages ?? 0;
  const resetPage = () => setPage(1);

  const columns = useMemo<DataTableColumn<StudentListItem>[]>(
    () => [
      {
        header: "Student",
        cell: (student) => (
          <div className="min-w-0">
            <Link
              href={`${pathname}/${encodeURIComponent(student.id)}`}
              onClick={(event) => event.stopPropagation()}
              className="font-medium text-primary hover:underline"
            >
              {student.name}
            </Link>
            <p className="mt-1 text-xs text-text-muted break-anywhere">{student.email}</p>
          </div>
        ),
        mobileLabel: "Student",
        mobilePriority: "primary",
      },
      {
        header: "Admission number",
        cell: (student) => student.admissionNumber,
        mobileLabel: "Admission number",
        mobilePriority: "secondary",
      },
      {
        header: "Department",
        cell: (student) => student.departmentName,
        mobileLabel: "Department",
        mobilePriority: "secondary",
      },
      {
        header: "Semester",
        cell: (student) => <Badge tone="neutral">Semester {student.semester}</Badge>,
        mobileLabel: "Semester",
        mobilePriority: "secondary",
        mobileIsStatus: true,
      },
    ],
    [pathname],
  );

  const rowActions = (student: StudentListItem) => {
    const actions = [];
    if (canEdit) {
      actions.push({
        label: "Edit",
        ariaLabel: `Edit ${student.name}`,
        onClick: (row: StudentListItem) => {
          setSuccessMessage("");
          setEditingStudent(row);
        },
      });
    }
    if (canDelete) {
      actions.push({
        label: "Delete",
        ariaLabel: `Delete ${student.name}`,
        className: "border-red-200 text-red-700 hover:bg-red-50",
        onClick: (row: StudentListItem) => {
          setSuccessMessage("");
          setDeletingStudent(row);
        },
      });
    }
    if (!canEdit && !canDelete) {
      actions.push({
        label: "Open details",
        ariaLabel: `Open ${student.name} details`,
        onClick: (row: StudentListItem) =>
          router.push(`${pathname}/${encodeURIComponent(row.id)}`),
      });
    }
    return actions;
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-text-muted">
            Search students and filter by department and semester.
          </p>
        </div>
        {canCreate && (
          <Button
            onClick={() => {
              setSuccessMessage("");
              setCreatingStudent(true);
            }}
          >
            Create Student
          </Button>
        )}
      </header>

      {successMessage && (
        <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          {successMessage}
        </p>
      )}

      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="flex flex-wrap gap-4">
          {showDepartmentFilter && (
            <div className="min-w-0 flex-1 basis-full sm:basis-[260px]">
              <Select
                id="student-directory-department"
                label="Department"
                value={departmentId}
                onChange={(event) => {
                  setDepartmentId(event.target.value);
                  resetPage();
                }}
                disabled={departmentQuery.isPending || departmentQuery.isError}
              >
                <option value="">All Departments</option>
                {(departmentQuery.data ?? []).map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name} ({department.code})
                  </option>
                ))}
              </Select>
              {departmentQuery.isPending && <p className="mt-2 text-sm text-text-muted">Loading departments...</p>}
              {departmentQuery.isError && (
                <p className="mt-2 text-sm text-red-600">
                  Unable to load departments. {departmentQuery.error instanceof Error ? departmentQuery.error.message : ""}{" "}
                  <button type="button" onClick={() => void departmentQuery.refetch()} className="underline">
                    Try again
                  </button>
                </p>
              )}
            </div>
          )}

          <div className="min-w-0 flex-1 basis-full sm:basis-[220px]">
            <Select
              id="student-directory-semester"
              label="Semester"
              value={semester}
              onChange={(event) => {
                setSemester(event.target.value);
                resetPage();
              }}
            >
              <option value="">All Semesters</option>
              {SEMESTERS.map((number) => (
                <option key={number} value={number}>
                  Semester {number}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex min-w-0 flex-1 basis-full items-end sm:basis-[180px]">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => {
                setSearch("");
                setDepartmentId("");
                setSemester("");
                resetPage();
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Students</h2>
          <p className="text-sm text-text-muted">{pagination?.total ?? 0} student(s) found</p>
        </div>

        {studentsQuery.isError ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p role="alert" className="text-sm text-red-600">
              {studentsQuery.error instanceof Error ? studentsQuery.error.message : "Unable to load students."}
            </p>
            <Button variant="outline" size="sm" onClick={() => void studentsQuery.refetch()} className="mt-4">
              Try again
            </Button>
          </div>
        ) : (
          <ResponsiveDataTable
            columns={columns}
            rows={students}
            loading={studentsQuery.isPending}
            getRowKey={(student) => student.id}
            rowActions={rowActions}
            onRowClick={(student) => router.push(`${pathname}/${encodeURIComponent(student.id)}`)}
            minWidthClassName="min-w-[760px]"
            emptyState="No students match your search or filters."
          />
        )}

        {!studentsQuery.isPending && !studentsQuery.isError && (
          <footer className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm">
            <p className="text-text-muted">
              {pagination?.total ?? 0} students · Page {pagination?.page ?? page} of {Math.max(totalPages, 1)}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1 || studentsQuery.isFetching} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages || studentsQuery.isFetching} onClick={() => setPage((current) => current + 1)}>
                Next
              </Button>
            </div>
          </footer>
        )}
      </section>

      {editingStudent && (
        <EditStudentModal
          key={editingStudent.id}
          student={editingStudent}
          canChangeDepartment={canChangeDepartment}
          canAssignCoordinator={canAssignCoordinator}
          departments={showDepartmentFilter ? departmentQuery.data ?? [] : []}
          onClose={() => setEditingStudent(null)}
          onUpdated={() => {
            setEditingStudent(null);
            setSuccessMessage("Student details updated successfully.");
          }}
        />
      )}
      {creatingStudent && (
        <CreateStudentModal
          onClose={() => setCreatingStudent(false)}
          onCreated={() => {
            setCreatingStudent(false);
            setSuccessMessage("Student account created. Password setup instructions were emailed.");
          }}
        />
      )}
      {deletingStudent && canDelete && (
        <DeleteStudentDialog
          student={deletingStudent}
          onClose={() => setDeletingStudent(null)}
          onDeleted={() => {
            setDeletingStudent(null);
            setSuccessMessage(`${deletingStudent.name} was deleted successfully.`);
          }}
        />
      )}
    </section>
  );
}

