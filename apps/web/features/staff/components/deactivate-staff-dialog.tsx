"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/button";
import { getStaffApiError } from "@/features/staff/api/staff-error";
import { useDeactivateStaff } from "@/features/staff/api/staff-query";
import type { StaffListItem } from "@/features/staff/api/staff";

type DeactivateStaffDialogProps = {
  staff: StaffListItem;
  onClose: () => void;
  onDeactivated: () => void;
};

export default function DeactivateStaffDialog({
  staff,
  onClose,
  onDeactivated,
}: DeactivateStaffDialogProps) {
  const [error, setError] = useState<{ message: string; details: string[] } | null>(null);
  const mutation = useDeactivateStaff();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !mutation.isPending) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mutation.isPending, onClose]);

  const confirmDeactivation = async () => {
    if (mutation.isPending) return;
    setError(null);
    try {
      await mutation.mutateAsync(staff.id);
      onDeactivated();
    } catch (cause) {
      setError(getStaffApiError(cause));
    }
  };

  const closeIfIdle = () => {
    if (!mutation.isPending) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeIfIdle();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="deactivate-staff-title"
        aria-describedby="deactivate-staff-description"
        className="w-full max-w-lg rounded-2xl border border-border bg-surface p-5 shadow-xl sm:p-6"
      >
        <h2 id="deactivate-staff-title" className="text-xl font-bold">
          Deactivate staff account?
        </h2>
        <p className="mt-3 text-sm leading-6 text-text-muted">
          You are about to deactivate <strong className="text-text">{staff.name}</strong>’s staff account.
          The account and its records will be retained; this does not permanently delete them.
        </p>
        <p id="deactivate-staff-description" className="sr-only">
          Confirming will deactivate this staff account while retaining the account and its records.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
            <p className="font-medium">{error.message}</p>
            {error.details.length > 0 && (
              <ul className="mt-2 list-inside list-disc space-y-1">
                {error.details.map((detail, index) => (
                  <li key={`${index}-${detail}`}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <footer className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={closeIfIdle} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => void confirmDeactivation()}
            disabled={mutation.isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {mutation.isPending ? "Deactivating..." : "Deactivate Account"}
          </Button>
        </footer>
      </section>
    </div>
  );
}
