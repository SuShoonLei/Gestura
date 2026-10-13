import { GestureCard } from "@/components/gestures/GestureCard.tsx";
import { PageHeader } from "@/components/layout/PageHeader.tsx";
import { GESTURE_CATALOG } from "@/data/catalog.ts";
import { usePageTitle } from "@/hooks/usePageTitle.ts";

export function GestureLibraryPage() {
  usePageTitle("Gesture library");

  return (
    <>
      <PageHeader
        title="Gesture library"
        description="Built-in gestures and the action each one triggers. Turn any of them off if you do not want it to fire."
      />
      <ul className="grid gap-4 sm:grid-cols-2">
        {GESTURE_CATALOG.map((gesture) => (
          <li key={gesture.id}>
            <GestureCard gesture={gesture} />
          </li>
        ))}
      </ul>
    </>
  );
}
