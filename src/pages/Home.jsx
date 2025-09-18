// src/pages/Home.jsx
import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion as Motion } from "framer-motion";
import Hero from "../components/Hero";
import CtaBanner from "../components/CtaBanner";
import projects from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import ParticleBackground from "../components/ParticleBackground"; // should accept `paused` prop

/**
 * Home.jsx — Ultra-Smooth mode ALWAYS ON (no visible toggle)
 *
 * Notes:
 *  - Ultra-smooth mode is enabled by default and cannot be toggled from UI on this page.
 *  - ParticleBackground is paused (paused={true}) to avoid heavy CPU during scroll.
 *  - Keeps prefers-reduced-motion respected: if reduce-motion is requested, animations are minimized.
 *
 * Performance approach summary:
 *  - Keep animations to transform + opacity only.
 *  - Memoize variants so they're stable.
 *  - Use IntersectionObserver with rAF and a small debounce.
 *  - Pause particle background on Home to reduce main-thread work and ensure smooth scroll.
 */

/* ----------------------- Utilities ----------------------- */
function cx(...args) {
  return args.filter(Boolean).join(" ");
}

/* Safe matchMedia wrapper */
function safeMatchMedia(query) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

/* ----------------------- useScrollReveal (optimized) ----------------------- */
/**
 * Custom hook returns [ref, visible]
 * - visible toggles when element enters/exits viewport
 * - uses rAF and a small debounce to avoid floods while scrolling
 */
function useScrollReveal({
  threshold = 0.15,
  root = null,
  rootMargin = "0px 0px -10% 0px",
  once = false,
} = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const rAFRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let mounted = true;

    const observer = new IntersectionObserver(
      (entries) => {
        if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
        rAFRef.current = requestAnimationFrame(() => {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => {
            entries.forEach((entry) => {
              if (!mounted) return;
              if (entry.isIntersecting) {
                setVisible(true);
                if (once) {
                  try {
                    observer.unobserve(entry.target);
                  } catch {}
                }
              } else {
                if (!once) {
                  setVisible(false);
                }
              }
            });
          }, 40);
        });
      },
      { threshold, root, rootMargin }
    );

    observer.observe(node);

    return () => {
      mounted = false;
      try {
        if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        observer.disconnect();
      } catch {}
    };
  }, [threshold, root, rootMargin, once]);

  return [ref, visible];
}

/* ===========================================================
   Variant factory — returns small or normal motion variants
   ultraSmooth = true (always) for this page; reduceMotion respected
   =========================================================== */
function makeVariants({ ultraSmooth = true, reduceMotion = false } = {}) {
  const enabled = !reduceMotion;

  // ultraSmooth smaller travel and slightly faster durations → softer feel
  const distanceFactor = ultraSmooth ? 0.45 : 1;
  const durationFactor = ultraSmooth ? 0.5 : 1;

  const fadeUp = {
    hidden: { opacity: enabled ? 0 : 1, y: enabled ? 40 * distanceFactor : 0, willChange: "transform, opacity" },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: enabled ? 0.6 * durationFactor : 0.01, ease: "easeOut" },
    },
  };

  const fadeIn = {
    hidden: { opacity: enabled ? 0 : 1, willChange: "opacity" },
    visible: { opacity: 1, transition: { duration: enabled ? 0.45 * durationFactor : 0.01, ease: "easeOut" } },
  };

  const slideInRight = {
    hidden: {
      opacity: enabled ? 0 : 1,
      x: enabled ? 60 * distanceFactor : 0,
      willChange: "transform, opacity",
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: enabled ? 0.7 * durationFactor : 0.01, ease: "easeOut" },
    },
  };

  const staggerParent = {
    hidden: {},
    visible: { transition: { staggerChildren: ultraSmooth ? 0.08 : 0.12, delayChildren: ultraSmooth ? 0.04 : 0.06 } },
  };

  const quickFade = {
    hidden: { opacity: enabled ? 0 : 1 },
    visible: { opacity: 1, transition: { duration: enabled ? 0.32 * durationFactor : 0.01, ease: "easeOut" } },
  };

  return { fadeUp, fadeIn, slideInRight, staggerParent, quickFade };
}

/* ===========================================================
   Home Component
   =========================================================== */
