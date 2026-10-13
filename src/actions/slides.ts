import { registerAction } from "./registry.ts";
import { reportSimulatedAction, simulateKey } from "./simulate.ts";

registerAction({
  id: "slides.previous",
  label: "Previous slide",
  category: "slides",
  execute() {
    simulateKey("ArrowLeft", "ArrowLeft");
    reportSimulatedAction("Previous slide");
  },
});

registerAction({
  id: "slides.next",
  label: "Next slide",
  category: "slides",
  execute() {
    simulateKey("ArrowRight", "ArrowRight");
    reportSimulatedAction("Next slide");
  },
});
