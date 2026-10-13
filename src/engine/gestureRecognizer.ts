import { clamp } from "@/lib/number.ts";
import type { GestureEvent, HandFrame } from "@/types/index.ts";
import { createDetectors } from "./detectors/index.ts";
import { measurePinch } from "./detectors/pinch.ts";
import { classifyPose } from "./detectors/poses.ts";
import type { GestureDetector } from "./detectors/types.ts";

const HISTORY_MS = 700;
const GAP_TOLERANCE_MS = 180;

export type RecognizerSnapshot = {
  handDetected: boolean;
  pose: "open-palm" | "fist" | "point" | null;
  pinch: number | null;
};

export type RecognizeOptions = {
  sensitivity: number;
  mirrored: boolean;
  now: number;
};

export class GestureRecognizer {
  private history: HandFrame[] = [];
  private gapStartedAt: number | null = null;
  private readonly detectors: GestureDetector[];

  constructor(detectors: GestureDetector[]) {
    this.detectors = detectors;
  }

  reset(): void {
    this.history = [];
    this.gapStartedAt = null;
    for (const detector of this.detectors) detector.reset();
  }

  push(frame: HandFrame | null, options: RecognizeOptions): GestureEvent[] {
    if (!frame || frame.landmarks.length < 21) {
      if (this.gapStartedAt === null) this.gapStartedAt = options.now;
      if (options.now - this.gapStartedAt < GAP_TOLERANCE_MS) return [];
      this.reset();
      return [];
    }

    this.gapStartedAt = null;
    this.history.push(frame);
    const oldest = frame.timestamp - HISTORY_MS;
    this.history = this.history.filter((item) => item.timestamp >= oldest).slice(-36);

    return this.detectors.flatMap((detector) =>
      detector.detect({
        history: this.history,
        latest: frame,
        sensitivity: clamp(options.sensitivity, 0, 1),
        mirrored: options.mirrored,
        now: frame.timestamp,
      }),
    );
  }

  getSnapshot(): RecognizerSnapshot {
    const latest = this.history[this.history.length - 1];
    if (!latest) return { handDetected: false, pose: null, pinch: null };
    return {
      handDetected: true,
      pose: classifyPose(latest.landmarks),
      pinch: measurePinch(latest.landmarks),
    };
  }
}

export function createGestureRecognizer(): GestureRecognizer {
  return new GestureRecognizer(createDetectors());
}
