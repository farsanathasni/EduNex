"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { AlertCircle, Inbox } from "lucide-react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getIssueErrorMessage,
  useIssuesQuery,
  type IssueBox,
  type IssueStatus,
} from "../api/issues-query";
import type { IssuePortal } from "../portal";
import {
  formatIssueDate,
  ISSUE_STATUS_LABELS,
  issueStatusBadgeClass,
} from "../utils/issue-ui";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

const selectClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-label text-text outline-none transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

const STATUSES: IssueStatus[] = [
  "open",
  "in_progress",
  "resolved",
  "rejected",
];

const BOX_TAB_LABELS: Record<IssueBox, string> = {
  received: "Received",
  sent: "Sent",
};

const SINGLE_BOX_LABELS: Record<IssueBox, string> = {
  received: "Received",
  sent: "My Issues",
};

const EMPTY_STATES: Record<
  IssueBox,
  { title: string; description: string }
> = {
  sent: {
    title: "You haven't raised any issues yet",
    description: "Issues you raise will appear here.",
  },
  received: {
    title: "No issues assigned to you",
    description: "Issues sent to you will appear here.",
  },
};

const PAGE_SIZE = 10;

export default function IssueList({
  portal,
  allowedBoxes,
  defaultBox,
  canCreate,
  isReady,
  search: controlledSearch,
  onSearchChange,
  showSearchInput = true,
}: {
  portal: IssuePortal;
  allowedBoxes: IssueBox[];
  defaultBox: IssueBox;
  canCreate: boolean;
  isReady: boolean;
  search?: string;
  onSearchChange?: (value: string) => void;
  showSearchInput?: boolean;
}) {
  const [selectedBox, setSelectedBox] = useState<IssueBox | null>(null);
  const box = selectedBox && allowedBoxes.includes(selectedBox) ? selectedBox : defaultBox;
  const [status, setStatus] = useState<IssueStatus | "">("");
  const [internalSearch, setInternalSearch] = useState("");
  const search = controlledSearch ?? internalSearch;
  const setSearch = onSearchChange ?? setInternalSearch;
  const [page, setPage] = useState(1);

  const query = useIssuesQuery({
    box,
    status: status || undefined,
    search: search.trim() || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const { data } = query;
  const pagination = data?.pagination;
  const emptyState = EMPTY_STATES[box];
  const hasTabs = allowedBoxes.length > 1;
  const tabId = (value: IssueBox) => `issue-tab-${value}`;

  useEffect(() => {
    if (pagination && page > pagination.totalPages) {
      setPage(Math.max(1, pagination.totalPages));
    }
  }, [pagination?.totalPages, page]);

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    current: IssueBox,
  ) => {
    const currentIndex = allowedBoxes.indexOf(current);
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % allowedBoxes.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + allowedBoxes.length) % allowedBoxes.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = allowedBoxes.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    const nextBox = allowedBoxes[nextIndex];
    setSelectedBox(nextBox);
    setPage(1);
    document.getElementById(tabId(nextBox))?.focus();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {allowedBoxes.length > 1 ? (
          <div
            role="tablist"
            aria-label="Issue box"
            className="inline-flex w-fit rounded-xl border border-border bg-surface p-1"
          >
            {allowedBoxes.map((value) => (
              <button
                key={value}
                id={tabId(value)}
                type="button"
                role="tab"
                aria-controls="issue-box-panel"
                aria-selected={box === value}
                tabIndex={box === value ? 0 : -1}
                onClick={() => {
                  setSelectedBox(value);
                  setPage(1);
                }}
                onKeyDown={(event) => handleTabKeyDown(event, value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${focusRing} ${
                  box === value
                    ? "bg-primary text-primary-foreground"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {BOX_TAB_LABELS[value]}
              </button>
            ))}
          </div>
        ) : (
          <div className="w-fit rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text">
            {SINGLE_BOX_LABELS[box]}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {showSearchInput && (
            <div className="min-w-0 flex-1 basis-full sm:basis-[260px] sm:max-w-sm">
              <Input
                type="search"
                aria-label="Search issues"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search title or description"
              />
            </div>
          )}
          <div className="min-w-0 flex-1 basis-full sm:basis-[180px] sm:max-w-[220px]">
            <select
              aria-label="Filter issues by status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as IssueStatus | "");
                setPage(1);
              }}
              className={`${selectClass} min-h-11`}
            >
              <option value="">All statuses</option>
              {STATUSES.map((value) => (
                <option key={value} value={value}>
                  {ISSUE_STATUS_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div
        role={hasTabs ? "tabpanel" : undefined}
        id={hasTabs ? "issue-box-panel" : undefined}
        aria-labelledby={hasTabs ? tabId(box) : undefined}
      >
        {!isReady || query.isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} padding="lg" className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </Card>
          ))}
        </div>
      ) : query.isError ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
            />
            <div>
              <p className="font-semibold text-text">
                We couldn&apos;t load your issues
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {getIssueErrorMessage(query.error, "Please try again.")}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void query.refetch()}
            className={focusRing}
          >
            Try again
          </Button>
        </div>
      ) : !data?.issues.length ? (
        <Card padding="lg" className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-subtle text-primary">
            <Inbox aria-hidden="true" className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-body-lg font-bold text-text">
            {emptyState.title}
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            {emptyState.description}
          </p>
          {box === "sent" && canCreate && (
            <Link
              href={`/${portal}/issues/new`}
              className={`mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-label font-semibold text-primary-foreground transition hover:bg-primary-hover ${focusRing}`}
            >
              New Issue
            </Link>
          )}
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.issues.map((issue) => (
              <Card key={issue.id} padding="lg" className="flex min-w-0 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="line-clamp-2 min-w-0 break-words text-body font-bold leading-snug text-text">
                    {issue.title}
                  </h2>
                  <span
                    className={`shrink-0 rounded-md border px-2 py-1 text-xs font-semibold ${issueStatusBadgeClass(issue.status)}`}
                  >
                    {ISSUE_STATUS_LABELS[issue.status]}
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 text-label leading-relaxed text-text-muted">
                  {issue.description}
                </p>

                <div className="mt-4 space-y-1 text-xs text-text-muted">
                  <p>
                    {box === "sent" ? "To" : "From"}:{" "}
                    <span className="font-medium text-text">
                      {issue.counterpartyName ?? "Unknown"}
                    </span>
                  </p>
                  <p>Updated {formatIssueDate(issue.updatedAt)}</p>
                </div>

                <div className="mt-auto pt-5">
                  <Link
                    href={`/${portal}/issues/${issue.id}`}
                    className={`inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-label font-semibold text-primary-foreground transition hover:bg-primary-hover ${focusRing}`}
                  >
                    View thread
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-text-muted">
                Page {pagination.page} of {pagination.totalPages} ·{" "}
                {pagination.total} issues
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className={focusRing}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className={focusRing}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}
