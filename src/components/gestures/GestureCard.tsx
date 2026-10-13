import type { GestureCatalogEntry } from "@/data/catalog.ts";
import { getAction } from "@/actions/index.ts";
import { useGestureStore } from "@/store/gestureStore.ts";
import { Card } from "@/components/ui/card.tsx";
import { Switch } from "@/components/ui/switch.tsx";

export function GestureCard({ gesture }: { gesture: GestureCatalogEntry }) {
  const enabled = useGestureStore((state) => state.enabledById[gesture.id] ?? true);
  const setEnabled = useGestureStore((state) => state.setEnabled);
  const actionLabel = getAction(gesture.actionId)?.label ?? gesture.actionId;

  return (
    <Card className="flex h-full flex-col p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id={`${gesture.id}-name`} className="text-base font-medium text-foreground">
            {gesture.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{gesture.description}</p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={(checked) => setEnabled(gesture.id, checked)}
          aria-labelledby={`${gesture.id}-name`}
        />
      </div>
      <p className="mt-4 text-sm text-foreground">
        <span className="text-muted-foreground">Action: </span>
        {actionLabel}
      </p>
    </Card>
  );
}
