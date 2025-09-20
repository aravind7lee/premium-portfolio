// src/utils/revealVariants.js

/**
 * Shared Framer Motion variants for scroll-reveal animations
 * GPU-optimized (transform, opacity only) with reduced-motion support
 */

// Check for reduced motion preference
const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Base reveal variant with fade + translateY
export const revealVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: prefersReducedMotion() ? 0.1 : 0.4,
      ease: "easeOut"
    }
  }
};

// Stagger container for grouped animations
export const staggerContainer = {
  hidden: {
    opacity: prefersReducedMotion() ? 1 : 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion() ? 0 : 0.08,
      delayChildren: prefersReducedMotion() ? 0 : 0.1
    }
  }
};

// Individual stagger item
export const staggerItem = {
  hidden: {
    opacity: 0,
    y: prefersReducedMotion() ? 0 : 20,
    transition: {
      duration: 0.2
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: prefersReducedMotion() ? 0.1 : 0.3,
      ease: "easeOut"
    }
  }
};

// Heading variant with slightly different timing
export const headingVariant = {
  hidden: {
    opacity: 0,
    y: prefersReducedMotion() ? 0 : 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: prefersReducedMotion() ? 0.1 : 0.35,
      ease: "easeOut"
    }
  }
};