"use client";

import Button from "@/components/ui/button";
import { useDeleteClubMutation } from "@/features/clubs/api/club-query";
import type { Club } from "@/features/clubs/api/clubs";

export default function DeleteClubDialog({
  club,
  onClose,
  onDeleted,
}: {
  club: Club;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const deleteClubMutation = useDeleteClubMutation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-club-title"
        className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-xl"
      >
        <h2 id="delete-club-title" className="text-xl font-semibold">
          Delete club?
        </h2>
        <p className="mt-3 text-sm text-text-muted">
          You selected <strong className="text-text">{club.name}</strong>.
          This action permanently removes the club and cannot be undone.
        </p>
        <p className="mt-2 text-sm text-text-muted">
          If events, memberships, coordinators, or announcements still
          reference this club, deletion will be blocked and the reason will be
          shown below.
        </p>

        {deleteClubMutation.isError && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {deleteClubMutation.error.message}
          </p>
        )}

        <footer className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleteClubMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteClubMutation.mutate(club.id, {
                onSuccess: () => {
                  onDeleted();
                },
              });
            }}
            disabled={deleteClubMutation.isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {deleteClubMutation.isPending ? "Deleting..." : "Delete club"}
          </Button>
        </footer>
      </section>
    </div>
  );
}
