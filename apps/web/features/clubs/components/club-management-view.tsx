"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import {
  useAssignClubDepartmentMutation,
  useClubsQuery,
  useCreateClubMutation,
} from "@/features/clubs/api/club-query";
import type { Club } from "@/features/clubs/api/clubs";
import {
  createClubSchema,
  createHodClubSchema,
  type CreateClubInput,
  type CreateHodClubInput,
} from "@/features/clubs/validation/club-schema";
import { useDepartment } from "@/features/departments/api/department-query";
import type { Department } from "@/features/departments/api/department";
import { useCreateHodClub, useHodClubs } from "@/features/hod/api/hod-query";
import { useAccess } from "@/lib/navigation/access";

type ClubManagementScope = "default" | "hod";

export default function ClubManagementView({
  scope = "default",
}: {
  scope?: ClubManagementScope;
}) {
  const { can, isSuperAdmin } = useAccess();
  const canCreateClub = can("club", "create");
  const isHodScope = scope === "hod";
  const canAssignDepartment = !isHodScope && isSuperAdmin;
  const { data: session, isPending: sessionPending } =
    authClient.useSession();

  const clubsQuery = useClubsQuery(undefined, !isHodScope);
  const hodClubsQuery = useHodClubs(isHodScope);
  const activeClubsQuery = isHodScope ? hodClubsQuery : clubsQuery;
  const departmentsQuery = useDepartment();
  const departments = departmentsQuery.data ?? [];

  if (sessionPending) {
    return <main className="p-8">Checking your session...</main>;
  }

  if (!session?.user) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Clubs</h1>
        <p className="mt-2 text-gray-600">
          Please log in to access club management.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fc] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header>
          <p className="text-sm font-semibold text-[#234c96]">
            EDUNEX / CLUB MANAGEMENT
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Clubs
          </h1>
          <p className="mt-2 text-gray-600">
            {isHodScope
              ? "Create and view clubs in your department."
              : "Create and view college clubs."}
          </p>
        </header>

        {canCreateClub &&
          (isHodScope ? (
            <HodClubCreateForm />
          ) : (
            <DefaultClubCreateForm />
          ))}

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Existing clubs
          </h2>

          {activeClubsQuery.isPending ? (
            <p className="text-gray-600">Loading clubs...</p>
          ) : activeClubsQuery.isError ? (
            <div>
              <p role="alert" className="text-red-600">
                {activeClubsQuery.error.message}
              </p>
              <button
                type="button"
                onClick={() => void activeClubsQuery.refetch()}
                className="mt-2 text-sm font-medium text-[#234c96]"
              >
                Try again
              </button>
            </div>
          ) : activeClubsQuery.data.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
              No clubs have been created yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {activeClubsQuery.data.map((club) => (
                <article
                  key={club.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {club.name}
                    </h3>
                    <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-[#234c96]">
                      ID: {club.id}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    {club.description || "No description provided."}
                  </p>

                  <p className="mt-3 text-sm text-gray-600">
                    Department:{" "}
                    <span className="font-medium text-gray-900">
                      {club.departmentId === null
                        ? "Unassigned"
                        : departments.find(
                            (department) =>
                              department.id === club.departmentId,
                          )?.name ?? `Department ${club.departmentId}`}
                    </span>
                  </p>

                  {canAssignDepartment && club.departmentId === null && (
                    <AssignDepartmentControl
                      club={club}
                      departments={departments}
                      departmentsPending={departmentsQuery.isPending}
                      departmentsError={departmentsQuery.isError}
                      onRetryDepartments={() =>
                        void departmentsQuery.refetch()
                      }
                    />
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function DefaultClubCreateForm() {
  const departmentsQuery = useDepartment();
  const createClubMutation = useCreateClubMutation();
  const form = useForm<CreateClubInput>({
    resolver: zodResolver(createClubSchema),
    defaultValues: {
      name: "",
      description: "",
      departmentId: "",
    },
  });

  const onSubmit = (values: CreateClubInput) => {
    createClubMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">
        Create a club
      </h2>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 space-y-4"
      >
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Club name
          </label>
          <input
            id="name"
            {...form.register("name")}
            placeholder="e.g. Coding Club"
            maxLength={150}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#234c96]"
          />
          {form.formState.errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.name.message}
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
            {...form.register("departmentId")}
            disabled={
              departmentsQuery.isPending ||
              departmentsQuery.isError ||
              createClubMutation.isPending
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-[#234c96] disabled:opacity-60"
          >
            <option value="">Select department</option>
            {(departmentsQuery.data ?? []).map((department) => (
              <option key={department.id} value={department.id}>
                {department.name} ({department.code})
              </option>
            ))}
          </select>
          {departmentsQuery.isError && (
            <p className="mt-1 text-sm text-red-600">
              Unable to load departments.{" "}
              <button
                type="button"
                onClick={() => void departmentsQuery.refetch()}
                className="underline"
              >
                Try again
              </button>
            </p>
          )}
          {form.formState.errors.departmentId && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.departmentId.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            {...form.register("description")}
            rows={3}
            placeholder="Describe the club (optional)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#234c96]"
          />
          {form.formState.errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        {createClubMutation.isError && (
          <p role="alert" className="text-sm text-red-600">
            {createClubMutation.error.message}
          </p>
        )}

        {createClubMutation.isSuccess && (
          <p role="status" className="text-sm text-green-700">
            Club created successfully.
          </p>
        )}

        <button
          type="submit"
          disabled={
            createClubMutation.isPending ||
            departmentsQuery.isPending ||
            departmentsQuery.isError
          }
          className="rounded-lg bg-[#234c96] px-5 py-2.5 font-medium text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {createClubMutation.isPending ? "Creating..." : "Create club"}
        </button>
      </form>
    </section>
  );
}

function HodClubCreateForm() {
  const createClubMutation = useCreateHodClub();
  const form = useForm<CreateHodClubInput>({
    resolver: zodResolver(createHodClubSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: CreateHodClubInput) => {
    createClubMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">
        Create a club
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        The club will be assigned to your department.
      </p>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 space-y-4"
      >
        <div>
          <label
            htmlFor="hod-name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Club name
          </label>
          <input
            id="hod-name"
            {...form.register("name")}
            placeholder="e.g. Coding Club"
            maxLength={150}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#234c96]"
          />
          {form.formState.errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="hod-description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="hod-description"
            {...form.register("description")}
            rows={3}
            placeholder="Describe the club (optional)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#234c96]"
          />
          {form.formState.errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        {createClubMutation.isError && (
          <p role="alert" className="text-sm text-red-600">
            {createClubMutation.error.message}
          </p>
        )}

        {createClubMutation.isSuccess && (
          <p role="status" className="text-sm text-green-700">
            Club created successfully.
          </p>
        )}

        <button
          type="submit"
          disabled={createClubMutation.isPending}
          className="rounded-lg bg-[#234c96] px-5 py-2.5 font-medium text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {createClubMutation.isPending ? "Creating..." : "Create club"}
        </button>
      </form>
    </section>
  );
}

function AssignDepartmentControl({
  club,
  departments,
  departmentsPending,
  departmentsError,
  onRetryDepartments,
}: {
  club: Club;
  departments: Department[];
  departmentsPending: boolean;
  departmentsError: boolean;
  onRetryDepartments: () => void;
}) {
  const [departmentId, setDepartmentId] = useState("");
  const assignMutation = useAssignClubDepartmentMutation();

  return (
    <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
      <label
        htmlFor={`department-${club.id}`}
        className="block text-sm font-medium text-gray-700"
      >
        Assign department
      </label>
      <div className="flex flex-wrap gap-2">
        <select
          id={`department-${club.id}`}
          value={departmentId}
          onChange={(event) => setDepartmentId(event.target.value)}
          disabled={
            departmentsPending ||
            departmentsError ||
            assignMutation.isPending
          }
          className="min-w-48 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#234c96] disabled:opacity-60"
        >
          <option value="">Select department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name} ({department.code})
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!departmentId || assignMutation.isPending}
          onClick={() => {
            assignMutation.mutate(
              {
                clubId: club.id,
                departmentId: Number(departmentId),
              },
              {
                onSuccess: () => setDepartmentId(""),
              },
            );
          }}
          className="rounded-lg border border-[#234c96] px-4 py-2 text-sm font-medium text-[#234c96] hover:bg-blue-50 disabled:opacity-60"
        >
          {assignMutation.isPending ? "Assigning..." : "Assign"}
        </button>
      </div>
      {departmentsError && (
        <p className="text-sm text-red-600">
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
        <p role="alert" className="text-sm text-red-600">
          {assignMutation.error.message}
        </p>
      )}
    </div>
  );
}
