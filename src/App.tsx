import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/AppShell.tsx";
import { ThemeSync } from "@/components/theme/ThemeSync.tsx";
import { CustomGesturesPage } from "@/pages/CustomGesturesPage.tsx";
import { GestureLibraryPage } from "@/pages/GestureLibraryPage.tsx";
import { HelpPage } from "@/pages/HelpPage.tsx";
import { LandingPage } from "@/pages/LandingPage.tsx";
import { LiveControlPage } from "@/pages/LiveControlPage.tsx";
import { SettingsPage } from "@/pages/SettingsPage.tsx";
import { useSettingsStore } from "@/store/settingsStore.ts";

export default function App() {
  const theme = useSettingsStore((state) => state.theme);

  return (
    <BrowserRouter>
      <ThemeSync />
      <Toaster theme={theme} position="top-center" closeButton visibleToasts={3} duration={2200} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppShell />}>
          <Route path="/app" element={<LiveControlPage />} />
          <Route path="/gestures" element={<GestureLibraryPage />} />
          <Route path="/custom" element={<CustomGesturesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
