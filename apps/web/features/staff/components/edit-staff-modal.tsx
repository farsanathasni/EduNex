"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { getStaffApiError } from "@/features/staff/api/staff-error";
import { useUpdateStaff } from "@/features/staff/api/staff-query";
import type { StaffListItem } from "@/features/staff/api/staff";
import {
  editStaffSchema,
  type EditStaffFormValues,
} from "@/features/staff/validation/edit-staff-schema";

type Department = {
  id: number;
  name: string;
  code: string;
};

type EditStaffModalProps = {
  staff: StaffListItem;
  canChangeDepartment: boolean;
  departments: Department[];
  isLoadingDepartments: boolean;
  departmentsError?: string;
  onRetryDepartments: () => void;
  onClose: () => void;
  onUpdated: () => void;
};

export default function EditStaffModal({
  staff,
  canChangeDepartment,
  departments,
  isLoadingDepartments,
  departmentsError,
  onRetryDepartments,
  onClose,
  onUpdated,
}: EditStaffModalProps) {
  const [submissionError, setSubmissionError] = useState<{
    message: string;
    details: string[];
  } | null>(null);
  const updateMutation = useUpdateStaff(staff.id);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditStaffFormValues>({
    resolver: zodResolver(editStaffSchema),
    defaultValues: {
      name: staff.name,
      email: staff.email,
      employeeId: staff.employeeId,
      designation: staff.designation ?? "",
      phone: staff.phone ?? "",
      departmentId: staff.departmentId === null ? "" : String(staff.departmentId),
    },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !updateMutation.isPending) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, updateMutation.isPending]);

  const onValid = async (values: EditStaffFormValues) => {
    if (updateMutation.isPending) return;
    setSubmissionError(null);

    if (canChangeDepartment && !values.departmentId) {
      setError("departmentId", {
        type: "required",
        message: "Select a department.",
      });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        name: values.name,
        email: values.email,
        employeeId: values.employeeId,
        designation: values.designation.trim() || null,
        phone: values.phone.trim() || null,
        ...(canChangeDepartment && values.departmentId
          ? { departmentId: Number(values.departmentId) }
          : {}),
      });
      onUpdated();
    } catch (error) {
      setSubmissionError(getStaffApiError(error));
    }
  };

  const closeIfIdle = () => {
    if (!updateMutation.isPending) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeIfIdle();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-staff-title"
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface shadow-xl"
      >
        <header className="sticky top-0 flex items-start justify-between gap-4 border-b border-border bg-surface px-5 py-4 sm:px-6">
          <div>
            <h2 id="edit-staff-title" className="text-xl font-bold">
              Edit Staff
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Update this staff member’s details.
            </p>
          </div>
          <button
            type="button"
            onClick={closeIfIdle}
            disabled={updateMutation.isPending}
            aria-label="Close Edit Staff dialog"
            className="rounded-lg px-3 py-1 text-2xl leading-none text-text-muted hover:bg-background hover:text-text disabled:opacity-50"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit(onValid)} noValidate>
          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <label htmlFor="edit-staff-name" className="mb-1 block text-sm font-medium">
                Full Name <span className="text-red-600">*</span>
              </label>
              <Input
                id="edit-staff-name"
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "edit-staff-name-error" : undefined}
                {...register("name")}
              />
              {errors.name && <p id="edit-staff-name-error" className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="edit-staff-email" className="mb-1 block text-sm font-medium">
                Email <span className="text-red-600">*</span>
              </label>
              <Input
                id="edit-staff-email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "edit-staff-email-error" : undefined}
                {...register("email")}
              />
              {errors.email && <p id="edit-staff-email-error" className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="edit-staff-employee-id" className="mb-1 block text-sm font-medium">
                Employee ID <span className="text-red-600">*</span>
              </label>
              <Input
                id="edit-staff-employee-id"
                aria-invalid={!!errors.employeeId}
                aria-describedby={errors.employeeId ? "edit-staff-employee-id-error" : undefined}
                {...register("employeeId")}
              />
              {errors.employeeId && <p id="edit-staff-employee-id-error" className="mt-1 text-sm text-red-600">{errors.employeeId.message}</p>}
            </div>

            <div>
              <label htmlFor="edit-staff-designation" className="mb-1 block text-sm font-medium">
                Designation <span className="text-text-muted">(optional)</span>
              </label>
              <Input
                id="edit-staff-designation"
                aria-invalid={!!errors.designation}
                aria-describedby={errors.designation ? "edit-staff-designation-error" : undefined}
                {...register("designation")}
              />
              {errors.designation && <p id="edit-staff-designation-error" className="mt-1 text-sm text-red-600">{errors.designation.message}</p>}
            </div>

            {canChangeDepartment ? (
              <div>
                <label htmlFor="edit-staff-department" className="mb-1 block text-sm font-medium">
                  Department <span className="text-red-600">*</span>
                </label>
                <select
                  id="edit-staff-department"
                  disabled={isLoadingDepartments || departments.length === 0 || updateMutation.isPending}
                  aria-invalid={!!errors.departmentId}
                  aria-describedby={errors.departmentId ? "edit-staff-department-error" : undefined}
                  {...register("departmentId")}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {isLoadingDepartments
                      ? "Loading departments..."
                      : departments.length
                        ? "Select a department"
                        : "No departments available"}
                  </option>
                  {departments.map((department) => (
                    <option key={department.id} value={String(department.id)}>
                      {department.name} ({department.code})
                    </option>
                  ))}
                </select>
                {errors.departmentId && <p id="edit-staff-department-error" className="mt-1 text-sm text-red-600">{errors.departmentId.message}</p>}
                {departmentsError && (
                  <p className="mt-1 text-sm text-red-600">
                    {departmentsError}{" "}
                    <button type="button" onClick={onRetryDepartments} className="underline">
                      Try again
                    </button>
                  </p>
                )}
              </div>
            ) : (
              <div>
                <span className="mb-1 block text-sm font-medium">Department</span>
                <p className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-muted">
                  {staff.departmentName ?? "No department assigned"}
                  {staff.departmentCode ? ` (${staff.departmentCode})` : ""}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="edit-staff-phone" className="mb-1 block text-sm font-medium">
                Phone Number <span className="text-text-muted">(optional)</span>
              </label>
              <Input
                id="edit-staff-phone"
                type="tel"
                autoComplete="tel"
                {...register("phone")}
              />
            </div>

            <div>
              <span className="mb-1 block text-sm font-medium">Staff Type</span>
              <p className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-muted">
                {staff.role === "hod" ? "Head of Department (HOD)" : "Faculty"}
              </p>
            </div>

            {submissionError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:col-span-2" role="alert">
                <p className="font-medium">{submissionError.message}</p>
                {submissionError.details.length > 0 && (
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    {submissionError.details.map((detail, index) => (
                      <li key={`${index}-${detail}`}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Button type="button" variant="outline" onClick={closeIfIdle} disabled={updateMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving Changes..." : "Save Changes"}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}
