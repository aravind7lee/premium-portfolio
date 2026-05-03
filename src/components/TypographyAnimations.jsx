// src/components/TypographyAnimations.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * TYPEWRITER EFFECT - Characters appear one by one
 */
export function Typewriter({ 
  text, 
  delay = 0, 
  speed = 50,
  className = '',
  onComplete 
}) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        setCurrentIndex(0);
      }, delay);
      return () => clearTimeout(delayTimer);
    }
  }, [delay]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete && currentIndex === text.length) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-0.5 h-5 bg-current ml-1 align-middle"
      />
    </span>
  );
}

/**
 * WORD REVEAL - Words appear one by one with fade + slide
 */
export function WordReveal({ 
  text, 
  delay = 0,
  staggerDelay = 0.1,
  className = '' 
}) {
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * staggerDelay,
            ease: 'easeOut',
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/**
 * LETTER STAGGER - Letters appear one by one with stagger
 */
export function LetterStagger({ 
  text, 
  delay = 0,
  staggerDelay = 0.03,
  className = '' 
}) {
  const letters = text.split('');

  return (
    <span className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * staggerDelay,
            ease: [0.6, 0.01, 0.05, 0.95],
          }}
          className="inline-block"
          style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
}

/**
 * GRADIENT TEXT WAVE - Animated gradient that waves through text
 */
export function GradientTextWave({ 
  text, 
  className = '',
  colors = ['#8B5CF6', '#EC4899', '#06B6D4']
}) {
  return (
    <motion.span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
        backgroundSize: '200% 100%',
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {text}
    </motion.span>
  );
}

/**
 * GLITCH TEXT - Cyberpunk glitch effect
 */
export function GlitchText({ text, className = '' }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <motion.span
        className="absolute top-0 left-0 text-cyan-400 opacity-70"
        animate={{
          x: [-2, 2, -2],
          y: [1, -1, 1],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatType: 'mirror',
        }}
        aria-hidden="true"
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 text-pink-400 opacity-70"
        animate={{
          x: [2, -2, 2],
          y: [-1, 1, -1],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatType: 'mirror',
        }}
        aria-hidden="true"
      >
        {text}
      </motion.span>
    </span>
  );
}

/**
 * FADE IN UP - Simple fade in with upward motion
 */
export function FadeInUp({ 
  children, 
  delay = 0,
  duration = 0.6,
  className = '' 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * SPLIT TEXT REVEAL - Text splits and reveals from center
 */
export function SplitTextReveal({ 
  text, 
  delay = 0,
  className = '' 
}) {
  const midpoint = Math.floor(text.length / 2);
  const leftPart = text.slice(0, midpoint);
  const rightPart = text.slice(midpoint);

  return (
    <span className={`inline-block ${className}`}>
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        className="inline-block"
      >
        {leftPart}
      </motion.span>
      <motion.span
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        className="inline-block"
      >
        {rightPart}
      </motion.span>
    </span>
  );
}

/**
 * ROTATING TEXT - Text rotates through multiple phrases
 */
export function RotatingText({ 
  texts = [], 
  interval = 3000,
  className = '' 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <motion.span
      key={currentIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`inline-block ${className}`}
    >
      {texts[currentIndex]}
    </motion.span>
  );
}

/**
 * CHAR WAVE - Characters wave up and down
 */
export function CharWave({ 
  text, 
  delay = 0,
  className = '' 
}) {
  const chars = text.split('');

  return (
    <span className={className}>
      {chars.map((char, index) => (
        <motion.span
          key={index}
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.6,
            delay: delay + index * 0.05,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="inline-block"
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

/**
 * SCALE IN - Text scales in with bounce
 */
export function ScaleIn({ 
  children, 
  delay = 0,
  className = '' 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
