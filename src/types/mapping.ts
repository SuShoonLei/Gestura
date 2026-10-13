import type { ActionId } from "./action.ts";
import type { GestureId } from "./gesture.ts";

export type GestureMapping = {
  gestureId: GestureId;
  actionId: ActionId;
  enabled: boolean;
};
