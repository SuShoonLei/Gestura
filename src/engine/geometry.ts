import type { Landmark } from "@/types/index.ts";

export function distance(a: Landmark, b: Landmark): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Angle at `b`, in radians. A straight finger is near PI. */
export function jointAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const abx = a.x - b.x;
  const aby = a.y - b.y;
  const cbx = c.x - b.x;
  const cby = c.y - b.y;
  const magnitude = Math.hypot(abx, aby) * Math.hypot(cbx, cby);
  if (magnitude === 0) return 0;
  const cosine = Math.min(1, Math.max(-1, (abx * cbx + aby * cby) / magnitude));
  return Math.acos(cosine);
}

export function thumbIndexDistance(landmarks: readonly Landmark[]): number | null {
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  if (!thumbTip || !indexTip) return null;
  return distance(thumbTip, indexTip);
}
