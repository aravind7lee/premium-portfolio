// src/components/skeleton/index.js
// Main exports for the skeleton system

// Provider and hooks
export { SkeletonProvider, useSkeletonController } from "./SkeletonProvider";

// Base component
export { SkeletonBase } from "./SkeletonBase";

// Pre-built skeleton components
export {
  SkeletonText,
  SkeletonAvatar,
  SkeletonImage,
  SkeletonButton,
  SkeletonCard,
  SkeletonProjectCard,
  SkeletonNavItem,
  SkeletonHero,
  SkeletonArticle,
  SkeletonList,
} from "./SkeletonComponents";

// Boundary and async utilities
export {
  withSkeleton,
  SkeletonBoundary,
  useSkeletonAsync,
  SkeletonImageWithLQIP,
} from "./SkeletonBoundary";




