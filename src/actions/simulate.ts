import { toast } from "sonner";
import { useRuntimeStore } from "@/store/runtimeStore.ts";

export function simulateKey(key: string, code: string): void {
  const init: KeyboardEventInit = { key, code, bubbles: true, cancelable: true };
  document.dispatchEvent(new KeyboardEvent("keydown", init));
  document.dispatchEvent(new KeyboardEvent("keyup", init));
}

/**
 * Browser stand-in for a system action.
 * TODO: Replace this simulation with a WebSocket message to a local companion
 * agent that performs real OS-level control (media keys, system volume, slides).
 */
export function reportSimulatedAction(label: string): void {
  useRuntimeStore.getState().recordAction(label);
  toast(label, { description: "Simulated on this page" });
}
