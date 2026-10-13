import { clamp } from "@/lib/number.ts";
import { registerAction } from "./registry.ts";
import { reportSimulatedAction, simulateKey } from "./simulate.ts";

let level = 50;

registerAction({
  id: "volume.set",
  label: "Set volume",
  category: "volume",
  execute(payload) {
    const next = clamp(Math.round((payload?.value ?? level / 100) * 100), 0, 100);
    if (next === level) return;
    if (next > level) simulateKey("ArrowUp", "ArrowUp");
    else simulateKey("ArrowDown", "ArrowDown");
    level = next;
    reportSimulatedAction(`Volume ${level}%`);
  },
});
