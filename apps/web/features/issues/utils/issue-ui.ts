import type { IssueCategory, IssueStatus } from "../api/issues.types";

export const ISSUE_CATEGORY_LABELS: Record<IssueCategory, string> = {
  academic: "Academic",
  facility: "Facility",
  technical: "Technical",
  other: "Other",
};

export const ISSUE_STATUS_LABELS: Record<IssueStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

export function isIssueClosed(status: IssueStatus): boolean {
  return status === "resolved" || status === "rejected";
}

export function formatIssueDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatIssueDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function issueStatusBadgeClass(status: IssueStatus): string {
  switch (status) {
    case "open":
      return "border-blue-500/30 bg-blue-500/10 text-blue-700";
    case "in_progress":
      return "border-amber-500/30 bg-amber-500/10 text-amber-700";
    case "resolved":
      return "border-green-500/30 bg-green-500/10 text-green-700";
    default:
      return "border-red-500/30 bg-red-500/10 text-red-700";
  }
}
