import React, { useState } from "react";
import { motion } from "framer-motion";
import { SkeletonBase } from "./skeleton";

export default function SkillItem({ skill, index, isLoading = false }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const colors = [
    { from: '#7c3aed', to: '#06b6d4' },
    { from: '#ec4899', to: '#8b5cf6' },
    { from: '#06b6d4', to: '#10b981' },
    { from: '#f59e0b', to: '#ef4444' },
  ];
  
  const colorScheme = colors[index % colors.length];

  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 py-2">
        <SkeletonBase width="8px" height="8px" borderRadius="50%" />
        <div className="flex-1">
          <SkeletonBase height="14px" width="80%" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, x: 5 }}
      className="relative flex items-center space-x-3 py-3 px-3 rounded-lg transition-all duration-300"
      style={{
        background: isHovered ? `linear-gradient(135deg, ${colorScheme.from}15, ${colorScheme.to}15)` : 'transparent',
      }}
    >
      {/* Animated bullet point */}
      <motion.div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${colorScheme.from}, ${colorScheme.to})`,
        }}
        animate={{
          scale: isHovered ? [1, 1.5, 1] : 1,
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Skill name */}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm transition-colors duration-300">
          {skill.name}
        </h4>
      </div>
      
      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-1 rounded-lg blur-sm opacity-0"
        style={{
          background: `linear-gradient(135deg, ${colorScheme.from}, ${colorScheme.to})`,
        }}
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
