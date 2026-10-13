import type { GestureEvent, Landmark } from "@/types/index.ts";
import { distance, jointAngle, thumbIndexDistance } from "@/engine/geometry.ts";
import { PINCH_OPEN } from "./constants.ts";
import type { DetectorContext, GestureDetector } from "./types.ts";

const FINGERS = [
  { mcp: 5, pip: 6, dip: 7, tip: 8 },
  { mcp: 9, pip: 10, dip: 11, tip: 12 },
  { mcp: 13, pip: 14, dip: 15, tip: 16 },
  { mcp: 17, pip: 18, dip: 19, tip: 20 },
] as const;

type PoseId = "open-palm" | "fist" | "point";

function fingerMetrics(
  landmarks: readonly Landmark[],
  finger: (typeof FINGERS)[number],
): { ratio: number; angle: number } | null {
  const wrist = landmarks[0];
  const mcp = landmarks[finger.mcp];
  const pip = landmarks[finger.pip];
  const dip = landmarks[finger.dip];
  const tip = landmarks[finger.tip];
  if (!wrist || !mcp || !pip || !dip || !tip) return null;
  const pipDistance = distance(pip, wrist);
  return {
    ratio: distance(tip, wrist) / Math.max(pipDistance, 1e-4),
    angle: jointAngle(mcp, pip, dip),
  };
}

function isExtended(landmarks: readonly Landmark[], finger: (typeof FINGERS)[number]): boolean {
  const metrics = fingerMetrics(landmarks, finger);
  if (!metrics) return false;
  return metrics.ratio > 1.12 && metrics.angle > 1.85;
}

function isCurled(landmarks: readonly Landmark[], finger: (typeof FINGERS)[number]): boolean {
  const metrics = fingerMetrics(landmarks, finger);
  if (!metrics) return false;
  return metrics.ratio < 1.05 && metrics.angle < 2.1;
}

export function isFist(landmarks: readonly Landmark[]): boolean {
  return FINGERS.every((finger) => isCurled(landmarks, finger));
}

export function classifyPose(landmarks: readonly Landmark[]): PoseId | null {
  if (landmarks.length < 21) return null;
  if (isFist(landmarks)) return "fist";

  const pinchDistance = thumbIndexDistance(landmarks);
  if (pinchDistance !== null && pinchDistance <= PINCH_OPEN) return null;

  const [index, middle, ring, pinky] = FINGERS;
  if (!index || !middle || !ring || !pinky) return null;

  const indexExtended = isExtended(landmarks, index);
  const middleExtended = isExtended(landmarks, middle);
  const ringExtended = isExtended(landmarks, ring);
  if (indexExtended && middleExtended && ringExtended && !isCurled(landmarks, pinky)) return "open-palm";

  const othersCurled = isCurled(landmarks, middle) && isCurled(landmarks, ring) && isCurled(landmarks, pinky);
  if (indexExtended && othersCurled) return "point";
  return null;
}

export function createPoseDetector(): GestureDetector {
  let candidate: PoseId | null = null;
  let candidateSince = 0;
  let emitted: PoseId | null = null;
  let cooldownUntil = 0;

  return {
    name: "pose",
    reset() {
      candidate = null;
      candidateSince = 0;
      emitted = null;
      cooldownUntil = 0;
    },
    detect(ctx: DetectorContext): GestureEvent[] {
      const pose = classifyPose(ctx.latest.landmarks);
      if (pose !== candidate) {
        candidate = pose;
        candidateSince = ctx.now;
      }
      if (!pose) {
        emitted = null;
        return [];
      }

      const holdMs = 420 - ctx.sensitivity * 220;
      if (ctx.now - candidateSince < holdMs) return [];
      if (pose === emitted || ctx.now < cooldownUntil) return [];

      emitted = pose;
      cooldownUntil = ctx.now + 750;
      return [{ id: pose, timestamp: ctx.now, confidence: 0.86 }];
    },
  };
}
