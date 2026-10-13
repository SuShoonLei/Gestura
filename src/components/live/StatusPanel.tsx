import { Card } from "@/components/ui/card.tsx";
import { useRuntimeStore } from "@/store/runtimeStore.ts";

const CAMERA_LABEL = {
  off: "Off",
  starting: "Starting",
  on: "On",
  error: "Unavailable",
} as const;

export function StatusPanel() {
  const camera = useRuntimeStore((state) => state.camera);
  const handDetected = useRuntimeStore((state) => state.handDetected);
  const currentGesture = useRuntimeStore((state) => state.currentGesture);
  const lastAction = useRuntimeStore((state) => state.lastAction);
  const modelStatus = useRuntimeStore((state) => state.modelStatus);
  const modelError = useRuntimeStore((state) => state.modelError);

  return (
    <Card className="p-4">
      <h2 className="text-sm font-medium text-foreground">Status</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Camera</dt>
          <dd className="font-medium text-foreground">{CAMERA_LABEL[camera]}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Hand</dt>
          <dd className="font-medium text-foreground">{handDetected ? "Detected" : "Not detected"}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Current gesture</dt>
          <dd className="text-right font-medium text-foreground">{currentGesture ?? "None"}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Last action</dt>
          <dd className="text-right font-medium text-foreground" aria-live="polite">
            {lastAction ?? "None yet"}
          </dd>
        </div>
      </dl>
      {modelStatus === "loading" ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading the hand model…</p>
      ) : null}
      {modelStatus === "error" && modelError ? (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {modelError}
        </p>
      ) : null}
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        Actions are simulated in this phase: a toast, a line in the activity feed, and a keyboard event on this page.
      </p>
    </Card>
  );
}
