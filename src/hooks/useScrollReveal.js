// src/hooks/useScrollReveal.js
import { useRef, useEffect, useState } from "react";

/**
 * Reusable scroll-reveal hook with IntersectionObserver
 * Provides replayable animations that trigger on every viewport entry/exit
 */
export function useScrollReveal({
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
  triggerOnce = false,
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if element is already visible on mount (for page reload)
    const rect = element.getBoundingClientRect();
    const isInitiallyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInitiallyVisible) {
      setIsVisible(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          // Allow replay on re-entry
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}