// src/pages/Projects.jsx
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import projects from "../data/projects";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import ProjectCard from "../components/ProjectCard";
import SkeletonLoader from "../components/SkeletonLoader";

/**
 * Shared observer registry for reusing IntersectionObservers
 */
const observerRegistry = new Map();

function useScrollReveal({
  threshold = 0.15,
  rootMargin = "0px 0px -80px 0px",
  once = false,
} = {}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  const key = `${Array.isArray(threshold) ? threshold.join(",") : threshold}|${rootMargin}`;

  const unregisterElement = useCallback(
    (el) => {
      if (!el) return;
      const entry = observerRegistry.get(key);
      if (!entry) return;
      try {
        entry.observer.unobserve(el);
      } catch {}
      entry.elements.delete(el);
      if (entry.elements.size === 0) {
        try {
          entry.observer.disconnect();
        } catch {}
        observerRegistry.delete(key);
      }
    },
    [key]
  );

  const refCallback = useCallback(
    (node) => {
      if (prefersReducedMotion) {
        setIsVisible(true);
        if (elementRef.current && elementRef.current !== node) {
          unregisterElement(elementRef.current);
        }
        elementRef.current = node;
        return;
      }

      if (elementRef.current && elementRef.current !== node) {
        unregisterElement(elementRef.current);
        elementRef.current = null;
      }
      if (!node) {
        elementRef.current = null;
        return;
      }

      elementRef.current = node;
      let entry = observerRegistry.get(key);
      if (!entry) {
        const elements = new Map();
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              const target = e.target;
              const reg = observerRegistry.get(key)?.elements.get(target);
              if (!reg) return;
              if (e.isIntersecting) {
                reg.setVisible(true);
                if (reg.once) {
                  try {
                    observer.unobserve(target);
                  } catch {}
                  observerRegistry.get(key)?.elements.delete(target);
                }
              } else if (!reg.once) {
                reg.setVisible(false);
              }
            });
          },
          { threshold, rootMargin }
        );
        entry = { observer, elements };
        observerRegistry.set(key, entry);
      }
      entry.elements.set(node, { setVisible: setIsVisible, once });
      try {
        entry.observer.observe(node);
      } catch {}
    },
    [key, prefersReducedMotion, unregisterElement, threshold, rootMargin, once]
  );

  useEffect(() => {
    return () => {
      if (elementRef.current) unregisterElement(elementRef.current);
    };
  }, [unregisterElement]);

  useEffect(() => {
    if (prefersReducedMotion) setIsVisible(true);
  }, [prefersReducedMotion]);

  return [refCallback, isVisible];
}

/**
 * ScrollReveal Component with Aura++ optimizations
 */
