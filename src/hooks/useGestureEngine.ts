import { useCallback, useEffect, useRef } from "react";
import { mapGestureToAction } from "@/engine/actionMapper.ts";
import { createGestureRecognizer, type RecognizerSnapshot } from "@/engine/gestureRecognizer.ts";
import { executeAction } from "@/actions/index.ts";
import { gestureName } from "@/data/catalog.ts";
import type { HandFrame } from "@/types/index.ts";
import { resolveMappings, useGestureStore } from "@/store/gestureStore.ts";
import { useRuntimeStore } from "@/store/runtimeStore.ts";
import { useSettingsStore } from "@/store/settingsStore.ts";

function liveLabel(snapshot: RecognizerSnapshot): string | null {
  if (!snapshot.handDetected) return null;
  if (snapshot.pose) return gestureName(snapshot.pose);
  if (snapshot.pinch !== null) return `Pinch ${Math.round(snapshot.pinch * 100)}%`;
  return null;
}

export function useGestureEngine(): (frame: HandFrame | null) => void {
  const recognizerRef = useRef(createGestureRecognizer());
  const recentRef = useRef<{ label: string; until: number } | null>(null);

  useEffect(() => {
    return useRuntimeStore.subscribe((state, previous) => {
      if (previous.camera === "on" && state.camera !== "on") {
        recognizerRef.current.reset();
        recentRef.current = null;
      }
    });
  }, []);

  return useCallback((frame: HandFrame | null) => {
    const settings = useSettingsStore.getState();
    const now = frame?.timestamp ?? performance.now();
    const events = recognizerRef.current.push(frame, {
      sensitivity: settings.sensitivity / 100,
      mirrored: settings.mirrorVideo,
      now,
    });

    const mappings = resolveMappings(useGestureStore.getState().enabledById);
    for (const event of events) {
      const name = gestureName(event.id);
      const shown = event.value === undefined ? name : `${name} ${Math.round(event.value * 100)}%`;
      recentRef.current = { label: shown, until: performance.now() + 1200 };

      const mapping = mappings.find((item) => item.gestureId === event.id);
      if (!mapping?.enabled) {
        useRuntimeStore.getState().pushActivity(`${name} recognized, turned off`, "gesture");
        continue;
      }

      useRuntimeStore.getState().pushActivity(`${name} recognized`, "gesture");
      const mapped = mapGestureToAction(event, mappings);
      if (mapped) executeAction(mapped.actionId, mapped.payload);
    }

    const snapshot = recognizerRef.current.getSnapshot();
    let label = liveLabel(snapshot);
    if (recentRef.current && performance.now() < recentRef.current.until) {
      label = recentRef.current.label;
    }
    useRuntimeStore.getState().setTracking(snapshot.handDetected, label);
  }, []);
}
