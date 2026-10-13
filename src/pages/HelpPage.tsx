import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader.tsx";
import { usePageTitle } from "@/hooks/usePageTitle.ts";

export function HelpPage() {
  usePageTitle("Help");

  return (
    <>
      <PageHeader
        title="Help"
        description="How to get a reliable read from the camera, and what to do when it will not start."
      />
      <div className="max-w-2xl space-y-8 text-sm leading-6 text-foreground">
        <section aria-labelledby="how-to-use">
          <h2 id="how-to-use" className="text-lg font-medium">
            How to use Gestura
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
            <li>Open Live Control and press Start.</li>
            <li>Allow the camera when the browser asks.</li>
            <li>Hold one hand in frame, about an arm's length away, palm facing the camera.</li>
            <li>
              Use the <Link to="/gestures" className="text-foreground underline">gesture library</Link> to turn
              individual gestures on or off.
            </li>
            <li>Pause between swipes so each one registers once.</li>
          </ol>
          <p className="mt-3 text-muted-foreground">
            Swipe left and right change slides. Open palm plays or pauses, a fist goes to the previous track, and
            pointing skips to the next. Pinch your thumb and index finger to change the volume. In this phase those
            actions are simulated on the page.
          </p>
        </section>

        <section aria-labelledby="camera-help">
          <h2 id="camera-help" className="text-lg font-medium">
            Camera permission
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>If the browser asks, choose Allow.</li>
            <li>If you blocked it, open the site settings from the address bar, set Camera to Allow, and press Start again.</li>
            <li>On macOS, check System Settings, Privacy & Security, Camera, and enable your browser.</li>
            <li>Cameras only work on localhost or HTTPS.</li>
            <li>If another app is using the camera, quit that app and try again.</li>
            <li>
              If you have more than one camera, pick it in <Link to="/settings" className="text-foreground underline">Settings</Link>.
            </li>
          </ul>
        </section>

        <section aria-labelledby="lighting-help">
          <h2 id="lighting-help" className="text-lg font-medium">
            Lighting and position
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Face a lamp or window so your hand is brighter than the background.</li>
            <li>Avoid a strong light behind you.</li>
            <li>Keep the whole hand inside the frame.</li>
            <li>Spread your fingers for an open palm, and curl all of them for a fist.</li>
            <li>For volume, touch thumb to index finger, then ease them apart.</li>
          </ul>
        </section>
      </div>
    </>
  );
}
