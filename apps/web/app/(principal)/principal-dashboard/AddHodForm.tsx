"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addHodSchema, type AddHodFormData } from "@/validation/add-hod.validation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";





type Department = {
  id: number;
  name: string;
  code: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

async function fetchDepartments(): Promise<Department[]> {
  const response = await fetch(`${API_URL}/api/principal/departments`, {
    credentials: "include",
  });

  const result: ApiResponse<Department[]> = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load departments");
  }

  return result.data;
}

async function createHod(data: AddHodFormData) {
  const response = await fetch(`${API_URL}/api/principal/hods`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create HOD account");
  }

  return result;
}

export default function AddHodForm() {
  const [successMessage, setSuccessMessage] = useState("");

  // Load departments using TanStack Query
  const {
    data: departments = [],
    isLoading: isLoadingDepartments,
    error: departmentError,
  } = useQuery({
    queryKey: ["principal", "departments"],
    queryFn: fetchDepartments,
  });

  // Form handling and validation
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

  // Create HOD using TanStack Query
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
    <section className="mx-auto w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Add Head of Department
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Create an HOD account and assign a department.
        </p>
      </div>

      {successMessage && (
        <p
          role="status"
          className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700"
        >
          {successMessage}
        </p>
      )}

      {createHodMutation.isError && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {createHodMutation.error.message}
        </p>
      )}

      {departmentError && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          Failed to load departments: {departmentError.message}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Full name
          </label>

          <input
            id="name"
            {...register("name")}
            placeholder="Enter full name"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            {...register("email")}
            placeholder="hod@example.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Temporary password
          </label>

          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
            placeholder="Minimum 8 characters"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="employeeId"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Employee ID
          </label>

          <input
            id="employeeId"
            {...register("employeeId")}
            placeholder="e.g. HOD001"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.employeeId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.employeeId.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="departmentId"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Department
          </label>

          <select
            id="departmentId"
            {...register("departmentId")}
            disabled={isLoadingDepartments || departments.length === 0}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            <option value="">
              {isLoadingDepartments
                ? "Loading departments..."
                : departments.length === 0
                  ? "No departments available"
                  : "Select department"}
            </option>

            {departments.map((department) => (
              <option key={department.id} value={department.id}>
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
          <label
            htmlFor="designation"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Designation
          </label>

          <input
            id="designation"
            {...register("designation")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.designation && (
            <p className="mt-1 text-sm text-red-600">
              {errors.designation.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Phone number (optional)
          </label>

          <input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="Enter phone number"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={createHodMutation.isPending || departments.length === 0}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createHodMutation.isPending ? "Creating account..." : "Create HOD"}
        </button>
      </form>
    </section>
  );
}