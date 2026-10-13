import type { BuiltinActionId, BuiltinGestureId } from "@/types/index.ts";

export type GestureCatalogEntry = {
  id: BuiltinGestureId;
  name: string;
  description: string;
  actionId: BuiltinActionId;
};

export const GESTURE_CATALOG: readonly GestureCatalogEntry[] = [
  {
    id: "swipe-left",
    name: "Swipe left",
    description: "Move your hand quickly toward the left side of the screen.",
    actionId: "slides.previous",
  },
  {
    id: "swipe-right",
    name: "Swipe right",
    description: "Move your hand quickly toward the right side of the screen.",
    actionId: "slides.next",
  },
  {
    id: "pinch",
    name: "Pinch",
    description: "Bring your thumb and index finger together, then move them apart or back together.",
    actionId: "volume.set",
  },
  {
    id: "open-palm",
    name: "Open palm",
    description: "Hold your hand open with the fingers spread.",
    actionId: "music.playPause",
  },
  {
    id: "fist",
    name: "Fist",
    description: "Close your hand into a fist and hold it briefly.",
    actionId: "music.previous",
  },
  {
    id: "point",
    name: "Point",
    description: "Extend your index finger and curl the other fingers.",
    actionId: "music.next",
  },
];

export function gestureName(id: string): string {
  return GESTURE_CATALOG.find((entry) => entry.id === id)?.name ?? id;
}
