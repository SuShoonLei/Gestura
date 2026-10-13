import type { Action, ActionPayload } from "@/types/index.ts";

const actions = new Map<string, Action>();

export function registerAction(action: Action): void {
  actions.set(action.id, action);
}

export function getAction(id: string): Action | undefined {
  return actions.get(id);
}

export function executeAction(id: string, payload?: ActionPayload): void {
  actions.get(id)?.execute(payload);
}
