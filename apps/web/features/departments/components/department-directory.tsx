"use client";

import { useState } from "react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  useDepartmentList,
} from "@/features/departments/api/department-query";
import type { Department } from "@/features/departments/api/department";
import CreateDepartmentsModal from "@/features/departments/components/create-departments-modal";
import DeleteDepartmentDialog from "@/features/departments/components/delete-department-dialog";
import EditDepartmentModal from "@/features/departments/components/edit-department-modal";
import DepartmentDirectorySkeleton from "@/features/departments/components/department-directory-skeleton";

const PAGE_SIZE = 10;

export default function DepartmentDirectory() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const departmentQuery = useDepartmentList({ search: search.trim(), page, limit: PAGE_SIZE });
  const departments = departmentQuery.data?.departments ?? [];
  const pagination = departmentQuery.data?.pagination;
  const totalPages = pagination?.totalPages ?? 0;

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="mt-2 text-sm text-text-muted">View and manage the departments registered in EduNex.</p>
        </div>
        <Button onClick={() => { setSuccessMessage(""); setIsCreateOpen(true); }}>
          + Create Department
        </Button>
      </header>

      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="max-w-xl">
          <label htmlFor="department-search" className="mb-2 block text-sm font-medium">Search departments</label>
          <Input
            id="department-search"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name or code"
          />
        </div>
      </section>

      {successMessage && (
        <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          {successMessage}
        </p>
      )}

      <section className="overflow-hidden rounded-xl border border-border bg-surface">
{departmentQuery.isPending ? (
  <DepartmentDirectorySkeleton />
        ) : departmentQuery.isError ? (
          <div className="p-6 text-sm text-red-600">
            <p>{departmentQuery.error instanceof Error ? departmentQuery.error.message : "Unable to load departments."}</p>
            <Button variant="outline" size="sm" onClick={() => void departmentQuery.refetch()} className="mt-3">
              Try again
            </Button>
          </div>
        ) : (
          <>
            {departments.length === 0 ? (
              <p className="p-6 text-sm text-text-muted">
                {search.trim() ? "No departments match your search." : "No departments found."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b border-border bg-background text-text-muted">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-medium">Department</th>
                      <th scope="col" className="px-4 py-3 font-medium">Code</th>
                      <th scope="col" className="px-4 py-3 font-medium">Description</th>
                      <th scope="col" className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((department) => (
                      <tr key={department.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-medium">{department.name}</td>
                        <td className="px-4 py-3">{department.code}</td>
                        <td className="px-4 py-3 text-text-muted">{department.description || "No description"}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => { setSuccessMessage(""); setEditingDepartment(department); }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => { setSuccessMessage(""); setDeletingDepartment(department); }}
                              className="border-red-200 text-red-700 hover:bg-red-50"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm">
              <p className="text-text-muted">
                {pagination?.total ?? 0} departments · Page {pagination?.page ?? page} of {Math.max(totalPages, 1)}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || departmentQuery.isFetching}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || departmentQuery.isFetching}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </footer>
          </>
        )}
      </section>

      {isCreateOpen && (
        <CreateDepartmentsModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={(count) => {
            setIsCreateOpen(false);
            setSearch("");
            setPage(1);
            setSuccessMessage(`${count} department${count === 1 ? "" : "s"} created successfully.`);
          }}
        />
      )}
      {editingDepartment && (
        <EditDepartmentModal
          key={editingDepartment.id}
          department={editingDepartment}
          onClose={() => setEditingDepartment(null)}
          onUpdated={() => {
            setEditingDepartment(null);
            setSuccessMessage("Department updated successfully.");
          }}
        />
      )}
      {deletingDepartment && (
        <DeleteDepartmentDialog
          department={deletingDepartment}
          onClose={() => setDeletingDepartment(null)}
          onDeleted={() => {
            const totalAfterDelete = Math.max(0, (pagination?.total ?? 1) - 1);
            setPage((current) => Math.min(current, Math.max(1, Math.ceil(totalAfterDelete / PAGE_SIZE))));
            setDeletingDepartment(null);
            setSuccessMessage(`${deletingDepartment.name} was deleted successfully.`);
          }}
        />
      )}
    </section>
  );
}
