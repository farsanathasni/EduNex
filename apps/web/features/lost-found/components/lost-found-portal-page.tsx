"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  getLostFoundErrorMessage,
  useLostFoundAuditQuery,
} from "../api/lost-found-query";
import { lostFoundHref, type LostFoundPortal } from "../portal";
import { useLostFoundUiAccess } from "../use-lost-found-access";
import {
  auditActionLabel,
  formatLostFoundDateTime,
} from "../utils/lost-found-ui";
import ClaimList from "./claim-list";
import ItemDetail from "./item-detail";
import ItemForm from "./item-form";
import ItemList from "./item-list";

type View = "list" | "new" | "detail" | "claims" | "audit";

const CONTAINER_CLASS: Record<LostFoundPortal, string> = {
  student: "mx-auto w-full max-w-6xl space-y-6 p-6",
  teacher: "space-y-6",
  hod: "space-y-6",
  principal: "space-y-6",
};

const PAGE_META: Record<View, { title: string; subtitle: string }> = {
  list: {
    title: "Lost & Found",
    subtitle: "Campus-wide lost and found with verified claims.",
  },
  new: {
    title: "Report a found item",
    subtitle: "Add photos and private verification questions.",
  },
  detail: {
    title: "Item details",
    subtitle: "Review the item, claims and activity.",
  },
  claims: {
    title: "My claims",
    subtitle: "Track claims you submitted across campus.",
  },
  audit: {
    title: "Lost & Found audit",
    subtitle: "Review all lost and found activity.",
  },
};

function AuditPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useLostFoundAuditQuery({
    page,
    limit: 20,
  });

  if (isLoading) return <p className="text-sm text-text-muted">Loading audit...</p>;
  if (isError) {
    return (
      <p className="text-sm text-red-600">
        {getLostFoundErrorMessage(error)}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {data?.events.map((event) => (
          <div
            key={event.id}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-text">
                {auditActionLabel(event.action)}
              </p>
              <p className="text-xs text-text-muted">
                {formatLostFoundDateTime(event.createdAt)}
              </p>
            </div>
            <p className="mt-1 text-sm text-text-muted">
              {event.actorName ?? "System"}
              {event.itemTitle ? ` · ${event.itemTitle}` : ""}
            </p>
          </div>
        ))}
      </div>

      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-text disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-text-muted">
            Page {page} of {data.pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-text disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function LostFoundPortalPage({
  portal,
  view,
}: {
  portal: LostFoundPortal;
  view: View;
}) {
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const itemId = Number(params?.id);
  const { isReady, canCreate, canClaim, canModerate } =
    useLostFoundUiAccess();

  useEffect(() => {
    if (!isReady) return;
    if (view === "new" && !canCreate) router.replace(lostFoundHref(portal));
    if (view === "claims" && !canClaim) router.replace(lostFoundHref(portal));
    if (view === "audit" && !canModerate) router.replace(lostFoundHref(portal));
  }, [isReady, canCreate, canClaim, canModerate, view, portal, router]);

  const meta = PAGE_META[view];

  return (
    <div className={CONTAINER_CLASS[portal]}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">{meta.title}</h1>
          <p className="mt-1 text-sm text-text-muted">{meta.subtitle}</p>
        </div>

        {view === "list" && (
          <div className="flex flex-wrap gap-2">
            {canClaim && (
              <Link
                href={lostFoundHref(portal, "my-claims")}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text"
              >
                My claims
              </Link>
            )}
            {canModerate && (
              <Link
                href={lostFoundHref(portal, "audit")}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text"
              >
                Audit trail
              </Link>
            )}
            {canCreate && (
              <Link
                href={lostFoundHref(portal, "new")}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Report item
              </Link>
            )}
          </div>
        )}
      </div>

      {view === "list" && <ItemList portal={portal} />}
      {view === "new" && isReady && canCreate && <ItemForm portal={portal} />}
      {view === "detail" && <ItemDetail itemId={itemId} />}
      {view === "claims" && isReady && canClaim && <ClaimList portal={portal} />}
      {view === "audit" && isReady && canModerate && <AuditPage />}
    </div>
  );
}
