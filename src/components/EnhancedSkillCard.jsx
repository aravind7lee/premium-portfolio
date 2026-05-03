// src/components/EnhancedSkillCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * EnhancedSkillCard Component
 * 
 * Premium skill card with:
 * - Smooth color transitions
 * - Glow effects on hover
 * - Scale animations
 * - Gradient backgrounds
 */

export default function EnhancedSkillCard({ skill, index }) {
  const [isHovered, setIsHovered] = useState(false);

  const colors = [
    { from: '#7c3aed', to: '#06b6d4', glow: 'rgba(124, 58, 237, 0.4)' },
    { from: '#ec4899', to: '#8b5cf6', glow: 'rgba(236, 72, 153, 0.4)' },
    { from: '#06b6d4', to: '#10b981', glow: 'rgba(6, 182, 212, 0.4)' },
    { from: '#f59e0b', to: '#ef4444', glow: 'rgba(245, 158, 11, 0.4)' },
  ];

  const colorScheme = colors[index % colors.length];

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${colorScheme.from}, ${colorScheme.to})`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Card */}
      <motion.div
        className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 overflow-hidden"
        whileHover={{ 
          scale: 1.05,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${colorScheme.from}, ${colorScheme.to})`,
          }}
          animate={{
            backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : '0% 0%',
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        {/* Icon */}
        <motion.div
          className="relative z-10 w-12 h-12 mb-4 rounded-xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${colorScheme.from}, ${colorScheme.to})`,
          }}
          animate={{
            rotate: isHovered ? 360 : 0,
          }}
          transition={{ duration: 0.6 }}
        >
          {skill.icon && (
            <span className="text-2xl">{skill.icon}</span>
          )}
        </motion.div>

        {/* Skill name */}
        <h3 className="relative z-10 text-lg font-bold text-white mb-2">
          {skill.name}
        </h3>

        {/* Skill level */}
        {skill.level && (
          <div className="relative z-10">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Proficiency</span>
              <span>{skill.level}%</span>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${colorScheme.from}, ${colorScheme.to})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: isHovered ? `${skill.level}%` : '0%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 0.8 }}
        />
      </motion.div>
    </motion.div>
  );
}
