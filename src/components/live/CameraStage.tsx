import type { RefObject } from "react";
import { CAMERA_ERROR_COPY } from "@/lib/cameraError.ts";
import { cn } from "@/lib/utils.ts";
import { useRuntimeStore } from "@/store/runtimeStore.ts";
import { useSettingsStore } from "@/store/settingsStore.ts";

type CameraStageProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

export function CameraStage({ videoRef, canvasRef }: CameraStageProps) {
  const camera = useRuntimeStore((state) => state.camera);
  const cameraError = useRuntimeStore((state) => state.cameraError);
  const mirrorVideo = useSettingsStore((state) => state.mirrorVideo);
  const errorCopy = cameraError ? CAMERA_ERROR_COPY[cameraError] : null;

  return (
    <figure className="space-y-2">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-black">
        <div className={cn("absolute inset-0", mirrorVideo && "scale-x-[-1]")}>
          <video
            ref={videoRef}
            className="h-full w-full object-contain"
            autoPlay
            muted
            playsInline
            tabIndex={-1}
            aria-hidden="true"
          />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-contain" aria-hidden="true" />
        </div>
        {camera !== "on" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#12161c] px-6 text-center">
            <p className="max-w-sm text-sm text-[#d9d3c7]">
              {camera === "starting" ? "Starting the camera…" : "The camera is off. Press Start when you are ready."}
            </p>
          </div>
        ) : null}
      </div>
      {mirrorVideo ? <figcaption className="text-xs text-muted-foreground">Preview is mirrored.</figcaption> : null}
      {errorCopy ? (
        <div role="alert" className="rounded-xl border border-destructive/40 bg-card px-4 py-3">
          <p className="text-sm font-medium text-foreground">{errorCopy.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{errorCopy.detail}</p>
        </div>
      ) : null}
    </figure>
  );
}
