"use client";

import { useState } from "react";

import Button from "@/components/ui/button";
import { useAssignClubDepartmentMutation } from "@/features/clubs/api/club-query";
import type { Club } from "@/features/clubs/api/clubs";
import type { Department } from "@/features/departments/api/department";

export default function AssignClubDepartmentDialog({
  club,
  departments,
  departmentsPending,
  departmentsError,
  onRetryDepartments,
  onClose,
  onAssigned,
}: {
  club: Club;
  departments: Department[];
  departmentsPending: boolean;
  departmentsError: boolean;
  onRetryDepartments: () => void;
  onClose: () => void;
  onAssigned: () => void;
}) {
  const [departmentId, setDepartmentId] = useState("");
  const assignMutation = useAssignClubDepartmentMutation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-club-department-title"
        className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-xl"
      >
        <h2
          id="assign-club-department-title"
          className="text-xl font-semibold"
        >
          Assign department
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Choose the department for {club.name}.
        </p>

        <label
          htmlFor={`assign-department-${club.id}`}
          className="mt-5 block text-sm font-medium text-text"
        >
          Department
        </label>
        <select
          id={`assign-department-${club.id}`}
          value={departmentId}
          onChange={(event) => setDepartmentId(event.target.value)}
          disabled={
            departmentsPending ||
            departmentsError ||
            assignMutation.isPending
          }
          className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-label text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name} ({department.code})
            </option>
          ))}
        </select>

        {departmentsError && (
          <p className="mt-2 text-sm text-red-600">
            Unable to load departments.{" "}
            <button
              type="button"
              onClick={onRetryDepartments}
              className="underline"
            >
              Try again
            </button>
          </p>
        )}

        {assignMutation.isError && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {assignMutation.error.message}
          </p>
        )}

        <footer className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={assignMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            disabled={!departmentId || assignMutation.isPending}
            onClick={() => {
              assignMutation.mutate(
                {
                  clubId: club.id,
                  departmentId: Number(departmentId),
                },
                { onSuccess: onAssigned },
              );
            }}
          >
            {assignMutation.isPending ? "Assigning..." : "Assign department"}
          </Button>
        </footer>
      </section>
    </div>
  );
}
