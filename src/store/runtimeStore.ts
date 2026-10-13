import { create } from "zustand";
import type { CameraErrorCode } from "@/lib/cameraError.ts";

export type CameraPhase = "off" | "starting" | "on" | "error";
export type ModelStatus = "idle" | "loading" | "ready" | "error";
export type ActivityTone = "gesture" | "action";

export type ActivityItem = {
  id: string;
  at: number;
  message: string;
  tone: ActivityTone;
};

type RuntimeState = {
  camera: CameraPhase;
  cameraError: CameraErrorCode | null;
  modelStatus: ModelStatus;
  modelError: string | null;
  handDetected: boolean;
  currentGesture: string | null;
  lastAction: string | null;
  activity: ActivityItem[];
  setCamera: (camera: CameraPhase, cameraError: CameraErrorCode | null) => void;
  setModel: (status: ModelStatus, modelError?: string | null) => void;
  setTracking: (handDetected: boolean, currentGesture: string | null) => void;
  pushActivity: (message: string, tone: ActivityTone) => void;
  recordAction: (label: string) => void;
};

const ACTIVITY_LIMIT = 30;
let activitySeq = 0;

function nextActivity(message: string, tone: ActivityTone): ActivityItem {
  activitySeq += 1;
  return {
    id: `${Date.now().toString(36)}-${activitySeq.toString(36)}`,
    at: Date.now(),
    message,
    tone,
  };
}

export const useRuntimeStore = create<RuntimeState>((set) => ({
  camera: "off",
  cameraError: null,
  modelStatus: "idle",
  modelError: null,
  handDetected: false,
  currentGesture: null,
  lastAction: null,
  activity: [],
  setCamera: (camera, cameraError) => set({ camera, cameraError }),
  setModel: (modelStatus, modelError = null) => set({ modelStatus, modelError }),
  setTracking: (handDetected, currentGesture) =>
    set((state) => {
      if (state.handDetected === handDetected && state.currentGesture === currentGesture) return state;
      return { handDetected, currentGesture };
    }),
  pushActivity: (message, tone) =>
    set((state) => ({
      activity: [nextActivity(message, tone), ...state.activity].slice(0, ACTIVITY_LIMIT),
    })),
  recordAction: (label) =>
    set((state) => ({
      lastAction: label,
      activity: [nextActivity(label, "action"), ...state.activity].slice(0, ACTIVITY_LIMIT),
    })),
}));
