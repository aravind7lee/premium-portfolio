// src/components/Toast.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const toastIcons = {
  success: FiCheckCircle,
  error: FiXCircle,
  warning: FiAlertCircle,
  info: FiInfo,
};

const toastStyles = {
  success: {
    bg: 'from-emerald-500/90 to-teal-500/90',
    border: 'border-emerald-400/50',
    icon: 'text-emerald-100',
    glow: 'shadow-emerald-500/50',
  },
  error: {
    bg: 'from-red-500/90 to-pink-500/90',
    border: 'border-red-400/50',
    icon: 'text-red-100',
    glow: 'shadow-red-500/50',
  },
  warning: {
    bg: 'from-amber-500/90 to-orange-500/90',
    border: 'border-amber-400/50',
    icon: 'text-amber-100',
    glow: 'shadow-amber-500/50',
  },
  info: {
    bg: 'from-blue-500/90 to-cyan-500/90',
    border: 'border-blue-400/50',
    icon: 'text-blue-100',
    glow: 'shadow-blue-500/50',
  },
};

function Toast({ id, type, message, onClose }) {
  const Icon = toastIcons[type];
  const styles = toastStyles[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative flex items-start gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r ${styles.bg} border ${styles.border} backdrop-blur-xl shadow-2xl ${styles.glow} w-full sm:min-w-[320px] sm:max-w-md`}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/10 blur-xl -z-10" />
      
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${styles.icon}`} />
      </div>

      {/* Message */}
      <p className="flex-1 text-xs sm:text-sm font-medium text-white leading-relaxed break-words pr-2">{message}</p>

      {/* Close button */}
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors touch-manipulation"
        aria-label="Close notification"
      >
        <FiX className="w-4 h-4 text-white" />
      </button>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 5, ease: 'linear' }}
      />
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (message) => addToast('success', message),
    error: (message) => addToast('error', message),
    warning: (message) => addToast('warning', message),
    info: (message) => addToast('info', message),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* Toast Container - Responsive positioning */}
      <div className="fixed top-16 sm:top-20 left-4 right-4 sm:left-auto sm:right-6 z-[100000] flex flex-col gap-2 sm:gap-3 pointer-events-none max-w-full sm:max-w-md">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto w-full">
              <Toast {...t} onClose={removeToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
