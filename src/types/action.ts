export const BUILTIN_ACTION_IDS = [
  "slides.previous",
  "slides.next",
  "music.playPause",
  "music.next",
  "music.previous",
  "volume.set",
] as const;

export type BuiltinActionId = (typeof BUILTIN_ACTION_IDS)[number];

/** Built-in ids, plus future user-defined ids such as `custom.focus`. */
export type ActionId = BuiltinActionId | `custom.${string}`;

export type ActionCategory = "slides" | "music" | "volume";

export type ActionPayload = {
  /** Normalized 0–1 value, used by continuous actions such as volume. */
  value?: number;
};

export type Action = {
  id: ActionId;
  label: string;
  category: ActionCategory;
  execute: (payload?: ActionPayload) => void;
};
