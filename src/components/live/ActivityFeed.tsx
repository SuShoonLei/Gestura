import { Card } from "@/components/ui/card.tsx";
import { useRuntimeStore } from "@/store/runtimeStore.ts";

function formatTime(at: number): string {
  return new Date(at).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function ActivityFeed() {
  const activity = useRuntimeStore((state) => state.activity);

  return (
    <Card className="p-4">
      <h2 className="text-sm font-medium text-foreground">Activity</h2>
      {activity.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No gestures yet. Start the camera and hold one hand in view.
        </p>
      ) : (
        <ol aria-label="Recent gestures and actions" className="mt-4 max-h-80 space-y-3 overflow-y-auto">
          {activity.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
              <span className="text-foreground">
                <span className="mr-2 text-xs tracking-wide text-muted-foreground uppercase">
                  {item.tone === "action" ? "Action" : "Gesture"}
                </span>
                {item.message}
              </span>
              <time dateTime={new Date(item.at).toISOString()} className="shrink-0 text-xs text-muted-foreground">
                {formatTime(item.at)}
              </time>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
