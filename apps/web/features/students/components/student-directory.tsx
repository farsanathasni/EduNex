"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import { useDepartment } from "@/features/departments/api/department-query"
import { useStudents } from "@/features/students/api/student-query"
import type { StudentListItem } from "@/features/students/api/student"
import EditStudentModal from "@/features/students/components/edit-student-modal"
import DeleteStudentDialog from "@/features/students/components/delete-student-dialog"
import CreateStudentModal from "@/features/students/components/create-student-modal"
import StudentDirectorySkeleton from "@/features/students/components/student-directory-skeleton"

const PAGE_SIZE = 10
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]

export default function StudentDirectory({
  showDepartmentFilter,
  title = "Student Directory",
  canEdit = false,
  canDelete = false,
  canChangeDepartment = false,
  canAssignCoordinator = false,
  canCreate = false,
}: {

  showDepartmentFilter: boolean
  title?: string
  canEdit?: boolean
  canDelete?: boolean
  canChangeDepartment?: boolean
  canAssignCoordinator?: boolean
  canCreate?: boolean
}) {

  const pathname = usePathname()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [semester, setSemester] = useState("")
  const [page, setPage] = useState(1)
  const [editingStudent, setEditingStudent] = useState<StudentListItem | null>(null)
  const [deletingStudent, setDeletingStudent] = useState<StudentListItem | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [creatingStudent, setCreatingStudent] = useState(false)

  const departmentQuery = useDepartment(showDepartmentFilter)
  const studentsQuery = useStudents({
    search: search.trim(),
    ...(showDepartmentFilter && departmentId ? { departmentId: Number(departmentId) } : {}),
    ...(semester ? { semester: Number(semester) } : {}),
    page,
    limit: PAGE_SIZE,
  })

  const students = studentsQuery.data?.students ?? []
  const pagination = studentsQuery.data?.pagination
  const totalPages = pagination?.totalPages ?? 0
  const resetPage = () => {
    setPage(1)
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-text-muted">
            Search students and filter by department and semester.
          </p>
        </div>
        {canCreate && <Button onClick={() => { setSuccessMessage(""); setCreatingStudent(true); }}>Create Student</Button>}
      </header>

      {successMessage && (
        <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          {successMessage}
        </p>
      )}

      <section className={`grid gap-4 rounded-xl border border-border bg-surface p-5 ${showDepartmentFilter ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        <div>
          <label htmlFor="student-directory-search" className="mb-2 block text-sm font-medium">Search students</label>
          <Input
            id="student-directory-search"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              resetPage();
            }}
            placeholder="Name, admission number, or email"
          />
        </div>

        {showDepartmentFilter && (
          <div>
            <label htmlFor="student-directory-department" className="mb-2 block text-sm font-medium">Department</label>
            <select
              id="student-directory-department"
              value={departmentId}
              onChange={(event) => {
                setDepartmentId(event.target.value);
                resetPage();
              }}
              disabled={departmentQuery.isPending || departmentQuery.isError}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 disabled:opacity-60"
            >
              <option value="">All Departments</option>
              {(departmentQuery.data ?? []).map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name} ({department.code})
                </option>
              ))}
            </select>
            {departmentQuery.isPending && <p className="mt-2 text-sm text-text-muted">Loading departments...</p>}
            {departmentQuery.isError && (
              <p className="mt-2 text-sm text-red-600">
                Unable to load departments. {departmentQuery.error instanceof Error ? departmentQuery.error.message : ""}{" "}
                <button type="button" onClick={() => void departmentQuery.refetch()} className="underline">Try again</button>
              </p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="student-directory-semester" className="mb-2 block text-sm font-medium">Semester</label>
          <select
            id="student-directory-semester"
            value={semester}
            onChange={(event) => {
              setSemester(event.target.value);
              resetPage();
            }}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          >
            <option value="">All Semesters</option>
            {SEMESTERS.map((number) => <option key={number} value={number}>Semester {number}</option>)}
          </select>
        </div>

        <div className={showDepartmentFilter ? "md:col-span-3" : "md:col-span-2"}>
          <Button
            variant="outline"
            size="sm"
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
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <h2 className="font-semibold">Students</h2>
          <p className="text-sm text-text-muted">{pagination?.total ?? 0} student(s) found</p>
        </div>

        {studentsQuery.isPending ? (
  <StudentDirectorySkeleton />
        ) : studentsQuery.isError ? (
          <div className="p-8 text-center">
            <p role="alert" className="text-sm text-red-600">
              {studentsQuery.error instanceof Error ? studentsQuery.error.message : "Unable to load students."}
            </p>
            <Button variant="outline" size="sm" onClick={() => void studentsQuery.refetch()} className="mt-4">Try again</Button>
          </div>
        ) : students.length === 0 ? (
          <p className="p-8 text-center text-sm text-text-muted">No students match your search or filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border bg-background text-text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Student</th>
                  <th scope="col" className="px-4 py-3 font-medium">Admission number</th>
                  <th scope="col" className="px-4 py-3 font-medium">Department</th>
                  <th scope="col" className="px-4 py-3 font-medium">Semester</th>
                  <th scope="col" className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    role="link"
                    tabIndex={0}
                    aria-label={`View ${student.name} details`}
                    onClick={() => router.push(`${pathname}/${encodeURIComponent(student.id)}`)}
                    onKeyDown={(event) => {
                      if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        router.push(`${pathname}/${encodeURIComponent(student.id)}`);
                      }
                    }}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`${pathname}/${encodeURIComponent(student.id)}`}
                        onClick={(event) => event.stopPropagation()}
                        className="font-medium text-primary hover:underline"
                      >
                        {student.name}
                      </Link>
                      <p className="mt-1 text-xs text-text-muted">{student.email}</p>
                    </td>
                    <td className="px-4 py-3">{student.admissionNumber}</td>
                    <td className="px-4 py-3">{student.departmentName}</td>
                    <td className="px-4 py-3">{student.semester}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {canEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSuccessMessage("");
                              setEditingStudent(student);
                            }}
                          >
                            Edit
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSuccessMessage("");
                              setDeletingStudent(student);
                            }}
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        )}
                        {!canEdit && !canDelete && (
                          <span className="text-text-muted">Open details</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!studentsQuery.isPending && !studentsQuery.isError && (
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm">
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

