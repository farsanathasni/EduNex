"use client";

import { useAccess } from "@/lib/navigation/access";

export interface LostFoundUiAccess {
  isReady: boolean;
  canView: boolean;
  canCreate: boolean;
  canClaim: boolean;
  canModerate: boolean;
}

export function useLostFoundUiAccess(): LostFoundUiAccess {
  const { can, isPending } = useAccess();

  return {
    isReady: !isPending,
    canView: can("lost_found", "view"),
    canCreate: can("lost_found", "create"),
    canClaim: can("lost_found", "claim"),
    canModerate: can("lost_found", "moderate"),
  };
}
