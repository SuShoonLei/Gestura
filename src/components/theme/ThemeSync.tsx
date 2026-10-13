import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/settingsStore.ts";

export function ThemeSync() {
  const theme = useSettingsStore((state) => state.theme);
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);
  const hydrated = useSettingsStore.persist.hasHydrated();
  const [, setHydrationTick] = useState(0);

  useEffect(() => {
    if (hydrated) return;
    return useSettingsStore.persist.onFinishHydration(() => {
      setHydrationTick((tick) => tick + 1);
    });
  }, [hydrated]);

  useEffect(() => {
    if (!useSettingsStore.persist.hasHydrated()) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);
  }, [hydrated, reduceMotion, theme]);

  return null;
}
