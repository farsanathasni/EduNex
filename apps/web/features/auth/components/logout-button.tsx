"use client";

import { LogOut } from "lucide-react";

import { useLogout } from "../hooks/use-logout";

type LogoutButtonProps = {
  className?: string;
  label?: string;
  showIcon?: boolean;
};

export default function LogoutButton({
  className = "w-full rounded-xl border border-border px-4 py-3 text-left text-sm font-medium transition hover:bg-background disabled:opacity-50",
  label = "Sign out",
  showIcon = false,
}: LogoutButtonProps) {
  const { logout, isSigningOut } = useLogout();

  return (
    <button
      type="button"
      onClick={() => void logout()}
      disabled={isSigningOut}
      className={className}
    >
      {showIcon && (
        <LogOut aria-hidden="true" className="h-5 w-5 shrink-0" />
      )}
      <span>{isSigningOut ? "Signing out..." : label}</span>
    </button>
  );
}
