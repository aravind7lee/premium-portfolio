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
 * Shared observer registry for reusing IntersectionObservers (performance)
 * Key is a string computed from threshold + rootMargin so elements with the
 * same intersection options share a single observer.
 *
 * Structure:
 *   observerRegistry.get(key) => { observer, elements: Map<element, { setVisible, once }> }
 */
const observerRegistry = new Map();

/**
 * Hook: useScrollReveal
 *
 * Returns [refCallback, isVisible]
 * - refCallback should be passed to the element's `ref` prop (works with callback ref).
 * - isVisible toggles true/false as element enters/exits viewport (unless prefers-reduced-motion).
 *
 * Options:
 *  - threshold (number|array) default 0.1
 *  - rootMargin (string) default "0px 0px -50px 0px"
 *  - once (boolean) default false  -> replay by default; if true the element is unobserved after first reveal
 */
function useScrollReveal({
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
  once = false,
} = {}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  // Hold the current element so we can cleanup on unmount or ref change
  const elementRef = useRef(null);

  // Helper to compute registry key
  const key = `${Array.isArray(threshold) ? threshold.join(",") : threshold}|${rootMargin}`;

  const unregisterElement = useCallback(
    (el) => {
      if (!el) return;
      const entry = observerRegistry.get(key);
      if (!entry) return;
      try {
        entry.observer.unobserve(el);
      } catch (e) {
        // ignore if already unobserved
      }
      entry.elements.delete(el);

      // If no elements left for this observer, disconnect and remove registry
      if (entry.elements.size === 0) {
        try {
          entry.observer.disconnect();
        } catch (e) {}
        observerRegistry.delete(key);
      }
    },
    [key]
  );

  const refCallback = useCallback(
    (node) => {
      // If reduced motion, we do not observe — immediately show.
      if (prefersReducedMotion) {
        setIsVisible(true);
        // Clean up any previous registrations
        if (elementRef.current && elementRef.current !== node) {
          unregisterElement(elementRef.current);
        }
        elementRef.current = node;
        return;
      }

      // If element changed, unregister previous one
      if (elementRef.current && elementRef.current !== node) {
        unregisterElement(elementRef.current);
        elementRef.current = null;
      }

      // If node is null (unmount), just clear
      if (!node) {
        elementRef.current = null;
        return;
      }

      elementRef.current = node;

      // Ensure registry entry exists for this observer options
      let entry = observerRegistry.get(key);
      if (!entry) {
        // Create new observer and element map for this key
        const elements = new Map();
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              const target = e.target;
              const reg = observerRegistry.get(key)?.elements.get(target);
              if (!reg) return;
              // If intersecting -> reveal
              if (e.isIntersecting) {
                try {
                  reg.setVisible(true);
                } catch (err) {}
                // If once is true for this element, unobserve and remove its registration
                if (reg.once) {
                  try {
                    observer.unobserve(target);
                  } catch (err) {}
                  observerRegistry.get(key)?.elements.delete(target);
                }
              } else {
                // Not intersecting -> hide again, only if once === false
                if (!reg.once) {
                  try {
                    reg.setVisible(false);
                  } catch (err) {}
                }
              }
            });
          },
          { threshold, rootMargin }
        );

        entry = { observer, elements };
        observerRegistry.set(key, entry);
      }

      // Register this element
      entry.elements.set(node, { setVisible: setIsVisible, once });
      try {
        entry.observer.observe(node);
      } catch (e) {
        // ignore observer errors
      }
    },
    [key, prefersReducedMotion, unregisterElement, threshold, rootMargin, once]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (elementRef.current) {
        unregisterElement(elementRef.current);
      }
    };
  }, [unregisterElement]);

  // If user prefers reduced motion, ensure visible
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
    }
  }, [prefersReducedMotion]);

  return [refCallback, isVisible];
}

/**
 * ScrollReveal component
 *
 * Props:
 *  - children
 *  - className
 *  - variant ("fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scale")
 *  - delay (ms)
 *  - duration (ms)
 *  - once (boolean): if true reveal only once; default false (replay on enter)
 *  - other props spread to motion.div
 */
