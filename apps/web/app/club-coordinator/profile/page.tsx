
"use client";

import type { ReactNode } from "react";
import {
  GraduationCap,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import CoordinatorLayout from "@/features/coordinator/components/coordinator-layout";
import { useAccess } from "@/lib/navigation/access";

import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function Banner({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={`relative overflow-hidden rounded-3xl bg-brand text-text-on-primary shadow-lg ${className}`}
    >
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

      <div className="relative z-10">{children}</div>
    </header>
  );
}

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card padding="lg">
      <div className="mb-5 flex items-center gap-3 border-b border-border-subtle pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-subtle text-primary">
          {icon}
        </div>

        <div>
          <h2 className="text-subheading font-bold text-text">
            {title}
          </h2>
          <p className="text-caption text-text-muted">
            {description}
          </p>
        </div>
      </div>

      {children}
    </Card>
  );
}

function ProfileDetail({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <div className="min-w-0">
      <dt className="text-caption font-medium text-text-muted">
        {label}
      </dt>

      <dd
        className={`mt-1 break-words text-label ${
          hasValue
            ? "font-semibold text-text"
            : "text-text-subtle"
        }`}
      >
        {hasValue ? value : "Not available"}
      </dd>
    </div>
  );
}

function ProfileLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Profile banner */}
      <div className="rounded-3xl bg-surface p-6 sm:p-10">
        <Skeleton className="mb-6 h-4 w-48" />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Skeleton className="h-20 w-20 shrink-0 rounded-2xl sm:h-24 sm:w-24" />

          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-52" />
            <Skeleton className="h-4 w-64 max-w-full" />
            <Skeleton className="h-3 w-48" />
          </div>

          <Skeleton className="h-24 w-32 rounded-2xl" />
        </div>
      </div>

      {/* Information cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((item) => (
          <Card key={item} padding="lg">
            <div className="mb-5 flex items-center gap-3 border-b border-border-subtle pb-4">
              <Skeleton className="h-10 w-10 rounded-xl" />

              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4].map((field) => (
                <div key={field} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-36" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Assigned clubs */}
      <Card padding="lg">
        <div className="mb-5 flex items-center gap-3 border-b border-border-subtle pb-4">
          <Skeleton className="h-10 w-10 rounded-xl" />

          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-64 max-w-full" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border p-5"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>

              <Skeleton className="mt-4 h-5 w-36" />
              <Skeleton className="mt-3 h-3 w-48" />

              <div className="mt-4 flex items-center gap-2 border-t border-border-subtle pt-3">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function CoordinatorProfilePage() {
  const { me, isPending } = useAccess();

  const user = me?.user;
  const coordinatedClubs = me?.coordinatedClubs ?? [];

  const initials =
    user?.name
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "CC";

  return (
    <CoordinatorLayout>
      <main className="min-h-screen bg-background px-4 py-6 font-roobert text-text sm:px-6 sm:py-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {isPending ? (
            <ProfileLoadingSkeleton />
          ) : (
            <>
              {/* Page heading */}
              <div>
                <p className="text-label font-semibold text-primary">
                  Your account
                </p>

                <h1 className="mt-2 text-display-sm font-extrabold tracking-tight text-text">
                  My Profile
                </h1>

                <p className="mt-2 text-label text-text-muted">
                  View your personal information and assigned club details.
                </p>
              </div>

              {/* Profile banner */}
              <Banner className="px-6 py-8 sm:px-10 sm:py-10">
                <p className="mb-5 text-label font-semibold text-white/80">
                  EduNex · Coordinator Portal
                </p>

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div
                    aria-hidden="true"
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-heading font-extrabold text-white backdrop-blur-sm sm:h-24 sm:w-24"
                  >
                    {initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="break-words text-display-sm font-extrabold tracking-tight">
                        {user?.name ?? "Coordinator"}
                      </h2>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-caption font-semibold text-white">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Active coordinator
                      </span>
                    </div>

                    <p className="mt-2 break-all text-label text-white/80">
                      {user?.email ?? "Email not available"}
                    </p>

                    <p className="mt-1 text-caption text-white/70">
                      Managing campus clubs and student activities
                    </p>
                  </div>

                  <div className="w-fit shrink-0 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center backdrop-blur-sm">
                    <p className="text-caption text-white/80">
                      Assigned clubs
                    </p>

                    <p className="mt-1 text-heading font-extrabold leading-none">
                      {coordinatedClubs.length}
                    </p>
                  </div>
                </div>
              </Banner>

              {/* Information cards */}
              <div className="grid gap-6 lg:grid-cols-2">
                <SectionCard
                  icon={<User className="h-5 w-5" />}
                  title="Personal information"
                  description="Your registered account details"
                >
                  <dl className="grid gap-5 sm:grid-cols-2">
                    <ProfileDetail label="Full name" value={user?.name} />
                    <ProfileDetail label="Email address" value={user?.email} />
                    <ProfileDetail label="Account role" value="Club Coordinator" />
                    <ProfileDetail label="Account status" value="Active" />
                  </dl>
                </SectionCard>

                <SectionCard
                  icon={<GraduationCap className="h-5 w-5" />}
                  title="Coordinator information"
                  description="Your campus responsibilities"
                >
                  <dl className="grid gap-5 sm:grid-cols-2">
                    <ProfileDetail label="Role" value="Club Coordinator" />
                    <ProfileDetail label="Assigned clubs" value={coordinatedClubs.length} />
                    <ProfileDetail label="Portal" value="EduNex" />
                    <ProfileDetail label="Account status" value="Active" />
                  </dl>
                </SectionCard>
              </div>

              {/* Assigned clubs */}
              <SectionCard
                icon={<Users className="h-5 w-5" />}
                title="Assigned clubs"
                description="Clubs currently assigned to your coordinator account"
              >
                {coordinatedClubs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-text-muted">
                      <Users className="h-6 w-6" />
                    </div>

                    <h3 className="mt-4 text-label font-bold text-text">
                      No clubs assigned
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-caption leading-relaxed text-text-muted">
                      You do not have any clubs assigned to your coordinator
                      account yet. Contact your HOD for more information.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {coordinatedClubs.map((club, index) => (
                      <div
                        key={club.id}
                        className="group rounded-2xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-subtle text-primary transition group-hover:bg-primary group-hover:text-white">
                            <GraduationCap className="h-5 w-5" />
                          </div>

                          <span className="rounded-full bg-primary-subtle px-3 py-1 text-caption font-semibold text-primary">
                            Club {index + 1}
                          </span>
                        </div>

                        <h3 className="mt-4 break-words text-subheading font-bold text-text">
                          {club.name}
                        </h3>

                        <p className="mt-2 text-caption text-text-muted">
                          Assigned to your coordinator account
                        </p>

                        <div className="mt-4 flex items-center gap-2 border-t border-border-subtle pt-3">
                          <span className="h-2 w-2 rounded-full bg-green-500" />

                          <span className="text-caption font-medium text-text-muted">
                            Active assignment
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              {/* Footer */}
              <p className="pb-4 text-center text-caption text-text-subtle">
                EduNex · Connecting students, faculty and campus life.
              </p>
            </>
          )}
        </div>
      </main>
    </CoordinatorLayout>
  );
}
