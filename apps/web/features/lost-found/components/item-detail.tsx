"use client";

import { useState } from "react";
import Image from "next/image";

import {
  getLostFoundErrorMessage,
  useConfirmReceiptMutation,
  useLostFoundItemQuery,
  useMarkReturnedMutation,
  useUpdateLostFoundItemMutation,
  useWithdrawClaimMutation,
} from "../api/lost-found-query";
import { useLostFoundUiAccess } from "../use-lost-found-access";
import {
  LOST_FOUND_CATEGORY_LABELS,
  LOST_FOUND_CLAIM_STATUS_LABELS,
  LOST_FOUND_STATUS_LABELS,
  formatLostFoundDate,
  formatLostFoundDateTime,
  lostFoundClaimStatusBadgeClass,
  lostFoundStatusBadgeClass,
} from "../utils/lost-found-ui";
import AuditTimeline from "./audit-timeline";
import ClaimForm from "./claim-form";
import ClaimReviewPanel from "./claim-review-panel";

export default function ItemDetail({ itemId }: { itemId: number }) {
  const { data: item, isLoading, isError } = useLostFoundItemQuery(itemId);
  const { canClaim } = useLostFoundUiAccess();

  const markReturned = useMarkReturnedMutation();
  const confirmReceipt = useConfirmReceiptMutation();
  const updateItem = useUpdateLostFoundItemMutation();
  const withdraw = useWithdrawClaimMutation();

  const [error, setError] = useState<string | null>(null);

  const runAction = async (action: () => Promise<unknown>) => {
    setError(null);

    try {
      await action();
    } catch (actionError) {
      setError(getLostFoundErrorMessage(actionError));
    }
  };

  if (isLoading) return <p className="text-sm text-text-muted">Loading item...</p>;
  if (isError || !item) {
    return (
      <p className="text-sm text-red-600">
        This item could not be found or you do not have access to it.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)]">
        <div className="space-y-4">
          {item.photos.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {item.photos.map((photo) => (
                <Image
                  key={photo.publicId}
                  src={photo.url}
                  alt={item.title}
                  width={800}
                  height={600}
                  unoptimized
                  className="h-64 w-full rounded-2xl border border-border object-cover"
                />
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-text">{item.title}</h2>
                <p className="mt-1 text-sm text-text-muted">
                  Reported by {item.finderName ?? "Unknown"} ·{" "}
                  {formatLostFoundDate(item.createdAt)}
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${lostFoundStatusBadgeClass(item.status)}`}
              >
                {LOST_FOUND_STATUS_LABELS[item.status]}
              </span>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-sm text-text">
              {item.description}
            </p>

            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-text-muted">Category</dt>
                <dd className="text-text">
                  {LOST_FOUND_CATEGORY_LABELS[item.category]}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Place</dt>
                <dd className="text-text">{item.place}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Date found</dt>
                <dd className="text-text">
                  {formatLostFoundDate(item.dateFound)}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Claims</dt>
                <dd className="text-text">{item.claimCount ?? "—"}</dd>
              </div>
            </dl>

            {item.canReview && (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                {item.status !== "returned" && item.status !== "closed" && (
                  <button
                    type="button"
                    disabled={markReturned.isPending}
                    onClick={() =>
                      runAction(() => markReturned.mutateAsync(item.id))
                    }
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    Mark returned
                  </button>
                )}
                {item.isFinder && item.status === "active" && (
                  <button
                    type="button"
                    disabled={updateItem.isPending}
                    onClick={() =>
                      runAction(() =>
                        updateItem.mutateAsync({ id: item.id, input: { close: true } }),
                      )
                    }
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text disabled:opacity-60"
                  >
                    Close item
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="font-semibold text-text">Verification questions</h3>
            <ol className="mt-3 space-y-2 text-sm text-text-muted">
              {item.verificationQuestions.map((question, index) => (
                <li key={question.id}>
                  {index + 1}. {question.prompt}
                </li>
              ))}
            </ol>

            {item.expectedAnswers && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Hidden answers (finder only)
                </p>
                <ul className="mt-2 space-y-1 text-sm text-text">
                  {item.expectedAnswers.map((answer, index) => (
                    <li key={answer.id}>
                      Q{index + 1}: {answer.answer}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {item.myClaim && (
            <section className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-text">Your claim</h3>
                  <p className="text-xs text-text-muted">
                    Submitted {formatLostFoundDateTime(item.myClaim.createdAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs ${lostFoundClaimStatusBadgeClass(item.myClaim.status)}`}
                >
                  {LOST_FOUND_CLAIM_STATUS_LABELS[item.myClaim.status]}
                </span>
              </div>

              {item.myClaim.decisionNote && (
                <p className="mt-3 text-sm text-text-muted">
                  {item.myClaim.decisionNote}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {item.myClaim.status === "pending" && (
                  <button
                    type="button"
                    disabled={withdraw.isPending}
                    onClick={() =>
                      runAction(() =>
                        withdraw.mutateAsync({
                          id: item.myClaim!.id,
                          itemId: item.id,
                        }),
                      )
                    }
                    className="rounded-lg border border-border px-3 py-1.5 text-sm text-text disabled:opacity-60"
                  >
                    Withdraw claim
                  </button>
                )}
                {item.myClaim.status === "approved" &&
                  item.status === "returned" && (
                    <button
                      type="button"
                      disabled={confirmReceipt.isPending}
                      onClick={() =>
                        runAction(() => confirmReceipt.mutateAsync(item.id))
                      }
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                    >
                      Confirm receipt
                    </button>
                  )}
              </div>
            </section>
          )}

          {canClaim &&
            !item.isFinder &&
            item.status === "active" &&
            !item.myClaim && (
              <ClaimForm itemId={item.id} questions={item.verificationQuestions} />
            )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>

      {item.canReview && item.claims && (
        <ClaimReviewPanel item={item} claims={item.claims} />
      )}

      {item.canReview && item.audit && <AuditTimeline events={item.audit} />}
    </div>
  );
}
