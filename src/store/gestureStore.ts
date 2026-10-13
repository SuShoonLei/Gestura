import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GESTURE_CATALOG } from "@/data/catalog.ts";
import type { GestureMapping } from "@/types/index.ts";

type GestureState = {
  enabledById: Record<string, boolean>;
  setEnabled: (gestureId: string, enabled: boolean) => void;
};

export function resolveMappings(enabledById: Readonly<Record<string, boolean>>): GestureMapping[] {
  return GESTURE_CATALOG.map((entry) => ({
    gestureId: entry.id,
    actionId: entry.actionId,
    enabled: enabledById[entry.id] ?? true,
  }));
}

export const useGestureStore = create<GestureState>()(
  persist(
    (set) => ({
      enabledById: {},
      setEnabled: (gestureId, enabled) =>
        set((state) => ({
          enabledById: { ...state.enabledById, [gestureId]: enabled },
        })),
    }),
    {
      name: "gestura-gestures",
      partialize: (state) => ({ enabledById: state.enabledById }),
    },
  ),
);
