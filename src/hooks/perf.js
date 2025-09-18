// src/hooks/perf.js
import React from "react";

// rAF-throttled callback for pointer/scroll handlers
export function useRafThrottle(callback) {
  const frameRef = React.useRef(0);
  const lastArgsRef = React.useRef(null);

  const run = React.useCallback(() => {
    frameRef.current = 0;
    // eslint-disable-next-line prefer-spread
    callback.apply(null, lastArgsRef.current || []);
  }, [callback]);

  return React.useCallback(
    (...args) => {
      lastArgsRef.current = args;
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(run);
    },
    [run]
  );
}

// IntersectionObserver visibility hook
export function useIsVisible(ref, rootMargin = "150px") {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setVisible(e.isIntersecting);
      },
      { root: null, rootMargin, threshold: 0.01 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [ref, rootMargin]);
  return visible;
}

// Low power detector: samples rAF for ~1s and flags if fps < 45
export function useLowPowerMode(sampleMs = 1000, fpsThreshold = 45) {
  const [lowPower, setLowPower] = React.useState(false);
  React.useEffect(() => {
    let mounted = true;
    let frames = 0;
    let start = performance.now();
    function loop(now) {
      frames += 1;
      if (now - start < sampleMs) {
        requestAnimationFrame(loop);
      } else if (mounted) {
        const fps = (frames * 1000) / (now - start);
        setLowPower(fps < fpsThreshold);
      }
    }
    const id = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      cancelAnimationFrame(id);
    };
  }, [sampleMs, fpsThreshold]);
  return lowPower;
}
