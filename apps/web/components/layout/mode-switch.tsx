"use client";

import { useAccess } from "@/lib/navigation/access";

// Shown only for accounts that are both Student and Club Coordinator.
export function ModeSwitch() {
  const { canSwitchMode, mode, setMode } = useAccess();

  if (!canSwitchMode) return null;

  const next = mode === "student" ? "coordinator" : "student";

  return (
    <button
      type="button"
      onClick={() => setMode(next)}
      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium transition hover:bg-background"
    >
      {mode === "student" ? "Switch to Coordinator" : "Switch to Student"}
    </button>
  );
}