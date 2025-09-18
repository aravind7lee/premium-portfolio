// src/components/ParticleBackground.jsx
import React from "react";
import Particles from "react-tsparticles";

/**
 * Simple Particle background without loadFull/init.
 * Use this if you're using only the built-in options (no plugin init necessary).
 */
export default function ParticleBackground({ className = "" }) {
  const isReduced = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const isMobile = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 640px)").matches;
  }, []);

  const particleCount = isReduced ? 0 : isMobile ? 16 : 36;
  const moveSpeed = isReduced ? 0 : isMobile ? 0.3 : 0.6;
  const hoverEnable = !isReduced && !isMobile;
  const clickEnable = !isReduced && !isMobile;

  React.useEffect(() => {
    const onVis = () => {
      // pause heavy effects when tab hidden
      if (document.hidden) {
        // particles will naturally stop rendering when not in view
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <Particles
      className={className}
      options={{
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          number: {
            value: particleCount,
            density: { enable: true, area: 900 },
          },
          color: { value: ["#7c3aed", "#06b6d4", "#ffffff"] },
          shape: { type: "circle" },
          opacity: { value: 0.1 },
          size: { value: { min: 1, max: 3 } },
          links: {
            enable: particleCount > 0 && !isMobile,
            distance: 140,
            opacity: 0.05,
          },
          move: { speed: moveSpeed, enable: particleCount > 0 },
        },
        interactivity: {
          events: {
            onHover: { enable: hoverEnable, mode: "repulse" },
            onClick: { enable: clickEnable, mode: "push" },
            resize: true,
          },
          modes: {
            repulse: { distance: 120 },
            push: { quantity: 2 },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
