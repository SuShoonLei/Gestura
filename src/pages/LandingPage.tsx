import { Lock, Music, Presentation, Sparkles, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { usePageTitle } from "@/hooks/usePageTitle.ts";

const FEATURES = [
  {
    title: "Slide control",
    description: "Swipe left or right to move between slides.",
    icon: Presentation,
  },
  {
    title: "Music control",
    description: "Open palm plays or pauses. A fist goes back. Pointing skips ahead.",
    icon: Music,
  },
  {
    title: "Volume",
    description: "Pinch your thumb and index finger, then move them apart or together.",
    icon: Volume2,
  },
  {
    title: "Custom gestures",
    description: "Map a gesture of your own to any action. The builder arrives in the next phase.",
    icon: Sparkles,
  },
] as const;

export function LandingPage() {
  usePageTitle("Gestura");

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <header className="mx-auto flex max-w-6xl items-center px-6 py-5">
        <p className="text-lg font-semibold tracking-tight">Gestura</p>
      </header>
      <main id="main">
        <section className="mx-auto max-w-6xl px-6 pt-8 pb-16 sm:pt-16">
          <div className="rise max-w-3xl">
            <p className="text-sm font-medium tracking-wide text-primary uppercase">On-device hand tracking</p>
            <h1 className="mt-3 font-display text-5xl leading-[1.05] font-semibold text-balance text-foreground sm:text-6xl">
              Your hands are the controller.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Gestura reads one hand through the webcam and turns a small set of gestures into slides, music, and
              volume.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4">
              <Button asChild size="lg">
                <Link to="/app">Get Started</Link>
              </Button>
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <span>All processing happens on your device. Your video never leaves this browser.</span>
              </p>
            </div>
          </div>
        </section>
        <section aria-labelledby="features-heading" className="mx-auto max-w-6xl px-6 pb-20">
          <h2 id="features-heading" className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            What you can do
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.title}>
                  <Card className="h-full p-5">
                    <Icon aria-hidden="true" className="size-5 text-primary" />
                    <h3 className="mt-4 text-lg font-medium text-foreground">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
