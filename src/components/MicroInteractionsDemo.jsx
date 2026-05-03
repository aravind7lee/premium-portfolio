// src/components/MicroInteractionsDemo.jsx
import React from 'react';
import { motion } from 'framer-motion';
import RippleButton from './RippleButton';
import MagneticCTA from './MagneticCTA';
import EnhancedSkillCard from './EnhancedSkillCard';
import ParallaxProjectCard from './ParallaxProjectCard';
import { FiArrowRight, FiDownload, FiMail } from 'react-icons/fi';

/**
 * MicroInteractionsDemo Component
 * 
 * Showcase page for all premium micro-interactions
 * Use this to test and demonstrate the features
 */

export default function MicroInteractionsDemo() {
  const demoSkills = [
    { name: 'React', icon: '⚛️', level: 95 },
    { name: 'Node.js', icon: '🟢', level: 90 },
    { name: 'TypeScript', icon: '📘', level: 85 },
    { name: 'Tailwind', icon: '🎨', level: 92 },
  ];

  const demoProject = {
    id: 1,
    title: 'Premium Portfolio',
    summary: 'A world-class portfolio with stunning micro-interactions',
    image: '/assets/work-1.png',
    featured: true,
    tags: ['React', 'Framer Motion', 'Tailwind'],
    liveUrl: '#',
    repoUrl: '#',
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
            Premium Micro-Interactions
          </h1>
          <p className="text-white/70 text-lg">
            Hover, click, and interact with these premium components
          </p>
        </motion.div>

        {/* Magnetic CTA Buttons */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Magnetic CTA Buttons</h2>
          <p className="text-white/60">Move your cursor near these buttons to feel the magnetic effect</p>
          
          <div className="flex flex-wrap gap-6">
            <MagneticCTA icon={FiArrowRight}>
              Get Started
            </MagneticCTA>
            
            <MagneticCTA icon={FiDownload}>
              Download Resume
            </MagneticCTA>
            
            <MagneticCTA icon={FiMail}>
              Contact Me
            </MagneticCTA>
          </div>
        </section>

        {/* Ripple Buttons */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Ripple Effect Buttons</h2>
          <p className="text-white/60">Click these buttons to see the ripple animation</p>
          
          <div className="flex flex-wrap gap-4">
            <RippleButton variant="primary">
              Primary Button
            </RippleButton>
            
            <RippleButton variant="secondary">
              Secondary Button
            </RippleButton>
            
            <RippleButton variant="ghost">
              Ghost Button
            </RippleButton>
          </div>
        </section>

        {/* Enhanced Skill Cards */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Enhanced Skill Cards</h2>
          <p className="text-white/60">Hover over these cards to see smooth color transitions and animations</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demoSkills.map((skill, index) => (
              <EnhancedSkillCard key={index} skill={skill} index={index} />
            ))}
          </div>
        </section>

        {/* Parallax Project Card */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white">3D Parallax Project Card</h2>
          <p className="text-white/60">Move your mouse over this card to see the 3D parallax effect</p>
          
          <div className="max-w-md mx-auto">
            <ParallaxProjectCard project={demoProject} />
          </div>
        </section>

        {/* Instructions */}
        <motion.div
          className="glass rounded-2xl p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            🎨 How to Use These Components
          </h3>
          <div className="text-white/70 space-y-2 text-left max-w-2xl mx-auto">
            <p>✅ <strong>MagneticCTA:</strong> Use for primary call-to-action buttons</p>
            <p>✅ <strong>RippleButton:</strong> Use for secondary actions and forms</p>
            <p>✅ <strong>EnhancedSkillCard:</strong> Replace existing skill cards</p>
            <p>✅ <strong>ParallaxProjectCard:</strong> Replace existing project cards</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
