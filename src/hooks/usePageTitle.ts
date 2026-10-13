import { useEffect } from "react";

export function usePageTitle(title: string): void {
  useEffect(() => {
    document.title = title === "Gestura" ? title : `${title} · Gestura`;
  }, [title]);
}
