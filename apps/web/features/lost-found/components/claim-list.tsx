"use client";

import Link from "next/link";

import {
  getLostFoundErrorMessage,
  useMyClaimsQuery,
  useWithdrawClaimMutation,
} from "../api/lost-found-query";
import { lostFoundHref, type LostFoundPortal } from "../portal";
import {
  LOST_FOUND_CLAIM_STATUS_LABELS,
  formatLostFoundDateTime,
  lostFoundClaimStatusBadgeClass,
} from "../utils/lost-found-ui";

export default function ClaimList({ portal }: { portal: LostFoundPortal }) {
  const { data, isLoading, isError } = useMyClaimsQuery();
  const withdraw = useWithdrawClaimMutation();

  if (isLoading) return <p className="text-sm text-text-muted">Loading claims...</p>;
  if (isError) {
    return (
      <p className="text-sm text-red-600">
        {getLostFoundErrorMessage(isError)}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {data?.length === 0 && (
        <p className="text-sm text-text-muted">You have not made any claims.</p>
      )}

      {data?.map((claim) => (
        <div
          key={claim.id}
          className="rounded-2xl border border-border bg-surface p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Link
                href={lostFoundHref(portal, claim.itemId)}
                className="font-semibold text-text hover:underline"
              >
                {claim.item.title}
              </Link>
              <p className="mt-1 text-xs text-text-muted">
                Submitted {formatLostFoundDateTime(claim.createdAt)}
              </p>
            </div>
            <span
              className={`rounded-full border px-2 py-0.5 text-xs ${lostFoundClaimStatusBadgeClass(claim.status)}`}
            >
              {LOST_FOUND_CLAIM_STATUS_LABELS[claim.status]}
            </span>
          </div>

          {claim.decisionNote && (
            <p className="mt-3 text-sm text-text-muted">
              {claim.decisionNote}
            </p>
          )}

          {claim.status === "pending" && (
            <button
              type="button"
              disabled={withdraw.isPending}
              onClick={() => withdraw.mutate({ id: claim.id, itemId: claim.itemId })}
              className="mt-3 rounded-lg border border-border px-3 py-1.5 text-sm text-text disabled:opacity-60"
            >
              Withdraw claim
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
