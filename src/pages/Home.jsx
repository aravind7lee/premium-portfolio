// src/pages/Home.jsx
import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion as Motion } from "framer-motion";
import Hero from "../components/Hero";
import CtaBanner from "../components/CtaBanner";
import projects from "../data/projects";
import ProjectCard from "../components/EnhancedProjectCard";
import { useNavigate } from "react-router-dom";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import ParticleBackground from "../components/ParticleBackground"; // should accept `paused` prop
import { SkeletonHero, SkeletonProjectCard, SkeletonText, SkeletonButton, SkeletonCard, useSkeletonAsync } from "../components/skeleton";

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

  // Skeleton loading for Hero section
  const {
    data: heroData,
    isLoading: heroLoading,
    error: heroError,
  } = useSkeletonAsync(async () => {
    // Simulate loading hero data - optimized 1.5 second loading time
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      loaded: true,
    };
  });

  // Skeleton loading for featured projects
  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
  } = useSkeletonAsync(async () => {
    // Simulate loading projects data - increased time to make skeleton visible
    await new Promise((resolve) => setTimeout(resolve, 3500));
    return projects.slice(0, 3);
  });

  // Skeleton loading for About section
  const {
    data: aboutData,
    isLoading: aboutLoading,
    error: aboutError,
  } = useSkeletonAsync(async () => {
    // Simulate loading about data - reduced to 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      loaded: true,
    };
  });

  // Skeleton loading for CTA section
  const {
    data: ctaData,
    isLoading: ctaLoading,
    error: ctaError,
  } = useSkeletonAsync(async () => {
    // Simulate loading CTA data
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      loaded: true,
    };
  });

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
  const [aboutTextRef, aboutTextVisible] = useScrollReveal({
    threshold: 0.3,
    rootMargin: "0px 0px -10% 0px",
    once: false,
  });
  const [educationRef, educationVisible] = useScrollReveal({
    threshold: 0.3,
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
            {heroLoading ? (
              <SkeletonHero className="min-h-[70vh] md:min-h-[85vh] flex items-center" />
            ) : heroError ? (
              <div className="min-h-[70vh] md:min-h-[85vh] flex items-center justify-center text-red-400">
                Failed to load hero section. Please refresh the page.
              </div>
            ) : (
              <Hero />
            )}
          </div>
        </Motion.section>

        {/* Projects Section */}
        <Motion.section
          ref={projectsRef}
          variants={reduce ? {} : variants.fadeUp}
          initial="hidden"
          animate={animState(projectsVisible)}
          id="projects"
          className="max-w-6xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16 md:mt-20 mb-16 sm:mb-20"
          aria-label="Featured projects"
        >
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Featured Projects</h2>
            <button
              onClick={openProjects}
              className="text-sm text-white/70 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-white/5"
            >
              See all
            </button>
          </div>

          {/* Staggered children */}
          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }, (_, i) => (
                <SkeletonProjectCard key={i} />
              ))}
            </div>
          ) : projectsError ? (
            <div className="glass rounded-lg p-6 text-center text-red-400">
              Failed to load projects. Please refresh the page.
            </div>
          ) : (
            <Motion.div
              variants={reduce ? {} : variants.staggerParent}
              initial="hidden"
              animate={animState(projectsVisible)}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {(projectsData || projects.slice(0, 3)).map((p, index) => (
                <Motion.div key={p.id} variants={reduce ? {} : variants.fadeUp} style={{ willChange: "transform, opacity" }}>
                  <ProjectCard project={{ ...p, featured: index === 0 }} onOpen={openProjects} />
                </Motion.div>
              ))}
            </Motion.div>
          )}
        </Motion.section>

        {/* About Section */}
        <Motion.section
          ref={aboutRef}
          variants={reduce ? {} : variants.fadeUp}
          initial="hidden"
          animate={animState(aboutVisible)}
          className="max-w-6xl mx-auto px-4 sm:px-6 my-16 sm:my-20 md:my-24"
          aria-label="About me"
        >
          {aboutLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* About text skeleton */}
              <div className="space-y-6">
                <SkeletonText lines={1} lineHeight="2.5rem" className="mb-6" />
                <SkeletonText lines={4} lineHeight="1.5rem" />
                <div className="mt-8">
                  <SkeletonButton width="150px" height="3rem" />
                </div>
              </div>
              {/* Education skeleton */}
              <SkeletonCard 
                height="400px" 
                className="glass rounded-xl backdrop-blur-lg" 
                showImage={false} 
                showText={true} 
                showButton={false} 
              />
            </div>
          ) : aboutError ? (
            <div className="glass rounded-lg p-6 text-center text-red-400">
              Failed to load about section. Please refresh the page.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* About text */}
              <Motion.div 
                ref={aboutTextRef}
                variants={reduce ? {} : variants.fadeUp}
                initial={reduce ? "visible" : "hidden"}
                animate={reduce ? "visible" : aboutTextVisible ? "visible" : "visible"}
                className="order-1 lg:order-1"
                style={{ willChange: "transform, opacity" }}
              >
                <h3 className="text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-6 font-bold text-white leading-tight">
                  About Me
                </h3>
                <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                  I'm a passionate developer who builds production-ready applications with a focus on exceptional UX, performance,
                  and beautiful animations. I prioritize accessible, maintainable code complemented by engaging microinteractions.
                </p>

                <Motion.div
                  className="inline-block"
                  whileHover={reduce ? {} : { scale: 1.02 }}
                  whileTap={reduce ? {} : { scale: 0.98 }}
                  style={{ willChange: "transform" }}
                >
                  <button
                    onClick={() => navigate("/about")}
                    className="inline-flex items-center px-6 py-3 rounded-xl glass transition-all duration-300 hover:shadow-lg group text-white font-medium"
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

              {/* Education Section */}
              <Motion.div
                ref={educationRef}
                variants={reduce ? {} : variants.slideInRight}
                initial={reduce ? "visible" : "hidden"}
                animate={reduce ? "visible" : educationVisible ? "visible" : "visible"}
                className="order-2 lg:order-2 glass rounded-2xl p-6 sm:p-8 backdrop-blur-lg"
                style={{ willChange: "transform, opacity" }}
              >
                {/* Section Heading */}
                <h4 className="font-bold text-xl sm:text-2xl mb-6 text-white flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm">🎓</span>
                  Education
                </h4>

                {/* Education List */}
                <Motion.div 
                  variants={reduce ? {} : variants.staggerParent}
                  initial={reduce ? "visible" : "hidden"}
                  animate={reduce ? "visible" : educationVisible ? "visible" : "visible"}
                  className="space-y-6"
                >
                  {/* MCA */}
                  <Motion.div 
                    variants={reduce ? {} : variants.fadeIn} 
                    className="relative pl-6 border-l-2 border-blue-500/30"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <div className="absolute -left-2.5 top-1 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/40"></div>

                    <div className="space-y-1">
                      <h5 className="text-base sm:text-lg font-semibold text-white leading-tight">
                        Master of Computer Application (MCA)
                      </h5>
                      <p className="text-white/70 text-sm sm:text-base italic">
                        SRM Institute of Science and Technology, Chennai
                      </p>
                      <p className="text-white/60 text-sm flex flex-wrap items-center gap-2">
                        <span>2023 – 2025</span>
                        <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                        <span className="font-medium text-green-400">CGPA: 9.73</span>
                      </p>
                    </div>
                  </Motion.div>

                  {/* BCA */}
                  <Motion.div 
                    variants={reduce ? {} : variants.fadeIn} 
                    className="relative pl-6 border-l-2 border-pink-500/30"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <div className="absolute -left-2.5 top-1 w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-red-500 shadow-lg shadow-pink-500/40"></div>

                    <div className="space-y-1">
                      <h5 className="text-base sm:text-lg font-semibold text-white leading-tight">
                        Bachelor of Computer Application (BCA)
                      </h5>
                      <p className="text-white/70 text-sm sm:text-base italic">
                        SRM Institute of Science and Technology, Chennai
                      </p>
                      <p className="text-white/60 text-sm flex flex-wrap items-center gap-2">
                        <span>2020 – 2023</span>
                        <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                        <span className="font-medium text-green-400">CGPA: 9.30</span>
                      </p>
                    </div>
                  </Motion.div>
                </Motion.div>
              </Motion.div>
            </div>
          )}
        </Motion.section>

        {/* CTA Section */}
        <Motion.section
          ref={ctaRef}
          variants={reduce ? {} : variants.fadeUp}
          initial="hidden"
          animate={animState(ctaVisible)}
          className="max-w-6xl mx-auto px-4 sm:px-6 my-12 sm:my-16 md:my-20"
        >
          {ctaLoading ? (
            <SkeletonCard 
              height="200px" 
              className="glass rounded-xl backdrop-blur-lg" 
              showImage={false} 
              showText={true} 
              showButton={true} 
            />
          ) : ctaError ? (
            <div className="glass rounded-lg p-6 text-center text-red-400">
              Failed to load CTA section. Please refresh the page.
            </div>
          ) : (
            <CtaBanner />
          )}
        </Motion.section>
      </Motion.main>
    </>
  );
}