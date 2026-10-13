import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import type { HandFrame } from "@/types/index.ts";

const HAND_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

type WasmFileset = Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>;

export class HandTracker {
  private landmarker: HandLandmarker | null = null;
  private fileset: WasmFileset | null = null;
  private initPromise: Promise<void> | null = null;
  private lastTimestamp = -1;
  private delegate: "GPU" | "CPU" = "GPU";
  private switchingDelegate = false;

  isReady(): boolean {
    return this.landmarker !== null;
  }

  init(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = this.load().catch((error: unknown) => {
        this.initPromise = null;
        throw error;
      });
    }
    return this.initPromise;
  }

  detect(video: HTMLVideoElement, now: number): HandFrame | null {
    if (!this.landmarker || video.readyState < 2 || video.videoWidth === 0) return null;

    const timestamp = now <= this.lastTimestamp ? this.lastTimestamp + 1 : now;
    this.lastTimestamp = timestamp;

    try {
      const result = this.landmarker.detectForVideo(video, timestamp);
      const landmarks = result.landmarks[0];
      if (!landmarks || landmarks.length < 21) return null;
      return {
        timestamp,
        landmarks: landmarks.map((point) => ({ x: point.x, y: point.y, z: point.z })),
      };
    } catch {
      if (this.delegate === "GPU" && !this.switchingDelegate) {
        this.switchingDelegate = true;
        void this.createLandmarker("CPU").finally(() => {
          this.switchingDelegate = false;
        });
      }
      return null;
    }
  }

  private async load(): Promise<void> {
    this.fileset = await FilesetResolver.forVisionTasks("/mediapipe");
    try {
      await this.createLandmarker("GPU");
    } catch {
      await this.createLandmarker("CPU");
    }
  }

  private async createLandmarker(delegate: "GPU" | "CPU"): Promise<void> {
    if (!this.fileset) throw new Error("Hand tracking runtime is not loaded.");
    this.landmarker?.close();
    this.delegate = delegate;
    this.landmarker = await HandLandmarker.createFromOptions(this.fileset, {
      baseOptions: {
        modelAssetPath: HAND_MODEL_URL,
        delegate,
      },
      runningMode: "VIDEO",
      numHands: 1,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
  }
}

let sharedTracker: HandTracker | null = null;

export function getHandTracker(): HandTracker {
  sharedTracker ??= new HandTracker();
  return sharedTracker;
}
