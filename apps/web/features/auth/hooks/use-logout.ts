import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { useModeStore } from "@/stores/mode-store";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const logout = useCallback(async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      queryClient.clear();
      useModeStore.getState().setMode("student");
      setIsSigningOut(false);
      router.replace("/login");
      router.refresh();
    }
  }, [isSigningOut, queryClient, router]);

  return { logout, isSigningOut };
}
