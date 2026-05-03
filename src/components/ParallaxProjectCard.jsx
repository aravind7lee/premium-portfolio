// src/components/ParallaxProjectCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useParallaxEffect from '../hooks/useParallaxEffect';
import { FiExternalLink, FiGithub, FiCode } from 'react-icons/fi';

/**
 * ParallaxProjectCard Component
 * 
 * Premium project card with:
 * - 3D parallax mouse tracking
 * - Tilt effect
 * - Layered depth
 * - Smooth animations
 */

export default function ParallaxProjectCard({ project, onOpen }) {
  const [isHovered, setIsHovered] = useState(false);
  const [parallaxRef, transform] = useParallaxEffect(15, true);

  return (
    <motion.div
      ref={parallaxRef}
      className="relative group cursor-pointer"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onOpen && onOpen(project)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-teal-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
      />

      {/* Card container with 3D transform */}
      <motion.div
        className="relative bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10"
        style={{
          transform: `
            translate3d(${transform.x}px, ${transform.y}px, 0)
            rotateX(${transform.rotateX}deg)
            rotateY(${transform.rotateY}deg)
          `,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Image container with parallax */}
        <div className="relative h-56 overflow-hidden">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            style={{
              transform: `translate3d(${transform.x * 0.5}px, ${transform.y * 0.5}px, 50px)`,
              transformStyle: 'preserve-3d',
            }}
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.6 }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Featured badge */}
          {project.featured && (
            <motion.div
              className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-teal-400 text-white text-xs font-bold"
              style={{
                transform: `translate3d(${transform.x * -0.3}px, ${transform.y * -0.3}px, 100px)`,
                transformStyle: 'preserve-3d',
              }}
            >
              Featured
            </motion.div>
          )}

          {/* Quick actions */}
          <motion.div
            className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              transform: `translate3d(${transform.x * -0.2}px, ${transform.y * -0.2}px, 80px)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <FiExternalLink className="w-4 h-4 text-white" />
              </motion.a>
            )}
            {project.repoUrl && project.repoUrl !== '#' && (
              <motion.a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <FiGithub className="w-4 h-4 text-white" />
              </motion.a>
            )}
          </motion.div>
        </div>

        {/* Content with depth */}
        <motion.div
          className="p-6"
          style={{
            transform: `translate3d(${transform.x * 0.3}px, ${transform.y * 0.3}px, 60px)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-teal-400 transition-all duration-300">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-white/70 line-clamp-2 mb-4">
            {project.summary || project.details}
          </p>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag, idx) => (
                <motion.span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white/10 text-white/80 border border-white/10"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  }}
                >
                  {tag}
                </motion.span>
              ))}
              {project.tags.length > 3 && (
                <span className="px-2.5 py-1 text-xs rounded-lg bg-white/5 text-white/60">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            transform: `translate3d(${transform.x * 0.5}px, ${transform.y * 0.5}px, 20px)`,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}
