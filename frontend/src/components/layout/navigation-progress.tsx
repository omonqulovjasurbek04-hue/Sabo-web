"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When pathname or searchParams change, instantly finish loading
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept internal link clicks to trigger instant visual feedback
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
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-100 pointer-events-none h-1 overflow-hidden bg-transparent">
      <div className="h-full bg-linear-to-r from-[#2F6B45] via-[#708B3E] to-[#C71925] animate-pulse w-full transition-all duration-300 origin-left" />
    </div>
  );
}
