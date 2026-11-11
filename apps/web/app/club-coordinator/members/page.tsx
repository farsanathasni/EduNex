
"use client";

import { useMemo, useState } from "react";
import {
  Users,
  UserRound,
  Mail,
  Phone,
  GraduationCap,
  CalendarDays,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  UsersRound,
  RefreshCw,
} from "lucide-react";

import CoordinatorLayout from "@/features/coordinator/components/coordinator-layout";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

import { useCoordinatorClubMembers } from "@/features/coordinator/api/coordinator-query";
import { useAccess } from "@/lib/navigation/access";
import { Skeleton } from "@/components/ui/skeleton";

type MembershipStatus = "approved" | "rejected";

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card
      padding="lg"
      className="flex items-center gap-4 border-border-subtle shadow-subtle transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
        {icon}
      </div>

      <div>
        <p className="text-caption font-medium text-text-muted">{label}</p>
        <p className="mt-1 text-heading-sm font-extrabold text-text">
          {value}
        </p>
      </div>
    </Card>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-caption text-text-muted">{label}</p>
        <p className="mt-1 break-words text-label font-semibold text-text">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card
      padding="lg"
      className="flex flex-col items-center border-dashed py-14 text-center shadow-none"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
        {icon}
      </div>

      <h3 className="mt-5 text-subheading font-bold text-text">{title}</h3>

      <p className="mt-2 max-w-md text-label leading-relaxed text-text-muted">
        {description}
      </p>
    </Card>
  );
}

