// src/components/RippleButton.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import useMagneticEffect from '../hooks/useMagneticEffect';

/**
 * RippleButton Component
 * 
 * Premium button with:
 * - Magnetic cursor effect
 * - Ripple animation on click
 * - Smooth color transitions
 * - Glow effects
 */

export default function RippleButton({ 
  children, 
  onClick, 
  className = '',
  variant = 'primary', // primary, secondary, ghost
  magnetic = true,
  ripple = true,
  ...props 
}) {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);
  const magneticRef = useMagneticEffect(0.3, 100);

  const handleClick = (e) => {
    if (ripple) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = {
        x,
        y,
        id: Date.now(),
      };

      setRipples([...ripples, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }

    if (onClick) onClick(e);
  };

  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-teal-400 text-white hover:shadow-2xl hover:shadow-purple-500/50',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40',
    ghost: 'bg-transparent text-white hover:bg-white/10',
  };

  const combinedRef = (node) => {
    buttonRef.current = node;
    if (magnetic && magneticRef) {
      magneticRef.current = node;
    }
  };

  return (
    <motion.button
      ref={combinedRef}
      onClick={handleClick}
      className={`
        relative overflow-hidden
        px-6 py-3 rounded-xl
        font-semibold
        transition-all duration-300
        ${variants[variant]}
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {/* Button content */}
      <span className="relative z-10">{children}</span>

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ 
            width: 400, 
            height: 400, 
            opacity: 0,
            x: -200,
            y: -200,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
}
