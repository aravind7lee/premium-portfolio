// src/hooks/usePageTransition.js
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

/**
 * usePageTransition Hook
 * 
 * Manages page transition states and provides utilities
 * for coordinating animations across components
 */

export default function usePageTransition() {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState("idle"); // idle, exiting, entering, complete
  const [previousPath, setPreviousPath] = useState(location.pathname);

  useEffect(() => {
    // Start transition
    setIsTransitioning(true);
    setTransitionPhase("exiting");

    // Mid-transition (route change happens here)
    const midTimer = setTimeout(() => {
      setTransitionPhase("entering");
      setPreviousPath(location.pathname);
    }, 200);

    // Complete transition
    const completeTimer = setTimeout(() => {
      setTransitionPhase("complete");
    }, 600);

    // End transition
    const endTimer = setTimeout(() => {
      setIsTransitioning(false);
      setTransitionPhase("idle");
    }, 800);

    return () => {
      clearTimeout(midTimer);
      clearTimeout(completeTimer);
      clearTimeout(endTimer);
    };
  }, [location.pathname]);

  const getTransitionDirection = useCallback(() => {
    const routes = ["/", "/about", "/projects", "/skills", "/contact"];
    const prevIndex = routes.indexOf(previousPath);
    const currIndex = routes.indexOf(location.pathname);
    
    if (prevIndex === -1 || currIndex === -1) return "none";
    return currIndex > prevIndex ? "forward" : "backward";
  }, [previousPath, location.pathname]);

  return {
    isTransitioning,
    transitionPhase,
    direction: getTransitionDirection(),
    previousPath,
    currentPath: location.pathname,
  };
}
