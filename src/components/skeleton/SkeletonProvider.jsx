// src/components/skeleton/SkeletonProvider.jsx
import React, { createContext, useContext, useState, useCallback } from "react";

const SkeletonContext = createContext();

export function SkeletonProvider({ children }) {
  const [skeletonStates, setSkeletonStates] = useState(new Map());

  const showSkeleton = useCallback((key) => {
    setSkeletonStates((prev) => new Map(prev.set(key, true)));
  }, []);

  const hideSkeleton = useCallback((key) => {
    setSkeletonStates((prev) => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  const isSkeletonVisible = useCallback(
    (key) => {
      return skeletonStates.get(key) || false;
    },
    [skeletonStates]
  );

  const value = {
    showSkeleton,
    hideSkeleton,
    isSkeletonVisible,
  };

  return (
    <SkeletonContext.Provider value={value}>
      {children}
    </SkeletonContext.Provider>
  );
}

export function useSkeletonController() {
  const context = useContext(SkeletonContext);
  if (!context) {
    throw new Error(
      "useSkeletonController must be used within SkeletonProvider"
    );
  }
  return context;
}



