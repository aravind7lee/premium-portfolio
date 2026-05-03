// src/components/LoadingSpinner.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Loading Spinner with multiple variants
 */
export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'gradient',
  className = '' 
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  if (variant === 'gradient') {
    return (
      <div className={`relative ${sizes[size]} ${className}`}>
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-teal-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            maskImage: 'conic-gradient(from 0deg, transparent 0%, black 50%, transparent 100%)',
            WebkitMaskImage: 'conic-gradient(from 0deg, transparent 0%, black 50%, transparent 100%)',
          }}
        />
        <div className="absolute inset-1 rounded-full bg-gray-900" />
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-teal-400"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={`${sizes[size]} rounded-full bg-gradient-to-r from-purple-600 to-teal-400 ${className}`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
    );
  }

  // Default: spinner
  return (
    <motion.div
      className={`${sizes[size]} border-4 border-purple-600/20 border-t-purple-600 rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}

/**
 * Full Page Loading Overlay
 */
export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="glass-modern rounded-2xl p-8 flex flex-col items-center gap-4 border border-white/10">
        <LoadingSpinner size="xl" variant="gradient" />
        <p className="text-white font-medium">{message}</p>
      </div>
    </motion.div>
  );
}

/**
 * Inline Loading State
 */
export function InlineLoader({ message = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 text-white/70">
      <LoadingSpinner size="sm" variant="gradient" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
