"use client";

import { useState } from "react";

import {
  getLostFoundErrorMessage,
  useDecideClaimMutation,
  type ClaimReview,
  type ItemDetail,
} from "../api/lost-found-query";
import {
  LOST_FOUND_CLAIM_STATUS_LABELS,
  formatLostFoundDateTime,
  lostFoundClaimStatusBadgeClass,
} from "../utils/lost-found-ui";

export default function ClaimReviewPanel({
  item,
  claims,
}: {
  item: ItemDetail;
  claims: ClaimReview[];
}) {
  const decide = useDecideClaimMutation();
  const [error, setError] = useState<string | null>(null);

  const onDecide = async (
    claim: ClaimReview,
    decision: "approved" | "rejected",
  ) => {
    setError(null);

    try {
      await decide.mutateAsync({
        id: claim.id,
        itemId: item.id,
        input: { decision },
      });
    } catch (mutationError) {
      setError(getLostFoundErrorMessage(mutationError));
    }
  };

  return (
    <section className="space-y-3 rounded-2xl border border-border bg-surface p-5">
      <div>
        <h3 className="font-semibold text-text">Claim review</h3>
        <p className="mt-1 text-sm text-text-muted">
          Match hints are computed on the server from the hidden answers.
        </p>
      </div>

      {claims.length === 0 && (
        <p className="text-sm text-text-muted">No claims yet.</p>
      )}

      {claims.map((claim) => {
        const matched = claim.matches.filter((match) => match.matches).length;

        return (
          <div
            key={claim.id}
            className="space-y-3 rounded-xl border border-border p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-text">
                  {claim.claimantName ?? "Claimant"}
                </p>
                <p className="text-xs text-text-muted">
                  {formatLostFoundDateTime(claim.createdAt)} · {matched}/
                  {claim.matches.length} answers matched
                </p>
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 text-xs ${lostFoundClaimStatusBadgeClass(claim.status)}`}
              >
                {LOST_FOUND_CLAIM_STATUS_LABELS[claim.status]}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {claim.matches.map((match) => (
                <span
                  key={match.id}
                  className={`rounded-full border px-2 py-0.5 text-xs ${
                    match.matches
                      ? "border-green-500/30 bg-green-500/10 text-green-700"
                      : "border-red-500/30 bg-red-500/10 text-red-700"
                  }`}
                >
                  {match.id}: {match.matches ? "match" : "no match"}
                </span>
              ))}
            </div>

            {claim.decisionNote && (
              <p className="text-sm text-text-muted">{claim.decisionNote}</p>
            )}

            {claim.status === "pending" && (
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={decide.isPending}
                  onClick={() => onDecide(claim, "approved")}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={decide.isPending}
                  onClick={() => onDecide(claim, "rejected")}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        );
      })}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </section>
  );
}
