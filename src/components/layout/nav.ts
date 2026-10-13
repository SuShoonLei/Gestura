import { CircleQuestionMark, Hand, Settings, Sparkles, Video, type LucideIcon } from "lucide-react";

export type AppNavItem = {
  to: "/app" | "/gestures" | "/custom" | "/settings" | "/help";
  label: string;
  icon: LucideIcon;
};

export const APP_NAV: readonly AppNavItem[] = [
  { to: "/app", label: "Live", icon: Video },
  { to: "/gestures", label: "Gestures", icon: Hand },
  { to: "/custom", label: "Custom", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help", icon: CircleQuestionMark },
];
