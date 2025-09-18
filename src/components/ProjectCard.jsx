// src/components/ProjectCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { useRafThrottle } from "../hooks/perf";

export default function ProjectCard({ project, onOpen }) {
  const ref = React.useRef();
  const frameRef = React.useRef(0);
  const lastTargetRef = React.useRef({ rx: 0, ry: 0, shadow: "" });

  // rAF-throttled tilt for 60fps and battery-friendly behavior
  const updateStyle = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { rx, ry, shadow } = lastTargetRef.current;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    el.style.boxShadow = shadow;
    frameRef.current = 0;
  }, []);

  const requestUpdate = useRafThrottle(updateStyle);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;
    const rx = dy * 8;
    const ry = dx * -8;
    lastTargetRef.current = { rx, ry, shadow: "" };
    requestUpdate();
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    el.style.boxShadow = "";
    el.style.willChange = "auto";
  };

  React.useEffect(
    () => () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    },
    []
  );

  const safeTags = project.tags || [];

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={() => onOpen && onOpen(project)}
      onMouseUp={() => onOpen && onOpen(project)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen && onOpen(project);
        }
      }}
      className="tilt-card cursor-pointer rounded-xl p-4 glass focus:outline-none focus:ring-2 focus:ring-offset-2"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      role="button"
      aria-label={`Open project ${project.title}`}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-40 object-cover rounded-md"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <p className="text-sm text-white/70 mt-1">{project.summary}</p>

        <div className="flex gap-2 mt-3 flex-wrap">
          {safeTags.slice(0, 6).map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded bg-white/5">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
