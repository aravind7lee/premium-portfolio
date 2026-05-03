// src/components/EnhancedProjectCard.jsx
import React, { useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiGithub, FiCode, FiStar, FiCheckSquare, FiSquare } from "react-icons/fi";

const EnhancedProjectCard = memo(function EnhancedProjectCard({
  project, onOpen, compareMode, isCompared, onToggleCompare,
}) {
  const cardRef = useRef(null);
  const rafRef = useRef(null);

  // Pure CSS tilt — zero React state, zero re-renders on mousemove
  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) return; // skip if frame already queued
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = cardRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale(1.02)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    const el = cardRef.current;
    if (el) el.style.transform = "";
  }, []);

  const previewSrc = project.previewGif || project.previewVideo || null;
  const isVideo = previewSrc && (previewSrc.endsWith(".mp4") || previewSrc.endsWith(".webm"));

  return (
    <div
      ref={cardRef}
      className="pcard"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => !compareMode && onOpen(project)}
      onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !compareMode) { e.preventDefault(); onOpen(project); } }}
      tabIndex={0}
      role="button"
      aria-label={`Open ${project.title}`}
    >
      {/* Image area */}
      <div className="pcard-img">
        <img src={project.image} alt={project.title} className="pcard-thumb" loading="lazy" decoding="async" />

        {/* Preview overlay — only rendered when src exists, shown via CSS opacity */}
        {previewSrc && (
          <div className="pcard-preview">
            {isVideo
              ? <video src={previewSrc} autoPlay muted loop playsInline className="pcard-thumb" />
              : <img src={previewSrc} alt="preview" className="pcard-thumb" />
            }
          </div>
        )}

        <div className="pcard-gradient" />

        {project.featured && (
          <div className="pcard-badge">
            <FiStar style={{ width: 10, height: 10 }} /> Featured
          </div>
        )}

        {/* Hover actions — pure CSS opacity */}
        <div className="pcard-actions">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pcard-action-btn pcard-action-live"
              onClick={(e) => e.stopPropagation()}
              title="Live Demo"
            >
              <FiExternalLink style={{ width: 13, height: 13 }} />
            </a>
          )}
          {project.repoUrl && project.repoUrl !== "#" && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pcard-action-btn pcard-action-repo"
              onClick={(e) => e.stopPropagation()}
              title="GitHub"
            >
              <FiGithub style={{ width: 13, height: 13 }} />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pcard-body">
        <h3 className="pcard-title">{project.title}</h3>
        <p className="pcard-summary">{project.summary}</p>

        <div className="pcard-tags">
          {(project.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="pcard-tag">{tag}</span>
          ))}
          {(project.tags || []).length > 3 && (
            <span className="pcard-tag-more">+{project.tags.length - 3}</span>
          )}
        </div>

        {compareMode ? (
          <button
            className={`pcard-btn ${isCompared ? "pcard-btn--selected" : ""}`}
            onClick={(e) => { e.stopPropagation(); onToggleCompare(project); }}
          >
            {isCompared ? <FiCheckSquare style={{ width: 14, height: 14 }} /> : <FiSquare style={{ width: 14, height: 14 }} />}
            {isCompared ? "Selected" : "Select to Compare"}
          </button>
        ) : (
          <button
            className="pcard-btn"
            onClick={(e) => { e.stopPropagation(); onOpen(project); }}
          >
            <FiCode style={{ width: 13, height: 13 }} />
            View Details
          </button>
        )}
      </div>
    </div>
  );
});

export default EnhancedProjectCard;
