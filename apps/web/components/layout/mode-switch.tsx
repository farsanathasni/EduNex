"use client";

import { useAccess } from "@/lib/navigation/access";
import Button from "../ui/button";

// Shown only for accounts that are both Student and Club Coordinator.
export function ModeSwitch() {
  const { canSwitchMode, mode, setMode } = useAccess();

  if (!canSwitchMode) return null;

  const next = mode === "student" ? "coordinator" : "student";

  return (
    <Button
      type="button"
      onClick={() => setMode(next)}
      className="rounded-xl border "
    >
      {mode === "student" ? "Switch to Coordinator" : "Switch to Student"}
    </Button>
  );
}