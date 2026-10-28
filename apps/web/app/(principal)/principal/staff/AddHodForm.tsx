
"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  addHodSchema,
  type AddHodFormData,
} from "@/validation/add-hod.validation";

import {
  getPrincipalDepartments,
  createHod,
} from "@/lib/principal";

type Department = {
  id: number;
  name: string;
  code: string;
};

type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

function extractDepartments(result: unknown): Department[] {
  if (Array.isArray(result)) {
    return result;
  }

  if (!result || typeof result !== "object") {
    throw new Error("Invalid departments API response.");
  }

  const response = result as ApiResponse<unknown>;

  if (response.success === false) {
    throw new Error(
      response.message || "Failed to load departments."
    );
  }

 
  if (Array.isArray(response.data)) {
    return response.data as Department[];
  }

  if (
    response.data &&
    typeof response.data === "object" &&
    Array.isArray(
      (response.data as { data?: unknown }).data
    )
  ) {
    return (response.data as { data: Department[] }).data;
  }

  throw new Error(
    "Departments response does not contain a department array. Check the API response."
  );
}

export default function AddHodForm() {
  const [successMessage, setSuccessMessage] = useState("");

  const {
    data: departments = [],
    isLoading: isLoadingDepartments,
    error: departmentError,
  } = useQuery<Department[]>({
    queryKey: ["principal", "departments", "add-hod-form"],
    queryFn: async () => {
      const result = await getPrincipalDepartments();
      return extractDepartments(result);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddHodFormData>({
    resolver: zodResolver(addHodSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      employeeId: "",
      departmentId: "",
      designation: "Head of Department",
      phone: "",
    },
  });

  const createHodMutation = useMutation({
    mutationFn: createHod,
    onSuccess: () => {
      setSuccessMessage("HOD account created successfully!");
      reset();
    },
    onError: () => {
      setSuccessMessage("");
    },
  });

  const onSubmit = (data: AddHodFormData) => {
    setSuccessMessage("");
    createHodMutation.mutate(data);
  };

  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      <h2 className="text-xl font-bold">Create HOD Account</h2>

      <p className="mt-2 text-sm text-text-muted">
        Create a Head of Department account and assign a department.
      </p>

      {successMessage && (
        <p className="mt-4 rounded-lg bg-green-100 p-3 text-sm text-green-800">
          {successMessage}
        </p>
      )}

      {departmentError && (
        <p className="mt-4 text-sm text-red-600">
          {departmentError instanceof Error
            ? departmentError.message
            : "Failed to load departments."}
        </p>
      )}

      {createHodMutation.isError && (
        <p className="mt-4 text-sm text-red-600">
          {createHodMutation.error instanceof Error
            ? createHodMutation.error.message
            : "Failed to create HOD account."}
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 grid gap-5 sm:grid-cols-2"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">
            Full Name
          </label>
          <input
            {...register("name")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            placeholder="Enter full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Initial Password
          </label>
          <input
            type="password"
            {...register("password")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            placeholder="Enter initial password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Employee ID
          </label>
          <input
            {...register("employeeId")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            placeholder="Enter employee ID"
          />
          {errors.employeeId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.employeeId.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Department
          </label>

          <select
            {...register("departmentId")}
            disabled={
              isLoadingDepartments || departments.length === 0
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          >
            <option value="">
              {isLoadingDepartments
                ? "Loading departments..."
                : departments.length === 0
                  ? "No departments available"
                  : "Select department"}
            </option>

            {departments.map((department) => (
              <option
                key={department.id}
                value={String(department.id)}
              >
                {department.name} ({department.code})
              </option>
            ))}
          </select>

          {errors.departmentId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.departmentId.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Designation
          </label>
          <input
            {...register("designation")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            placeholder="Head of Department"
          />
          {errors.designation && (
            <p className="mt-1 text-sm text-red-600">
              {errors.designation.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Phone
          </label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={
              createHodMutation.isPending ||
              departments.length === 0
            }
            className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createHodMutation.isPending
              ? "Creating HOD..."
              : "Create HOD"}
          </button>
        </div>
      </form>
    </section>
  );
}