export default function ClubMembersPage() {
  const [activeFilter, setActiveFilter] =
    useState<MembershipStatus>("approved");

  const [selectedClubId, setSelectedClubId] = useState<number | "all">("all");

  const { me } = useAccess();

  const coordinatedClubs = me?.coordinatedClubs ?? [];

  const assignedClubIds = useMemo(
    () => new Set(coordinatedClubs.map((club) => club.id)),
    [coordinatedClubs],
  );

  const hasAssignedClubs = coordinatedClubs.length > 0;

  const {
    data: members = [],
    isPending,
    isError,
    refetch,
  } = useCoordinatorClubMembers(hasAssignedClubs);

  // Only show members from the coordinator's assigned clubs.
  const assignedMembers = members.filter((member) =>
    assignedClubIds.has(member.clubId),
  );

  // Apply the selected club filter.
  const selectedMembers = assignedMembers.filter(
    (member) =>
      selectedClubId === "all" || member.clubId === selectedClubId,
  );

  const filteredMembers = selectedMembers.filter(
    (member) => member.status === activeFilter,
  );

  const approvedCount = selectedMembers.filter(
    (member) => member.status === "approved",
  ).length;

  const rejectedCount = selectedMembers.filter(
    (member) => member.status === "rejected",
  ).length;

  const clubName =
    selectedClubId === "all"
      ? coordinatedClubs.length === 1
        ? coordinatedClubs[0].name
        : "Your Assigned Clubs"
      : coordinatedClubs.find((club) => club.id === selectedClubId)?.name ??
        "Club Members";

  return (
    <CoordinatorLayout>
      <main className="min-h-screen space-y-8 bg-background pb-8 font-roobert text-text">

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-brand px-6 py-8 text-text-on-primary shadow-lg sm:px-9 sm:py-10">

          {/* Background decoration */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[36px] border-white/10"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 right-[20%] h-56 w-56 rounded-full bg-white/[0.06]"
          />

          <div className="relative z-10 max-w-3xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-caption font-semibold text-white/90">
              <UsersRound className="h-4 w-4" />
              CLUB MANAGEMENT · MEMBERS
            </div>

            <h1 className="text-display-sm font-extrabold tracking-tight sm:text-display">
              {clubName}
            </h1>

            <p className="mt-4 max-w-xl text-body leading-relaxed text-white/80">
              Manage your club community, review student membership decisions,
              and keep track of approved members and rejected applications.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">

              <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
                <p className="text-2xl font-extrabold">
                  {selectedMembers.length}
                </p>
                <p className="mt-1 text-caption text-white/75">
                  Total applications
                </p>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
                <p className="text-2xl font-extrabold">
                  {coordinatedClubs.length}
                </p>
                <p className="mt-1 text-caption text-white/75">
                  Assigned clubs
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Statistics */}
        <section
          aria-label="Membership statistics"
          className="grid gap-4 sm:grid-cols-2"
        >
          <StatCard
            icon={<CheckCircle2 className="h-6 w-6" />}
            label="Approved Members"
            value={approvedCount}
          />

          <StatCard
            icon={<XCircle className="h-6 w-6" />}
            label="Rejected Requests"
            value={rejectedCount}
          />
        </section>

        {/* Members Section */}
        <section className="space-y-5">

          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-primary">
              Membership overview
            </p>

            <h2 className="mt-2 text-heading-lg font-extrabold tracking-tight text-text">
              Club Members
            </h2>

            <p className="mt-1.5 text-label text-text-muted">
              View student details and check the status of their membership
              applications.
            </p>
          </div>

          {/* Club Selector */}
          {coordinatedClubs.length > 1 && (
            <Card padding="md" className="border-border-subtle shadow-subtle">
              <label
                htmlFor="club-filter"
                className="mb-2 block text-label font-semibold text-text"
              >
                Filter by club
              </label>

              <select
                id="club-filter"
                value={selectedClubId}
                onChange={(event) =>
                  setSelectedClubId(
                    event.target.value === "all"
                      ? "all"
                      : Number(event.target.value),
                  )
                }
                className="w-full max-w-md rounded-xl border border-border bg-background px-4 py-3 text-label text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                <option value="all">All assigned clubs</option>

                {coordinatedClubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
            </Card>
          )}

          {/* Status Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">

              <button
                type="button"
                onClick={() => setActiveFilter("approved")}
                aria-pressed={activeFilter === "approved"}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-label font-semibold transition-all ${
                  activeFilter === "approved"
                    ? "bg-primary text-white shadow-md"
                    : "border border-border bg-surface text-text-muted hover:border-primary/40 hover:bg-primary-subtle hover:text-primary"
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                Approved
                <span
                  className={`rounded-full px-2 py-0.5 text-caption ${
                    activeFilter === "approved"
                      ? "bg-white/20 text-white"
                      : "bg-secondary text-text-muted"
                  }`}
                >
                  {approvedCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter("rejected")}
                aria-pressed={activeFilter === "rejected"}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-label font-semibold transition-all ${
                  activeFilter === "rejected"
                    ? "bg-primary text-white shadow-md"
                    : "border border-border bg-surface text-text-muted hover:border-primary/40 hover:bg-primary-subtle hover:text-primary"
                }`}
              >
                <XCircle className="h-4 w-4" />
                Rejected
                <span
                  className={`rounded-full px-2 py-0.5 text-caption ${
                    activeFilter === "rejected"
                      ? "bg-white/20 text-white"
                      : "bg-secondary text-text-muted"
                  }`}
                >
                  {rejectedCount}
                </span>
              </button>

            </div>

            <p className="text-caption text-text-muted" aria-live="polite">
              Showing{" "}
              <span className="font-bold text-text">
                {filteredMembers.length}
              </span>{" "}
              {filteredMembers.length === 1 ? "member" : "members"}
            </p>
          </div>

          {/* No Assigned Clubs */}
          {!hasAssignedClubs && (
            <EmptyState
              icon={<Users className="h-7 w-7" />}
              title="No clubs assigned"
              description="Club members will appear here after a club is assigned to your coordinator account. Contact your HOD for more information."
            />
          )}

          
{/* Loading */}
{hasAssignedClubs && isPending && (
  <div
    role="status"
    aria-label="Loading club members"
    className="grid gap-5 lg:grid-cols-2"
  >
    <span className="sr-only">Loading club members...</span>

    {[1, 2, 3, 4].map((item) => (
      <Card
        key={item}
        padding="lg"
        className="space-y-5 border-border-subtle shadow-subtle"
      >
        {/* Student Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>

          <Skeleton className="h-7 w-20 rounded-full" />
        </div>

        {/* Club Information */}
        <Skeleton className="h-11 w-full rounded-xl" />

        {/* Student Details */}
        <div className="grid gap-5 border-t border-border-subtle pt-5 sm:grid-cols-2">
          {[1, 2, 3, 4].map((detail) => (
            <div key={detail} className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>

        {/* Review Date */}
        <div className="flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
      </Card>
    ))}
  </div>
)}


          {/* Error */}
          {hasAssignedClubs && isError && (
            <EmptyState
              icon={<RefreshCw className="h-7 w-7" />}
              title="Unable to load club members"
              description="Something went wrong while loading membership information. Please try again."
            />
          )}

          {hasAssignedClubs && isError && (
            <div className="flex justify-center">
              <Button onClick={() => void refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
            </div>
          )}

          {/* Empty Filter Result */}
          {hasAssignedClubs &&
            !isPending &&
            !isError &&
            filteredMembers.length === 0 && (
              <EmptyState
                icon={
                  activeFilter === "approved" ? (
                    <Users className="h-7 w-7" />
                  ) : (
                    <XCircle className="h-7 w-7" />
                  )
                }
                title={
                  activeFilter === "approved"
                    ? "No approved members yet"
                    : "No rejected requests"
                }
                description={
                  activeFilter === "approved"
                    ? "Students whose membership applications are approved will appear here."
                    : "Rejected membership applications will appear here."
                }
              />
            )}

          {/* Member Cards */}
          {hasAssignedClubs &&
            !isPending &&
            !isError &&
            filteredMembers.length > 0 && (
              <div className="grid gap-5 lg:grid-cols-2">

                {filteredMembers.map((member) => (
                  <Card
                    key={member.studentId}
                    padding="lg"
                    className="group flex h-full flex-col border-border-subtle shadow-subtle transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                  >

                    {/* Student Header */}
                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                          <UserRound className="h-6 w-6" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="break-words text-subheading font-bold text-text">
                            {member.studentName}
                          </h3>

                          <p className="mt-1 break-words text-caption text-text-muted">
                            {member.admissionNumber}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-caption font-semibold ${
                          member.status === "approved"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {member.status === "approved" ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}

                        {member.status === "approved" ? "Approved" : "Rejected"}
                      </span>

                    </div>

                    {/* Club Information */}
                    <div className="mt-5 flex items-center gap-2 rounded-xl bg-primary-subtle/60 px-4 py-3">
                      <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                      <p className="truncate text-label font-semibold text-primary">
                        {member.clubName}
                      </p>
                    </div>

                    {/* Student Details */}
                    <div className="mt-5 grid flex-1 gap-5 border-t border-border-subtle pt-5 sm:grid-cols-2">

                      <DetailItem
                        icon={<Mail className="h-4 w-4" />}
                        label="Email address"
                        value={member.email}
                      />

                      <DetailItem
                        icon={<Phone className="h-4 w-4" />}
                        label="Phone number"
                        value={member.phone}
                      />

                      <DetailItem
                        icon={<GraduationCap className="h-4 w-4" />}
                        label="Department"
                        value={
                          member.departmentName
                            ? `${member.departmentName}${
                                member.departmentCode
                                  ? ` (${member.departmentCode})`
                                  : ""
                              }`
                            : null
                        }
                      />

                      <DetailItem
                        icon={<CalendarDays className="h-4 w-4" />}
                        label="Semester"
                        value={member.semester}
                      />

                    </div>

                    {/* Review Date */}
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
                      <div className="flex items-center gap-2 text-text-muted">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-caption font-medium">
                          {member.status === "approved"
                            ? "Approved date"
                            : "Reviewed date"}
                        </span>
                      </div>

                      <span className="text-caption font-semibold text-text">
                        {member.joinedAt
                          ? new Date(member.joinedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "Not available"}
                      </span>
                    </div>

                  </Card>
                ))}

              </div>
            )}

        </section>

        {/* Footer */}
        <p className="pb-3 text-center text-caption text-text-subtle">
          EduNex · Connecting students, faculty and campus life.
        </p>

      </main>
    </CoordinatorLayout>
  );
}
