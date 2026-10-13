export const BUILTIN_GESTURE_IDS = [
  "swipe-left",
  "swipe-right",
  "pinch",
  "open-palm",
  "fist",
  "point",
] as const;

export type BuiltinGestureId = (typeof BUILTIN_GESTURE_IDS)[number];

/** Built-in ids, plus future user-defined ids such as `custom.wave`. */
export type GestureId = BuiltinGestureId | `custom.${string}`;

export type GestureEvent = {
  id: GestureId;
  timestamp: number;
  confidence: number;
  /** Continuous gestures (pinch) report a 0–1 value. 0 is closed, 1 is open. */
  value?: number;
};
