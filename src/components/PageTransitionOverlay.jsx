// src/components/PageTransitionOverlay.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

/**
 * PageTransitionOverlay Component
 * 
 * Premium curtain overlay effect during page transitions
 * - Smooth curtain animation
 * - Gradient effects
 * - Optional route name display
 */

const ROUTE_NAMES = {
  "/": "Home",
  "/about": "About",
  "/projects": "Projects",
  "/skills": "Skills",
  "/contact": "Contact",
};

export default function PageTransitionOverlay({ showRouteName = true }) {
  const location = useLocation();
  const reduceMotion = usePrefersReducedMotion();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [routeName, setRouteName] = useState("");

  useEffect(() => {
    setIsTransitioning(true);
    setRouteName(ROUTE_NAMES[location.pathname] || "Page");

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (reduceMotion) {
    return null;
  }

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="fixed inset-0 z-[9998] origin-top"
          style={{
            background: "linear-gradient(135deg, rgba(124, 58, 237, 0.95), rgba(6, 182, 212, 0.95))",
            pointerEvents: "none",
          }}
        >
          {/* Gradient mesh overlay */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)
              `,
            }}
          />

          {/* Route name display */}
          {showRouteName && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.h2
                  className="text-5xl md:text-7xl font-bold text-white tracking-tight"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  {routeName}
                </motion.h2>
                
                {/* Animated underline */}
                <motion.div
                  className="mt-4 h-1 bg-white/50 rounded-full mx-auto"
                  initial={{ width: 0 }}
                  animate={{ width: "120px" }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
            </motion.div>
          )}

          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: 0,
                }}
                animate={{
                  y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
