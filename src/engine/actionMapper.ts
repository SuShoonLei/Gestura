import type { ActionPayload, GestureEvent, GestureMapping } from "@/types/index.ts";

export type MappedAction = {
  actionId: GestureMapping["actionId"];
  payload?: ActionPayload;
};

export function mapGestureToAction(
  event: GestureEvent,
  mappings: readonly GestureMapping[],
): MappedAction | null {
  const mapping = mappings.find((item) => item.gestureId === event.id);
  if (!mapping?.enabled) return null;

  if (event.value === undefined) return { actionId: mapping.actionId };
  return { actionId: mapping.actionId, payload: { value: event.value } };
}
