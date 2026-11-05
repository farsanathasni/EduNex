"use client";

import Button from "@/components/ui/button";
import type { StudentListItem } from "@/features/students/api/student";
import { useDeleteStudent } from "@/features/students/api/student-query";

export default function DeleteStudentDialog({
  student,
  onClose,
  onDeleted,
}: {
  student: StudentListItem;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const mutation = useDeleteStudent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section role="alertdialog" aria-modal="true" aria-labelledby="delete-student-title" className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl">
        <h2 id="delete-student-title" className="text-xl font-semibold">Delete student?</h2>
        <p className="mt-3 text-sm text-text-muted">
          Delete <strong className="text-text">{student.name}</strong>&apos;s student profile? This is a soft delete. The profile is marked deleted and historical account data is retained.
        </p>
        {mutation.error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{mutation.error.message || "Unable to delete this student."}</p>}
        <footer className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button
            type="button"
            className="bg-red-600 text-white hover:bg-red-700"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(student.id, { onSuccess: onDeleted })}
          >
            {mutation.isPending ? "Deleting..." : "Delete student"}
          </Button>
        </footer>
      </section>
    </div>
  );
}
