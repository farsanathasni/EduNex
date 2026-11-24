
"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  Building2,
  CalendarDays,
  Megaphone,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { useRegisterHeaderSearch } from "@/components/layout/header-search";
import Dialog from "@/components/ui/dialog";
import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";
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

type AnnouncementsPageProps = {
  variant?: "staff" | "student";
};

const ANNOUNCEMENT_PARAM = "announcement";

const audienceMeta: Record<
  AnnouncementAudience,
  {
    label: string;
    badgeClass: string;
    accentClass: string;
    icon: typeof Building2;
    iconClass: string;
  }
> = {
  campus: {
    label: "Campus",
    badgeClass: "border-blue-200 bg-blue-50 text-blue-700",
    accentClass: "bg-blue-500",
    icon: Building2,
    iconClass: "bg-blue-50 text-blue-600",
  },
  department: {
    label: "Department",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    accentClass: "bg-emerald-500",
    icon: Users,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  club: {
    label: "Club",
    badgeClass: "border-orange-200 bg-orange-50 text-orange-700",
    accentClass: "bg-orange-500",
    icon: Megaphone,
    iconClass: "bg-orange-50 text-orange-600",
  },
};

function formatDate(date: string | null) {
  if (!date) return "Not published";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isNewAnnouncement(date: string | null) {
  if (!date) return false;
  const published = new Date(date).getTime();
  if (Number.isNaN(published)) return false;
  const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
  return published >= threeDaysAgo;
}

function getPreview(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();
  return normalized;
}

function AnnouncementsPageContent({
  variant = "staff",
}: AnnouncementsPageProps) {
  const { can, hasRole, isSuperAdmin } = useAccess();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastFocusedAnnouncementRef = useRef<HTMLElement | null>(null);

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [search, setSearch] = useState("");

  useRegisterHeaderSearch({
    value: search,
    onChange: setSearch,
    placeholder: "Search announcements...",
  });

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

  const announcementParam = searchParams.get(ANNOUNCEMENT_PARAM);
  const selectedAnnouncementId =
    announcementParam && /^\d+$/.test(announcementParam)
      ? Number(announcementParam)
      : null;

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

  const selectedAnnouncement = useMemo(
    () =>
      selectedAnnouncementId === null
        ? null
        : announcements.find(
            (announcement) => announcement.id === selectedAnnouncementId,
          ) ?? null,
    [announcements, selectedAnnouncementId],
  );

  const isDialogOpen = selectedAnnouncementId !== null;
  const isDialogNotFound =
    isDialogOpen && !isLoading && !isError && !selectedAnnouncement;

  const openAnnouncementDialog = useCallback(
    (announcementId: number, target: HTMLElement) => {
      lastFocusedAnnouncementRef.current = target;
      const params = new URLSearchParams(searchParams.toString());
      params.set(ANNOUNCEMENT_PARAM, String(announcementId));
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const closeAnnouncementDialog = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(ANNOUNCEMENT_PARAM);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (isDialogOpen) return;
    const target = lastFocusedAnnouncementRef.current;
    if (!target) return;
    lastFocusedAnnouncementRef.current = null;
    if (document.contains(target)) {
      target.focus();
    }
  }, [isDialogOpen]);

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
    if (selectedAnnouncementId === announcement.id) {
      closeAnnouncementDialog();
    }
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
      if (selectedAnnouncementId === id) {
        closeAnnouncementDialog();
      }
    } catch (error) {
      console.error("Announcement deletion failed:", error);
    }
  };

  const departmentNameById = useMemo(
    () =>
      new Map(
        departments.map((department) => [department.id, department.name]),
      ),
    [departments],
  );

  const clubNameById = useMemo(
    () => new Map(clubs.map((club) => [club.id, club.name])),
    [clubs],
  );

  const getAnnouncementSource = (announcement: Announcement) => {
    if (announcement.audience === "department") {
      return announcement.departmentId !== null
        ? departmentNameById.get(announcement.departmentId) ?? "Department"
        : "Department";
    }
    if (announcement.audience === "club") {
      return announcement.clubId !== null
        ? clubNameById.get(announcement.clubId) ?? "Club"
        : "Club";
    }
    return "Campus";
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

  const dialogAnnouncement = selectedAnnouncement;
  const dialogMeta = dialogAnnouncement
    ? audienceMeta[dialogAnnouncement.audience]
    : null;
  const dialogCanManage = dialogAnnouncement
    ? canManageAnnouncement(dialogAnnouncement)
    : false;
  const showDialogActions =
    !!dialogAnnouncement && dialogCanManage && (canUpdate || canDelete);

  return (
    <PageContainer className="space-y-6 py-6 sm:py-8">
      <PageHeader
        title="Announcements"
        description="Stay updated with campus, department and club news."
        primaryAction={
          canCreate ? (
            <button
              onClick={openCreateForm}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover sm:w-auto"
            >
              <Plus size={18} />
              Create Announcement
            </button>
          ) : undefined
        }
      />

      {isFormOpen && (
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
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
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-text-muted hover:bg-primary-subtle"
              aria-label="Close form"
              title="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {!editingAnnouncement && audience === "department" && (
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
                      <option key={department.id} value={department.id}>
                        {department.name} ({department.code})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {!editingAnnouncement && audience === "club" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-text">
                  Select Club
                </label>
                <select
                  value={selectedClubId}
                  onChange={(event) => setSelectedClubId(event.target.value)}
                  required
                  disabled={isTargetLoading}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none focus:border-primary disabled:opacity-50"
                >
                  <option value="">
                    {isTargetLoading ? "Loading clubs..." : "Select a club"}
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
                {!isTargetLoading && selectedClubs.length === 0 && (
                  <p className="mt-2 text-xs text-red-600">
                    No assigned clubs are available.
                  </p>
                )}
              </div>
            )}

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

            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSaving}
                className="min-h-11 rounded-xl border border-border px-5 py-3 text-sm font-medium text-text transition hover:bg-primary-subtle disabled:opacity-50"
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
                className="min-h-11 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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

      <section className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All", value: "all" },
            { label: "Campus", value: "campus" },
            { label: "Department", value: "department" },
            { label: "Club", value: "club" },
          ].map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() =>
                setActiveFilter(filter.value as "all" | AnnouncementAudience)
              }
              className={`min-h-11 rounded-xl px-4 py-2 text-sm font-medium transition ${
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

      <section className={variant === "student" ? "grid gap-4 lg:grid-cols-2" : "space-y-3"}>
        {isLoading ? (
          <div className={variant === "student" ? "grid gap-4 lg:col-span-2 lg:grid-cols-2" : "space-y-3"}>
            {Array.from({ length: variant === "student" ? 4 : 5 }).map((_, i) => (
              <div
                key={i}
                className={`animate-pulse rounded-2xl border border-border bg-surface ${
                  variant === "student" ? "h-44" : "h-24"
                }`}
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center lg:col-span-2">
            <p className="font-semibold text-red-700">
              Failed to load announcements.
            </p>
            <p className="mt-1 text-sm text-red-600">Please try again later.</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center lg:col-span-2">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle">
              <Megaphone size={27} className="text-primary" />
            </div>
            <h3 className="font-semibold text-text">No announcements found</h3>
            <p className="mt-2 text-sm text-text-muted">
              There are no announcements matching your search.
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => {
            const canManage = canManageAnnouncement(announcement);
            const meta = audienceMeta[announcement.audience];
            const Icon = meta.icon;
            const source = getAnnouncementSource(announcement);
            const preview = getPreview(announcement.content);
            const isNew = isNewAnnouncement(announcement.publishedAt);

            if (variant === "student") {
              return (
                <article
                  key={announcement.id}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-surface shadow-subtle transition duration-200 hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transform-none"
                >
                  <button
                    type="button"
                    onClick={(e) => openAnnouncementDialog(announcement.id, e.currentTarget)}
                    className="flex min-h-[11rem] w-full flex-col p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:p-6"
                    aria-label={`Open announcement: ${announcement.title}`}
                  >
                    <div className={`absolute inset-y-0 left-0 w-1.5 ${meta.accentClass}`} />
                    <div className="flex items-start gap-4 pl-2">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${meta.iconClass}`}>
                        <Icon size={22} aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${meta.badgeClass}`}>
                            {meta.label}
                          </span>
                          {isNew && (
                            <span className="rounded-full border border-accent/30 bg-accent-subtle px-2.5 py-1 text-xs font-semibold text-accent">
                              New
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-text">
                          {announcement.title}
                        </h3>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={15} aria-hidden="true" />
                            {formatDate(announcement.publishedAt)}
                          </span>
                          <span className="min-w-0 truncate">{source}</span>
                        </div>
                        {preview ? (
                          <p className="mt-3 line-clamp-1 text-sm leading-6 text-text-muted">
                            {preview}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </button>
                </article>
              );
            }

            return (
              <article
                key={announcement.id}
                className="rounded-2xl border border-border bg-surface transition hover:border-primary/20 hover:shadow-sm"
              >
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:gap-4">
                  <button
                    type="button"
                    onClick={(e) => openAnnouncementDialog(announcement.id, e.currentTarget)}
                    className="min-w-0 flex-1 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    aria-label={`Open announcement: ${announcement.title}`}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                      <span className={`rounded-full border px-2.5 py-1 font-semibold ${meta.badgeClass}`}>
                        {meta.label}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={14} aria-hidden="true" />
                        {formatDate(announcement.publishedAt)}
                      </span>
                      <span className="min-w-0 truncate">{source}</span>
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-base font-semibold text-text sm:text-lg">
                      {announcement.title}
                    </h3>
                    {preview ? (
                      <p className="mt-1 line-clamp-1 text-sm text-text-muted">
                        {preview}
                      </p>
                    ) : null}
                  </button>

                  {canManage && (canUpdate || canDelete) && (
                    <div className="flex shrink-0 items-center gap-2 sm:pt-1">
                      {canUpdate && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditForm(announcement);
                          }}
                          title="Edit announcement"
                          aria-label={`Edit announcement: ${announcement.title}`}
                          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border p-2 text-text-muted transition hover:bg-primary-subtle hover:text-primary"
                        >
                          <Pencil size={17} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleDelete(announcement.id);
                          }}
                          disabled={deleteMutation.isPending}
                          title="Delete announcement"
                          aria-label={`Delete announcement: ${announcement.title}`}
                          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border p-2 text-text-muted transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
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

      <Dialog
        open={isDialogOpen}
        onClose={closeAnnouncementDialog}
        title={dialogAnnouncement?.title ?? "Announcement"}
        size="lg"
        footer={
          showDialogActions ? (
            <>
              {canUpdate && dialogAnnouncement && (
                <button
                  type="button"
                  onClick={() => openEditForm(dialogAnnouncement)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-text transition hover:bg-primary-subtle"
                >
                  <Pencil size={16} />
                  Edit
                </button>
              )}
              {canDelete && dialogAnnouncement && (
                <button
                  type="button"
                  onClick={() => void handleDelete(dialogAnnouncement.id)}
                  disabled={deleteMutation.isPending}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
            </>
          ) : undefined
        }
      >
        {isLoading && !dialogAnnouncement ? (
          <div className="space-y-3">
            <div className="h-5 w-32 animate-pulse rounded bg-border/60" />
            <div className="h-4 w-full animate-pulse rounded bg-border/60" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-border/60" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-border/60" />
          </div>
        ) : isError && !dialogAnnouncement ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to load this announcement. Please try again later.
          </div>
        ) : isDialogNotFound ? (
          <div className="rounded-xl border border-dashed border-border bg-background p-6 text-center">
            <p className="font-semibold text-text">Announcement not found</p>
            <p className="mt-2 text-sm text-text-muted">
              This announcement may have been removed or is not available.
            </p>
          </div>
        ) : dialogAnnouncement && dialogMeta ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${dialogMeta.badgeClass}`}>
                {dialogMeta.label}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-text-muted">
                <CalendarDays size={15} aria-hidden="true" />
                {formatDate(dialogAnnouncement.publishedAt)}
              </span>
              <span className="text-sm text-text-muted">
                {getAnnouncementSource(dialogAnnouncement)}
              </span>
            </div>
            <div className="whitespace-pre-wrap break-words text-sm leading-7 text-text sm:text-base">
              {dialogAnnouncement.content}
            </div>
          </div>
        ) : null}
      </Dialog>
    </PageContainer>
  );
}

export function AnnouncementsPage(props: AnnouncementsPageProps) {
  return (
    <Suspense
      fallback={
        <PageContainer className="space-y-6 py-6 sm:py-8">
          <div className="h-20 animate-pulse rounded-2xl border border-border bg-surface" />
          <div className="h-24 animate-pulse rounded-2xl border border-border bg-surface" />
        </PageContainer>
      }
    >
      <AnnouncementsPageContent {...props} />
    </Suspense>
  );
}
