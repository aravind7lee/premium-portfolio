// src/components/TransitionDemo.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { TRANSITION_PRESETS } from "../config/transitionConfig";

/**
 * TransitionDemo Component
 * 
 * Visual demo to preview different transition styles
 * Add this to any page to test transitions
 * 
 * Usage:
 * import TransitionDemo from './components/TransitionDemo';
 * <TransitionDemo />
 */

export default function TransitionDemo() {
  const [selectedPreset, setSelectedPreset] = useState("default");
  const [isAnimating, setIsAnimating] = useState(false);

  const previewTransition = (presetName) => {
    setSelectedPreset(presetName);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const preset = TRANSITION_PRESETS[selectedPreset];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 shadow-2xl border border-white/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Transition Demo</h3>
          <button
            onClick={() => document.getElementById("transition-demo")?.remove()}
            className="text-white/60 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {Object.keys(TRANSITION_PRESETS).map((presetName) => (
            <button
              key={presetName}
              onClick={() => previewTransition(presetName)}
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedPreset === presetName
                  ? "bg-gradient-to-r from-purple-600 to-teal-400 text-white"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {presetName.charAt(0).toUpperCase() + presetName.slice(1)}
            </button>
          ))}
        </div>

        {/* Preview Box */}
        <div className="mt-6 h-32 bg-white/5 rounded-lg overflow-hidden relative">
          <motion.div
            key={selectedPreset}
            initial={{
              opacity: 0,
              x: preset.slideDistance,
              scale: preset.scale.from,
              filter: `blur(${preset.blur.from}px)`,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: preset.scale.to,
              filter: `blur(${preset.blur.to}px)`,
            }}
            transition={{
              duration: preset.duration,
              ease: preset.easing.enter,
            }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-teal-400/20"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {selectedPreset}
              </div>
              <div className="text-xs text-white/60">
                {preset.duration}s • {preset.slideDistance}px
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-4 text-xs text-white/50 text-center">
          Click presets to preview transitions
        </div>
      </motion.div>
    </div>
  );
}
