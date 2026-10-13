import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clamp } from "@/lib/number.ts";

export type ThemeName = "light" | "dark";

type SettingsState = {
  sensitivity: number;
  cameraDeviceId: string;
  mirrorVideo: boolean;
  reduceMotion: boolean;
  theme: ThemeName;
  setSensitivity: (value: number) => void;
  setCameraDeviceId: (id: string) => void;
  setMirrorVideo: (value: boolean) => void;
  setReduceMotion: (value: boolean) => void;
  setTheme: (theme: ThemeName) => void;
};

const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      sensitivity: 55,
      cameraDeviceId: "",
      mirrorVideo: true,
      reduceMotion: prefersReducedMotion,
      theme: "dark",
      setSensitivity: (sensitivity) => set({ sensitivity: clamp(sensitivity, 0, 100) }),
      setCameraDeviceId: (cameraDeviceId) => set({ cameraDeviceId }),
      setMirrorVideo: (mirrorVideo) => set({ mirrorVideo }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "gestura-settings",
      partialize: (state) => ({
        sensitivity: state.sensitivity,
        cameraDeviceId: state.cameraDeviceId,
        mirrorVideo: state.mirrorVideo,
        reduceMotion: state.reduceMotion,
        theme: state.theme,
      }),
    },
  ),
);
