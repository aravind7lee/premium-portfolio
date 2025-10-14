// src/components/ThemeToggle.jsx
import React, { useMemo, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeProvider";

// Ultra-smooth theme toggle: GPU-accelerated, spring-based, no layout thrash
function ThemeToggleImpl({ className = "" }) {
  const { theme, cycleTheme, isDark } = useTheme();
  const prefersReduced = useReducedMotion();

  // motion values avoid re-layout and re-render on every frame
  const x = useMotionValue(isDark ? 28 : 0);
  const xSpring = useSpring(x, {
    stiffness: prefersReduced ? 1000 : 780,
    damping: prefersReduced ? 50 : 32,
    mass: 0.9,
  });
  const rotate = useTransform(xSpring, [0, 28], [0, 180]);

  // update target when theme changes
  React.useEffect(() => {
    const targetX = isDark ? 28 : 0;
    x.set(targetX);
  }, [isDark, x]);

  // Optimistic, snappy interaction
  const isToggling = useRef(false);
  const onToggle = () => {
    if (isToggling.current) return;
    isToggling.current = true;
    
    // Toggle the theme immediately
    cycleTheme();
    
    // Allow another toggle after animation
    setTimeout(() => (isToggling.current = false), prefersReduced ? 50 : 200);
  };

  const bg = useMemo(
    () =>
      isDark
        ? "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))"
        : "linear-gradient(135deg, rgba(0,0,0,0.06), rgba(0,0,0,0.03))",
    [isDark]
  );

  return (
    <button
      onClick={onToggle}
      type="button"
      aria-label={`Toggle theme, current: ${theme}`}
      aria-pressed={isDark}
      role="switch"
      title={`Theme: ${theme}`}
      className={`inline-flex items-center ${className}`}
    >
      <div
        className="w-16 h-9 rounded-full p-1 cursor-pointer select-none relative"
        style={{
          background: bg,
          border: "1px solid rgba(255,255,255,0.06)",
          WebkitTapHighlightColor: "transparent",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        {/* Trail glow */}
        {!prefersReduced && (
          <motion.span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 999,
              background: isDark
                ? "radial-gradient(600px circle at 20% 50%, rgba(159,122,234,0.15), transparent 40%)"
                : "radial-gradient(600px circle at 80% 50%, rgba(6,182,212,0.16), transparent 40%)",
              filter: "blur(4px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          />
        )}

        {/* Knob */}
        <motion.div
          initial={false}
          style={{ x: xSpring }}
          whileTap={prefersReduced ? undefined : { scale: 0.97 }}
          className="w-7 h-7 rounded-full shadow-sm flex items-center justify-center absolute top-1 left-1"
          animate={{ 
            backgroundColor: isDark ? "#0b1220" : "#ffffff",
            transition: { duration: prefersReduced ? 0 : 0.2 }
          }}
        >
          {/* Only one icon is mounted; crossfade/scale on switch */}
          <AnimatePresence initial={false} mode="wait">
            {isDark ? (
              <motion.span
                key="moon"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                initial={
                  prefersReduced
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9, rotate: -20 }
                }
                animate={
                  prefersReduced
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 1, scale: 1, rotate: 0 }
                }
                exit={
                  prefersReduced
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.9, rotate: 20 }
                }
                transition={{ duration: prefersReduced ? 0 : 0.18 }}
              >
                <FiMoon size={16} color="#8E37EB" />
              </motion.span>
            ) : (
              <motion.span
                key="sun"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  rotate,
                }}
                initial={
                  prefersReduced
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9, rotate: 20 }
                }
                animate={
                  prefersReduced
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 1, scale: 1, rotate: 0 }
                }
                exit={
                  prefersReduced
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.9, rotate: -20 }
                }
                transition={{ duration: prefersReduced ? 0 : 0.18 }}
              >
                <FiSun size={16} color="#111827" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </button>
  );
}

const ThemeToggle = React.memo(ThemeToggleImpl);
export default ThemeToggle;
