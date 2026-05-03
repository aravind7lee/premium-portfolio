// src/pages/Projects.jsx
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import projects from "../data/projects";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import ProjectCard from "../components/EnhancedProjectCard";
import { SkeletonProjectCard, useSkeletonAsync } from "../components/skeleton";
import StickyHeader from "../components/StickyHeader";
import { FiFolder, FiGrid, FiColumns, FiLayers, FiX, FiExternalLink, FiGithub } from "react-icons/fi";
import ErrorState from "../components/ErrorState";
import { WordReveal, GradientTextWave } from "../components/TypographyAnimations";

/* ─── Comparison Panel ─────────────────────────────────────────────────────── */
function ComparisonPanel({ items, onClose, onRemove }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const a = items[0];
  const b = items[1];

  if (!a || !b) return null;

  const allTags = [...new Set([...(a.tags || []), ...(b.tags || [])])];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10"
        style={{ background: "linear-gradient(135deg, rgba(10,10,20,0.97), rgba(15,15,30,0.97))" }}
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-600/20 border border-purple-400/30">
              <FiLayers className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Project Comparison</h2>
              <p className="text-xs text-white/50">Side-by-side analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all text-white/60 hover:text-white"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Project headers */}
        <div className="grid grid-cols-2 gap-px bg-white/5 border-b border-white/10">
          {[a, b].map((proj, i) => (
            <div key={proj.id} className="p-5 bg-black/20 relative">
              <button
                onClick={() => onRemove(proj)}
                className="absolute top-3 right-3 p-1 rounded text-white/30 hover:text-white/70 transition-colors"
              >
                <FiX className="w-3 h-3" />
              </button>
              <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 text-xs font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded">
                  {i === 0 ? "Project A" : "Project B"}
                </div>
              </div>
              <h3 className="text-sm font-bold text-white leading-snug">{proj.title}</h3>
              <p className="text-xs text-white/55 mt-1 line-clamp-2">{proj.summary}</p>
              <div className="flex gap-2 mt-3">
                {proj.liveUrl && (
                  <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600/30 border border-purple-400/30 text-purple-300 text-xs hover:bg-purple-600/50 transition-colors">
                    <FiExternalLink className="w-3 h-3" /> Live
                  </a>
                )}
                {proj.repoUrl && proj.repoUrl !== "#" && (
                  <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/15 text-white/60 text-xs hover:bg-white/10 transition-colors">
                    <FiGithub className="w-3 h-3" /> Repo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison rows */}
        <div className="p-5 space-y-0">
          {/* Tech Stack */}
          <CompareRow label="Tech Stack">
            {[a, b].map((proj) => (
              <div key={proj.id} className="flex flex-wrap gap-1.5">
                {(proj.tags || []).map((tag) => {
                  const inBoth = (a.tags || []).includes(tag) && (b.tags || []).includes(tag);
                  return (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 text-xs rounded-md border transition-all ${
                        inBoth
                          ? "bg-teal-500/20 border-teal-400/40 text-teal-300"
                          : "bg-white/5 border-white/10 text-white/60"
                      }`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            ))}
          </CompareRow>

          {/* Shared tags */}
          <CompareRow label="Shared Technologies">
            <div className="col-span-2 flex flex-wrap gap-1.5">
              {allTags
                .filter((t) => (a.tags || []).includes(t) && (b.tags || []).includes(t))
                .map((tag) => (
                  <span key={tag} className="px-2.5 py-1 text-xs rounded-md bg-teal-500/20 border border-teal-400/40 text-teal-300">
                    ✓ {tag}
                  </span>
                ))}
              {allTags.filter((t) => (a.tags || []).includes(t) && (b.tags || []).includes(t)).length === 0 && (
                <span className="text-xs text-white/40">No shared technologies</span>
              )}
            </div>
          </CompareRow>

          {/* Description */}
          <CompareRow label="Description">
            {[a, b].map((proj) => (
              <p key={proj.id} className="text-xs text-white/60 leading-relaxed">{proj.details || proj.summary}</p>
            ))}
          </CompareRow>
        </div>

        <div className="p-5 pt-0 text-center">
          <p className="text-xs text-white/30">
            <span className="text-teal-400">Teal</span> = shared technologies between both projects
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CompareRow({ label, children }) {
  const childArray = React.Children.toArray(children);
  const isSingle = childArray.length === 1 && React.isValidElement(children) && children.props.className?.includes("col-span-2");

  return (
    <div className="border-b border-white/5 py-4">
      <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">{label}</p>
      {isSingle ? (
        <div>{children}</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">{children}</div>
      )}
    </div>
  );
}

/* ─── Project Detail Modal ─────────────────────────────────────────────────── */
function ProjectModal({ project, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setTimeout(() => closeBtnRef.current?.focus(), 50);
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl"
        style={{ background: "linear-gradient(135deg, rgba(10,10,20,0.98), rgba(15,15,30,0.98))" }}
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
      >
        {/* Hero image */}
        <div className="relative h-56 overflow-hidden rounded-t-2xl">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
          >
            <FiX className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-5 right-16">
            <h2 className="text-xl font-bold text-white leading-tight">
              <GradientTextWave text={project.title} colors={["#8B5CF6", "#EC4899", "#06B6D4"]} />
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-sm text-white/70 leading-relaxed">{project.summary}</p>

          <div className="flex flex-wrap gap-2">
            {(project.tags || []).map((t) => (
              <span key={t} className="px-2.5 py-1 text-xs rounded-lg bg-purple-600/15 border border-purple-400/25 text-purple-300">
                {t}
              </span>
            ))}
          </div>

          <div className="h-px bg-white/5" />

          <p className="text-sm text-white/60 leading-relaxed">{project.details}</p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                project.liveUrl
                  ? "bg-gradient-to-r from-purple-600 to-teal-500 text-white hover:opacity-90"
                  : "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed pointer-events-none"
              }`}
              whileHover={project.liveUrl ? { scale: 1.02 } : {}}
              whileTap={project.liveUrl ? { scale: 0.98 } : {}}
            >
              <FiExternalLink className="w-4 h-4" />
              {project.liveUrl ? "View Live Demo" : "Live Unavailable"}
            </motion.a>
            <motion.a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border transition-all ${
                project.repoUrl && project.repoUrl !== "#"
                  ? "border-white/20 text-white/80 hover:border-white/40 hover:bg-white/5"
                  : "border-white/10 text-white/30 cursor-not-allowed pointer-events-none"
              }`}
              whileHover={project.repoUrl && project.repoUrl !== "#" ? { scale: 1.02 } : {}}
              whileTap={project.repoUrl && project.repoUrl !== "#" ? { scale: 0.98 } : {}}
            >
              <FiGithub className="w-4 h-4" />
              {project.repoUrl && project.repoUrl !== "#" ? "View Repository" : "Repo Private"}
            </motion.a>
          </div>

          <p className="text-center text-xs text-white/25">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/40">Esc</kbd> to close
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Projects Page ───────────────────────────────────────────────────── */
export default function Projects() {
  const reduce = usePrefersReducedMotion();
  const [selected, setSelected] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [layout, setLayout] = useState("grid"); // "grid" | "masonry"
  const [compareMode, setCompareMode] = useState(false);
  const [compareItems, setCompareItems] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const { data: projectsData, isLoading, error } = useSkeletonAsync(async () => {
    await new Promise((r) => setTimeout(r, 900));
    return projects;
  }, [retryCount]);

  const categories = useMemo(() => {
    const base = new Set(["All"]);
    (projectsData || projects).forEach((p) => (p.tags || []).forEach((t) => base.add(t)));
    return Array.from(base);
  }, [projectsData]);

  const filteredProjects = useMemo(() => {
    const data = projectsData || projects;
    if (activeFilter === "All") return data;
    return data.filter((p) => (p.tags || []).includes(activeFilter));
  }, [activeFilter, projectsData]);

  const handleToggleCompare = useCallback((project) => {
    setCompareItems((prev) => {
      const exists = prev.find((p) => p.id === project.id);
      if (exists) return prev.filter((p) => p.id !== project.id);
      if (prev.length >= 2) return [prev[1], project];
      return [...prev, project];
    });
  }, []);

  const handleExitCompare = useCallback(() => {
    setCompareMode(false);
    setCompareItems([]);
    setShowComparison(false);
  }, []);

  return (
    <motion.main
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <StickyHeader title="Projects" icon={FiFolder} sectionId="projects-section" className="mb-8" />

        <div id="projects-section">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <WordReveal
              text="A curated selection of projects — filter, explore, and compare side-by-side."
              delay={0.2}
              staggerDelay={0.04}
              className="mt-2 mb-6 text-sm text-gray-600 dark:text-gray-300 max-w-2xl"
            />
          </motion.div>

          {/* ── Toolbar ── */}
          <motion.div
            className="flex flex-wrap items-center justify-between gap-4 mb-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {/* Filter chips */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none py-1 flex-1 min-w-0">
              <LayoutGroup id="filter-chips">
                {categories.map((cat) => {
                  const active = activeFilter === cat;
                  return (
                    <motion.button
                      key={cat}
                      layout
                      type="button"
                      onClick={() => setActiveFilter(cat)}
                      aria-pressed={active}
                      className="relative flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 focus:outline-none"
                      style={{
                        color: active ? "#fff" : "rgba(var(--color-text-rgb), 0.65)",
                        background: active ? "transparent" : "rgba(var(--color-text-rgb), 0.05)",
                        border: active ? "none" : "1px solid rgba(var(--color-text-rgb), 0.1)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {active && (
                        <motion.span
                          layoutId="filter-pill"
                          className="absolute inset-0 rounded-full"
                          style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{cat}</span>
                    </motion.button>
                  );
                })}
              </LayoutGroup>
            </div>

            {/* View controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Layout toggle */}
              <div className="flex rounded-lg border border-white/10 overflow-hidden">
                {[
                  { id: "grid", icon: FiGrid, label: "Grid" },
                  { id: "masonry", icon: FiColumns, label: "Masonry" },
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setLayout(id)}
                    title={label}
                    className={`p-2 transition-all duration-200 ${
                      layout === id
                        ? "bg-purple-600/40 text-purple-300"
                        : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>

              {/* Compare toggle */}
              <motion.button
                onClick={() => {
                  if (compareMode) {
                    handleExitCompare();
                  } else {
                    setCompareMode(true);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  compareMode
                    ? "bg-purple-600/40 border-purple-400/50 text-purple-300"
                    : "border-white/10 text-white/50 hover:border-purple-400/40 hover:text-purple-300 hover:bg-purple-600/10"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <FiLayers className="w-3.5 h-3.5" />
                {compareMode ? "Exit Compare" : "Compare"}
              </motion.button>
            </div>
          </motion.div>

          {/* Compare mode banner */}
          <AnimatePresence>
            {compareMode && (
              <motion.div
                className="mb-5 p-3.5 rounded-xl border border-purple-400/30 bg-purple-600/10 flex items-center justify-between gap-4"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              >
                <div className="flex items-center gap-3">
                  <FiLayers className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-purple-300">Compare Mode Active</p>
                    <p className="text-xs text-purple-400/70">
                      {compareItems.length === 0 && "Select 2 projects to compare"}
                      {compareItems.length === 1 && `"${compareItems[0].title.split("—")[0].trim()}" selected — pick one more`}
                      {compareItems.length === 2 && `"${compareItems[0].title.split("—")[0].trim()}" vs "${compareItems[1].title.split("—")[0].trim()}"`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {compareItems.length === 2 && (
                    <motion.button
                      onClick={() => setShowComparison(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition-colors"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Compare Now →
                    </motion.button>
                  )}
                  <button onClick={handleExitCompare} className="p-1.5 rounded-lg text-purple-400/60 hover:text-purple-300 transition-colors">
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Project Grid / Masonry ── */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => <SkeletonProjectCard key={i} />)}
            </div>
          ) : error ? (
            <ErrorState
              title="Failed to load projects"
              message="We couldn't load the projects. Please check your connection and try again."
              onRetry={() => setRetryCount((c) => c + 1)}
            />
          ) : filteredProjects.length === 0 ? (
            <motion.div
              className="rounded-xl border border-white/10 p-10 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-white/50 text-sm">No projects match this filter.</p>
            </motion.div>
          ) : layout === "masonry" ? (
            <MasonryGrid
              projects={filteredProjects}
              compareMode={compareMode}
              compareItems={compareItems}
              onOpen={setSelected}
              onToggleCompare={handleToggleCompare}
              reduce={reduce}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredProjects.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, delay: i * 0.03 }}
                  >
                    <ProjectCard
                      project={{ ...p, featured: p.id === "resuflow" || p.id === "grindx" }}
                      onOpen={setSelected}
                      compareMode={compareMode}
                      isCompared={compareItems.some((c) => c.id === p.id)}
                      onToggleCompare={handleToggleCompare}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {selected && !compareMode && (
          <ProjectModal key="modal" project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComparison && compareItems.length === 2 && (
          <ComparisonPanel
            key="compare"
            items={compareItems}
            onClose={() => setShowComparison(false)}
            onRemove={(proj) => {
              setCompareItems((prev) => prev.filter((p) => p.id !== proj.id));
              setShowComparison(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.main>
  );
}

/* ─── Masonry Grid ─────────────────────────────────────────────────────────── */
function MasonryGrid({ projects, compareMode, compareItems, onOpen, onToggleCompare, reduce }) {
  // Split into 3 columns for masonry
  const cols = useMemo(() => {
    const c = [[], [], []];
    projects.forEach((p, i) => c[i % 3].push(p));
    return c;
  }, [projects]);

  return (
    <div className="masonry-grid">
      {cols.map((col, ci) => (
        <div key={ci} className="masonry-col">
          <AnimatePresence mode="popLayout">
            {col.map((p, i) => (
              <motion.div
                key={p.id}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: (ci * 0.06) + (i * 0.05) }}
                className="masonry-item"
              >
                <ProjectCard
                  project={{ ...p, featured: p.id === "resuflow" || p.id === "grindx" }}
                  onOpen={onOpen}
                  compareMode={compareMode}
                  isCompared={compareItems.some((c) => c.id === p.id)}
                  onToggleCompare={onToggleCompare}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
