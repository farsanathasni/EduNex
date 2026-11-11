"use client";

import { useState } from "react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useAccess } from "@/lib/navigation/access";
import type { Club } from "@/features/clubs/api/clubs";
import { useClubListQuery } from "@/features/clubs/api/club-query";
import AssignClubDepartmentDialog from "@/features/clubs/components/assign-club-department-dialog";
import ClubCreateModal from "@/features/clubs/components/club-create-modal";
import DeleteClubDialog from "@/features/clubs/components/delete-club-dialog";
import EditClubDialog from "@/features/clubs/components/edit-club-dialog";
import { useDepartment } from "@/features/departments/api/department-query";
import { useHodClubListQuery } from "@/features/hod/api/hod-query";
import ClubManagementSkeleton from "@/features/clubs/components/club-management-skeleton";

type ClubManagementScope = "default" | "hod";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function ClubManagementView({
  scope = "default",
}: {
  scope?: ClubManagementScope;
}) {
  const { can, isSuperAdmin, me } = useAccess();
  const canCreateClub = can("club", "create");
  const canEditClub = can("club", "update");
  const canDeleteClub = can("club", "delete");
  const isHodScope = scope === "hod";
  const canAssignDepartment = !isHodScope && isSuperAdmin;
  const hodDepartmentId = me?.staffProfile?.departmentId ?? null;
  const { data: session, isPending: sessionPending } =
    authClient.useSession();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [deletingClub, setDeletingClub] = useState<Club | null>(null);
  const [assigningClub, setAssigningClub] = useState<Club | null>(null);
  const [notice, setNotice] = useState("");

  const params = { search: search.trim(), page, limit };
  const clubsQuery = useClubListQuery(params, !isHodScope);
  const hodClubsQuery = useHodClubListQuery(params, isHodScope);
  const activeClubsQuery = isHodScope ? hodClubsQuery : clubsQuery;
  const departmentsQuery = useDepartment();
  const departments = departmentsQuery.data ?? [];

  const clubs = activeClubsQuery.data?.clubs ?? [];
  const pagination = activeClubsQuery.data?.pagination;
  const totalPages = pagination?.totalPages ?? 0;
  const currentPage = pagination?.page ?? page;

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

  const getDepartmentName = (club: Club) => {
    if (club.departmentId === null) return "Unassigned";

    return (
      departments.find(
        (department) => department.id === club.departmentId,
      )?.name ?? `Department ${club.departmentId}`
    );
  };

  const isWithinHodDepartment = (club: Club) =>
    !isHodScope ||
    (hodDepartmentId !== null && club.departmentId === hodDepartmentId);

  const resetPage = () => {
    setPage(1);
    setNotice("");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">
              EDUNEX / CLUB MANAGEMENT
            </p>
            <h1 className="mt-2 text-3xl font-bold text-text">Clubs</h1>
            <p className="mt-2 text-sm text-text-muted">
              {isHodScope
                ? "Browse clubs across every department. Create, edit, and delete are limited to clubs in your department."
                : "Create and manage college clubs across every department."}
            </p>
          </div>
          {canCreateClub && (
            <Button
              onClick={() => {
                setNotice("");
                setIsCreateOpen(true);
              }}
            >
              Add Club
            </Button>
          )}
        </header>

        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="max-w-xl">
            <label
              htmlFor="club-search"
              className="mb-2 block text-sm font-medium text-text"
            >
              Search clubs
            </label>
            <Input
              id="club-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                resetPage();
              }}
              placeholder="Search by club name"
              maxLength={150}
            />
          </div>
        </section>

        {notice && (
          <p
            role="status"
            className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
          >
            {notice}
          </p>
        )}

        <section className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
            <h2 className="font-semibold text-text">Existing clubs</h2>
            <p className="text-sm text-text-muted">
              {pagination?.total ?? 0} club(s) found
            </p>
          </div>

          {activeClubsQuery.isPending ? (
  <ClubManagementSkeleton />
) : activeClubsQuery.isError ?  (
            <div className="p-8 text-center">
              <p role="alert" className="text-sm text-red-600">
                {activeClubsQuery.error.message}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void activeClubsQuery.refetch()}
                className="mt-4"
              >
                Try again
              </Button>
            </div>
          ) : clubs.length === 0 ? (
            <p className="p-8 text-center text-sm text-text-muted">
              {search.trim()
                ? "No clubs match your search."
                : "No clubs have been created yet."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-border bg-background text-text-muted">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Club Name
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Department
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Description
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clubs.map((club) => {
                    const canAssignThisClub =
                      canAssignDepartment && club.departmentId === null;
                    const canEditThisClub =
                      canEditClub && isWithinHodDepartment(club);
                    const canDeleteThisClub =
                      canDeleteClub && isWithinHodDepartment(club);

                    return (
                      <tr
                        key={club.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-4 py-3 font-medium text-text">
                          {club.name}
                        </td>
                        <td className="px-4 py-3 text-text-muted">
                          {getDepartmentName(club)}
                        </td>
                        <td className="max-w-md px-4 py-3 text-text-muted">
                          <span className="line-clamp-2">
                            {club.description || "No description provided."}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {canAssignThisClub && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setNotice("");
                                  setAssigningClub(club);
                                }}
                              >
                                Assign department
                              </Button>
                            )}
                            {canEditThisClub && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setNotice("");
                                  setEditingClub(club);
                                }}
                              >
                                Edit
                              </Button>
                            )}
                            {canDeleteThisClub && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setNotice("");
                                  setDeletingClub(club);
                                }}
                                className="border-red-200 text-red-700 hover:bg-red-50"
                              >
                                Delete
                              </Button>
                            )}
                            {!canAssignThisClub &&
                              !canEditThisClub &&
                              !canDeleteThisClub && (
                                <span className="text-text-muted">—</span>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!activeClubsQuery.isPending &&
            !activeClubsQuery.isError && (
              <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm">
                <p className="text-text-muted">
                  {pagination?.total ?? 0} clubs · Page {currentPage} of{" "}
                  {Math.max(totalPages, 1)}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <label
                    htmlFor="club-page-size"
                    className="flex items-center gap-2 text-text-muted"
                  >
                    Rows per page
                    <select
                      id="club-page-size"
                      value={limit}
                      onChange={(event) => {
                        setLimit(Number(event.target.value));
                        setPage(1);
                        setNotice("");
                      }}
                      disabled={activeClubsQuery.isFetching}
                      className="rounded-lg border border-border bg-surface px-2 py-1.5 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    >
                      {PAGE_SIZE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        page <= 1 || activeClubsQuery.isFetching
                      }
                      onClick={() =>
                        setPage((current) => Math.max(1, current - 1))
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        page >= totalPages ||
                        totalPages === 0 ||
                        activeClubsQuery.isFetching
                      }
                      onClick={() =>
                        setPage((current) => current + 1)
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </footer>
            )}
        </section>
      </div>

      {isCreateOpen && canCreateClub && (
        <ClubCreateModal
          scope={isHodScope ? "hod" : "default"}
          onClose={() => setIsCreateOpen(false)}
          onCreated={() => {
            setIsCreateOpen(false);
            setSearch("");
            setPage(1);
            setNotice("Club created successfully.");
          }}
        />
      )}

      {editingClub && (
        <EditClubDialog
          club={editingClub}
          departmentName={getDepartmentName(editingClub)}
          onClose={() => setEditingClub(null)}
          onUpdated={() => {
            setEditingClub(null);
            setNotice("Club updated successfully.");
          }}
        />
      )}

      {deletingClub && (
        <DeleteClubDialog
          club={deletingClub}
          onClose={() => setDeletingClub(null)}
          onDeleted={() => {
            setDeletingClub(null);
            setNotice("Club deleted successfully.");

            if (clubs.length === 1 && page > 1) {
              setPage(page - 1);
            }
          }}
        />
      )}

      {assigningClub && (
        <AssignClubDepartmentDialog
          club={assigningClub}
          departments={departments}
          departmentsPending={departmentsQuery.isPending}
          departmentsError={departmentsQuery.isError}
          onRetryDepartments={() => void departmentsQuery.refetch()}
          onClose={() => setAssigningClub(null)}
          onAssigned={() => {
            setAssigningClub(null);
            setNotice("Club department assigned successfully.");
          }}
        />
      )}
    </main>
  );
}
