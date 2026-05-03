// src/components/PageTransition.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

/**
 * PageTransition Component
 * 
 * Premium page transition system with:
 * - Intelligent route-based slide directions
 * - Smooth fade + slide animations
 * - Reduced motion support
 * - Performance optimized
 */

// Route hierarchy for intelligent transitions
const ROUTE_ORDER = {
  "/": 0,
  "/about": 1,
  "/projects": 2,
  "/skills": 3,
  "/contact": 4,
};

// Get transition direction based on route navigation
const getTransitionDirection = (from, to) => {
  const fromIndex = ROUTE_ORDER[from] ?? 0;
  const toIndex = ROUTE_ORDER[to] ?? 0;
  
  // Forward navigation (left to right in hierarchy)
  if (toIndex > fromIndex) return "forward";
  
  // Backward navigation (right to left in hierarchy)
  if (toIndex < fromIndex) return "backward";
  
  // Same route or unknown
  return "none";
};

// Premium transition variants
const createPageVariants = (direction, reduceMotion) => {
  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.3 } },
      exit: { opacity: 0, transition: { duration: 0.2 } },
    };
  }

  const slideDistance = 60;
  
  const variants = {
    forward: {
      initial: { 
        opacity: 0, 
        x: slideDistance,
        scale: 0.98,
      },
      animate: { 
        opacity: 1, 
        x: 0,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
      exit: { 
        opacity: 0, 
        x: -slideDistance,
        scale: 0.98,
        transition: {
          duration: 0.4,
          ease: [0.55, 0.06, 0.68, 0.19],
        },
      },
    },
    backward: {
      initial: { 
        opacity: 0, 
        x: -slideDistance,
        scale: 0.98,
      },
      animate: { 
        opacity: 1, 
        x: 0,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
      exit: { 
        opacity: 0, 
        x: slideDistance,
        scale: 0.98,
        transition: {
          duration: 0.4,
          ease: [0.55, 0.06, 0.68, 0.19],
        },
      },
    },
    none: {
      initial: { opacity: 0, scale: 0.98 },
      animate: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: 0.4,
          ease: "easeOut",
        },
      },
      exit: { 
        opacity: 0, 
        scale: 0.98,
        transition: {
          duration: 0.3,
          ease: "easeIn",
        },
      },
    },
  };

  return variants[direction] || variants.none;
};

export default function PageTransition({ children }) {
  const location = useLocation();
  const reduceMotion = usePrefersReducedMotion();
  const [prevPath, setPrevPath] = useState(location.pathname);
  const [direction, setDirection] = useState("none");

  useEffect(() => {
    const newDirection = getTransitionDirection(prevPath, location.pathname);
    setDirection(newDirection);
    setPrevPath(location.pathname);
  }, [location.pathname, prevPath]);

  const variants = createPageVariants(direction, reduceMotion);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        style={{
          width: "100%",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
