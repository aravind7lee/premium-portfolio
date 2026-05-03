// src/config/transitionConfig.js

/**
 * Page Transition Configuration
 * 
 * Customize your page transitions by modifying these presets
 * or creating your own custom configurations
 */

export const TRANSITION_PRESETS = {
  // Default: Smooth slide with blur
  default: {
    slideDistance: 60,
    duration: 0.5,
    exitDuration: 0.4,
    scale: { from: 0.98, to: 1 },
    blur: { from: 4, to: 0 },
    easing: {
      enter: [0.25, 0.46, 0.45, 0.94],
      exit: [0.55, 0.06, 0.68, 0.19],
    },
  },

  // Fast: Quick and snappy
  fast: {
    slideDistance: 40,
    duration: 0.3,
    exitDuration: 0.25,
    scale: { from: 0.99, to: 1 },
    blur: { from: 2, to: 0 },
    easing: {
      enter: [0.4, 0, 0.2, 1],
      exit: [0.4, 0, 1, 1],
    },
  },

  // Smooth: Extra smooth and elegant
  smooth: {
    slideDistance: 80,
    duration: 0.7,
    exitDuration: 0.6,
    scale: { from: 0.96, to: 1 },
    blur: { from: 6, to: 0 },
    easing: {
      enter: [0.16, 1, 0.3, 1],
      exit: [0.7, 0, 0.84, 0],
    },
  },

  // Minimal: Subtle fade only
  minimal: {
    slideDistance: 20,
    duration: 0.4,
    exitDuration: 0.3,
    scale: { from: 1, to: 1 },
    blur: { from: 0, to: 0 },
    easing: {
      enter: [0.4, 0, 0.2, 1],
      exit: [0.4, 0, 0.2, 1],
    },
  },

  // Dramatic: Bold and eye-catching
  dramatic: {
    slideDistance: 100,
    duration: 0.8,
    exitDuration: 0.7,
    scale: { from: 0.94, to: 1 },
    blur: { from: 8, to: 0 },
    easing: {
      enter: [0.76, 0, 0.24, 1],
      exit: [0.6, 0.04, 0.98, 0.34],
    },
  },
};

// Active preset (change this to switch styles)
export const ACTIVE_PRESET = "default";

// Progress bar configuration
export const PROGRESS_BAR_CONFIG = {
  // Colors (CSS gradient)
  gradient: "linear-gradient(90deg, #7c3aed, #06b6d4, #10b981)",
  
  // Timing
  timing: {
    initial: 100, // ms between updates (0-60%)
    slow: 200,    // ms between updates (60-90%)
    complete: 600, // ms until completion
    fadeOut: 400,  // ms to fade out after complete
  },
  
  // Effects
  effects: {
    shimmer: true,
    glow: true,
    particles: true,
  },
  
  // Shadow
  shadow: "0 0 20px rgba(124, 58, 237, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)",
};

// Overlay configuration
export const OVERLAY_CONFIG = {
  enabled: false, // Set to true to enable curtain overlay
  showRouteName: true,
  
  // Colors
  gradient: "linear-gradient(135deg, rgba(124, 58, 237, 0.95), rgba(6, 182, 212, 0.95))",
  
  // Timing
  duration: 0.5,
  easing: [0.76, 0, 0.24, 1],
  
  // Effects
  particles: {
    enabled: true,
    count: 8,
  },
  
  // Typography
  typography: {
    size: {
      mobile: "3rem",
      desktop: "5rem",
    },
    weight: "bold",
  },
};

// Route hierarchy (for determining transition direction)
export const ROUTE_HIERARCHY = {
  "/": 0,
  "/about": 1,
  "/projects": 2,
  "/skills": 3,
  "/contact": 4,
};

// Export current configuration
export const getCurrentConfig = () => {
  return {
    transition: TRANSITION_PRESETS[ACTIVE_PRESET],
    progressBar: PROGRESS_BAR_CONFIG,
    overlay: OVERLAY_CONFIG,
    routes: ROUTE_HIERARCHY,
  };
};

// Helper to get transition direction
export const getTransitionDirection = (fromPath, toPath) => {
  const fromIndex = ROUTE_HIERARCHY[fromPath] ?? 0;
  const toIndex = ROUTE_HIERARCHY[toPath] ?? 0;
  
  if (toIndex > fromIndex) return "forward";
  if (toIndex < fromIndex) return "backward";
  return "none";
};

// Helper to get route name
export const getRouteName = (path) => {
  const names = {
    "/": "Home",
    "/about": "About",
    "/projects": "Projects",
    "/skills": "Skills",
    "/contact": "Contact",
  };
  return names[path] || "Page";
};
