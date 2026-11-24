"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useRegisterHeaderSearch } from "@/components/layout/header-search";
import Button from "@/components/ui/button";
import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";

import IssueForm from "./issue-form";
import IssueList from "./issue-list";
import IssueThread from "./issue-thread";
import type { IssuePortal } from "../portal";
import { useIssueUiAccess } from "../use-issue-access";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

const PAGE_META: Record<
  "list" | "new" | "detail",
  { title: string; subtitle: string }
> = {
  list: {
    title: "Issues",
    subtitle: "Track concerns you raised or received.",
  },
  new: {
    title: "New issue",
    subtitle: "Raise a concern with the right person.",
  },
  detail: {
    title: "Issue thread",
    subtitle: "Review the conversation and updates.",
  },
};

const STUDENT_LIST_META = {
  title: "My Issues",
  subtitle: "Raise a concern and track the response",
};

export default function IssuePortalPage({
  portal,
  view,
}: {
  portal: IssuePortal;
  view: "list" | "new" | "detail";
}) {
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const issueId = Number(params?.id);
  const { allowedBoxes, canCreate, canRespond, defaultBox, isReady } =
    useIssueUiAccess(portal);
  const [search, setSearch] = useState("");

  useRegisterHeaderSearch(
    portal === "student" && view === "list"
      ? { value: search, onChange: setSearch, placeholder: "Search title or description" }
      : null,
  );

  const meta =
    portal === "student" && view === "list" ? STUDENT_LIST_META : PAGE_META[view];

  useEffect(() => {
    if (view === "new" && isReady && (portal === "principal" || !canCreate)) {
      router.replace(`/${portal}/issues`);
    }
  }, [view, isReady, canCreate, portal, router]);

  if (view === "new" && isReady && (portal === "principal" || !canCreate)) {
    return null;
  }

  const content = (
    <>
      {view === "list" && (
        <IssueList
          portal={portal}
          allowedBoxes={allowedBoxes}
          defaultBox={defaultBox}
          canCreate={canCreate}
          isReady={isReady}
          search={search}
          onSearchChange={setSearch}
          showSearchInput={portal !== "student"}
        />
      )}
      {view === "new" && canCreate && <IssueForm portal={portal} studentStyle={portal === "student"} />}
      {view === "detail" && <IssueThread issueId={issueId} portal={portal} canRespond={canRespond} />}
    </>
  );

  if (portal === "student") {
    return (
      <PageContainer className="space-y-6 py-6 sm:py-8">
        <PageHeader
          eyebrow="Support"
          title={meta.title}
          description={meta.subtitle}
          primaryAction={
            view === "list" && canCreate ? (
              <Link
                href={`/${portal}/issues/new`}
                className={`inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-label font-semibold text-primary-foreground transition hover:bg-primary-hover sm:w-auto ${focusRing}`}
              >
                New Issue
              </Link>
            ) : undefined
          }
          action={
            view !== "list" ? (
              <Link
                href={`/${portal}/issues`}
                className={`inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border bg-surface px-5 py-3 text-label font-semibold text-text transition hover:bg-secondary sm:w-auto ${focusRing}`}
              >
                Back to issues
              </Link>
            ) : undefined
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
        {view === "list" && canCreate && (
          <Link
            href={`/${portal}/issues/new`}
            className={`inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-label font-semibold text-primary-foreground transition hover:bg-primary-hover ${focusRing}`}
          >
            New Issue
          </Link>
        )}
      </div>
      {content}
    </div>
  );
}
