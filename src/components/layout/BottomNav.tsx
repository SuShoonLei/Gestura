import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import { APP_NAV } from "./nav.ts";

export function BottomNav() {
  return (
    <nav
      aria-label="App"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden"
    >
      <ul className="flex items-stretch px-1 pt-1 pb-[max(0.4rem,env(safe-area-inset-bottom))]">
        {APP_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to} className="min-w-0 flex-1">
              <NavLink
                to={item.to}
                end
                className={({ isActive }) =>
                  cn(
                    "flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-medium text-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted",
                  )
                }
              >
                <Icon aria-hidden="true" className="size-4" />
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
