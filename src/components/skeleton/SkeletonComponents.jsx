// src/components/skeleton/SkeletonComponents.jsx
import React from "react";
import { SkeletonBase } from "./SkeletonBase";

/**
 * Skeleton for text content
 */
export function SkeletonText({
  lines = 1,
  className = "",
  lineHeight = "1.5rem",
  spacing = "0.5rem",
  ...props
}) {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonBase
          key={i}
          height={lineHeight}
          width={i === lines - 1 ? "75%" : "100%"}
          style={{ marginBottom: i < lines - 1 ? spacing : 0 }}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton for circular avatars or profile images
 */
export function SkeletonAvatar({ size = "3rem", className = "", ...props }) {
  return (
    <SkeletonBase
      className={className}
      width={size}
      height={size}
      borderRadius="50%"
      {...props}
    />
  );
}

/**
 * Skeleton for rectangular images
 */
export function SkeletonImage({
  width = "100%",
  height = "200px",
  className = "",
  ...props
}) {
  return (
    <SkeletonBase
      className={className}
      width={width}
      height={height}
      borderRadius="0.5rem"
      {...props}
    />
  );
}

/**
 * Skeleton for buttons
 */
export function SkeletonButton({
  width = "120px",
  height = "2.5rem",
  className = "",
  ...props
}) {
  return (
    <SkeletonBase
      className={className}
      width={width}
      height={height}
      borderRadius="0.375rem"
      {...props}
    />
  );
}

/**
 * Skeleton for cards
 */
export function SkeletonCard({
  width = "100%",
  height = "300px",
  className = "",
  showImage = true,
  showText = true,
  showButton = false,
  ...props
}) {
  return (
    <div
      className={`p-4 border border-white/10 rounded-lg ${className}`}
      style={{ width, height }}
      {...props}
    >
      {showImage && <SkeletonImage height="150px" className="mb-4" />}

      {showText && (
        <div className="space-y-3">
          <SkeletonText lines={2} />
          <SkeletonText lines={1} lineHeight="1rem" />
        </div>
      )}

      {showButton && (
        <div className="mt-4 flex gap-2">
          <SkeletonButton width="80px" height="2rem" />
          <SkeletonButton width="100px" height="2rem" />
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton for project cards specifically
 */
export function SkeletonProjectCard({ className = "", ...props }) {
  return (
    <SkeletonCard
      className={`bg-white/5 backdrop-blur-sm ${className}`}
      height="400px"
      showImage={true}
      showText={true}
      showButton={true}
      {...props}
    />
  );
}

/**
 * Skeleton for navigation items
 */
export function SkeletonNavItem({ className = "", ...props }) {
  return (
    <SkeletonBase
      className={className}
      width="80px"
      height="2rem"
      borderRadius="0.25rem"
      {...props}
    />
  );
}

/**
 * Skeleton for hero section
 */
export function SkeletonHero({ className = "", ...props }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${className}`} {...props}>
      {/* Content Column */}
      <div className="order-2 md:order-1 space-y-6 text-center md:text-left">
        {/* Main heading */}
        <div className="space-y-4">
          <SkeletonBase height="3rem" width="90%" className="mx-auto md:mx-0" />
          <SkeletonBase height="3rem" width="70%" className="mx-auto md:mx-0" />
        </div>

        {/* Description */}
        <div className="space-y-3">
          <SkeletonBase height="1.5rem" width="100%" />
          <SkeletonBase height="1.5rem" width="85%" />
          <SkeletonBase height="1.5rem" width="60%" />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center md:justify-start">
          <SkeletonButton width="150px" height="3rem" />
          <SkeletonButton width="120px" height="3rem" />
        </div>

        {/* Scroll indicator */}
        <div className="mt-6">
          <SkeletonBase height="1rem" width="120px" className="mx-auto md:mx-0" />
        </div>
      </div>

      {/* Image Column */}
      <div className="order-1 md:order-2 flex justify-center md:justify-end">
        <div className="w-64 md:w-80 lg:w-[360px] aspect-square">
          <SkeletonBase 
            height="100%" 
            width="100%" 
            borderRadius="1rem" 
            className="shadow-2xl"
          />
          {/* Subtitle */}
          <div className="mt-6">
            <SkeletonBase height="1rem" width="200px" className="mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for article content
 */
export function SkeletonArticle({ className = "", ...props }) {
  return (
    <article className={`space-y-6 ${className}`} {...props}>
      {/* Title */}
      <SkeletonBase height="2.5rem" width="70%" />

      {/* Meta info */}
      <div className="flex gap-4">
        <SkeletonAvatar size="2rem" />
        <div className="space-y-2">
          <SkeletonBase height="1rem" width="100px" />
          <SkeletonBase height="0.875rem" width="80px" />
        </div>
      </div>

      {/* Featured image */}
      <SkeletonImage height="300px" />

      {/* Content */}
      <div className="space-y-4">
        <SkeletonText lines={4} />
        <SkeletonText lines={3} />
        <SkeletonText lines={2} />
      </div>
    </article>
  );
}

/**
 * Skeleton for lists
 */
export function SkeletonList({
  items = 5,
  className = "",
  itemHeight = "4rem",
  ...props
}) {
  return (
    <div className={`space-y-3 ${className}`} {...props}>
      {Array.from({ length: items }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 border border-white/10 rounded-lg"
        >
          <SkeletonAvatar size="2.5rem" />
          <div className="flex-1 space-y-2">
            <SkeletonBase height="1.25rem" width="60%" />
            <SkeletonBase height="1rem" width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}