const ScrollReveal = ({
  children,
  className = "",
  variant = "fadeIn",
  delay = 0,
  duration = 700,
  once = false, // default replay behavior (false)
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
  ...props
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [ref, isVisible] = useScrollReveal({
    threshold,
    rootMargin,
    once,
  });

  const shouldReveal = prefersReducedMotion ? true : isVisible;

  // convert ms -> seconds for framer motion
  const sec = (n) => (n / 1000) || 0;

  const variants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: sec(duration), delay: sec(delay) } },
    },
    slideUp: {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: sec(duration), delay: sec(delay) } },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 40 },
      visible: { opacity: 1, x: 0, transition: { duration: sec(duration), delay: sec(delay) } },
    },
    slideRight: {
      hidden: { opacity: 0, x: -40 },
      visible: { opacity: 1, x: 0, transition: { duration: sec(duration), delay: sec(delay) } },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: sec(duration), delay: sec(delay) } },
    },
  };

  // If user prefers reduced motion, start visible and no animation jank
  const initialState = prefersReducedMotion ? "visible" : "hidden";
  const animateState = shouldReveal ? "visible" : "hidden";

  return (
    <motion.div
      ref={ref}
      initial={initialState}
      animate={animateState}
      variants={variants[variant] || variants.fadeIn}
      className={className}
      // for better GPU compositing and smoother transitions
      style={{ willChange: "transform, opacity" }}
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

  const open = (project) => {
    if (!project) return;
    setSelected(project);
  };

  const close = () => {
    setSelected(null);
  };

  const openInNewTab = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.main
      initial={reduce ? false : { x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}
      className="min-h-screen pt-24"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <ScrollReveal variant="slideUp" duration={800} once={false}>
          <header className="mb-6">
            <h1 id="projects-heading" className="text-3xl font-bold text-gray-900 dark:text-white">
              Projects
            </h1>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
              A curated selection of projects — filter, explore, and open demos or repos.
            </p>
          </header>
        </ScrollReveal>

        <ScrollReveal variant="slideUp" duration={800} delay={100} once={false}>
          <div className="mb-6">
            <div className="flex gap-3 overflow-x-auto scrollbar-none py-1">
              {categories.map((cat, index) => {
                const active = activeFilter === cat;
                return (
                  <ScrollReveal
                    key={cat}
                    variant="scale"
                    delay={index * 80}
                    duration={600}
                    className="flex-shrink-0"
                    once={false} // category chips should replay too if desired
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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </div>
        ) : filteredProjects.length === 0 ? (
          <ScrollReveal variant="fadeIn" duration={800} once={false}>
            <div className="glass rounded-lg p-6 text-center text-gray-800 dark:text-gray-200">
              No projects found.
            </div>
          </ScrollReveal>
        ) : (
          <div id="projects" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProjects.map((p, index) => (
              <ScrollReveal
                key={p.id}
                variant="slideUp"
                delay={index * 100}
                duration={800}
                className="h-full"
                once={false} // replay each time it re-enters viewport
              >
                <ProjectCard project={p} onOpen={open} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
          >
            <div
              onClick={close}
              className="absolute inset-0 bg-black/60"
              aria-hidden="true"
            />

            <motion.div
              ref={modalRef}
              tabIndex={-1}
              initial={{ scale: 0.98, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 12 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative z-10 w-full h-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-5 sm:p-6
                         bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 shadow-lg"
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
                    aria-label="Close project details"
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
                  <p className="text-gray-800 dark:text-gray-200">{selected.details}</p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => openInNewTab(selected.liveUrl)}
                      disabled={!selected.liveUrl}
                      className="px-4 py-3 rounded-md bg-gradient-to-r from-purple-600 to-teal-400 text-black font-semibold shadow-sm disabled:opacity-50"
                      aria-label={`Open ${selected.title} in a new tab`}
                    >
                      {selected.liveUrl ? "View Live" : "Live Unavailable"}
                    </button>

                    <button
                      type="button"
                      onClick={() => openInNewTab(selected.repoUrl)}
                      disabled={!selected.repoUrl || selected.repoUrl === "#"}
                      className="px-4 py-3 rounded-md glass disabled:opacity-50"
                      aria-label={`Open ${selected.title} repository`}
                    >
                      {selected.repoUrl && selected.repoUrl !== "#"
                        ? "View Repo"
                        : "Repo Unavailable"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        close();
                        const elem = document.getElementById("projects");
                        if (elem) elem.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-4 py-3 rounded-md glass text-sm"
                    >
                      Back to projects
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
