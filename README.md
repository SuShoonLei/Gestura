# Gestura

Gestura tracks one hand in the webcam and turns gestures into actions. Video is processed in the browser and is not uploaded.

This phase simulates those actions on the page. A later local companion can take over real system control.

## Setup

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build
npm run preview
```

The hand-landmarker model is downloaded from the MediaPipe model host the first time you open Live Control. The WebAssembly runtime is served from this app. Frames stay on the device.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Landing |
| `/app` | Live camera, landmark overlay, status, activity feed |
| `/gestures` | Built-in gestures, mapped actions, enable switches |
| `/custom` | Placeholder for user-defined gestures |
| `/settings` | Sensitivity, camera, mirror, motion, theme |
| `/help` | Usage, camera permission, lighting |

Settings and gesture on/off switches are stored in `localStorage`.

## Architecture

```text
webcam
  → src/engine/handTracker.ts        landmarks per frame
  → src/engine/gestureRecognizer.ts  gesture events
  → src/engine/actionMapper.ts       event + mapping → action id
  → src/actions/*.ts                 execute(payload)
  → toast, activity feed, keyboard event
```

- `src/types/` holds `Landmark`, `GestureEvent`, `Action`, and `GestureMapping`.
- `src/engine/detectors/` holds one detector per gesture family. The recognizer only runs that list.
- `src/data/catalog.ts` is the built-in gesture list: name, description, and default action.
- `src/store/` is Zustand. Settings and enabled gestures persist. Runtime status does not.
- `src/hooks/useCamera.ts`, `useHandTracking.ts`, and `useGestureEngine.ts` connect the page to those layers.
- `src/actions/slides.ts`, `music.ts`, and `volume.ts` each register actions with `execute(payload)`.

Simulated actions are centralized in `src/actions/simulate.ts`. That file is where a future WebSocket companion agent should perform real OS-level control.

### Default mapping

| Gesture | Action |
| --- | --- |
| Swipe left | Previous slide (`ArrowLeft`) |
| Swipe right | Next slide (`ArrowRight`) |
| Pinch | Volume (`ArrowUp` / `ArrowDown`) |
| Open palm | Play / pause |
| Fist | Previous track |
| Point | Next track |

Swipe direction follows the preview. When mirror video is on, a swipe toward the right side of the screen is swipe right.

## How to add a new gesture

Adding a gesture is a new detector file plus a catalog row. `GestureRecognizer` and `actionMapper` stay as they are.

1. Add the id to `BuiltinGestureId` in `src/types/gesture.ts`. Custom gestures can later use ids like `` `custom.${string}` `` without a new union member.
2. Add a row to `GESTURE_CATALOG` in `src/data/catalog.ts` with the name, description, and `actionId`. The library page and the enable switch read this list. Enabled state is stored separately, so new rows default to on.
3. Add `src/engine/detectors/yourGesture.ts` that exports `createYourGestureDetector()` and returns `GestureEvent`s. Register it in `createDetectors()` in `src/engine/detectors/index.ts`.
4. If it needs a new action, add an `execute(payload)` handler in the matching file under `src/actions/` (or a new category file imported from `src/actions/index.ts`). Point the catalog row at that action id.

A user-defined gesture can reuse this path later: store a `custom.*` id in the mapping table and emit that id from a detector. The mapper already routes any enabled `gestureId` to its `actionId`.
