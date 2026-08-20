"use client";

import { useEffect, useRef, useState } from "react";

import { prefersReducedMotion } from "@/lib/three/motion";
import { cn } from "@/lib/utils";

interface MilkDropAnimationProps {
  className?: string;
  color?: string;
}

export function MilkDropAnimation({
  className,
  color = "#FFFFFF",
}: MilkDropAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative size-16 shrink-0", className)}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
        <path
          d="M32 6c0 0-12 14-12 24a12 12 0 0 0 24 0c0-10-12-24-12-24Z"
          fill={color}
          className={
            visible
              ? "animate-[sabo-drop_0.9s_cubic-bezier(0.4,0,0.2,1)_both]"
              : "opacity-0"
          }
        />
        <ellipse
          cx="32"
          cy="48"
          rx="2.5"
          ry="1"
          fill={color}
          className={
            visible
              ? "animate-[sabo-drop_0.9s_cubic-bezier(0.4,0,0.2,1)_both]"
              : "opacity-0"
          }
        />
        <circle
          cx="32"
          cy="50"
          r="2"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          className={
            visible
              ? "animate-[sabo-ripple_2.2s_ease-out_0.6s_both]"
              : "opacity-0"
          }
        />
        <circle
          cx="32"
          cy="50"
          r="2"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          className={
            visible
              ? "animate-[sabo-ripple_2.2s_ease-out_0.8s_both]"
              : "opacity-0"
          }
        />
      </svg>
      <style>{`
        @keyframes sabo-drop {
          0% { opacity: 0; transform: translateY(-14px); }
          30% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0.85; transform: translateY(0); }
        }
        @keyframes sabo-ripple {
          0% { opacity: 0.9; transform: scale(1); }
          100% { opacity: 0; transform: scale(9); }
        }
      `}</style>
    </div>
  );
}