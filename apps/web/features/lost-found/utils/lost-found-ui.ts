import type {
  LostFoundCategory,
  LostFoundClaimStatus,
  LostFoundStatus,
} from "../api/lost-found.types";

export const LOST_FOUND_CATEGORY_LABELS: Record<LostFoundCategory, string> = {
  bags: "Bags",
  electronics: "Electronics",
  documents: "Documents",
  books: "Books",
  clothing: "Clothing",
  accessories: "Accessories",
  keys: "Keys",
  other: "Other",
};

export const LOST_FOUND_STATUS_LABELS: Record<LostFoundStatus, string> = {
  active: "Active",
  claimed: "Claim approved",
  returned: "Returned",
  closed: "Closed",
};

export const LOST_FOUND_CLAIM_STATUS_LABELS: Record<
  LostFoundClaimStatus,
  string
> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export function formatLostFoundDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatLostFoundDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function lostFoundStatusBadgeClass(status: LostFoundStatus): string {
  switch (status) {
    case "active":
      return "border-blue-500/30 bg-blue-500/10 text-blue-700";
    case "claimed":
      return "border-amber-500/30 bg-amber-500/10 text-amber-700";
    case "returned":
      return "border-green-500/30 bg-green-500/10 text-green-700";
    default:
      return "border-slate-500/30 bg-slate-500/10 text-slate-600";
  }
}

export function lostFoundClaimStatusBadgeClass(
  status: LostFoundClaimStatus,
): string {
  switch (status) {
    case "pending":
      return "border-amber-500/30 bg-amber-500/10 text-amber-700";
    case "approved":
      return "border-green-500/30 bg-green-500/10 text-green-700";
    case "rejected":
      return "border-red-500/30 bg-red-500/10 text-red-700";
    default:
      return "border-slate-500/30 bg-slate-500/10 text-slate-600";
  }
}

export function auditActionLabel(action: string): string {
  const labels: Record<string, string> = {
    posted: "Item posted",
    edited: "Item edited",
    closed: "Item closed",
    claim_submitted: "Claim submitted",
    approved: "Claim approved",
    rejected: "Claim rejected",
    withdrawn: "Claim withdrawn",
    returned: "Item returned",
    receipt_confirmed: "Receipt confirmed",
  };

  return labels[action] ?? action.replaceAll("_", " ");
}
