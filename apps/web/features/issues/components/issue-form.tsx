"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getIssueErrorMessage,
  useCreateIssueMutation,
  useIssueRecipientsQuery,
  type IssueCategory,
  type IssueRecipientGroup,
} from "../api/issues-query";
import type { IssuePortal } from "../portal";
import {
  ISSUE_CATEGORY_LABELS,
} from "../utils/issue-ui";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

const selectClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-label text-text outline-none transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

const GROUP_LABELS: Record<IssueRecipientGroup, string> = {
  hod: "Head of Department",
  faculty: "Faculty",
  principal: "Principal",
};

const CATEGORIES: IssueCategory[] = [
  "academic",
  "facility",
  "technical",
  "other",
];

export default function IssueForm({ portal }: { portal: IssuePortal }) {
  const router = useRouter();
  const recipientsQuery = useIssueRecipientsQuery();
  const createMutation = useCreateIssueMutation();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<IssueCategory>("academic");
  const [recipientId, setRecipientId] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");

  const recipients = recipientsQuery.data;
  const hasRecipients =
    !!recipients &&
    (recipients.hod.length > 0 ||
      recipients.faculty.length > 0 ||
      recipients.principal.length > 0);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    createMutation.mutate(
      { title, description, category, recipientId },
      {
        onSuccess: (issue) => {
          router.push(`/${portal}/issues/${issue.id}`);
        },
        onError: (error) => {
          setFormError(
            getIssueErrorMessage(error, "Could not submit your issue."),
          );
        },
      },
    );
  }

  if (recipientsQuery.isLoading) {
    return (
      <Card padding="lg" className="space-y-5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </Card>
    );
  }

  if (recipientsQuery.isError) {
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
              We couldn&apos;t load recipients
            </p>
            <p className="mt-1 text-sm text-text-muted">
              {getIssueErrorMessage(
                recipientsQuery.error,
                "Please try again.",
              )}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void recipientsQuery.refetch()}
          className={focusRing}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!hasRecipients) {
    return (
      <Card padding="lg">
        <h2 className="text-body-lg font-bold text-text">
          No recipients available
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Ask your department or principal to complete their profiles before
          raising an issue.
        </p>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700"
          >
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4" />
            <span>{formError}</span>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="issue-title" className="text-label font-medium text-text">
            Title
          </label>
          <Input
            id="issue-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Briefly describe the issue"
            maxLength={200}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="issue-category"
              className="text-label font-medium text-text"
            >
              Category
            </label>
            <select
              id="issue-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as IssueCategory)
              }
              className={selectClass}
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {ISSUE_CATEGORY_LABELS[item]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="issue-recipient"
              className="text-label font-medium text-text"
            >
              Recipient
            </label>
            <select
              id="issue-recipient"
              value={recipientId}
              onChange={(event) => setRecipientId(event.target.value)}
              className={selectClass}
              required
            >
              <option value="">Choose a recipient</option>
              {(Object.keys(GROUP_LABELS) as IssueRecipientGroup[]).map(
                (group) =>
                  recipients[group].length > 0 && (
                    <optgroup key={group} label={GROUP_LABELS[group]}>
                      {recipients[group].map((recipient) => (
                        <option key={recipient.id} value={recipient.id}>
                          {recipient.name}
                        </option>
                      ))}
                    </optgroup>
                  ),
              )}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="issue-description"
            className="text-label font-medium text-text"
          >
            Description
          </label>
          <textarea
            id="issue-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            maxLength={5000}
            required
            className={`${selectClass} resize-y`}
            placeholder="Share what happened and any details that will help."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            disabled={createMutation.isPending || !recipientId}
            className={focusRing}
          >
            {createMutation.isPending ? "Submitting…" : "Submit issue"}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/${portal}/issues`)}
            className={focusRing}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
