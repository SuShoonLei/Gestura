import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader.tsx";
import { usePageTitle } from "@/hooks/usePageTitle.ts";

export function CustomGesturesPage() {
  usePageTitle("Custom gestures");

  return (
    <>
      <PageHeader
        title="Custom gestures"
        description="User-defined gestures will be mapped to any action. This phase only reserves the page."
      />
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-20 text-center">
        <Sparkles aria-hidden="true" className="size-6 text-primary" />
        <h2 className="mt-4 text-lg font-medium text-foreground">Coming in the next phase</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          You will record a gesture and choose the action it runs. Nothing here is saved yet.
        </p>
      </div>
    </>
  );
}
