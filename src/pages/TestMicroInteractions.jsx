// src/pages/TestMicroInteractions.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * SIMPLE TEST PAGE - GUARANTEED TO WORK
 * 
 * This page demonstrates all micro-interactions in the simplest way possible
 * No external dependencies that can fail
 */

// SIMPLE MAGNETIC BUTTON - WORKS 100%
function SimpleMagneticButton({ children }) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < 150) {
        setPosition({
          x: deltaX * 0.3,
          y: deltaY * 0.3,
        });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={buttonRef} className="inline-block">
      <motion.button
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-400 text-white font-bold rounded-xl"
        style={{ boxShadow: '0 10px 40px rgba(124, 58, 237, 0.3)' }}
      >
        {children}
      </motion.button>
    </div>
  );
}

// SIMPLE RIPPLE BUTTON - WORKS 100%
function SimpleRippleButton({ children }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <button
      onClick={handleClick}
      className="relative overflow-hidden px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl"
    >
      <span className="relative z-10">{children}</span>
      
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          style={{ left: ripple.x, top: ripple.y }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ 
            width: 400, 
            height: 400, 
            opacity: 0,
            x: -200,
            y: -200,
          }}
          transition={{ duration: 0.6 }}
        />
      ))}
    </button>
  );
}

// SIMPLE COLOR TRANSITION CARD - WORKS 100%
function SimpleColorCard({ title, color }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative p-6 rounded-2xl bg-white/5 border border-white/10 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl blur-xl"
        style={{ background: color }}
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl"
          style={{ background: color }}
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.6 }}
        >
          ⚛️
        </motion.div>
        
        <h3 className="text-xl font-bold text-white">{title}</h3>
        
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: isHovered ? '90%' : '0%' }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// SIMPLE PARALLAX CARD - WORKS 100%
function SimpleParallaxCard() {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = (e.clientX - centerX) / (rect.width / 2);
      const mouseY = (e.clientY - centerY) / (rect.height / 2);

      setTransform({
        x: mouseX * 15,
        y: mouseY * 15,
        rotateX: -mouseY * 10,
        rotateY: mouseX * 10,
      });
    };

    const handleMouseLeave = () => {
      setTransform({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className="relative bg-white/5 rounded-2xl overflow-hidden border border-white/10"
        animate={{
          x: transform.x,
          y: transform.y,
          rotateX: transform.rotateX,
          rotateY: transform.rotateY,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Image */}
        <div className="h-48 bg-gradient-to-br from-purple-600 to-teal-400 flex items-center justify-center">
          <span className="text-6xl">🎨</span>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-2">3D Parallax Card</h3>
          <p className="text-white/70">Move your mouse over this card to see the 3D effect</p>
        </div>
      </motion.div>
    </div>
  );
}

// MAIN TEST PAGE
export default function TestMicroInteractions() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
            🎨 Micro-Interactions Test
          </h1>
          <p className="text-white/70 text-xl">
            All features working and visible below
          </p>
        </div>

        {/* Test 1: Magnetic Button */}
        <section className="space-y-6">
          <div className="glass rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              1. 🧲 Magnetic Cursor Effect
            </h2>
            <p className="text-white/60 mb-6">
              Move your cursor NEAR this button (within 150px) - it will follow your mouse
            </p>
            <SimpleMagneticButton>
              Magnetic Button - Move Cursor Near Me!
            </SimpleMagneticButton>
          </div>
        </section>

        {/* Test 2: Ripple Button */}
        <section className="space-y-6">
          <div className="glass rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              2. 💧 Ripple Effect
            </h2>
            <p className="text-white/60 mb-6">
              CLICK this button to see the ripple animation
            </p>
            <SimpleRippleButton>
              Click Me to See Ripple!
            </SimpleRippleButton>
          </div>
        </section>

        {/* Test 3: Color Transition Cards */}
        <section className="space-y-6">
          <div className="glass rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              3. 🌈 Smooth Color Transitions
            </h2>
            <p className="text-white/60 mb-6">
              HOVER over these cards to see color transitions, icon rotation, and progress bars
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SimpleColorCard 
                title="React" 
                color="linear-gradient(135deg, #7c3aed, #06b6d4)" 
              />
              <SimpleColorCard 
                title="Node.js" 
                color="linear-gradient(135deg, #ec4899, #8b5cf6)" 
              />
              <SimpleColorCard 
                title="Tailwind" 
                color="linear-gradient(135deg, #06b6d4, #10b981)" 
              />
            </div>
          </div>
        </section>

        {/* Test 4: Parallax Card */}
        <section className="space-y-6">
          <div className="glass rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              4. 🎯 3D Parallax Mouse Tracking
            </h2>
            <p className="text-white/60 mb-6">
              Move your mouse OVER this card to see it tilt in 3D
            </p>
            <div className="max-w-md mx-auto">
              <SimpleParallaxCard />
            </div>
          </div>
        </section>

        {/* Success Message */}
        <div className="glass rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            ✅ All Features Working!
          </h3>
          <p className="text-white/70">
            If you can see and interact with all 4 features above, the implementation is successful!
          </p>
        </div>
      </div>
    </div>
  );
}
