// src/components/EnhancedProjectCard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiExternalLink, FiGithub, FiCode, FiStar } from "react-icons/fi";

export default function EnhancedProjectCard({ project, onOpen }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative h-full cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onOpen(project)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Subtle glow effect - much softer */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
      
      <div className="relative h-full bg-white/5 dark:bg-white/5 rounded-2xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
        {/* Image container */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
          
          {/* Featured badge - cleaner design */}
          {project.featured && (
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
              <FiStar className="w-3 h-3 text-yellow-400" />
              Featured
            </div>
          )}
          
          {/* Quick action buttons - cleaner style */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <FiExternalLink className="w-4 h-4 text-white" />
              </motion.a>
            )}
            {project.repoUrl && project.repoUrl !== "#" && (
              <motion.a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <FiGithub className="w-4 h-4 text-white" />
              </motion.a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Title */}
          <h3 className="text-lg font-bold text-white group-hover:text-white/90 transition-colors duration-300">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">
            {project.summary || project.details}
          </p>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {project.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white/10 text-white/80 border border-white/10 hover:border-white/20 hover:bg-white/15 transition-all duration-200"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="px-2.5 py-1 text-xs rounded-lg bg-white/5 text-white/60 border border-white/10">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* View Details Button - cleaner design */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(project);
            }}
            className="w-full mt-4 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiCode className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
            View Details
          </motion.button>
        </div>

        {/* Subtle shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </motion.div>
  );
}
