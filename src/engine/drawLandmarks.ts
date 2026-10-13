import type { Landmark } from "@/types/index.ts";

const HAND_CONNECTIONS: readonly (readonly [number, number])[] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
];

export function drawLandmarks(
  canvas: HTMLCanvasElement,
  landmarks: readonly Landmark[] | null,
  video: HTMLVideoElement,
): void {
  const context = canvas.getContext("2d");
  if (!context) return;

  const width = video.videoWidth;
  const height = video.videoHeight;
  if (width === 0 || height === 0) return;

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  context.clearRect(0, 0, width, height);
  if (!landmarks) return;

  context.lineWidth = Math.max(2, width / 280);
  context.lineCap = "round";
  context.strokeStyle = "rgba(232, 161, 90, 0.95)";
  context.fillStyle = "rgba(243, 239, 230, 0.95)";

  for (const [start, end] of HAND_CONNECTIONS) {
    const a = landmarks[start];
    const b = landmarks[end];
    if (!a || !b) continue;
    context.beginPath();
    context.moveTo(a.x * width, a.y * height);
    context.lineTo(b.x * width, b.y * height);
    context.stroke();
  }

  const radius = Math.max(3.5, width / 180);
  for (const point of landmarks) {
    context.beginPath();
    context.arc(point.x * width, point.y * height, radius, 0, Math.PI * 2);
    context.fill();
  }
}
