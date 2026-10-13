import { useRef } from "react";
import { ActivityFeed } from "@/components/live/ActivityFeed.tsx";
import { CameraStage } from "@/components/live/CameraStage.tsx";
import { StatusPanel } from "@/components/live/StatusPanel.tsx";
import { PageHeader } from "@/components/layout/PageHeader.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useCamera } from "@/hooks/useCamera.ts";
import { useGestureEngine } from "@/hooks/useGestureEngine.ts";
import { useHandTracking } from "@/hooks/useHandTracking.ts";
import { usePageTitle } from "@/hooks/usePageTitle.ts";
import { useRuntimeStore } from "@/store/runtimeStore.ts";

export function LiveControlPage() {
  usePageTitle("Live control");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { start, stop } = useCamera(videoRef);
  const onFrame = useGestureEngine();
  useHandTracking({ videoRef, canvasRef, onFrame });
  const camera = useRuntimeStore((state) => state.camera);
  const running = camera === "on" || camera === "starting";

  return (
    <>
      <PageHeader
        title="Live control"
        description="Point the camera at one hand. Gestures you make show up here and trigger a simulated action."
        action={
          <Button
            type="button"
            aria-pressed={camera === "on"}
            disabled={camera === "starting"}
            onClick={() => {
              if (running) stop();
              else void start();
            }}
          >
            {camera === "starting" ? "Starting…" : camera === "on" ? "Stop" : "Start"}
          </Button>
        }
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <CameraStage videoRef={videoRef} canvasRef={canvasRef} />
        <div className="flex flex-col gap-4">
          <StatusPanel />
          <ActivityFeed />
        </div>
      </div>
    </>
  );
}