const ScrollReveal = ({
  children,
  className = "",
  variant = "fadeIn",
  delay = 0,
  duration = 500, // shorter for desktop smoothness
  once = false,
  threshold = 0.15,
  rootMargin = "0px 0px -80px 0px",
  ...props
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [ref, isVisible] = useScrollReveal({
    threshold,
    rootMargin,
    once,
  });

  const shouldReveal = prefersReducedMotion ? true : isVisible;
  const sec = (n) => (n / 1000) || 0;

  const variants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: sec(duration), delay: sec(delay), ease: "easeOut" },
      },
    },
    slideUp: {
      hidden: { opacity: 0, y: 12 }, // reduced from 40 → 12
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: sec(duration), delay: sec(delay), ease: "easeOut" },
      },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.97 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: sec(duration), delay: sec(delay), ease: "easeOut" },
      },
    },
  };

  const initialState = prefersReducedMotion ? "visible" : "hidden";
  const animateState = shouldReveal ? "visible" : "hidden";

  return (
    <motion.div
      ref={ref}
      initial={initialState}
      animate={animateState}
      variants={variants[variant] || variants.fadeIn}
      className={className}
      style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default function Projects() {
  const reduce = usePrefersReducedMotion();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastActiveEl = useRef(null);

  const categories = useMemo(() => {
    const base = new Set(["All"]);
    projects.forEach((p) => (p.tags || []).forEach((t) => base.add(t)));
    return Array.from(base);
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((p) => (p.tags || []).includes(activeFilter));
  }, [activeFilter]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (selected) {
      lastActiveEl.current = document.activeElement;
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (closeBtnRef.current) closeBtnRef.current.focus();
        else if (modalRef.current) modalRef.current.focus();
      }, 0);
    } else {
      document.body.style.overflow = "";
      if (lastActiveEl.current && lastActiveEl.current.focus) {
        try {
          lastActiveEl.current.focus();
        } catch {}
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  const open = (project) => setSelected(project);
  const close = () => setSelected(null);

  const openInNewTab = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.main
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24"
      aria-labelledby="projects-heading"
      style={{ scrollBehavior: "smooth", backfaceVisibility: "hidden" }}
    >
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <ScrollReveal variant="slideUp" duration={500} once={false}>
          <header className="mb-6">
            <h1
              id="projects-heading"
              className="text-3xl font-bold text-gray-900 dark:text-white"
            >
              Projects
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
              A curated selection of projects — filter, explore, and open demos or repos.
            </p>
          </header>
        </ScrollReveal>

        {/* Filter Chips */}
        <ScrollReveal variant="slideUp" duration={500} delay={100} once={false}>
          <div className="mb-6">
            <div className="flex gap-3 overflow-x-auto scrollbar-none py-1">
              {categories.map((cat, index) => {
                const active = activeFilter === cat;
                return (
                  <ScrollReveal
                    key={cat}
                    variant="scale"
                    delay={index * 60}
                    duration={400}
                    className="flex-shrink-0"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFilter(cat)}
                      aria-pressed={active}
                      className={`px-3 py-1.5 rounded-full text-sm transition ${
                        active
                          ? "bg-gradient-to-r from-purple-600 to-teal-400 text-black"
                          : "glass"
                      }`}
                    >
                      {cat}
                    </button>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Project Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </div>
        ) : filteredProjects.length === 0 ? (
          <ScrollReveal variant="fadeIn" duration={500}>
            <div className="glass rounded-lg p-6 text-center text-gray-800 dark:text-gray-200">
              No projects found.
            </div>
          </ScrollReveal>
        ) : (
          <div
            id="projects"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {filteredProjects.map((p, index) => (
              <ScrollReveal
                key={p.id}
                variant="slideUp"
                delay={index * 70}
                duration={500}
                className="h-full"
              >
                <ProjectCard project={p} onOpen={open} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Modal */}
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <div
              onClick={close}
              className="absolute inset-0 bg-black/60"
              aria-hidden="true"
            />
            <motion.div
              ref={modalRef}
              tabIndex={-1}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative z-10 w-full h-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-5 sm:p-6 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 shadow-lg"
              style={{ transform: "translateZ(0)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="pr-4 flex-1">
                  <h2 id="project-modal-title" className="text-2xl font-bold">
                    {selected.title}
                  </h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    {selected.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(selected.tags || []).map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    ref={closeBtnRef}
                    onClick={close}
                    className="px-3 py-1.5 rounded-md glass text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="w-full">
                  <img
                    src={selected.image || "/assets/placeholder.png"}
                    alt={`${selected.title} screenshot`}
                    className="w-full rounded-md object-cover h-64"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-800 dark:text-gray-200">
                    {selected.details}
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => openInNewTab(selected.liveUrl)}
                      disabled={!selected.liveUrl}
                      className="px-4 py-3 rounded-md bg-gradient-to-r from-purple-600 to-teal-400 text-black font-semibold shadow-sm disabled:opacity-50"
                    >
                      {selected.liveUrl ? "View Live" : "Live Unavailable"}
                    </button>
                    <button
                      type="button"
                      onClick={() => openInNewTab(selected.repoUrl)}
                      disabled={!selected.repoUrl || selected.repoUrl === "#"}
                      className="px-4 py-3 rounded-md glass disabled:opacity-50"
                    >
                      {selected.repoUrl && selected.repoUrl !== "#"
                        ? "View Repo"
                        : "Repo Unavailable"}
                    </button>
                  </div>
                  <div className="mt-6 text-xs text-gray-600 dark:text-gray-400">
                    Tip: Press <kbd className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700">Esc</kbd> to close.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
