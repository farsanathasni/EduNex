"use client";

import { useState } from "react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  useUpdateDepartment,
} from "@/features/departments/api/department-query";
import type { Department } from "@/features/departments/api/department";
import { departmentFormSchema } from "@/features/departments/validation/department-schema";

export default function EditDepartmentModal({
  department,
  onClose,
  onUpdated,
}: {
  department: Department;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [name, setName] = useState(department.name);
  const [code, setCode] = useState(department.code);
  const [description, setDescription] = useState(department.description ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateMutation = useUpdateDepartment();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = departmentFormSchema.safeParse({ name, code, description });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") nextErrors[field] ??= issue.message;
      }
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    updateMutation.mutate(
      { id: department.id, data: parsed.data },
      { onSuccess: onUpdated },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="edit-department-title" className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
        <header className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 id="edit-department-title" className="text-xl font-semibold">Edit Department</h2>
            <p className="mt-1 text-sm text-text-muted">Update {department.name} details.</p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} aria-label="Close edit department dialog">×</Button>
        </header>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <FormField label="Department name" error={errors.name}>
            <Input value={name} onChange={(event) => setName(event.target.value)} maxLength={100} disabled={updateMutation.isPending} aria-invalid={!!errors.name} />
          </FormField>
          <FormField label="Department code" error={errors.code}>
            <Input value={code} onChange={(event) => setCode(event.target.value)} maxLength={10} disabled={updateMutation.isPending} aria-invalid={!!errors.code} />
          </FormField>
          <FormField label="Description" error={errors.description}>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={500}
              rows={3}
              disabled={updateMutation.isPending}
              aria-invalid={!!errors.description}
              className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </FormField>
          {updateMutation.error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {updateMutation.error.message || "Unable to update department."}
            </p>
          )}
          <footer className="flex justify-end gap-3 border-t border-border pt-4">
            <Button variant="outline" onClick={onClose} disabled={updateMutation.isPending}>Cancel</Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-sm font-medium">
      <span>{label}</span>
      {children}
      {error && <span className="block text-xs font-normal text-red-600">{error}</span>}
    </label>
  );
}
