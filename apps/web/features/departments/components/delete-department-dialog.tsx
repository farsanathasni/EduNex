"use client";

import Button from "@/components/ui/button";
import { useDeleteDepartment } from "@/features/departments/api/department-query";
import type { Department } from "@/features/departments/api/department";

export default function DeleteDepartmentDialog({
  department,
  onClose,
  onDeleted,
}: {
  department: Department;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const deleteMutation = useDeleteDepartment();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section role="alertdialog" aria-modal="true" aria-labelledby="delete-department-title" className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-xl">
        <h2 id="delete-department-title" className="text-xl font-semibold">Delete department?</h2>
        <p className="mt-3 text-sm text-text-muted">
          You are about to delete <strong className="text-text">{department.name}</strong> ({department.code}).
          Deletion may be blocked while students are assigned to this department.
        </p>
        <p className="mt-2 text-sm text-text-muted">
          This action removes the department record. The department will remain in the directory unless the server confirms the deletion.
        </p>
        {deleteMutation.error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {deleteMutation.error.message || "Unable to delete department."}
          </p>
        )}
        <footer className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={deleteMutation.isPending}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => deleteMutation.mutate(department.id, { onSuccess: onDeleted })}
            disabled={deleteMutation.isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete department"}
          </Button>
        </footer>
      </section>
    </div>
  );
}
