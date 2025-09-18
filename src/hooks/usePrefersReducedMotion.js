// src/hooks/usePrefersReducedMotion.js
export default function usePrefersReducedMotion() {
  if (typeof window === "undefined" || !("matchMedia" in window)) return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

