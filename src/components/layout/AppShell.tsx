import { Link, Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav.tsx";
import { Sidebar } from "./Sidebar.tsx";

export function AppShell() {
  return (
    <div className="min-h-dvh bg-background text-foreground md:grid md:grid-cols-[15rem_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-col pb-20 md:pb-0">
        <header className="flex items-center border-b border-border px-4 py-3 md:hidden">
          <Link to="/" className="text-base font-semibold tracking-tight text-foreground">
            Gestura
          </Link>
        </header>
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
