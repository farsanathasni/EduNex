
"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Search,
  Megaphone,
  Plus,
  CalendarDays,
  Building2,
  Users,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { useAccess } from "@/lib/navigation/access";

import type {
  Announcement,
  AnnouncementAudience,
} from "../api/announcement";

import {
  useAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from "../api/announcement-query";

import { useDepartment } from "@/features/departments/api/department-query";
import { useClubsQuery } from "@/features/clubs/api/club-query";
import { useHodDashboard } from "@/features/hod/api/hod-query";
import { useCoordinatorStatusQuery } from "@/features/coordinator/api/coordinator-query";

export function AnnouncementsPage() {
  const { can, hasRole, isSuperAdmin } = useAccess();

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] = useState<
    "all" | AnnouncementAudience
  >("all");

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [audience, setAudience] =
    useState<AnnouncementAudience>("campus");

  const [selectedDepartmentId, setSelectedDepartmentId] =
    useState("");

  const [selectedClubId, setSelectedClubId] = useState("");

  const [formError, setFormError] = useState("");

  // --------------------------------------------------
  // Permissions and roles
  // --------------------------------------------------

  const canCreate = can("announcement", "create");
  const canUpdate = can("announcement", "update");
  const canDelete = can("announcement", "delete");

  const isHod = hasRole("hod");

  const isCoordinator =
    hasRole("student") &&
    canCreate &&
    !isSuperAdmin &&
    !isHod;

  const availableAudiences: AnnouncementAudience[] = isSuperAdmin
    ? ["campus", "department", "club"]
    : isHod
      ? ["department"]
      : isCoordinator
        ? ["club"]
        : [];

  // --------------------------------------------------
  // Existing API queries
  // --------------------------------------------------

  const {
    data: announcements = [],
    isLoading,
    isError,
  } = useAnnouncementsQuery(search);

  const {
    data: departments = [],
    isLoading: isDepartmentsLoading,
  } = useDepartment(isSuperAdmin);

  const {
    data: clubs = [],
    isLoading: isClubsLoading,
  } = useClubsQuery(undefined, isSuperAdmin || isCoordinator);

  const {
    data: hodDashboard,
    isLoading: isHodDashboardLoading,
  } = useHodDashboard(isHod);

  const {
    data: coordinatorStatus,
    isLoading: isCoordinatorStatusLoading,
  } = useCoordinatorStatusQuery();

  // --------------------------------------------------
  // Assigned coordinator clubs
  // --------------------------------------------------

  const assignedClubIds = useMemo(
    () =>
      coordinatorStatus?.assignments.map(
        (assignment) => assignment.clubId,
      ) ?? [],
    [coordinatorStatus],
  );

  const coordinatorClubs = useMemo(
    () =>
      clubs.filter((club) =>
        assignedClubIds.includes(club.id),
      ),
    [clubs, assignedClubIds],
  );

  // --------------------------------------------------
  // Mutations
  // --------------------------------------------------

  const createMutation = useCreateAnnouncementMutation();
  const updateMutation = useUpdateAnnouncementMutation();
  const deleteMutation = useDeleteAnnouncementMutation();

  // --------------------------------------------------
  // Filter announcements
  // --------------------------------------------------

  const filteredAnnouncements = useMemo(() => {
    if (activeFilter === "all") return announcements;

    return announcements.filter(
      (announcement) => announcement.audience === activeFilter,
    );
  }, [announcements, activeFilter]);

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const stats = useMemo(
    () => ({
      total: announcements.length,
      campus: announcements.filter(
        (item) => item.audience === "campus",
      ).length,
      department: announcements.filter(
        (item) => item.audience === "department",
      ).length,
      club: announcements.filter(
        (item) => item.audience === "club",
      ).length,
    }),
    [announcements],
  );

  // --------------------------------------------------
  // Form helpers
  // --------------------------------------------------

  const resetForm = () => {
    setTitle("");
    setContent("");
    setAudience(availableAudiences[0] ?? "campus");
    setSelectedDepartmentId("");
    setSelectedClubId("");
    setEditingAnnouncement(null);
    setFormError("");
    setIsFormOpen(false);
  };

  const openCreateForm = () => {
    setEditingAnnouncement(null);
    setTitle("");
    setContent("");
    setAudience(availableAudiences[0] ?? "campus");
    setSelectedDepartmentId("");
    setSelectedClubId("");
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setTitle(announcement.title);
    setContent(announcement.content);
    setAudience(announcement.audience);
    setFormError("");
    setIsFormOpen(true);
  };

  const handleAudienceChange = (
    value: AnnouncementAudience,
  ) => {
    setAudience(value);
    setSelectedDepartmentId("");
    setSelectedClubId("");
    setFormError("");
  };

  // --------------------------------------------------
  // Submit form
  // --------------------------------------------------

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setFormError("");

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setFormError("Please enter both a title and content.");
      return;
    }

    try {
      if (editingAnnouncement) {
        await updateMutation.mutateAsync({
          id: editingAnnouncement.id,
          data: {
            title: trimmedTitle,
            content: trimmedContent,
          },
        });
      } else {
        // Super Admin: Campus announcement
        if (audience === "campus") {
          if (!isSuperAdmin) {
            setFormError(
              "Only Super Admin can create campus announcements.",
            );
            return;
          }

          await createMutation.mutateAsync({
            title: trimmedTitle,
            content: trimmedContent,
            audience: "campus",
          });
        }

        // Department announcement
        else if (audience === "department") {
          const departmentId = isHod
            ? hodDashboard?.departmentId
            : Number(selectedDepartmentId);

          if (!departmentId || !Number.isFinite(departmentId)) {
            setFormError("Please select a valid department.");
            return;
          }

          await createMutation.mutateAsync({
            title: trimmedTitle,
            content: trimmedContent,
            audience: "department",
            departmentId,
          });
        }

        // Club announcement
        else if (audience === "club") {
          const clubId = Number(selectedClubId);

          if (!clubId || !Number.isFinite(clubId)) {
            setFormError("Please select a club.");
            return;
          }

          if (
            isCoordinator &&
            !assignedClubIds.includes(clubId)
          ) {
            setFormError(
              "You can only publish announcements for your assigned clubs.",
            );
            return;
          }

          await createMutation.mutateAsync({
            title: trimmedTitle,
            content: trimmedContent,
            audience: "club",
            clubId,
          });
        }
      }

      resetForm();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to save announcement.",
      );
    }
  };

  // --------------------------------------------------
  // Check whether current user can manage an announcement
  // --------------------------------------------------

  const canManageAnnouncement = (
    announcement: Announcement,
  ) => {
    if (isSuperAdmin) return true;

    if (
      isHod &&
      announcement.audience === "department" &&
      announcement.departmentId === hodDashboard?.departmentId
    ) {
      return true;
    }

    if (
      isCoordinator &&
      announcement.audience === "club" &&
      announcement.clubId !== null &&
      assignedClubIds.includes(announcement.clubId)
    ) {
      return true;
    }

    return false;
  };

  // --------------------------------------------------
  // Delete announcement
  // --------------------------------------------------

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this announcement?",
      )
    ) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Announcement deletion failed:", error);
    }
  };

  // --------------------------------------------------
  // Format date
  // --------------------------------------------------

  const formatDate = (date: string | null) => {
    if (!date) return "Not published";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  const isTargetLoading =
    (audience === "department" &&
      (isSuperAdmin
        ? isDepartmentsLoading
        : isHodDashboardLoading)) ||
    (audience === "club" &&
      (isCoordinator
        ? isCoordinatorStatusLoading || isClubsLoading
        : isClubsLoading));

  const selectedClubs = isCoordinator
    ? coordinatorClubs
    : clubs;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-8">

      {/* Header */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-100">
              <Bell size={17} />
              Communication Center
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Announcements
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
              Stay updated with the latest campus, department and
              club news.
            </p>
          </div>

          {canCreate && (
            <button
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              <Plus size={18} />
              Create Announcement
            </button>
          )}
        </div>

        <Megaphone
          size={150}
          className="absolute -bottom-8 -right-5 text-white/10"
        />
      </section>

      {/* Statistics */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Announcements",
            value: stats.total,
            icon: Bell,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Campus",
            value: stats.campus,
            icon: Building2,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Department",
            value: stats.department,
            icon: Users,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Club",
            value: stats.club,
            icon: Megaphone,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">
                    {item.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-text">
                    {item.value}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${item.bg}`}>
                  <Icon size={23} className={item.color} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Create / Edit Form */}

      {isFormOpen && (
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text">
                {editingAnnouncement
                  ? "Edit Announcement"
                  : "Create Announcement"}
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Share important updates with your audience.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg p-2 text-text-muted hover:bg-primary-subtle"
              title="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Announcement Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter announcement title"
                required
                minLength={3}
                maxLength={200}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary"
              />
            </div>

            {/* Audience */}

            {!editingAnnouncement && (
              <div>
                <label className="mb-2 block text-sm font-medium text-text">
                  Announcement Audience
                </label>

                <select
                  value={audience}
                  onChange={(event) =>
                    handleAudienceChange(
                      event.target.value as AnnouncementAudience,
                    )
                  }
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none focus:border-primary"
                >
                  {availableAudiences.map((item) => (
                    <option key={item} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-text-muted">
                  {audience === "campus"
                    ? "This announcement will be visible across the campus."
                    : audience === "department"
                      ? "This announcement will be visible to the selected department."
                      : "This announcement will be visible to members of the selected club."}
                </p>
              </div>
            )}

            {/* Department selector */}

            {!editingAnnouncement &&
              audience === "department" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Select Department
                  </label>

                  {isHod ? (
                    <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text">
                      {hodDashboard?.department?.name ??
                        "Loading your department..."}
                    </div>
                  ) : (
                    <select
                      value={selectedDepartmentId}
                      onChange={(event) =>
                        setSelectedDepartmentId(event.target.value)
                      }
                      required
                      disabled={isDepartmentsLoading}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none focus:border-primary disabled:opacity-50"
                    >
                      <option value="">
                        {isDepartmentsLoading
                          ? "Loading departments..."
                          : "Select a department"}
                      </option>

                      {departments.map((department) => (
                        <option
                          key={department.id}
                          value={department.id}
                        >
                          {department.name} ({department.code})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

            {/* Club selector */}

            {!editingAnnouncement && audience === "club" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-text">
                  Select Club
                </label>

                <select
                  value={selectedClubId}
                  onChange={(event) =>
                    setSelectedClubId(event.target.value)
                  }
                  required
                  disabled={isTargetLoading}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none focus:border-primary disabled:opacity-50"
                >
                  <option value="">
                    {isTargetLoading
                      ? "Loading clubs..."
                      : "Select a club"}
                  </option>

                  {selectedClubs.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name}
                    </option>
                  ))}
                </select>

                {isCoordinator && (
                  <p className="mt-2 text-xs text-text-muted">
                    Only clubs assigned to you are available.
                  </p>
                )}

                {!isTargetLoading &&
                  selectedClubs.length === 0 && (
                    <p className="mt-2 text-xs text-red-600">
                      No assigned clubs are available.
                    </p>
                  )}
              </div>
            )}

            {/* Content */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Announcement Content
              </label>

              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Write your announcement..."
                required
                maxLength={10000}
                rows={6}
                className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary"
              />
            </div>

            {/* Error */}

            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            {/* Actions */}

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSaving}
                className="rounded-xl border border-border px-5 py-3 text-sm font-medium text-text transition hover:bg-primary-subtle disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  isSaving ||
                  isTargetLoading ||
                  !title.trim() ||
                  !content.trim() ||
                  (!editingAnnouncement &&
                    (availableAudiences.length === 0 ||
                      (audience === "department" &&
                        (isHod
                          ? !hodDashboard?.departmentId
                          : !selectedDepartmentId)) ||
                      (audience === "club" && !selectedClubId)))
                }
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : editingAnnouncement
                    ? "Update Announcement"
                    : "Publish Announcement"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Search and Filters */}

      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-text">
              Latest Updates
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Browse announcements available to you.
            </p>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search announcements..."
              className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm text-text outline-none transition focus:border-primary"
            />
          </div>
        </div>

        {/* Audience Filters */}

        <div className="flex flex-wrap gap-2">
          {[
            { label: "All", value: "all" },
            { label: "Campus", value: "campus" },
            { label: "Department", value: "department" },
            { label: "Club", value: "club" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() =>
                setActiveFilter(
                  filter.value as "all" | AnnouncementAudience,
                )
              }
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                activeFilter === filter.value
                  ? "bg-primary text-white"
                  : "border border-border bg-surface text-text-muted hover:bg-primary-subtle"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {/* Announcement List */}

      <section className="space-y-4">
        {isLoading ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-text-muted">
            Loading announcements...
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-700">
              Failed to load announcements.
            </p>

            <p className="mt-1 text-sm text-red-600">
              Please try again later.
            </p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle">
              <Megaphone size={27} className="text-primary" />
            </div>

            <h3 className="font-semibold text-text">
              No announcements found
            </h3>

            <p className="mt-2 text-sm text-text-muted">
              There are no announcements matching your search.
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => {
            const canManage =
              canManageAnnouncement(announcement);

            return (
              <article
                key={announcement.id}
                className="rounded-2xl border border-border bg-surface p-5 transition hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          announcement.audience === "campus"
                            ? "bg-blue-50 text-blue-700"
                            : announcement.audience === "department"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {announcement.audience.charAt(0).toUpperCase() +
                          announcement.audience.slice(1)}
                      </span>

                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <CalendarDays size={14} />
                        {formatDate(announcement.publishedAt)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-text">
                      {announcement.title}
                    </h3>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-text-muted">
                      {announcement.content}
                    </p>
                  </div>

                  {/* Edit and Delete */}

                  {canManage && (canUpdate || canDelete) && (
                    <div className="flex shrink-0 items-center gap-2">
                      {canUpdate && (
                        <button
                          onClick={() =>
                            openEditForm(announcement)
                          }
                          title="Edit announcement"
                          className="rounded-lg border border-border p-2 text-text-muted transition hover:bg-primary-subtle hover:text-primary"
                        >
                          <Pencil size={17} />
                        </button>
                      )}

                      {canDelete && (
                        <button
                          onClick={() =>
                            handleDelete(announcement.id)
                          }
                          disabled={deleteMutation.isPending}
                          title="Delete announcement"
                          className="rounded-lg border border-border p-2 text-text-muted transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
