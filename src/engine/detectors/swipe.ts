import type { GestureEvent, Landmark } from "@/types/index.ts";
import { clamp, lerp } from "@/lib/number.ts";
import type { DetectorContext, GestureDetector } from "./types.ts";

const WINDOW_MS = 240;

function palmPoint(landmarks: readonly Landmark[]): { x: number; y: number } | null {
  const wrist = landmarks[0];
  const middleKnuckle = landmarks[9];
  if (!wrist || !middleKnuckle) return null;
  return {
    x: (wrist.x + middleKnuckle.x) / 2,
    y: (wrist.y + middleKnuckle.y) / 2,
  };
}

/** Map raw camera x into the direction the user sees when the preview is mirrored. */
function screenX(x: number, mirrored: boolean): number {
  return mirrored ? 1 - x : x;
}

export function createSwipeDetector(): GestureDetector {
  let cooldownUntil = 0;

  return {
    name: "swipe",
    reset() {
      cooldownUntil = 0;
    },
    detect(ctx: DetectorContext): GestureEvent[] {
      if (ctx.now < cooldownUntil) return [];

      const windowed = ctx.history.filter((frame) => ctx.now - frame.timestamp <= WINDOW_MS);
      if (windowed.length < 4) return [];

      const first = windowed[0];
      const last = windowed[windowed.length - 1];
      if (!first || !last) return [];

      const dt = (last.timestamp - first.timestamp) / 1000;
      if (dt < 0.08) return [];

      const start = palmPoint(first.landmarks);
      const end = palmPoint(last.landmarks);
      if (!start || !end) return [];

      const dx = screenX(end.x, ctx.mirrored) - screenX(start.x, ctx.mirrored);
      const dy = end.y - start.y;
      if (Math.abs(dx) < Math.abs(dy) * 1.15) return [];

      const minDistance = lerp(0.15, 0.055, ctx.sensitivity);
      const minSpeed = lerp(1.35, 0.4, ctx.sensitivity);
      const speed = Math.abs(dx) / dt;
      if (Math.abs(dx) < minDistance || speed < minSpeed) return [];

      cooldownUntil = ctx.now + 700;
      return [
        {
          id: dx > 0 ? "swipe-right" : "swipe-left",
          timestamp: ctx.now,
          confidence: clamp(speed / (minSpeed * 2), 0.55, 0.99),
        },
      ];
    },
  };
}
