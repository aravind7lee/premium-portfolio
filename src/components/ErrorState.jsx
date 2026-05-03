// src/components/ErrorState.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

/**
 * Premium Error State Component with Retry
 */
export default function ErrorState({ 
  title = 'Something went wrong',
  message = 'An error occurred while loading this content.',
  onRetry,
  showRetry = true,
  className = '' 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-modern rounded-2xl p-8 border border-red-500/30 ${className}`}
    >
      <div className="flex flex-col items-center text-center gap-4">
        {/* Icon */}
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500/20 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 flex items-center justify-center">
            <FiAlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-sm text-white/70 max-w-md">{message}</p>
        </div>

        {/* Retry Button */}
        {showRetry && onRetry && (
          <motion.button
            onClick={onRetry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-red-500/30 transition-all"
          >
            <FiRefreshCw className="w-4 h-4" />
            Try Again
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Inline Error Message
 */
export function InlineError({ message, onRetry }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30">
      <div className="flex items-center gap-3">
        <FiAlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <p className="text-sm text-red-300">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex-shrink-0 text-sm text-red-400 hover:text-red-300 underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Empty State Component
 */
export function EmptyState({ 
  title = 'No data found',
  message = 'There is nothing to display here.',
  icon: Icon,
  action,
  actionLabel = 'Refresh',
  className = '' 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-modern rounded-2xl p-12 border border-white/10 ${className}`}
    >
      <div className="flex flex-col items-center text-center gap-4">
        {Icon && (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600/20 to-teal-400/20 border border-purple-500/30 flex items-center justify-center">
            <Icon className="w-8 h-8 text-purple-400" />
          </div>
        )}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-sm text-white/70 max-w-md">{message}</p>
        </div>
        {action && (
          <motion.button
            onClick={action}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-teal-400 text-white font-semibold shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            {actionLabel}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
