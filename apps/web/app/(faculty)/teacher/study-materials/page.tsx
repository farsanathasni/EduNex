
"use client";

import { useState } from "react";
import {
  useCreateTeacherMaterialMutation,
  useDeleteTeacherMaterialMutation,
  useTeacherMaterialsQuery,
  type CreateMaterialInput,
} from "@/features/teacher/api/teacher-query";

const initialForm: CreateMaterialInput = {
  title: "",
  description: "",
  fileUrl: "",
  fileType: "PDF",
  visibility: "department",
};


function TeacherMaterialsSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            <div className="h-5 w-48 max-w-full rounded bg-border" />

            <div className="mt-3 h-4 w-64 max-w-full rounded bg-border" />

            <div className="mt-4 flex gap-2">
              <div className="h-6 w-14 rounded-md bg-border" />
              <div className="h-6 w-24 rounded-md bg-border" />
            </div>

            <div className="mt-4 h-4 w-28 rounded bg-border" />
          </div>

          <div className="h-9 w-20 shrink-0 rounded-lg bg-border" />
        </div>
      ))}
    </div>
  );
}


export default function TeacherMaterialsPage() {
  const [form, setForm] = useState<CreateMaterialInput>(initialForm);

  const { data: materials, isLoading, isError, refetch } =
    useTeacherMaterialsQuery();

  const createMutation = useCreateTeacherMaterialMutation();
  const deleteMutation = useDeleteTeacherMaterialMutation();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createMutation.mutate(form, {
      onSuccess: () => {
        setForm(initialForm);
      },
    });
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this material?")) {
      return;
    }

    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Study Materials</h1>
        <p className="mt-2 text-sm text-muted">
          Add and manage learning resources for students.
        </p>
      </div>

      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Add Study Material</h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter material title"
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter a short description"
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              File URL *
            </label>
            <input
              name="fileUrl"
              type="url"
              value={form.fileUrl}
              onChange={handleChange}
              placeholder="https://example.com/material.pdf"
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                File Type
              </label>
              <select
                name="fileType"
                value={form.fileType}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              >
                <option value="PDF">PDF</option>
                <option value="DOC">DOC</option>
                <option value="PPT">PPT</option>
                <option value="VIDEO">Video</option>
                <option value="LINK">Link</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Visibility
              </label>
              <select
                name="visibility"
                value={form.visibility}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              >
                <option value="department">Department</option>
                <option value="campus">Campus</option>
              </select>
            </div>
          </div>

          {createMutation.isError && (
            <p className="text-sm text-red-500">
              Failed to add material. Please try again.
            </p>
          )}

          {createMutation.isSuccess && (
            <p className="text-sm text-green-600">
              Material added successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            {createMutation.isPending ? "Adding..." : "Add Material"}
          </button>
        </form>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Uploaded Materials</h2>
          <p className="mt-1 text-sm text-muted">
            {materials?.length ?? 0} materials available
          </p>
        </div>

{isLoading ? (
  <TeacherMaterialsSkeleton />
        ) : isError ? (
          <div>
            <p className="text-red-500">Unable to load materials.</p>
            <button onClick={() => refetch()} className="mt-3 text-primary">
              Try again
            </button>
          </div>
        ) : !materials?.length ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="font-medium">No study materials yet</p>
            <p className="mt-2 text-sm text-muted">
              Add your first learning resource using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {materials.map((material) => (
              <div
                key={material.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold">{material.title}</h3>

                  {material.description && (
                    <p className="mt-1 text-sm text-muted">
                      {material.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-md bg-primary-subtle px-2 py-1 text-primary">
                      {material.fileType || "File"}
                    </span>

                    <span className="rounded-md bg-background px-2 py-1 text-muted">
                      {material.visibility}
                    </span>
                  </div>

                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm text-primary hover:underline"
                  >
                    Open material
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(material.id)}
                  disabled={deleteMutation.isPending}
                  className="shrink-0 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {deleteMutation.isError && (
          <p className="mt-3 text-sm text-red-500">
            Could not delete material. You can only delete materials uploaded by you.
          </p>
        )}
      </section>
    </div>
  );
}
