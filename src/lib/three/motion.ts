export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

export type DeviceTier = "high" | "medium" | "low";

export function getDeviceTier(): DeviceTier {
  if (typeof navigator === "undefined") return "high";
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency || 4;
  if (cores <= 2) return "low";
  if (memory !== undefined && memory <= 2) return "low";
  if (memory !== undefined && memory <= 4) return "medium";
  return "high";
}