"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useRegisterHeaderSearch } from "@/components/layout/header-search";
import Button from "@/components/ui/button";
import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";

import {
  getLostFoundErrorMessage,
  useLostFoundAuditQuery,
} from "../api/lost-found-query";
import { lostFoundHref, type LostFoundPortal } from "../portal";
import { useLostFoundUiAccess } from "../use-lost-found-access";
import { auditActionLabel, formatLostFoundDateTime } from "../utils/lost-found-ui";
import ClaimList from "./claim-list";
import ItemDetail from "./item-detail";
import ItemForm from "./item-form";
import ItemList from "./item-list";

type View = "list" | "new" | "detail" | "claims" | "audit";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

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
  const { isReady, canCreate, canClaim, canModerate } = useLostFoundUiAccess();
  const [search, setSearch] = useState("");

  useRegisterHeaderSearch(
    portal === "student" && view === "list"
      ? { value: search, onChange: setSearch, placeholder: "Search items or places" }
      : null,
  );

  useEffect(() => {
    if (!isReady) return;
    if (view === "new" && !canCreate) router.replace(lostFoundHref(portal));
    if (view === "claims" && !canClaim) router.replace(lostFoundHref(portal));
    if (view === "audit" && !canModerate) router.replace(lostFoundHref(portal));
  }, [isReady, canCreate, canClaim, canModerate, view, portal, router]);

  const meta = PAGE_META[view];
  const content = (
    <>
      {view === "list" && (
        <ItemList
          portal={portal}
          search={search}
          onSearchChange={setSearch}
          showSearchInput={portal !== "student"}
          studentStyle={portal === "student"}
        />
      )}
      {view === "new" && isReady && canCreate && <ItemForm portal={portal} studentStyle={portal === "student"} />}
      {view === "detail" && <ItemDetail itemId={itemId} studentStyle={portal === "student"} />}
      {view === "claims" && isReady && canClaim && <ClaimList portal={portal} studentStyle={portal === "student"} />}
      {view === "audit" && isReady && canModerate && <AuditPage />}
    </>
  );

  if (portal === "student") {
    return (
      <PageContainer className="space-y-6 py-6 sm:py-8">
        <PageHeader
          eyebrow="Campus community"
          title={meta.title}
          description={meta.subtitle}
          primaryAction={
            view === "list" && canCreate ? (
              <Link
                href={lostFoundHref(portal, "new")}
                className={`inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-label font-semibold text-primary-foreground transition hover:bg-primary-hover sm:w-auto ${focusRing}`}
              >
                Report item
              </Link>
            ) : undefined
          }
          action={
            view === "list" ? (
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                {canClaim && (
                  <Link href={lostFoundHref(portal, "my-claims")} className={`inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition hover:bg-secondary ${focusRing}`}>
                    My claims
                  </Link>
                )}
              </div>
            ) : (
              <Link href={lostFoundHref(portal)} className={`inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition hover:bg-secondary sm:w-auto ${focusRing}`}>
                Back to Lost &amp; Found
              </Link>
            )
          }
        />
        {content}
      </PageContainer>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">{meta.title}</h1>
          <p className="mt-1 text-sm text-text-muted">{meta.subtitle}</p>
        </div>
        {view === "list" && (
          <div className="flex flex-wrap gap-2">
            {canClaim && <Link href={lostFoundHref(portal, "my-claims")} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text">My claims</Link>}
            {canModerate && <Link href={lostFoundHref(portal, "audit")} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text">Audit trail</Link>}
            {canCreate && <Link href={lostFoundHref(portal, "new")} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Report item</Link>}
          </div>
        )}
      </div>
      {content}
    </div>
  );
}
