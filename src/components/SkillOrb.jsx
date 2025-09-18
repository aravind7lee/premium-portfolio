import React from 'react';
import { motion } from 'framer-motion';

export default function SkillOrb({ label }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, rotate: 360 }}
      transition={{ duration: 1.6 }}
      className="w-28 h-28 rounded-full flex items-center justify-center tilt-card glass"
      role="img"
      aria-label={label}
    >
      <div className="text-center">
        <div className="text-sm font-semibold">{label}</div>
      </div>
    </motion.div>
  );
}
