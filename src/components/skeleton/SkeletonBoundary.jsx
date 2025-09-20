// src/components/skeleton/SkeletonBoundary.jsx
import React, { Suspense, useState, useEffect } from "react";
import { SkeletonBase } from "./SkeletonBase";

/**
 * Higher-order component that wraps content with skeleton loading
 */
export function withSkeleton(WrappedComponent, SkeletonComponent, skeletonKey) {
  return function SkeletonWrapper(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
      // Simulate data loading
      const timer = setTimeout(() => {
        setData(props);
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }, [props]);

    if (isLoading) {
      return <SkeletonComponent {...props} />;
    }

    return <WrappedComponent {...data} />;
  };
}

/**
 * Skeleton boundary for async components
 */
export function SkeletonBoundary({
  children,
  fallback,
  skeletonKey = "default",
  onError,
  ...props
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      setHasError(true);
      onError?.(error);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, [onError]);

  if (hasError) {
    return (
      <div className="p-4 text-center text-red-400" role="alert">
        <p>Something went wrong while loading this content.</p>
        <button
          onClick={() => setHasError(false)}
          className="mt-2 px-4 py-2 bg-red-500/20 rounded-md hover:bg-red-500/30 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <Suspense fallback={fallback || <SkeletonBase height="200px" />} {...props}>
      {children}
    </Suspense>
  );
}

/**
 * Hook for managing skeleton state with async operations
 */
export function useSkeletonAsync(asyncFunction, dependencies = []) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await asyncFunction();

        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, isLoading, error };
}

/**
 * Skeleton wrapper for images with LQIP support
 */
export function SkeletonImageWithLQIP({
  src,
  lqip,
  alt,
  className = "",
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {/* LQIP placeholder */}
      {lqip && !isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
          style={{ backgroundImage: `url(${lqip})` }}
        />
      )}

      {/* Skeleton overlay */}
      {!isLoaded && !hasError && (
        <SkeletonBase className="absolute inset-0" animate={true} />
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
          <span className="text-gray-400 text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
}




