"use client";

import { useAccess } from "@/lib/navigation/access";

import type { IssueBox } from "./api/issues-query";

export interface IssueUiAccess {
  isReady: boolean;
  canCreate: boolean;
  canRespond: boolean;
  allowedBoxes: IssueBox[];
  defaultBox: IssueBox;
}

export function useIssueUiAccess(): IssueUiAccess {
  const { can, isPending } = useAccess();

  const canCreate = can("issue", "create");
  const canRespond = can("issue", "respond");
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
