"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getIssueErrorMessage,
  useIssueQuery,
  useReplyIssueMutation,
  useResolveIssueMutation,
} from "../api/issues-query";
import type { IssuePortal } from "../portal";
import {
  formatIssueDateTime,
  isIssueClosed,
  ISSUE_STATUS_LABELS,
  issueStatusBadgeClass,
} from "../utils/issue-ui";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

const selectClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-label text-text outline-none transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function IssueThread({
  issueId,
  portal,
  canRespond,
}: {
  issueId: number;
  portal: IssuePortal;
  canRespond: boolean;
}) {
  const query = useIssueQuery(issueId);
  const replyMutation = useReplyIssueMutation();
  const resolveMutation = useResolveIssueMutation();

  const [reply, setReply] = useState("");
  const [resolution, setResolution] = useState<"resolved" | "rejected">(
    "resolved",
  );
  const [closingNote, setClosingNote] = useState("");
  const [actionError, setActionError] = useState("");

  if (!Number.isInteger(issueId) || issueId <= 0) {
    return (
      <div
        role="alert"
        className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5"
      >
        <p className="font-semibold text-text">Issue not found</p>
        <Link
          href={`/${portal}/issues`}
          className={`text-sm font-medium text-primary hover:underline ${focusRing}`}
        >
          ← Back to issues
        </Link>
      </div>
    );
  }

  if (query.isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-64" />
        <Card padding="lg" className="space-y-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </Card>
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
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
              We couldn&apos;t load this issue
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
    );
  }

  const { issue, responses } = query.data;
  const closed = isIssueClosed(issue.status);

  function handleReply() {
    setActionError("");

    const body = reply.trim();
    if (!body) {
      setActionError("Please enter a reply before sending it.");
      return;
    }

    replyMutation.mutate(
      { id: issueId, input: { body } },
      {
        onSuccess: () => setReply(""),
        onError: (error) =>
          setActionError(
            getIssueErrorMessage(error, "Could not send your reply."),
          ),
      },
    );
  }

  function handleResolve() {
    setActionError("");

    resolveMutation.mutate(
      {
        id: issueId,
        input: {
          status: resolution,
          note: closingNote.trim() || undefined,
        },
      },
      {
        onSuccess: () => setClosingNote(""),
        onError: (error) =>
          setActionError(
            getIssueErrorMessage(error, "Could not update the issue."),
          ),
      },
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href={`/${portal}/issues`}
        className={`inline-flex items-center text-sm font-medium text-primary hover:underline ${focusRing}`}
      >
        ← Back to issues
      </Link>

      {actionError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4" />
          <span>{actionError}</span>
        </div>
      )}

      <Card padding="lg" className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="break-words text-body-lg font-bold text-text">
              {issue.title}
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {issue.isSender
                ? `Sent to ${issue.recipientName ?? "recipient"}`
                : `Received from ${issue.senderName ?? "sender"}`}
              {" · "}
              {formatIssueDateTime(issue.createdAt)}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-md border px-2 py-1 text-xs font-semibold ${issueStatusBadgeClass(issue.status)}`}
          >
            {ISSUE_STATUS_LABELS[issue.status]}
          </span>
        </div>

        <p className="whitespace-pre-wrap text-label leading-relaxed text-text">
          {issue.description}
        </p>

        <div className="flex flex-wrap gap-2 text-xs text-text-muted">
          {issue.category && (
            <span className="rounded-md bg-background px-2 py-1">
              {issue.category}
            </span>
          )}
          <span className="rounded-md bg-background px-2 py-1">
            Updated {formatIssueDateTime(issue.updatedAt)}
          </span>
          {issue.resolvedAt && (
            <span className="rounded-md bg-background px-2 py-1">
              Closed {formatIssueDateTime(issue.resolvedAt)}
            </span>
          )}
        </div>
      </Card>

      <div>
        <h2 className="text-body-lg font-bold text-text">Thread</h2>
        <div className="mt-3 space-y-3">
          {responses.length === 0 ? (
            <Card padding="lg" className="text-sm text-text-muted">
              No replies yet.
            </Card>
          ) : (
            responses.map((response) => (
              <Card key={response.id} padding="lg" className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-label font-semibold text-text">
                    {response.authorName ?? "Unknown"}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatIssueDateTime(response.createdAt)}
                  </p>
                </div>
                <p className="whitespace-pre-wrap text-label text-text-muted">
                  {response.body}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>

      {closed ? (
        <div
          role="status"
          className="rounded-xl border border-border bg-secondary p-5 text-sm text-text-muted"
        >
          This issue is {ISSUE_STATUS_LABELS[issue.status].toLowerCase()} and
          read-only.
        </div>
      ) : (
        <Card padding="lg" className="space-y-4">
          <h2 className="text-body-lg font-bold text-text">Add a reply</h2>
          <div className="space-y-2">
            <label htmlFor="issue-reply" className="sr-only">
              Your reply
            </label>
            <textarea
              id="issue-reply"
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="Write a reply…"
              className={selectClass}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleReply}
              disabled={replyMutation.isPending || !reply.trim()}
              className={focusRing}
            >
              Send reply
            </Button>
          </div>

          {canRespond && issue.isRecipient && (
            <div className="space-y-3 border-t border-border pt-4">
              <h3 className="text-label font-semibold text-text">
                Resolve this issue
              </h3>
              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  aria-label="Resolution status"
                  value={resolution}
                  onChange={(event) =>
                    setResolution(
                      event.target.value as "resolved" | "rejected",
                    )
                  }
                  className={`${selectClass} sm:w-44`}
                >
                  <option value="resolved">Resolve</option>
                  <option value="rejected">Reject</option>
                </select>
                <Input
                  aria-label="Closing note"
                  value={closingNote}
                  onChange={(event) => setClosingNote(event.target.value)}
                  placeholder="Optional closing note"
                  maxLength={2000}
                />
              </div>
              <Button
                variant="accent"
                onClick={handleResolve}
                disabled={resolveMutation.isPending}
                className={focusRing}
              >
                {resolveMutation.isPending
                  ? "Updating…"
                  : "Update status"}
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
