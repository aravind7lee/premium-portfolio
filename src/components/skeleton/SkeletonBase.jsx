// src/components/skeleton/SkeletonBase.jsx
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Base skeleton component with GPU-optimized shimmer animation
 * Uses only transform and opacity for performance
 */
export function SkeletonBase({
  className = "",
  width = "100%",
  height = "1rem",
  borderRadius = "0.375rem",
  animate = true,
  children,
  ...props
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!animate || prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [animate, prefersReducedMotion]);

  const shimmerVariants = {
    hidden: {
      opacity: 0.3,
      x: "-100%",
    },
    visible: {
      opacity: 0.6,
      x: "100%",
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.5,
      },
    },
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        ...props.style,
      }}
      role="status"
      aria-busy="true"
      aria-label="Loading content"
      {...props}
    >
      {children}

      {animate && isVisible && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
            transform: "translateX(-100%)",
          }}
          variants={shimmerVariants}
          initial="hidden"
          animate="visible"
        />
      )}
    </div>
  );
}



