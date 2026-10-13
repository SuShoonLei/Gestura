import { createPinchDetector } from "./pinch.ts";
import { createPoseDetector } from "./poses.ts";
import { createSwipeDetector } from "./swipe.ts";
import type { GestureDetector } from "./types.ts";

/** Register detectors here. The recognizer does not need to change. */
export function createDetectors(): GestureDetector[] {
  return [createSwipeDetector(), createPinchDetector(), createPoseDetector()];
}
