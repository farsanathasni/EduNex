"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getPrincipalDepartments } from "@/features/principal/api/principal";
import AddStaffModal from "@/features/staff/components/add-staff-modal";
import StaffDirectory from "@/features/staff/components/staff-directory";

type Department = {
  id: number;
  name: string;
  code: string;
};

type DepartmentResponse = {
  success?: boolean;
  message?: string;
  data?: Department[];
};

export default function StaffManagementPage() {
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [staffCreatedMessage, setStaffCreatedMessage] = useState("");

  const departmentsQuery = useQuery({
    queryKey: ["principal", "departments"],
    queryFn: async () => {
      const result = (await getPrincipalDepartments()) as DepartmentResponse;
      if (!result.success || !Array.isArray(result.data)) {
        throw new Error(result.message || "Unable to load departments.");
      }
      return result.data;
    },
  });

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="mt-2 text-sm text-text-muted">
            Manage college staff, faculty members, and Heads of Department.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setStaffCreatedMessage("");
            setIsAddStaffOpen(true);
          }}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          Add Staff
        </button>
      </header>

      {staffCreatedMessage && (
        <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800" role="status">
          {staffCreatedMessage}
        </p>
      )}

      <StaffDirectory
        canChangeDepartment
        canDeactivateStaff
        departments={departmentsQuery.data ?? []}
        isLoadingDepartments={departmentsQuery.isPending}
        departmentsError={
          departmentsQuery.isError
            ? departmentsQuery.error instanceof Error
              ? departmentsQuery.error.message
              : "Unable to load departments."
            : undefined
        }
        onRetryDepartments={() => void departmentsQuery.refetch()}
      />

      {isAddStaffOpen && (
        <AddStaffModal
          departments={departmentsQuery.data ?? []}
          isLoadingDepartments={departmentsQuery.isPending}
          departmentsError={
            departmentsQuery.isError
              ? departmentsQuery.error instanceof Error
                ? departmentsQuery.error.message
                : "Unable to load departments."
              : undefined
          }
          onRetryDepartments={() => void departmentsQuery.refetch()}
          onClose={() => setIsAddStaffOpen(false)}
          onCreated={() => {
            setStaffCreatedMessage(
              "Staff account created successfully. The password setup email has been sent.",
            );
            setIsAddStaffOpen(false);
          }}
        />
      )}
    </section>
  );
}
