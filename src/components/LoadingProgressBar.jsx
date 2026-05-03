// src/components/LoadingProgressBar.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

/**
 * LoadingProgressBar Component
 * 
 * Premium loading indicator with:
 * - Smooth progress animation
 * - Gradient effects
 * - Auto-complete on route change
 * - Configurable timing
 */

export default function LoadingProgressBar() {
  const location = useLocation();
  const reduceMotion = usePrefersReducedMotion();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Start loading on route change
    setIsLoading(true);
    setProgress(0);

    // Clear any existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Simulate progressive loading
    let currentProgress = 0;
    
    // Fast initial progress (0 -> 60%)
    intervalRef.current = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 60) {
        currentProgress = 60;
        clearInterval(intervalRef.current);
        
        // Slow progress (60% -> 90%)
        intervalRef.current = setInterval(() => {
          currentProgress += Math.random() * 5;
          if (currentProgress >= 90) {
            currentProgress = 90;
            clearInterval(intervalRef.current);
          }
          setProgress(currentProgress);
        }, 200);
      }
      setProgress(currentProgress);
    }, 100);

    // Complete loading after a short delay
    timeoutRef.current = setTimeout(() => {
      setProgress(100);
      
      // Hide progress bar after completion
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 400);
    }, 600);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [location.pathname]);

  if (reduceMotion) {
    return null; // Skip loading bar for reduced motion
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 z-[9999] h-1"
          style={{ pointerEvents: "none" }}
        >
          {/* Background track */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          
          {/* Progress bar */}
          <motion.div
            className="h-full relative overflow-hidden"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            style={{
              background: "linear-gradient(90deg, #7c3aed, #06b6d4, #10b981)",
              backgroundSize: "200% 100%",
              boxShadow: "0 0 20px rgba(124, 58, 237, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)",
            }}
          >
            {/* Animated shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: "50%",
              }}
            />
            
            {/* Glow effect */}
            <div 
              className="absolute right-0 top-0 bottom-0 w-20 blur-xl"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.8))",
              }}
            />
          </motion.div>

          {/* Trailing particles effect */}
          {progress > 10 && progress < 100 && (
            <motion.div
              className="absolute top-0 h-full w-2"
              style={{
                left: `${progress}%`,
                background: "radial-gradient(circle, rgba(124, 58, 237, 0.8), transparent)",
                filter: "blur(4px)",
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
