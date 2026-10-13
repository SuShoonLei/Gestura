import { registerAction } from "./registry.ts";
import { reportSimulatedAction, simulateKey } from "./simulate.ts";

registerAction({
  id: "music.playPause",
  label: "Play / pause",
  category: "music",
  execute() {
    simulateKey("MediaPlayPause", "MediaPlayPause");
    reportSimulatedAction("Play / pause");
  },
});

registerAction({
  id: "music.next",
  label: "Next track",
  category: "music",
  execute() {
    simulateKey("MediaTrackNext", "MediaTrackNext");
    reportSimulatedAction("Next track");
  },
});

registerAction({
  id: "music.previous",
  label: "Previous track",
  category: "music",
  execute() {
    simulateKey("MediaTrackPrevious", "MediaTrackPrevious");
    reportSimulatedAction("Previous track");
  },
});
