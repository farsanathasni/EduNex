"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useUpdateClubMutation } from "@/features/clubs/api/club-query";
import type { Club } from "@/features/clubs/api/clubs";
import {
  updateClubSchema,
  type UpdateClubInput,
} from "@/features/clubs/validation/club-schema";

export default function EditClubDialog({
  club,
  departmentName,
  onClose,
  onUpdated,
}: {
  club: Club;
  departmentName: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const updateClubMutation = useUpdateClubMutation();
  const form = useForm<UpdateClubInput>({
    resolver: zodResolver(updateClubSchema),
    defaultValues: {
      name: club.name,
      description: club.description ?? "",
    },
  });

  const onSubmit = (values: UpdateClubInput) => {
    updateClubMutation.mutate(
      { clubId: club.id, data: values },
      {
        onSuccess: () => {
          onUpdated();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-club-title"
        className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 id="edit-club-title" className="text-xl font-semibold">
              Edit club
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Update the details for {club.name}.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={updateClubMutation.isPending}
            aria-label="Close edit club dialog"
          >
            Close
          </Button>
        </header>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 overflow-y-auto p-5"
        >
          <div>
            <label
              htmlFor="edit-club-name"
              className="mb-1 block text-sm font-medium text-text"
            >
              Club name
            </label>
            <Input
              id="edit-club-name"
              {...form.register("name")}
              placeholder="e.g. Coding Club"
              maxLength={150}
              disabled={updateClubMutation.isPending}
            />
            {form.formState.errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <p className="mb-1 block text-sm font-medium text-text">
              Department
            </p>
            <p className="rounded-lg border border-border bg-background px-3 py-2 text-label text-text-muted">
              {departmentName}
            </p>
            <p className="mt-1 text-xs text-text-subtle">
              Department assignment is managed separately by the Principal.
            </p>
          </div>

          <div>
            <label
              htmlFor="edit-club-description"
              className="mb-1 block text-sm font-medium text-text"
            >
              Description
            </label>
            <textarea
              id="edit-club-description"
              {...form.register("description")}
              rows={4}
              maxLength={1000}
              placeholder="Describe the club (optional)"
              disabled={updateClubMutation.isPending}
              className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-label text-text outline-none transition placeholder:text-text-subtle hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {form.formState.errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {updateClubMutation.isError && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {updateClubMutation.error.message}
            </p>
          )}

          <footer className="flex justify-end gap-3 border-t border-border pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={updateClubMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateClubMutation.isPending}
            >
              {updateClubMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}
