import type { GestureEvent } from "@/types/index.ts";
import { thumbIndexDistance } from "@/engine/geometry.ts";
import { clamp, lerp } from "@/lib/number.ts";
import { PINCH_CLOSED, PINCH_OPEN } from "./constants.ts";
import { isFist } from "./poses.ts";
import type { DetectorContext, GestureDetector } from "./types.ts";

export function measurePinch(landmarks: Parameters<typeof thumbIndexDistance>[0]): number | null {
  if (isFist(landmarks)) return null;
  const span = thumbIndexDistance(landmarks);
  if (span === null || span > PINCH_OPEN) return null;
  return clamp((span - PINCH_CLOSED) / (PINCH_OPEN - PINCH_CLOSED), 0, 1);
}

export function createPinchDetector(): GestureDetector {
  let armed = false;
  let lastValue = 0;
  let cooldownUntil = 0;

  return {
    name: "pinch",
    reset() {
      armed = false;
      lastValue = 0;
      cooldownUntil = 0;
    },
    detect(ctx: DetectorContext): GestureEvent[] {
      const value = measurePinch(ctx.latest.landmarks);
      if (value === null) {
        armed = false;
        return [];
      }
      if (!armed) {
        armed = true;
        lastValue = value;
        return [];
      }

      const minDelta = lerp(0.14, 0.05, ctx.sensitivity);
      if (ctx.now < cooldownUntil || Math.abs(value - lastValue) < minDelta) return [];

      lastValue = value;
      cooldownUntil = ctx.now + 200;
      return [{ id: "pinch", timestamp: ctx.now, confidence: 0.84, value }];
    },
  };
}
