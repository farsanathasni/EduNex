
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
  Filter,
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

import PageHeader from "@/components/ui/page-header";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type FilterValue = "all" | AnnouncementAudience;

const ITEMS_PER_PAGE = 6;

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <Card className="flex items-center gap-4 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
        <Icon size={23} />
      </div>

      <div className="min-w-0">
        <p className="text-caption font-medium text-text-muted">
          {label}
        </p>

        <p className="mt-0.5 text-2xl font-extrabold leading-tight text-text">
          {value}
        </p>

        <p className="mt-1 text-xs text-text-subtle">
          {description}
        </p>
      </div>
    </Card>
  );
}

export function AnnouncementsPage() {
  const { can, hasRole, isSuperAdmin } = useAccess();

  // Search, filter and pagination state
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<FilterValue>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
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

  // Permissions
  const canCreate = can("announcement", "create");
  const canUpdate = can("announcement", "update");
  const canDelete = can("announcement", "delete");

  const isHod = hasRole("hod");

  const isCoordinator =
    hasRole("student") &&
    canCreate &&
    !isSuperAdmin &&
    !isHod;

  const availableAudiences: AnnouncementAudience[] =
    isSuperAdmin
      ? ["campus", "department", "club"]
      : isHod
        ? ["department"]
        : isCoordinator
          ? ["club"]
          : [];

  // Fetch announcements from backend.
  // Search, audience filter and pagination are handled server-side.
  const {
    data: announcementResult,
    isLoading,
    isError,
    isFetching,
  } = useAnnouncementsQuery({
    search,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    audience:
      activeFilter === "all" ? undefined : activeFilter,
  });

  const announcements =
    announcementResult?.announcements ?? [];

  const pagination = announcementResult?.pagination;

  // Department query
  const {
    data: departments = [],
    isLoading: isDepartmentsLoading,
  } = useDepartment(isSuperAdmin);

  // Club query
  const {
    data: clubs = [],
    isLoading: isClubsLoading,
  } = useClubsQuery(undefined, isSuperAdmin || isCoordinator);

  // HOD dashboard
  const {
    data: hodDashboard,
    isLoading: isHodDashboardLoading,
  } = useHodDashboard(isHod);

  // Coordinator status
  const {
    data: coordinatorStatus,
    isLoading: isCoordinatorStatusLoading,
  } = useCoordinatorStatusQuery();

  // Assigned clubs
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

  const selectedClubs = isCoordinator
    ? coordinatorClubs
    : clubs;

  // Mutations
  const createMutation = useCreateAnnouncementMutation();
  const updateMutation = useUpdateAnnouncementMutation();
  const deleteMutation = useDeleteAnnouncementMutation();

  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  // Search handler
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Filter handler
  const handleFilterChange = (value: FilterValue) => {
    setActiveFilter(value);
    setCurrentPage(1);
  };

  // Statistics
  // These counts represent the currently loaded page.
  const stats = useMemo(
    () => [
      {
        label: "Announcements",
        value: announcements.length,
        description: "On this page",
        icon: Bell,
        iconStyle: "bg-primary-subtle text-primary",
      },
      {
        label: "Campus",
        value: announcements.filter(
          (item) => item.audience === "campus",
        ).length,
        description: "Campus updates on this page",
        icon: Building2,
        iconStyle: "bg-blue-50 text-blue-700",
      },
      {
        label: "Department",
        value: announcements.filter(
          (item) => item.audience === "department",
        ).length,
        description: "Department updates on this page",
        icon: Users,
        iconStyle: "bg-emerald-50 text-emerald-700",
      },
      {
        label: "Club",
        value: announcements.filter(
          (item) => item.audience === "club",
        ).length,
        description: "Club updates on this page",
        icon: Megaphone,
        iconStyle: "bg-orange-50 text-orange-700",
      },
    ],
    [announcements],
  );

  // Form helpers
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

  // Submit announcement
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setFormError("");

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setFormError(
        "Please enter both a title and content.",
      );
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
      } else if (audience === "campus") {
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
      } else if (audience === "department") {
        const departmentId = isHod
          ? hodDashboard?.departmentId
          : Number(selectedDepartmentId);

        if (
          !departmentId ||
          !Number.isFinite(departmentId)
        ) {
          setFormError("Please select a valid department.");
          return;
        }

        await createMutation.mutateAsync({
          title: trimmedTitle,
          content: trimmedContent,
          audience: "department",
          departmentId,
        });
      } else if (audience === "club") {
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

      resetForm();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to save announcement.",
      );
    }
  };

  // Manage permissions
  const canManageAnnouncement = (
    announcement: Announcement,
  ) => {
    if (isSuperAdmin) return true;

    if (
      isHod &&
      announcement.audience === "department" &&
      announcement.departmentId ===
        hodDashboard?.departmentId
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

  // Delete announcement
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
      console.error(
        "Announcement deletion failed:",
        error,
      );
    }
  };

  // Date formatting
  const formatDate = (date: string | null) => {
    if (!date) return "Not published";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Target loading
  const isTargetLoading =
    (audience === "department" &&
      (isSuperAdmin
        ? isDepartmentsLoading
        : isHodDashboardLoading)) ||
    (audience === "club" &&
      (isCoordinator
        ? isCoordinatorStatusLoading || isClubsLoading
        : isClubsLoading));

  // Filters
  const filters: {
    label: string;
    value: FilterValue;
  }[] = [
    { label: "All", value: "all" },
    { label: "Campus", value: "campus" },
    { label: "Department", value: "department" },
    { label: "Club", value: "club" },
  ];

  // Audience styles
  const getAudienceStyle = (
    value: AnnouncementAudience,
  ) => {
    if (value === "campus") {
      return {
        badge: "bg-primary-subtle text-primary",
        icon: Building2,
      };
    }

    if (value === "department") {
      return {
        badge: "bg-emerald-50 text-emerald-700",
        icon: Users,
      };
    }

    return {
      badge: "bg-orange-50 text-orange-700",
      icon: Megaphone,
    };
  };

  return (
  <main className="min-h-screen bg-background text-text">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-brand px-6 pb-24 pt-12 text-text-on-primary shadow-xl sm:px-10 sm:pb-28 sm:pt-16">

        {/* Background decoration */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full border-[35px] border-white/10" />

        <div className="pointer-events-none absolute -bottom-32 right-1/4 -z-10 h-64 w-64 rounded-full border-[25px] border-white/10" />

        <div className="relative max-w-3xl">

          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
            <Megaphone size={15} />
            EduNex · Communication Center
          </div>

          {/* Heading */}
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Stay connected with your campus.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
            Stay informed with the latest campus news, department
            updates, important notices, and club announcements.
            Everything important, all in one place.
          </p>

          {/* CTA */}
          {canCreate && (
            <div className="mt-8">
              <Button
                variant="secondary"
                size="lg"
                onClick={openCreateForm}
                className="shadow-lg"
              >
                <Plus size={18} />
                Create Announcement
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* STATISTICS */}
      <section className="relative z-10 -mt-12 grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 sm:px-6 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
            description={item.description}
          />
        ))}
      </section>

      {/* CREATE / EDIT FORM */}
      {isFormOpen && (
        <section
          id="announcement-form"
          className="mt-10 scroll-mt-8"
        >
          <Card
            padding="lg"
            className="overflow-hidden border border-primary/20 shadow-lg"
          >
            <div className="mb-7 flex items-start justify-between gap-4 border-b border-border pb-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
                  {editingAnnouncement ? (
                    <Pencil size={20} />
                  ) : (
                    <Megaphone size={21} />
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-text">
                    {editingAnnouncement
                      ? "Edit Announcement"
                      : "Create New Announcement"}
                  </h2>

                  <p className="mt-1 text-sm text-text-muted">
                    Share important information with your audience.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={resetForm}
                aria-label="Close form"
              >
                <X size={18} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* TITLE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Announcement Title
                  <span className="ml-1 text-accent">*</span>
                </label>

                <Input
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Enter a clear announcement title"
                  required
                  minLength={3}
                  maxLength={200}
                />
              </div>

              {/* AUDIENCE */}
              {!editingAnnouncement && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text">
                    Announcement Audience
                    <span className="ml-1 text-accent">*</span>
                  </label>

                  <select
                    value={audience}
                    onChange={(event) =>
                      handleAudienceChange(
                        event.target.value as AnnouncementAudience,
                      )
                    }
                    required
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {availableAudiences.map((item) => (
                      <option key={item} value={item}>
                        {item.charAt(0).toUpperCase() +
                          item.slice(1)}
                      </option>
                    ))}
                  </select>

                  <div className="mt-3 flex items-start gap-3 rounded-xl border border-primary/10 bg-primary-subtle p-4">
                    <Megaphone
                      size={19}
                      className="mt-0.5 shrink-0 text-primary"
                    />

                    <p className="text-xs leading-5 text-text-muted">
                      {audience === "campus"
                        ? "This announcement will be shared across the campus."
                        : audience === "department"
                          ? "This announcement will be shared with the selected department."
                          : "This announcement will be shared with members of the selected club."}
                    </p>
                  </div>
                </div>
              )}

              {/* DEPARTMENT */}
              {!editingAnnouncement &&
                audience === "department" && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-text">
                      Select Department
                      <span className="ml-1 text-accent">*</span>
                    </label>

                    {isHod ? (
                      <div className="rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-medium text-text">
                        {hodDashboard?.department?.name ??
                          "Loading your department..."}
                      </div>
                    ) : (
                      <select
                        value={selectedDepartmentId}
                        onChange={(event) =>
                          setSelectedDepartmentId(
                            event.target.value,
                          )
                        }
                        required
                        disabled={isDepartmentsLoading}
                        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                      >
                        <option value="">
                          {isDepartmentsLoading
                            ? "Loading departments..."
                            : "Choose a department"}
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

              {/* CLUB */}
              {!editingAnnouncement &&
                audience === "club" && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-text">
                      Select Club
                      <span className="ml-1 text-accent">*</span>
                    </label>

                    <select
                      value={selectedClubId}
                      onChange={(event) =>
                        setSelectedClubId(event.target.value)
                      }
                      required
                      disabled={isTargetLoading}
                      className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    >
                      <option value="">
                        {isTargetLoading
                          ? "Loading clubs..."
                          : "Choose a club"}
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
                        <p className="mt-2 text-xs text-accent">
                          No assigned clubs are available.
                        </p>
                      )}
                  </div>
                )}

              {/* CONTENT */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-text">
                    Announcement Content
                    <span className="ml-1 text-accent">*</span>
                  </label>

                  <span className="text-xs text-text-subtle">
                    {content.length}/10000
                  </span>
                </div>

                <textarea
                  value={content}
                  onChange={(event) =>
                    setContent(event.target.value)
                  }
                  placeholder="Write your announcement here..."
                  required
                  maxLength={10000}
                  rows={6}
                  className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-7 text-text outline-none transition placeholder:text-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* ERROR */}
              {formError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {formError}
                </div>
              )}

              {/* FORM ACTIONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSaving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
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
                        (audience === "club" &&
                          !selectedClubId)))
                  }
                >
                  {isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Plus size={17} />
                      {editingAnnouncement
                        ? "Update Announcement"
                        : "Publish Announcement"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </section>
      )}

      {/* ANNOUNCEMENTS HEADING + SEARCH */}
      <section className="mt-14 space-y-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
              <Bell size={16} />
              CAMPUS COMMUNICATION
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-text sm:text-3xl">
              Latest Announcements
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">
              Discover important updates and stay informed
              about everything happening around your campus.
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle"
            />

            <Input
              type="search"
              value={search}
              onChange={(event) =>
                handleSearchChange(event.target.value)
              }
              placeholder="Search announcements..."
              className="h-12 rounded-xl pl-11 shadow-sm"
            />
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 flex items-center gap-2 text-sm font-semibold text-text-muted">
            <Filter size={16} />
            Filter by:
          </span>

          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant={
                activeFilter === filter.value
                  ? "primary"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                handleFilterChange(filter.value)
              }
              className="rounded-full px-4"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </section>

      {/* ANNOUNCEMENT LIST */}
      <section className="mt-7">

        {/* LOADING */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: ITEMS_PER_PAGE }).map(
              (_, index) => (
                <Card
                  key={index}
                  className="space-y-5"
                >
                  <div className="flex justify-between">
                    <Skeleton className="h-7 w-28 rounded-full" />
                    <Skeleton className="h-5 w-24" />
                  </div>

                  <Skeleton className="h-7 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />

                  <div className="border-t border-border pt-4">
                    <Skeleton className="h-5 w-32" />
                  </div>
                </Card>
              ),
            )}
          </div>

        ) : isError ? (
          /* ERROR */
          <Card className="py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Bell size={28} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-text">
              Unable to load announcements
            </h3>

            <p className="mt-2 text-sm text-text-muted">
              Something went wrong while loading announcements.
              Please try again later.
            </p>
          </Card>

        ) : announcements.length === 0 ? (
          /* EMPTY STATE */
          <Card className="py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
              <Megaphone size={30} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-text">
              No announcements found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
              There are no announcements matching your current
              search or filter. Check back later for new updates.
            </p>

            {(search || activeFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                className="mt-5 rounded-full"
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
                  setCurrentPage(1);
                }}
              >
                <X size={15} />
                Clear filters
              </Button>
            )}
          </Card>

        ) : (
          <>
            {/* CARDS */}
            <div
              className={`grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3 ${
                isFetching
                  ? "pointer-events-none opacity-60"
                  : ""
              }`}
            >
              {announcements.map((announcement) => {
                const canManage =
                  canManageAnnouncement(announcement);

                const audienceStyle = getAudienceStyle(
                  announcement.audience,
                );

                const AudienceIcon = audienceStyle.icon;

                return (
                  <Card
                    key={announcement.id}
                    className="group flex h-full flex-col overflow-hidden border border-border/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                  >
                    {/* TOP ACCENT */}
                    <div className="-mx-5 -mt-5 mb-5 h-1.5 bg-primary opacity-70 transition-opacity group-hover:opacity-100" />

                    {/* CARD HEADER */}
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${audienceStyle.badge}`}
                      >
                        <AudienceIcon size={14} />

                        {announcement.audience
                          .charAt(0)
                          .toUpperCase() +
                          announcement.audience.slice(1)}
                      </span>

                      <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-text-subtle">
                        <CalendarDays size={14} />
                        {formatDate(announcement.publishedAt)}
                      </span>
                    </div>

                    {/* CARD CONTENT */}
                    <div className="mt-5 flex-1">
                      <h3 className="break-words text-lg font-bold leading-snug text-text transition-colors group-hover:text-primary">
                        {announcement.title}
                      </h3>

                      <div className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-text-muted">
                        {announcement.content}
                      </div>
                    </div>

                    {/* CARD FOOTER */}
                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
                      <span className="flex items-center gap-2 text-xs font-semibold text-text-subtle">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                          <Megaphone size={14} />
                        </span>

                        EduNex
                      </span>

                      {canManage &&
                        (canUpdate || canDelete) && (
                          <div className="flex items-center gap-2">
                            {canUpdate && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-lg px-3"
                                onClick={() =>
                                  openEditForm(announcement)
                                }
                                aria-label="Edit announcement"
                                title="Edit announcement"
                              >
                                <Pencil size={15} />
                                <span className="hidden sm:inline">
                                  Edit
                                </span>
                              </Button>
                            )}

                            {canDelete && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-lg border-red-200 px-3 text-red-600 hover:border-red-300 hover:bg-red-50"
                                onClick={() =>
                                  handleDelete(announcement.id)
                                }
                                disabled={
                                  deleteMutation.isPending
                                }
                                aria-label="Delete announcement"
                                title="Delete announcement"
                              >
                                <Trash2 size={15} />
                              </Button>
                            )}
                          </div>
                        )}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* PAGINATION */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-10 flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-text-muted">
                  Showing{" "}
                  <span className="font-semibold text-text">
                    {(pagination.page - 1) *
                      pagination.limit +
                      1}
                    {" – "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-text">
                    {pagination.total}
                  </span>{" "}
                  announcements
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    disabled={
                      currentPage === 1 || isFetching
                    }
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(1, page - 1),
                      )
                    }
                  >
                    Previous
                  </Button>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={
                        currentPage === page
                          ? "primary"
                          : "outline"
                      }
                      size="sm"
                      className="min-w-9 rounded-lg"
                      disabled={isFetching}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    disabled={
                      currentPage ===
                        pagination.totalPages ||
                      isFetching
                    }
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(
                          pagination.totalPages,
                          page + 1,
                        ),
                      )
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* FOOTER */}
      <footer className="mt-14 flex flex-col items-center justify-center gap-2 border-t border-border py-7 text-center">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-muted">
          <Megaphone size={16} className="text-primary" />
          EduNex · Campus Communication
        </div>

        <p className="text-xs text-text-subtle">
          Keeping your campus informed and connected.
        </p>
      </footer>
    </div>
  </main>
);
}
