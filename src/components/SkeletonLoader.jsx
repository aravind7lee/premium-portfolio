// src/components/SkeletonLoader.jsx
import React from "react";

export default function SkeletonLoader({
  className = "h-48 w-full rounded-lg",
}) {
  return (
    <div
      className={`bg-white/6 animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}
