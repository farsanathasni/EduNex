
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useClubsQuery,useCreateClubMutation } from "../clubQuery";
import {
  createClubSchema,
  type CreateClubInput,
} from "@/validation/club-schema";

export default function ClubsPage() {
  const { data: session, isPending: sessionPending } =
    authClient.useSession();

  const form = useForm<CreateClubInput>({
    resolver: zodResolver(createClubSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const clubsQuery = useClubsQuery();
  const createClubMutation = useCreateClubMutation();

  const onSubmit = (values: CreateClubInput) => {
    createClubMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

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
            Create and view college clubs.
          </p>
        </header>

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
              disabled={createClubMutation.isPending}
              className="rounded-lg bg-[#234c96] px-5 py-2.5 font-medium text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {createClubMutation.isPending
                ? "Creating..."
                : "Create club"}
            </button>
          </form>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Existing clubs
          </h2>

          {clubsQuery.isPending ? (
            <p className="text-gray-600">Loading clubs...</p>
          ) : clubsQuery.isError ? (
            <div>
              <p role="alert" className="text-red-600">
                {clubsQuery.error.message}
              </p>
              <button
                type="button"
                onClick={() => void clubsQuery.refetch()}
                className="mt-2 text-sm font-medium text-[#234c96]"
              >
                Try again
              </button>
            </div>
          ) : clubsQuery.data.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
              No clubs have been created yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {clubsQuery.data.map((club) => (
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
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
