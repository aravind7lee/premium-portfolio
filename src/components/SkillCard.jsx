import React from "react";
import { motion } from "framer-motion";

export default function SkillItem({ skill, index }) {
  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case "Advanced":
        return "text-green-600 dark:text-green-400";
      case "Intermediate":
        return "text-amber-600 dark:text-yellow-400";
      case "Beginner":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

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

      {/* Skill name and proficiency */}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
          {skill.name}
        </h4>
        <p
          className={`text-xs font-medium ${getProficiencyColor(
            skill.proficiency
          )}`}
        >
          {skill.proficiency}
        </p>
      </div>
    </motion.div>
  );
}
