"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/button";
import { getStaffApiError } from "@/features/staff/api/staff-error";
import Input from "@/components/ui/input";
import { useCreateStaff } from "@/features/staff/api/staff-query";
import {
  addStaffSchema,
  type AddStaffFormValues,
} from "@/features/staff/validation/add-staff-schema";

type Department = {
  id: number;
  name: string;
  code: string;
};

type AddStaffModalProps = {
  departments: Department[];
  isLoadingDepartments: boolean;
  departmentsError?: string;
  onRetryDepartments: () => void;
  onClose: () => void;
  onCreated: () => void;
};

export default function AddStaffModal({
  departments,
  isLoadingDepartments,
  departmentsError,
  onRetryDepartments,
  onClose,
  onCreated,
}: AddStaffModalProps) {
  
  const [submissionError, setSubmissionError] = useState<{
    message: string;
    details: string[];
  } | null>(null);
  const createStaffMutation = useCreateStaff();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddStaffFormValues>({
    resolver: zodResolver(addStaffSchema),
    defaultValues: {
      staffType: "faculty",
      name: "",
      email: "",
      employeeId: "",
      departmentId: "",
      designation: "",
      phone: "",
    },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !createStaffMutation.isPending) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, createStaffMutation.isPending]);

  const onValid = async (values: AddStaffFormValues) => {
    if (createStaffMutation.isPending) return;
    setSubmissionError(null);

    try {
      await createStaffMutation.mutateAsync({
        name: values.name,
        email: values.email,
        employeeId: values.employeeId,
        role: values.staffType,
        departmentId: Number(values.departmentId),
        designation: values.designation,
        ...(values.phone?.trim() ? { phone: values.phone.trim() } : {}),
      });
      onCreated();
    } catch (error) {
      setSubmissionError(getStaffApiError(error));
    }
  };

  const errorText = (message?: string) =>
    message ? <p className="mt-1 text-sm text-red-600">{message}</p> : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !createStaffMutation.isPending) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-staff-title"
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface shadow-xl"
      >
        <header className="sticky top-0 flex items-start justify-between gap-4 border-b border-border bg-surface px-5 py-4 sm:px-6">
          <div>
            <h2 id="add-staff-title" className="text-xl font-bold">
              Add Staff
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Enter the staff member’s details and choose their role.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
  if (!createStaffMutation.isPending) onClose();
}}
            disabled={createStaffMutation.isPending}
            aria-label="Close Add Staff dialog"
            className="rounded-lg px-3 py-1 text-2xl leading-none text-text-muted hover:bg-background hover:text-text"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit(onValid)} noValidate>
          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            <div className="sm:col-span-2">
              <label htmlFor="new-staff-type" className="mb-1 block text-sm font-medium">
                Staff Type <span className="text-red-600">*</span>
              </label>
              <select
                id="new-staff-type"
                {...register("staffType")}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="faculty">Faculty</option>
                <option value="hod">Head of Department (HOD)</option>
              </select>
              {errorText(errors.staffType?.message)}
            </div>

            <div>
              <label htmlFor="new-staff-name" className="mb-1 block text-sm font-medium">
                Full Name <span className="text-red-600">*</span>
              </label>
              <Input
                id="new-staff-name"
                autoComplete="name"
                placeholder="e.g. Asha Sharma"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "new-staff-name-error" : undefined}
                {...register("name")}
              />
              {errors.name && (
                <p id="new-staff-name-error" className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="new-staff-email" className="mb-1 block text-sm font-medium">
                Email <span className="text-red-600">*</span>
              </label>
              <Input
                id="new-staff-email"
                type="email"
                autoComplete="email"
                placeholder="name@college.edu"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "new-staff-email-error" : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p id="new-staff-email-error" className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="new-staff-employee-id" className="mb-1 block text-sm font-medium">
                Employee ID <span className="text-red-600">*</span>
              </label>
              <Input
                id="new-staff-employee-id"
                placeholder="e.g. EMP-1024"
                aria-invalid={!!errors.employeeId}
                aria-describedby={errors.employeeId ? "new-staff-employee-id-error" : undefined}
                {...register("employeeId")}
              />
              {errors.employeeId && (
                <p id="new-staff-employee-id-error" className="mt-1 text-sm text-red-600">
                  {errors.employeeId.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="new-staff-department" className="mb-1 block text-sm font-medium">
                Department <span className="text-red-600">*</span>
              </label>
              <select
                id="new-staff-department"
                disabled={isLoadingDepartments || departments.length === 0}
                aria-invalid={!!errors.departmentId}
                aria-describedby={errors.departmentId ? "new-staff-department-error" : undefined}
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
              {errors.departmentId && (
                <p id="new-staff-department-error" className="mt-1 text-sm text-red-600">
                  {errors.departmentId.message}
                </p>
              )}
              {departmentsError && (
                <p className="mt-1 text-sm text-red-600">
                  {departmentsError}{" "}
                  <button type="button" onClick={onRetryDepartments} className="underline">
                    Try again
                  </button>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="new-staff-designation" className="mb-1 block text-sm font-medium">
                Designation <span className="text-red-600">*</span>
              </label>
              <Input
                id="new-staff-designation"
                placeholder="e.g. Assistant Professor"
                aria-invalid={!!errors.designation}
                aria-describedby={errors.designation ? "new-staff-designation-error" : undefined}
                {...register("designation")}
              />
              {errors.designation && (
                <p id="new-staff-designation-error" className="mt-1 text-sm text-red-600">
                  {errors.designation.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="new-staff-phone" className="mb-1 block text-sm font-medium">
                Phone Number <span className="text-text-muted">(optional)</span>
              </label>
              <Input
                id="new-staff-phone"
                type="tel"
                autoComplete="tel"
                placeholder="e.g. +91 98765 43210"
                {...register("phone")}
              />
            </div>

            {submissionError && (
              <div
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:col-span-2"
                role="alert"
              >
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
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createStaffMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createStaffMutation.isPending}>
              {createStaffMutation.isPending ? "Creating Staff..." : "Create Staff"}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}
