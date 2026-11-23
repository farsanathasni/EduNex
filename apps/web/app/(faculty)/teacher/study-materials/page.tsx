"use client";

import axios from "axios";
import { useState } from "react";
import {
  useCreateTeacherMaterialMutation,
  useDeleteTeacherMaterialMutation,
  useTeacherMaterialsQuery,
  useUpdateTeacherMaterialMutation,
  useUploadTeacherMaterialMutation,
  type CreateMaterialInput,
  type StudyMaterial,
} from "@/features/teacher/api/teacher-query";

const initialForm: CreateMaterialInput = {
  title: "",
  description: "",
  fileUrl: "",
  fileType: "PDF",
  visibility: "department",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_FILES =
  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.mp4";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (typeof data?.message === "string" && data.message) {
      return data.message;
    }
  }

  return fallback;
}

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
  const [source, setSource] = useState<"link" | "file">("link");
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: materials, isLoading, isError, refetch } =
    useTeacherMaterialsQuery();

  const createMutation = useCreateTeacherMaterialMutation();
  const uploadMutation = useUploadTeacherMaterialMutation();
  const updateMutation = useUpdateTeacherMaterialMutation();
  const deleteMutation = useDeleteTeacherMaterialMutation();

  const isSaving =
    createMutation.isPending ||
    uploadMutation.isPending ||
    updateMutation.isPending;

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

  const resetForm = () => {
    setForm(initialForm);
    setFile(null);
    setFileInputKey((key) => key + 1);
    setEditingId(null);
    setProgress(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;

    if (selected && selected.size > MAX_FILE_SIZE) {
      setActionError("The file is too large. The maximum size is 10 MB.");
      setFile(null);
      return;
    }

    setActionError(null);
    setFile(selected);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionError(null);

    if (editingId !== null) {
      const input =
        source === "file" && file
          ? {
              title: form.title,
              description: form.description,
              visibility: form.visibility,
              file,
            }
          : {
              title: form.title,
              description: form.description,
              visibility: form.visibility,
              fileUrl: form.fileUrl,
              fileType: form.fileType,
            };

      updateMutation.mutate(
        { id: editingId, input, onProgress: setProgress },
        {
          onSuccess: resetForm,
          onError: (error) =>
            setActionError(getErrorMessage(error, "Could not update material.")),
        }
      );
      return;
    }

    if (source === "file") {
      if (!file) {
        setActionError("Please choose a file to upload.");
        return;
      }

      uploadMutation.mutate(
        {
          input: {
            title: form.title,
            description: form.description,
            visibility: form.visibility,
            fileType: form.fileType,
            file,
          },
          onProgress: setProgress,
        },
        {
          onSuccess: resetForm,
          onError: (error) =>
            setActionError(getErrorMessage(error, "Could not upload file.")),
        }
      );
      return;
    }

    createMutation.mutate(form, {
      onSuccess: resetForm,
      onError: (error) =>
        setActionError(getErrorMessage(error, "Could not add material.")),
    });
  };

  const handleEdit = (material: StudyMaterial) => {
    setEditingId(material.id);
    setForm({
      title: material.title,
      description: material.description ?? "",
      fileUrl: material.fileUrl,
      fileType: material.fileType ?? "PDF",
      visibility: material.visibility,
    });
    setSource(material.filePublicId ? "file" : "link");
    setFile(null);
    setFileInputKey((key) => key + 1);
    setProgress(null);
    setActionError(null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this material?")) {
      return;
    }

    deleteMutation.mutate(id, {
      onError: (error) =>
        setActionError(getErrorMessage(error, "Could not delete material.")),
    });
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
        <h2 className="text-lg font-semibold">
          {editingId === null ? "Add Study Material" : "Edit Study Material"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSource("link")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                source === "link"
                  ? "bg-primary text-white"
                  : "border border-border text-text-muted"
              }`}
            >
              Paste a link
            </button>
            <button
              type="button"
              onClick={() => setSource("file")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                source === "file"
                  ? "bg-primary text-white"
                  : "border border-border text-text-muted"
              }`}
            >
              Upload a file
            </button>
          </div>

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

          {source === "link" ? (
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
          ) : (
            <div>
              <label className="mb-2 block text-sm font-medium">
                File {editingId === null ? "*" : "(leave empty to keep current)"}
              </label>
              <input
                key={fileInputKey}
                type="file"
                accept={ACCEPTED_FILES}
                onChange={handleFileChange}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <p className="mt-2 text-xs text-text-muted">
                PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, PNG, JPG, JPEG or MP4.
                Maximum 10 MB.
              </p>
              {file && (
                <p className="mt-2 text-sm text-text">
                  {file.name} ({formatFileSize(file.size)})
                </p>
              )}
            </div>
          )}

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

          {progress !== null && (
            <div>
              <p className="mb-1 text-xs text-text-muted">Uploading… {progress}%</p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {actionError && (
            <p className="text-sm text-red-500">{actionError}</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              {isSaving
                ? "Saving..."
                : editingId === null
                  ? "Add Material"
                  : "Save Changes"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-border px-5 py-3 text-sm font-medium"
              >
                Cancel
              </button>
            )}
          </div>
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

                    {material.fileName && (
                      <span className="rounded-md bg-background px-2 py-1 text-muted">
                        {material.fileName}
                        {material.fileSize !== null &&
                          ` · ${formatFileSize(material.fileSize)}`}
                      </span>
                    )}
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

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(material)}
                    className="rounded-lg border border-border px-4 py-2 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(material.id)}
                    disabled={deleteMutation.isPending}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
