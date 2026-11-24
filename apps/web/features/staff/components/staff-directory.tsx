"use client";

import { useMemo, useState } from "react";

import { useRegisterHeaderSearch } from "@/components/layout/header-search";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { ResponsiveDataTable, type DataTableColumn } from "@/components/ui/data-table";
import Select from "@/components/ui/select";
import DeactivateStaffDialog from "@/features/staff/components/deactivate-staff-dialog";
import EditStaffModal from "@/features/staff/components/edit-staff-modal";
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

  useRegisterHeaderSearch({
    value: search,
    onChange: (value) => {
      setSearch(value);
      setPage(1);
    },
    placeholder: "Name, employee ID, or email",
  });

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

  const columns = useMemo<DataTableColumn<StaffListItem>[]>(
    () => [
      {
        header: "Name",
        cell: (member) => <span className="font-medium">{member.name}</span>,
        mobileLabel: "Name",
        mobilePriority: "primary",
      },
      {
        header: "Employee ID",
        cell: (member) => member.employeeId,
        mobileLabel: "Employee ID",
        mobilePriority: "secondary",
      },
      {
        header: "Email",
        cell: (member) => member.email,
        mobileLabel: "Email",
        mobilePriority: "secondary",
      },
      {
        header: "Staff Type",
        cell: (member) => (
          <Badge tone={member.role === "hod" ? "primary" : "neutral"}>
            {member.role === "hod" ? "HOD" : "Faculty"}
          </Badge>
        ),
        mobileLabel: "Staff Type",
        mobilePriority: "secondary",
        mobileIsStatus: true,
      },
      {
        header: "Department",
        cell: (member) =>
          member.departmentName
            ? `${member.departmentName}${member.departmentCode ? ` (${member.departmentCode})` : ""}`
            : "—",
        mobileLabel: "Department",
        mobilePriority: "secondary",
      },
      {
        header: "Designation",
        cell: (member) => member.designation || "—",
        mobileLabel: "Designation",
        mobilePriority: "secondary",
      },
    ],
    [],
  );

  const rowActions = (member: StaffListItem) => {
    const actions: {
      label: string;
      ariaLabel: string;
      className?: string;
      onClick: (row: StaffListItem) => void;
    }[] = [
      {
        label: "Edit",
        ariaLabel: `Edit ${member.name}`,
        onClick: (row: StaffListItem) => {
          setUpdatedMessage("");
          setEditingStaff(row);
        },
      },
    ];

    if (canDeactivateStaff) {
      actions.push({
        label: "Deactivate",
        ariaLabel: `Deactivate ${member.name}`,
        className: "border-red-200 text-red-700 hover:bg-red-50",
        onClick: (row: StaffListItem) => {
          setUpdatedMessage("");
          setDeactivatingStaff(row);
        },
      });
    }

    return actions;
  };

  return (
    <section className="space-y-6">
      {(showTypeFilter || canChangeDepartment) && (
        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="flex flex-wrap gap-4">
            {showTypeFilter && (
              <div className="min-w-0 flex-1 basis-full sm:basis-[220px]">
                <Select
                  id="staff-directory-type"
                  label="Staff Type"
                  value={type}
                  onChange={(event) =>
                    resetPageAnd(() => setType(event.target.value as StaffType))
                  }
                >
                  <option value="all">All Staff</option>
                  <option value="hod">HODs</option>
                  <option value="faculty">Faculty</option>
                </Select>
              </div>
            )}

            {canChangeDepartment && (
              <div className="min-w-0 flex-1 basis-full sm:basis-[260px]">
                <Select
                  id="staff-directory-department"
                  label="Department"
                  value={selectedDepartment}
                  onChange={(event) =>
                    resetPageAnd(() => setSelectedDepartment(event.target.value))
                  }
                  disabled={isLoadingDepartments || !!departmentsError}
                >
                  <option value="">All Departments</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name} ({department.code})
                    </option>
                  ))}
                </Select>
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
      )}

      {updatedMessage && (
        <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800" role="status">
          {updatedMessage}
        </p>
      )}

      {staffQuery.isError ? (
        <div className="rounded-xl border border-border bg-surface p-6 text-sm text-red-600">
          <p>{staffQuery.error instanceof Error ? staffQuery.error.message : "Unable to load staff."}</p>
          <Button variant="outline" size="sm" onClick={() => void staffQuery.refetch()} className="mt-3">
            Try again
          </Button>
        </div>
      ) : (
        <>
          <ResponsiveDataTable
            columns={columns}
            rows={staff}
            loading={staffQuery.isPending}
            getRowKey={(member) => member.id}
            rowActions={rowActions}
            minWidthClassName="min-w-[900px]"
            emptyState="No staff match the selected search and filters."
          />

          {!staffQuery.isPending && (
            <footer className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm">
              <p className="text-text-muted">
                {pagination?.total ?? 0} staff · Page {pagination?.page ?? page} of {Math.max(totalPages, 1)}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || staffQuery.isFetching}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || staffQuery.isFetching}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </footer>
          )}
        </>
      )}

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
