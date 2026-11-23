"use client";

import { useAccess } from "@/lib/navigation/access";

import type { IssueBox } from "./api/issues-query";
import type { IssuePortal } from "./portal";

export interface IssueUiAccess {
  isReady: boolean;
  canCreate: boolean;
  canRespond: boolean;
  allowedBoxes: IssueBox[];
  defaultBox: IssueBox;
}

export function useIssueUiAccess(portal: IssuePortal): IssueUiAccess {
  const { can, isPending } = useAccess();

  const canRespond = can("issue", "respond");
  const canCreate = portal === "principal" ? false : can("issue", "create");
  const createOnly = canCreate && !canRespond;
  const respondOnly = canRespond && !canCreate;

  return {
    isReady: !isPending,
    canCreate,
    canRespond,
    allowedBoxes: createOnly
      ? ["sent"]
      : respondOnly
        ? ["received"]
        : ["received", "sent"],
    defaultBox: createOnly ? "sent" : "received",
  };
}
