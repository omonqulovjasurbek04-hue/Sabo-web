import { cn } from "@/lib/utils";

interface SceneLoaderProps {
  className?: string;
}

export function SceneLoader({ className }: SceneLoaderProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden rounded-[inherit] bg-surface/60 animate-pulse",
        className
      )}
      aria-hidden="true"
    />
  );
}