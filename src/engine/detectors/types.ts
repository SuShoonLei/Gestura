import type { GestureEvent, HandFrame } from "@/types/index.ts";

export type DetectorContext = {
  history: readonly HandFrame[];
  latest: HandFrame;
  /** 0 is least sensitive, 1 is most sensitive. */
  sensitivity: number;
  mirrored: boolean;
  now: number;
};

export type GestureDetector = {
  name: string;
  reset: () => void;
  detect: (ctx: DetectorContext) => GestureEvent[];
};
