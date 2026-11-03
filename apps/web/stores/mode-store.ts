import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Mode = "student" | "coordinator";

// Frontend-only view mode. The backend always checks the union of roles.
export const useModeStore = create<{
  mode: Mode;
  setMode: (mode: Mode) => void;
}>()(
  persist(
    (set) => ({
      mode: "student",
      setMode: (mode) => set({ mode }),
    }),
    { name: "edunex-mode" },
  ),
);