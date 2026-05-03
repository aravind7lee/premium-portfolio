// src/components/RouteTransitionWrapper.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import PageTransition from "./PageTransition";
import LoadingProgressBar from "./LoadingProgressBar";
import PageTransitionOverlay from "./PageTransitionOverlay";

/**
 * RouteTransitionWrapper Component
 * 
 * Combines page transitions, loading progress bar, and optional overlay
 * for a complete premium navigation experience
 * 
 * Features:
 * - Smart route-based slide transitions
 * - Animated loading progress bar
 * - Optional curtain overlay effect
 */

export default function RouteTransitionWrapper({ 
  children, 
  showOverlay = false, // Set to true for curtain effect
  showRouteName = true 
}) {
  const location = useLocation();

  return (
    <>
      {/* Loading progress bar at the top */}
      <LoadingProgressBar />
      
      {/* Optional curtain overlay effect */}
      {showOverlay && <PageTransitionOverlay showRouteName={showRouteName} />}
      
      {/* Page transition wrapper */}
      <PageTransition key={location.pathname}>
        {children}
      </PageTransition>
    </>
  );
}
