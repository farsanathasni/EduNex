"use client";

import { useState } from "react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useCreateDepartments } from "@/features/departments/api/department-query";
import {
  createDepartmentsFormSchema,
  type DepartmentFormValues,
} from "@/features/departments/validation/department-schema";

type DepartmentRow = DepartmentFormValues;
type DepartmentField = keyof DepartmentRow;
type FieldErrors = Partial<Record<DepartmentField, string>>;

const emptyDepartment = (): DepartmentRow => ({ name: "", code: "", description: "" });

export default function CreateDepartmentsModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (count: number) => void;
}) {
  const [rows, setRows] = useState<DepartmentRow[]>([emptyDepartment()]);
  const [rowErrors, setRowErrors] = useState<FieldErrors[]>([]);
  const [formError, setFormError] = useState("");
  const createMutation = useCreateDepartments();

  const updateRow = (index: number, field: DepartmentField, value: string) => {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
    setRowErrors((current) =>
      current.map((errors, rowIndex) =>
        rowIndex === index ? { ...errors, [field]: undefined } : errors,
      ),
    );
    setFormError("");
    createMutation.reset();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    const parsed = createDepartmentsFormSchema.safeParse(rows);
    if (!parsed.success) {
      const nextErrors = rows.map(() => ({} as FieldErrors));
      let generalError = "";
      for (const issue of parsed.error.issues) {
        const [rowIndex, field] = issue.path;
        if (
          typeof rowIndex === "number" &&
          typeof field === "string" &&
          rowIndex < nextErrors.length
        ) {
          nextErrors[rowIndex][field as DepartmentField] ??= issue.message;
        } else {
          generalError ||= issue.message;
        }
      }
      setRowErrors(nextErrors);
      setFormError(generalError);
      return;
    }

    createMutation.mutate(parsed.data, {
      onSuccess: (createdDepartments) => onCreated(createdDepartments.length),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-departments-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 id="create-departments-title" className="text-xl font-semibold">Create Departments</h2>
            <p className="mt-1 text-sm text-text-muted">Add one or more departments.</p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} aria-label="Close create departments dialog">×</Button>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-4 overflow-y-auto p-5">
            {rows.map((row, index) => (
              <fieldset key={index} className="space-y-3 rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <legend className="px-1 text-sm font-semibold">Department {index + 1}</legend>
                  {rows.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={createMutation.isPending}
                      onClick={() => {
                        setRows((current) => current.filter((_, rowIndex) => rowIndex !== index));
                        setRowErrors((current) => current.filter((_, rowIndex) => rowIndex !== index));
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Department name" error={rowErrors[index]?.name}>
                    <Input
                      value={row.name}
                      onChange={(event) => updateRow(index, "name", event.target.value)}
                      placeholder="e.g. Computer Science"
                      maxLength={100}
                      disabled={createMutation.isPending}
                      aria-invalid={!!rowErrors[index]?.name}
                    />
                  </Field>
                  <Field label="Department code" error={rowErrors[index]?.code}>
                    <Input
                      value={row.code}
                      onChange={(event) => updateRow(index, "code", event.target.value)}
                      placeholder="e.g. CSE"
                      maxLength={10}
                      disabled={createMutation.isPending}
                      aria-invalid={!!rowErrors[index]?.code}
                    />
                  </Field>
                </div>
                <Field label="Description" error={rowErrors[index]?.description}>
                  <textarea
                    value={row.description}
                    onChange={(event) => updateRow(index, "description", event.target.value)}
                    placeholder="Briefly describe this department (optional)"
                    maxLength={500}
                    rows={2}
                    disabled={createMutation.isPending}
                    aria-invalid={!!rowErrors[index]?.description}
                    className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  />
                </Field>
              </fieldset>
            ))}

            {rows.length < 50 && (
              <Button
                type="button"
                variant="outline"
                disabled={createMutation.isPending}
                onClick={() => {
                  setRows((current) => [...current, emptyDepartment()]);
                  setRowErrors((current) => [...current, {}]);
                }}
              >
                + Add another department
              </Button>
            )}
            {formError && <p role="alert" className="text-sm text-red-600">{formError}</p>}
            {createMutation.error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {createMutation.error.message || "Unable to create departments."}
              </p>
            )}
          </div>

          <footer className="flex flex-wrap justify-end gap-3 border-t border-border p-5">
            <Button variant="outline" onClick={onClose} disabled={createMutation.isPending}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create departments"}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function Field({
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
