"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import IssueForm from "./issue-form";
import IssueList from "./issue-list";
import IssueThread from "./issue-thread";
import type { IssuePortal } from "../portal";
import { useIssueUiAccess } from "../use-issue-access";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

const CONTAINER_CLASS: Record<IssuePortal, string> = {
  student: "mx-auto w-full max-w-5xl p-6 space-y-6",
  teacher: "space-y-6",
  hod: "space-y-6",
  principal: "space-y-6",
};

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

  return (
    <div className={CONTAINER_CLASS[portal]}>
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

      {view === "list" && (
        <IssueList
          portal={portal}
          allowedBoxes={allowedBoxes}
          defaultBox={defaultBox}
          canCreate={canCreate}
          isReady={isReady}
        />
      )}
      {view === "new" && canCreate && <IssueForm portal={portal} />}
      {view === "detail" && (
        <IssueThread
          issueId={issueId}
          portal={portal}
          canRespond={canRespond}
        />
      )}
    </div>
  );
}
