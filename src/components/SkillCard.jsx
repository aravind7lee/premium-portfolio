import React from "react";
import { motion } from "framer-motion";
import { SkeletonBase } from "./skeleton";

export default function SkillItem({ skill, index, isLoading = false }) {
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
      className="flex items-center space-x-3 py-2"
    >
      {/* Purple bullet point */}
      <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full flex-shrink-0"></div>

      {/* Skill name only */}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
          {skill.name}
        </h4>
      </div>
    </motion.div>
  );
}
