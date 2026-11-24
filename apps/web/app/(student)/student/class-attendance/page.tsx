"use client";

import { isAxiosError } from "axios";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";
import { ResponsiveDataTable, type DataTableColumn } from "@/components/ui/data-table";
import { useAccess } from "@/lib/navigation/access";
import { useMyClassAttendanceSummaryQuery } from "@/features/class-attendance/api/class-attendance-query";

type AttendanceSubjectRow = {
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  attended: number;
  total: number;
  percentage: number;
  belowMinimum: boolean;
};

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const msg = (error.response?.data as { message?: string } | undefined)?.message;
    if (error.response?.status === 401) return "Please sign in to continue.";
    if (typeof msg === "string" && msg) return msg;
    if (error.response?.status === 403) return "You don't have access.";
  }
  return error instanceof Error ? error.message : "Failed to load attendance.";
}

export default function StudentClassAttendancePage() {
  const { can, isPending: accessPending } = useAccess();
  const allowed = can("class_attendance", "view_own");

  const { data, isLoading, isError, error, refetch } =
    useMyClassAttendanceSummaryQuery(allowed);

  if (accessPending) {
    return (
      <PageContainer className="space-y-4 py-6 sm:py-8">
        <p className="text-text-muted">Checking access...</p>
      </PageContainer>
    );
  }

  if (!allowed) {
    return (
      <PageContainer className="space-y-4 py-6 sm:py-8">
        <PageHeader title="My Attendance" description="View your class attendance records." />
        <Card padding="lg" className="rounded-3xl">
          <p className="text-text-muted">You don&apos;t have access.</p>
        </Card>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer className="space-y-6 py-6 sm:py-8">
        <PageHeader title="My Attendance" description="Your subject-wise class attendance." />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl border border-border bg-surface" />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-3xl border border-border bg-surface" />
      </PageContainer>
    );
  }

  if (isError) {
    const forbidden = isAxiosError(error) && error.response?.status === 403;
    return (
      <PageContainer className="space-y-4 py-6 sm:py-8">
        <PageHeader title="My Attendance" description="Your subject-wise class attendance." />
        <Card padding="lg" className="rounded-3xl">
          <p className={forbidden ? "text-text" : "text-red-600"}>{getErrorMessage(error)}</p>
          {!forbidden && (
            <Button onClick={() => void refetch()} className="mt-4 min-h-11 w-full sm:w-auto">
              Try again
            </Button>
          )}
        </Card>
      </PageContainer>
    );
  }

  if (!data) return null;

  const { overall, subjects, minimumPercentage } = data;
  const columns: DataTableColumn<AttendanceSubjectRow>[] = [
    { header: "Subject", cell: (s) => <span className="font-medium">{s.subjectName}</span>, mobileLabel: "Subject", mobilePriority: "primary" },
    { header: "Code", cell: (s) => s.subjectCode, mobileLabel: "Code", mobilePriority: "secondary" },
    { header: "Present / Total", cell: (s) => `${s.attended} / ${s.total}`, mobileLabel: "Present / Total", mobilePriority: "secondary" },
    { header: "Percentage", cell: (s) => <span className={s.belowMinimum ? "font-semibold text-red-700" : "font-semibold text-text"}>{s.percentage}%</span>, mobileLabel: "Percentage", mobilePriority: "secondary" },
    { header: "Status", cell: (s) => <Badge tone={s.belowMinimum ? "danger" : "success"}>{s.belowMinimum ? `Below ${minimumPercentage}%` : "On track"}</Badge>, mobileLabel: "Status", mobilePriority: "secondary", mobileIsStatus: true },
  ];

  return (
    <PageContainer className="space-y-6 py-6 sm:py-8">
      <PageHeader
        eyebrow="Attendance"
        title="My Attendance"
        description={`Your subject-wise class attendance. Minimum required: ${minimumPercentage}%.`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card padding="lg" className="rounded-3xl">
          <p className="text-sm text-text-muted">Overall attendance</p>
          <p className="mt-2 text-3xl font-bold text-text">{overall.percentage}%</p>
          <p className="mt-1 text-sm text-text-muted">{overall.attended} / {overall.total} classes</p>
        </Card>
        <Card padding="lg" className="rounded-3xl">
          <p className="text-sm text-text-muted">Classes attended</p>
          <p className="mt-2 text-3xl font-bold text-green-700">{overall.attended}</p>
        </Card>
        <Card padding="lg" className="rounded-3xl">
          <p className="text-sm text-text-muted">Total classes</p>
          <p className="mt-2 text-3xl font-bold text-text">{overall.total}</p>
        </Card>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="text-subheading font-bold text-text">Subject-wise attendance</h2>
          <p className="mt-1 text-sm text-text-muted">Subjects below {minimumPercentage}% are highlighted.</p>
        </div>
        <ResponsiveDataTable
          columns={columns}
          rows={subjects}
          getRowKey={(s) => s.subjectId}
          minWidthClassName="min-w-[720px]"
          emptyState="No attendance records yet. Your class attendance will appear here once it is recorded."
        />
      </div>
    </PageContainer>
  );
}
