import { useEffect, useRef, type RefObject } from "react";
import { drawLandmarks } from "@/engine/drawLandmarks.ts";
import { getHandTracker } from "@/engine/handTracker.ts";
import type { HandFrame } from "@/types/index.ts";
import { useRuntimeStore } from "@/store/runtimeStore.ts";

type HandTrackingOptions = {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onFrame: (frame: HandFrame | null) => void;
};

export function useHandTracking({ videoRef, canvasRef, onFrame }: HandTrackingOptions): void {
  const onFrameRef = useRef(onFrame);

  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    const tracker = getHandTracker();
    let frameId = 0;
    let cancelled = false;

    if (!tracker.isReady()) {
      useRuntimeStore.getState().setModel("loading");
    }

    void tracker
      .init()
      .then(() => {
        if (cancelled) return;
        useRuntimeStore.getState().setModel("ready");

        const loop = () => {
          frameId = window.requestAnimationFrame(loop);
          if (cancelled || document.hidden) return;

          const video = videoRef.current;
          const canvas = canvasRef.current;
          const cameraOn = useRuntimeStore.getState().camera === "on";
          if (!video || !canvas || !cameraOn) {
            if (canvas) {
              const context = canvas.getContext("2d");
              if (context && canvas.width > 0 && canvas.height > 0) {
                context.clearRect(0, 0, canvas.width, canvas.height);
              }
            }
            return;
          }

          const frame = tracker.detect(video, performance.now());
          if (useRuntimeStore.getState().camera !== "on") return;
          drawLandmarks(canvas, frame?.landmarks ?? null, video);
          onFrameRef.current(frame);
        };

        frameId = window.requestAnimationFrame(loop);
      })
      .catch(() => {
        if (cancelled) return;
        useRuntimeStore.getState().setModel(
          "error",
          "The hand tracking model could not be loaded. Check your connection and reload. Your video stays on this device either way.",
        );
      });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
      onFrameRef.current(null);
    };
  }, [canvasRef, videoRef]);
}