export default function Home() {
  const navigate = useNavigate();
  const prefersReduced = usePrefersReducedMotion();

  // Ultra-Smooth forced ON for Home page (no toggle)
  const ultraSmooth = true;

  // Respect system reduced motion preference
  const reduce = !!prefersReduced;

  // memoized variants
  const variants = useMemo(() => makeVariants({ ultraSmooth, reduceMotion: reduce }), [ultraSmooth, reduce]);

  // navigation helper
  const openProjects = () => navigate("/projects");

  // helper for motion state (if reduced motion, always "visible")
  const animState = (visible) => (reduce ? "visible" : visible ? "visible" : "hidden");

  /* -----------------------
     Scroll reveal refs
     ----------------------- */
  const [heroRef, heroVisible] = useScrollReveal({
    threshold: 0.12,
    rootMargin: "0px 0px -18% 0px",
    once: false,
  });
  const [projectsRef, projectsVisible] = useScrollReveal({
    threshold: 0.15,
    rootMargin: "0px 0px -15% 0px",
    once: false,
  });
  const [aboutRef, aboutVisible] = useScrollReveal({
    threshold: 0.15,
    rootMargin: "0px 0px -15% 0px",
    once: false,
  });
  const [timelineRef, timelineVisible] = useScrollReveal({
    threshold: 0.18,
    rootMargin: "0px 0px -10% 0px",
    once: false,
  });
  const [ctaRef, ctaVisible] = useScrollReveal({
    threshold: 0.12,
    rootMargin: "0px 0px -20% 0px",
    once: false,
  });

  /* -----------------------
     Small optimization: prevent heavy paint when resizing
     ----------------------- */
  useEffect(() => {
    let t = null;
    const onResize = () => {
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        // light; avoid heavy reflows here
      }, 120);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      if (t) clearTimeout(t);
    };
  }, []);

  return (
    <>
      {/* ParticleBackground paused to preserve smoothness on desktop */}
      <ParticleBackground paused={true} />

      <Motion.main
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="z-10"
        style={{ willChange: "transform, opacity" }}
      >
        {/* HERO Section */}
        <Motion.section
          id="hero"
          ref={heroRef}
          variants={reduce ? {} : variants.fadeUp}
          initial="hidden"
          animate={animState(heroVisible)}
          className="max-w-6xl mx-auto px-6 mt-6 md:mt-10"
          aria-label="Hero section"
        >
          <div style={{ willChange: "transform, opacity" }}>
            <Hero />
          </div>
        </Motion.section>

        {/* Projects Section */}
        <Motion.section
          ref={projectsRef}
          variants={reduce ? {} : variants.fadeUp}
          initial="hidden"
          animate={animState(projectsVisible)}
          id="projects"
          className="max-w-6xl mx-auto px-6 mt-16 md:mt-20 mb-20"
          aria-label="Featured projects"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Projects</h2>
            <button
              onClick={openProjects}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              See all
            </button>
          </div>

          {/* Staggered children */}
          <Motion.div
            variants={reduce ? {} : variants.staggerParent}
            initial="hidden"
            animate={animState(projectsVisible)}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {projects.slice(0, 3).map((p) => (
              <Motion.div key={p.id} variants={reduce ? {} : variants.fadeUp} style={{ willChange: "transform, opacity" }}>
                <ProjectCard project={p} onOpen={openProjects} />
              </Motion.div>
            ))}
          </Motion.div>
        </Motion.section>

        {/* About Section */}
        <Motion.section
          ref={aboutRef}
          variants={reduce ? {} : variants.fadeUp}
          initial="hidden"
          animate={animState(aboutVisible)}
          className="max-w-6xl mx-auto px-6 my-24"
          aria-label="About me"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* About text */}
            <Motion.div variants={reduce ? {} : variants.fadeUp} style={{ willChange: "transform, opacity" }}>
              <h3 className="text-2xl md:text-3xl mb-6 font-bold bg-clip-text">About Me</h3>
              <p className="mt-3 text-white/80 text-lg leading-relaxed">
                I'm a passionate developer who builds production-ready applications with a focus on exceptional UX, performance,
                and beautiful animations. I prioritize accessible, maintainable code complemented by engaging microinteractions.
              </p>

              <Motion.div
                className="mt-8"
                whileHover={reduce ? {} : { scale: 1.01 }}
                whileTap={reduce ? {} : { scale: 0.98 }}
                style={{ willChange: "transform" }}
              >
                <button
                  onClick={() => navigate("/about")}
                  className="px-6 py-3 rounded-lg glass transition-all duration-300 hover:shadow-lg flex items-center group"
                  aria-label="Learn more about me"
                >
                  Learn more
                  <svg
                    className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Motion.div>
            </Motion.div>

            {/* Education Section (Replacing Timeline) */}
            <Motion.div
              ref={timelineRef}
              variants={reduce ? {} : variants.slideInRight}
              initial="hidden"
              animate={animState(timelineVisible)}
              className="glass rounded-xl p-8 backdrop-blur-lg"
              style={{ willChange: "transform, opacity" }}
            >
              {/* Section Heading */}
              <h4 className="font-bold text-2xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Education</h4>

              {/* Education List */}
              <ul className="space-y-8">
                {/* MCA */}
                <Motion.li variants={reduce ? {} : variants.fadeIn} className="relative pl-8 border-l-2 border-white/20">
                  <div className="absolute -left-2.5 top-1 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-md shadow-blue-500/40"></div>

                  <strong className="block text-lg font-semibold text-white">Master of Computer Application (MCA)</strong>

                  <span className="block text-white/80 italic">SRM Institute of Science and Technology, Chennai</span>

                  <p className="mt-1 text-white/70">2023 – 2025 • <span className="font-medium">CGPA: 9.73</span></p>
                </Motion.li>

                {/* BCA */}
                <Motion.li variants={reduce ? {} : variants.fadeIn} className="relative pl-8 border-l-2 border-white/20">
                  <div className="absolute -left-2.5 top-1 w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-red-500 shadow-md shadow-pink-500/40"></div>

                  <strong className="block text-lg font-semibold text-white">Bachelor of Computer Application (BCA)</strong>

                  <span className="block text-white/80 italic">SRM Institute of Science and Technology, Chennai</span>

                  <p className="mt-1 text-white/70">2020 – 2023 • <span className="font-medium">CGPA: 9.30</span></p>
                </Motion.li>
              </ul>
            </Motion.div>
          </div>
        </Motion.section>

        {/* CTA Section */}
        <Motion.section
          ref={ctaRef}
          variants={reduce ? {} : variants.fadeUp}
          initial="hidden"
          animate={animState(ctaVisible)}
          className="max-w-6xl mx-auto px-6 my-16"
        >
          <CtaBanner />
        </Motion.section>
      </Motion.main>
    </>
  );
}
