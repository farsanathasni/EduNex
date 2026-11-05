"use client";

import { useState } from "react";

import EditStaffModal from "@/features/staff/components/edit-staff-modal";
import DeactivateStaffDialog from "@/features/staff/components/deactivate-staff-dialog";
import { useStaff } from "@/features/staff/api/staff-query";
import type { StaffListItem, StaffType } from "@/features/staff/api/staff";

type Department = {
  id: number;
  name: string;
  code: string;
};

type StaffDirectoryProps = {
  canChangeDepartment: boolean;
  canDeactivateStaff?: boolean;
  showTypeFilter?: boolean;
  fixedStaffType?: StaffType;
  departments?: Department[];
  isLoadingDepartments?: boolean;
  departmentsError?: string;
  onRetryDepartments?: () => void;
};

const PAGE_SIZE = 10;

export default function StaffDirectory({
  canChangeDepartment,
  canDeactivateStaff = false,
  showTypeFilter = canChangeDepartment,
  fixedStaffType,
  departments = [],
  isLoadingDepartments = false,
  departmentsError,
  onRetryDepartments = () => undefined,
}: StaffDirectoryProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<StaffType>("all");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [page, setPage] = useState(1);
  const [editingStaff, setEditingStaff] = useState<StaffListItem | null>(null);
  const [deactivatingStaff, setDeactivatingStaff] = useState<StaffListItem | null>(null);
  const [updatedMessage, setUpdatedMessage] = useState("");

  const staffQuery = useStaff({
    type: fixedStaffType ?? type,
    ...(canChangeDepartment && selectedDepartment
      ? { departmentId: Number(selectedDepartment) }
      : {}),
    search: search.trim(),
    page,
    limit: PAGE_SIZE,
  });
  const staff = staffQuery.data?.staff ?? [];
  const pagination = staffQuery.data?.pagination;
  const totalPages = pagination?.totalPages ?? 0;

  const resetPageAnd = (update: () => void) => {
    setPage(1);
    update();
  };

  return (
    <section className="space-y-6">
      <section className="rounded-xl border border-border bg-surface p-5">
        <div className={`grid gap-4 ${canChangeDepartment ? "md:grid-cols-3" : showTypeFilter ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
          <div>
            <label htmlFor="staff-directory-search" className="mb-2 block text-sm font-medium">
              Search Staff
            </label>
            <input
              id="staff-directory-search"
              type="search"
              value={search}
              onChange={(event) => resetPageAnd(() => setSearch(event.target.value))}
              placeholder="Name, employee ID, or email"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {showTypeFilter && (
            <div>
              <label htmlFor="staff-directory-type" className="mb-2 block text-sm font-medium">
                Staff Type
              </label>
              <select
                id="staff-directory-type"
                value={type}
                onChange={(event) =>
                  resetPageAnd(() => setType(event.target.value as StaffType))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
              >
                <option value="all">All Staff</option>
                <option value="hod">HODs</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
          )}

          {canChangeDepartment && (
            <div>
              <label htmlFor="staff-directory-department" className="mb-2 block text-sm font-medium">
                Department
              </label>
              <select
                id="staff-directory-department"
                value={selectedDepartment}
                onChange={(event) =>
                  resetPageAnd(() => setSelectedDepartment(event.target.value))
                }
                disabled={isLoadingDepartments || !!departmentsError}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 disabled:opacity-60"
              >
                <option value="">All Departments</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name} ({department.code})
                  </option>
                ))}
              </select>
              {isLoadingDepartments && (
                <p className="mt-2 text-sm text-text-muted">Loading departments...</p>
              )}
              {departmentsError && (
                <p className="mt-2 text-sm text-red-600">
                  {departmentsError}{" "}
                  <button type="button" onClick={onRetryDepartments} className="underline">
                    Try again
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {updatedMessage && (
        <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800" role="status">
          {updatedMessage}
        </p>
      )}

      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        {staffQuery.isPending ? (
          <p className="p-6 text-sm text-text-muted">Loading staff...</p>
        ) : staffQuery.isError ? (
          <div className="p-6 text-sm text-red-600">
            <p>{staffQuery.error instanceof Error ? staffQuery.error.message : "Unable to load staff."}</p>
            <button type="button" onClick={() => void staffQuery.refetch()} className="mt-2 underline">
              Try again
            </button>
          </div>
        ) : staff.length === 0 ? (
          <p className="p-6 text-sm text-text-muted">No staff match the selected search and filters.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-border bg-background text-text-muted">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">Name</th>
                    <th scope="col" className="px-4 py-3 font-medium">Employee ID</th>
                    <th scope="col" className="px-4 py-3 font-medium">Email</th>
                    <th scope="col" className="px-4 py-3 font-medium">Staff Type</th>
                    <th scope="col" className="px-4 py-3 font-medium">Department</th>
                    <th scope="col" className="px-4 py-3 font-medium">Designation</th>
                    <th scope="col" className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member) => (
                    <tr key={member.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium">{member.name}</td>
                      <td className="px-4 py-3">{member.employeeId}</td>
                      <td className="px-4 py-3">{member.email}</td>
                      <td className="px-4 py-3">{member.role === "hod" ? "HOD" : "Faculty"}</td>
                      <td className="px-4 py-3">
                        {member.departmentName
                          ? `${member.departmentName}${member.departmentCode ? ` (${member.departmentCode})` : ""}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3">{member.designation || "—"}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            setUpdatedMessage("");
                            setEditingStaff(member);
                          }}
                          className="rounded-md border border-border px-3 py-1.5 font-medium hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                        >
                          Edit
                        </button>
                        {canDeactivateStaff && (
                          <button
                            type="button"
                            onClick={() => {
                              setUpdatedMessage("");
                              setDeactivatingStaff(member);
                            }}
                            className="ml-2 rounded-md border border-red-200 px-3 py-1.5 font-medium text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                          >
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm">
              <p className="text-text-muted">
                {pagination?.total ?? 0} staff · Page {pagination?.page ?? page} of {Math.max(totalPages, 1)}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || staffQuery.isFetching}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="rounded-lg border border-border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages || staffQuery.isFetching}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </footer>
          </>
        )}
      </section>

      {editingStaff && (
        <EditStaffModal
          key={editingStaff.id}
          staff={editingStaff}
          canChangeDepartment={canChangeDepartment}
          departments={departments}
          isLoadingDepartments={isLoadingDepartments}
          departmentsError={departmentsError}
          onRetryDepartments={onRetryDepartments}
          onClose={() => setEditingStaff(null)}
          onUpdated={() => {
            setUpdatedMessage("Staff details updated successfully.");
            setEditingStaff(null);
          }}
        />
      )}

      {deactivatingStaff && canDeactivateStaff && (
        <DeactivateStaffDialog
          staff={deactivatingStaff}
          onClose={() => setDeactivatingStaff(null)}
          onDeactivated={() => {
            setUpdatedMessage(`${deactivatingStaff.name} was deactivated successfully.`);
            setDeactivatingStaff(null);
          }}
        />
      )}
    </section>
  );
}
