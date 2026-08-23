"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // When route change completes, finish bar and hide
    setProgress(100);
    const t = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 200);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      const isExternal =
        target.getAttribute("target") === "_blank" ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#");

      if (!isExternal && href !== pathname) {
        setLoading(true);
        setProgress(30);
        setTimeout(() => setProgress(75), 100);
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-100 pointer-events-none h-1 bg-transparent overflow-hidden">
      <div
        className="h-full bg-linear-to-r from-primary via-emerald-400 to-action-red transition-all duration-200 ease-out relative shadow-sm shadow-primary/50"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-white/40 blur-xs" />
      </div>
    </div>
  );
}
