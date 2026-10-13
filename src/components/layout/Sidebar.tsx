import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import { APP_NAV } from "./nav.ts";

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-card px-4 py-6 md:flex">
      <a href="/" className="px-3 text-lg font-semibold tracking-tight text-foreground">
        Gestura
      </a>
      <p className="mt-1 px-3 text-xs text-muted-foreground">Hand control</p>
      <nav aria-label="App" className="mt-8 flex flex-col gap-1">
        {APP_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted",
                )
              }
            >
              <Icon aria-hidden="true" className="size-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
