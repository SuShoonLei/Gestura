import { PageHeader } from "@/components/layout/PageHeader.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { useVideoDevices } from "@/hooks/useCamera.ts";
import { usePageTitle } from "@/hooks/usePageTitle.ts";
import { cn } from "@/lib/utils.ts";
import { useSettingsStore, type ThemeName } from "@/store/settingsStore.ts";

const THEMES: readonly { id: ThemeName; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

export function SettingsPage() {
  usePageTitle("Settings");
  const devices = useVideoDevices();
  const sensitivity = useSettingsStore((state) => state.sensitivity);
  const cameraDeviceId = useSettingsStore((state) => state.cameraDeviceId);
  const mirrorVideo = useSettingsStore((state) => state.mirrorVideo);
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);
  const theme = useSettingsStore((state) => state.theme);
  const setSensitivity = useSettingsStore((state) => state.setSensitivity);
  const setCameraDeviceId = useSettingsStore((state) => state.setCameraDeviceId);
  const setMirrorVideo = useSettingsStore((state) => state.setMirrorVideo);
  const setReduceMotion = useSettingsStore((state) => state.setReduceMotion);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const knownDevice = devices.some((device) => device.deviceId === cameraDeviceId);

  return (
    <>
      <PageHeader
        title="Settings"
        description="These choices are saved in this browser and apply the next time you open Gestura."
      />
      <div className="grid max-w-2xl gap-4">
        <Card className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-4">
            <Label id="sensitivity-label" htmlFor="sensitivity">
              Sensitivity
            </Label>
            <span className="text-sm font-medium text-foreground">{sensitivity}</span>
          </div>
          <Slider
            id="sensitivity"
            aria-labelledby="sensitivity-label"
            min={0}
            max={100}
            step={1}
            value={[sensitivity]}
            onValueChange={(value) => setSensitivity(value[0] ?? sensitivity)}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
          <p className="text-sm text-muted-foreground">Higher values respond to smaller, slower movements.</p>
        </Card>

        <Card className="space-y-3 p-4">
          <Label htmlFor="camera">Camera</Label>
          <select
            id="camera"
            value={cameraDeviceId}
            onChange={(event) => setCameraDeviceId(event.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
          >
            <option value="">Default camera</option>
            {cameraDeviceId && !knownDevice ? <option value={cameraDeviceId}>Saved camera</option> : null}
            {devices.map((device, index) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${index + 1}`}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground">
            Camera names appear after you allow access on the Live Control page.
          </p>
        </Card>

        <Card className="flex items-start justify-between gap-4 p-4">
          <div>
            <Label htmlFor="mirror-video">Mirror video</Label>
            <p id="mirror-help" className="mt-1 text-sm text-muted-foreground">
              Flips the preview so left and right match what you see. Swipes follow that direction.
            </p>
          </div>
          <Switch
            id="mirror-video"
            checked={mirrorVideo}
            onCheckedChange={setMirrorVideo}
            aria-describedby="mirror-help"
          />
        </Card>

        <Card className="flex items-start justify-between gap-4 p-4">
          <div>
            <Label htmlFor="reduce-motion">Reduce motion</Label>
            <p id="motion-help" className="mt-1 text-sm text-muted-foreground">
              Turns off interface animation.
            </p>
          </div>
          <Switch
            id="reduce-motion"
            checked={reduceMotion}
            onCheckedChange={setReduceMotion}
            aria-describedby="motion-help"
          />
        </Card>

        <Card className="space-y-3 p-4">
          <p id="theme-label" className="text-sm font-medium text-foreground">
            Theme
          </p>
          <div role="radiogroup" aria-labelledby="theme-label" className="grid grid-cols-2 gap-2">
            {THEMES.map((option) => {
              const selected = theme === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setTheme(option.id)}
                  className={cn(
                    "h-10 cursor-pointer rounded-lg border text-sm font-medium text-foreground",
                    selected ? "border-primary bg-accent" : "border-border bg-background hover:bg-muted",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
