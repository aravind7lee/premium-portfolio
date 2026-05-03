// src/components/MagneticCTA.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useMagneticEffect from '../hooks/useMagneticEffect';

/**
 * MagneticCTA Component
 * 
 * Premium CTA button with:
 * - Strong magnetic cursor effect
 * - Ripple animation
 * - Glow effects
 * - Smooth transitions
 */

export default function MagneticCTA({ 
  children, 
  onClick, 
  href,
  className = '',
  icon: Icon,
  ...props 
}) {
  const [ripples, setRipples] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const magneticRef = useMagneticEffect(0.4, 150); // Stronger magnetic effect

  const handleClick = (e) => {
    // Create ripple
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);

    if (onClick) onClick(e);
  };

  const Component = href ? motion.a : motion.button;
  const linkProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Component
      ref={magneticRef}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative group
        inline-flex items-center gap-3
        px-8 py-4 rounded-2xl
        bg-gradient-to-r from-purple-600 to-teal-400
        text-white font-bold text-lg
        overflow-hidden
        cursor-pointer
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        boxShadow: '0 10px 40px rgba(124, 58, 237, 0.3)',
      }}
      {...linkProps}
      {...props}
    >
      {/* Animated glow */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-teal-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-75"
        animate={{
          opacity: isHovered ? 0.75 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-3">
        {children}
        {Icon && (
          <motion.span
            animate={{
              x: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-5 h-5" />
          </motion.span>
        )}
      </span>

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/40"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ 
            width: 500, 
            height: 500, 
            opacity: 0,
            x: -250,
            y: -250,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          x: isHovered ? ['0%', '200%'] : '0%',
        }}
        transition={{
          duration: 1,
          repeat: isHovered ? Infinity : 0,
          ease: 'linear',
        }}
      />

      {/* Particle effects */}
      {isHovered && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x: '50%',
                y: '50%',
                opacity: 0,
              }}
              animate={{
                x: `${50 + Math.cos((i * Math.PI * 2) / 6) * 100}%`,
                y: `${50 + Math.sin((i * Math.PI * 2) / 6) * 100}%`,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </>
      )}
    </Component>
  );
}
