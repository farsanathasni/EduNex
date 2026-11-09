"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useCreateClubMutation } from "@/features/clubs/api/club-query";
import {
  createClubSchema,
  createHodClubSchema,
  type CreateClubInput,
  type CreateHodClubInput,
} from "@/features/clubs/validation/club-schema";
import { useDepartment } from "@/features/departments/api/department-query";
import { useCreateHodClub } from "@/features/hod/api/hod-query";

type ClubCreateModalProps = {
  scope: "default" | "hod";
  onClose: () => void;
  onCreated: () => void;
};

export default function ClubCreateModal({
  scope,
  onClose,
  onCreated,
}: ClubCreateModalProps) {
  return scope === "hod" ? (
    <HodClubCreateModal onClose={onClose} onCreated={onCreated} />
  ) : (
    <DefaultClubCreateModal onClose={onClose} onCreated={onCreated} />
  );
}

function DefaultClubCreateModal({
  onClose,
  onCreated,
}: Omit<ClubCreateModalProps, "scope">) {
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
        onCreated();
      },
    });
  };

  return (
    <ModalShell
      title="Add Club"
      description="Create a club and assign it to a department."
      onClose={onClose}
      closeDisabled={createClubMutation.isPending}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 overflow-y-auto p-5"
      >
        <div>
          <label
            htmlFor="create-club-name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Club name
          </label>
          <Input
            id="create-club-name"
            {...form.register("name")}
            placeholder="e.g. Coding Club"
            maxLength={150}
            disabled={createClubMutation.isPending}
          />
          {form.formState.errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="create-club-department"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <select
            id="create-club-department"
            {...form.register("departmentId")}
            disabled={
              departmentsQuery.isPending ||
              departmentsQuery.isError ||
              createClubMutation.isPending
            }
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-label text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
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
            htmlFor="create-club-description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="create-club-description"
            {...form.register("description")}
            rows={3}
            maxLength={1000}
            placeholder="Describe the club (optional)"
            disabled={createClubMutation.isPending}
            className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-label text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {form.formState.errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        {createClubMutation.isError && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {createClubMutation.error.message}
          </p>
        )}

        <FormActions
          onClose={onClose}
          isPending={createClubMutation.isPending}
          submitLabel="Create club"
          pendingLabel="Creating..."
          disabled={
            departmentsQuery.isPending || departmentsQuery.isError
          }
        />
      </form>
    </ModalShell>
  );
}

function HodClubCreateModal({
  onClose,
  onCreated,
}: Omit<ClubCreateModalProps, "scope">) {
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
        onCreated();
      },
    });
  };

  return (
    <ModalShell
      title="Add Club"
      description="The club will be assigned to your department."
      onClose={onClose}
      closeDisabled={createClubMutation.isPending}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 overflow-y-auto p-5"
      >
        <div>
          <label
            htmlFor="create-hod-club-name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Club name
          </label>
          <Input
            id="create-hod-club-name"
            {...form.register("name")}
            placeholder="e.g. Coding Club"
            maxLength={150}
            disabled={createClubMutation.isPending}
          />
          {form.formState.errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="create-hod-club-description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="create-hod-club-description"
            {...form.register("description")}
            rows={3}
            maxLength={1000}
            placeholder="Describe the club (optional)"
            disabled={createClubMutation.isPending}
            className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-label text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {form.formState.errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        {createClubMutation.isError && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {createClubMutation.error.message}
          </p>
        )}

        <FormActions
          onClose={onClose}
          isPending={createClubMutation.isPending}
          submitLabel="Create club"
          pendingLabel="Creating..."
        />
      </form>
    </ModalShell>
  );
}

function ModalShell({
  title,
  description,
  onClose,
  closeDisabled,
  children,
}: {
  title: string;
  description: string;
  onClose: () => void;
  closeDisabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="club-create-title"
        className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 id="club-create-title" className="text-xl font-semibold">
              {title}
            </h2>
            <p className="mt-1 text-sm text-text-muted">{description}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={closeDisabled}
            aria-label="Close add club dialog"
          >
            Close
          </Button>
        </header>
        {children}
      </section>
    </div>
  );
}

function FormActions({
  onClose,
  isPending,
  submitLabel,
  pendingLabel,
  disabled = false,
}: {
  onClose: () => void;
  isPending: boolean;
  submitLabel: string;
  pendingLabel: string;
  disabled?: boolean;
}) {
  return (
    <footer className="flex justify-end gap-3 border-t border-border pt-4">
      <Button
        variant="outline"
        onClick={onClose}
        disabled={isPending}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isPending || disabled}>
        {isPending ? pendingLabel : submitLabel}
      </Button>
    </footer>
  );
}
