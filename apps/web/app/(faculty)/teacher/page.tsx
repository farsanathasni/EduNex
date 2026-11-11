
"use client";

import Link from "next/link";
import { useTeacherDashboardQuery } from "@/features/teacher/api/teacher-query";

function TeacherDashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Dashboard heading */}
      <section>
        <div className="h-4 w-28 rounded bg-border" />
        <div className="mt-3 h-8 w-56 rounded bg-border" />
        <div className="mt-3 h-4 w-40 rounded bg-border" />
      </section>

      {/* Statistics cards */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-surface p-6"
          >
            <div className="h-4 w-32 rounded bg-border" />
            <div className="mt-4 h-9 w-20 rounded bg-border" />
            <div className="mt-3 h-4 w-44 rounded bg-border" />
          </div>
        ))}
      </section>

      {/* Quick actions */}
      <section>
        <div className="h-6 w-32 rounded bg-border" />

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="h-5 w-28 rounded bg-border" />
              <div className="mt-3 h-4 w-full rounded bg-border" />
              <div className="mt-2 h-4 w-3/4 rounded bg-border" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <p className="text-sm text-muted">{title}</p>
      <h2 className="mt-3 text-3xl font-bold">{value}</h2>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}

export default function TeacherDashboardPage() {
  const { data, isLoading, isError, refetch } =
    useTeacherDashboardQuery();

  if (isLoading) {
    return <TeacherDashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <p className="text-red-500">Unable to load dashboard.</p>
        <button
          onClick={() => refetch()}
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm text-muted">Welcome back</p>
        <h1 className="mt-1 text-2xl font-bold">
          Teacher Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted">
          {data.teacher.departmentName ?? "Department not available"}
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Students"
          value={data.totalStudents}
          description="Students in your department"
        />

        <StatCard
          title="Total Semesters"
          value={data.totalSemesters}
          description="Semesters currently available"
        />

        <StatCard
          title="Study Materials"
          value={data.totalMaterials}
          description="Materials in your department"
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold">Quick Actions</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/teacher/classes"
            className="rounded-xl border border-border bg-surface p-5 transition hover:border-primary"
          >
            <h3 className="font-semibold">My Classes</h3>
            <p className="mt-2 text-sm text-muted">
              View available department semesters.
            </p>
          </Link>

          <Link
            href="/teacher/students"
            className="rounded-xl border border-border bg-surface p-5 transition hover:border-primary"
          >
            <h3 className="font-semibold">My Students</h3>
            <p className="mt-2 text-sm text-muted">
              View and filter students by semester.
            </p>
          </Link>

          <Link
            href="/teacher/study-materials"
            className="rounded-xl border border-border bg-surface p-5 transition hover:border-primary"
          >
            <h3 className="font-semibold">Study Materials</h3>
            <p className="mt-2 text-sm text-muted">
              Add and manage learning resources.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
