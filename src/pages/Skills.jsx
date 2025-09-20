// Skills.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion as Motion } from "framer-motion"; // kept for lightweight page mount
import skills from "../data/skills";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import SkillItem from "../components/SkillCard";
import { SkeletonCard, useSkeletonAsync } from "../components/skeleton";

/* --------------------
   Config
   -------------------- */
const ULTRA_SMOOTH = true;

/* --------------------
   Helpers
   -------------------- */
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    let raf = null;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener("resize", onResize);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return width;
}

/* --------------------
   Lightweight IntersectionObserver hook.
   returns [ref, isVisible].
   -------------------- */
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const elementRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const elem = elementRef.current;
    if (!elem || prefersReducedMotion) {
      setIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIntersecting(true);
          observer.unobserve(elem);
        }
      },
      {
        threshold: options.threshold ?? 0.12,
        root: options.root ?? null,
        rootMargin: options.rootMargin ?? "0px 0px -8% 0px",
      }
    );

    observer.observe(elem);

    return () => {
      try {
        if (elem) observer.unobserve(elem);
      } catch (e) {
        // ignore if already disconnected
      }
    };
    // intentionally only re-run when prefersReducedMotion changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  return [elementRef, isIntersecting];
};

/* --------------------
   Reveal component
   -------------------- */
const Reveal = ({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.36,
  className = "",
  threshold = 0.12,
  style = {},
  ...props
}) => {
  const [elementRef, isIntersecting] = useIntersectionObserver({ threshold });
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div ref={elementRef} className={className} style={style} {...props}>
        {children}
      </div>
    );
  }

  const transitionStyle = {
    transitionProperty: "transform, opacity",
    transitionTimingFunction: "cubic-bezier(0.22, 0.12, 0.12, 1)",
    transitionDuration: `${duration}s`,
    transitionDelay: `${delay}s`,
    ...style,
  };

  return (
    <div
      ref={elementRef}
      className={`reveal ${isIntersecting ? "is-visible" : ""} ${className}`}
      data-variant={variant}
      style={transitionStyle}
      {...props}
    >
      {children}
    </div>
  );
};

/* --------------------
   StaggerReveal: group-based stagger using transitionDelay
   -------------------- */
const StaggerReveal = ({
  children,
  staggerDelay = 0.06,
  variant = "fade-up",
  duration = 0.36,
  className = "",
  ...props
}) => {
  const [containerRef, containerVisible] = useIntersectionObserver({
    threshold: 0.12,
    rootMargin: "0px 0px -8% 0px",
  });

  // Map children into visible items (ensure we always render children)
  return (
    <div
      ref={containerRef}
      className={`stagger-reveal ${className}`}
      data-visible={containerVisible ? "true" : "false"}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        const delay = index * staggerDelay;
        return (
          <div
            className="stagger-item"
            key={index}
            data-variant={variant}
            style={{
              transitionProperty: "transform, opacity",
              transitionDuration: `${duration}s`,
              transitionTimingFunction: "cubic-bezier(0.22, 0.12, 0.12, 1)",
              transitionDelay: `${delay}s`,
              opacity: containerVisible ? 1 : 0,
              transform: containerVisible
                ? "translate3d(0,0,0)"
                : "translate3d(0,8px,0)",
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

/* --------------------
   The Skills component
   -------------------- */
export default function Skills() {
  const reduce = usePrefersReducedMotion();
  const width = useWindowWidth();
  const isDesktop = width >= 1024;
  const prefersReducedMotion = reduce;

  // Simulate loading skills data
  const {
    data: skillsData,
    isLoading,
    error,
  } = useSkeletonAsync(async () => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return skills;
  });

  useEffect(() => {
    if (ULTRA_SMOOTH) {
      document.documentElement.classList.add("ultra-smooth-enabled");
      if (isDesktop) {
        document.documentElement.classList.add("ultra-smooth-desktop");
      } else {
        document.documentElement.classList.remove("ultra-smooth-desktop");
      }
    } else {
      document.documentElement.classList.remove("ultra-smooth-enabled");
      document.documentElement.classList.remove("ultra-smooth-desktop");
    }
    // keep intentionally minimal
  }, [isDesktop]);

  const initial = prefersReducedMotion ? false : { opacity: 0 };

  // defensive getters with fallback to original data
  const currentSkills = skillsData || skills;
  const frontendSkills = Array.isArray(currentSkills?.frontend)
    ? currentSkills.frontend
    : [];
  const backendSkills = Array.isArray(currentSkills?.backend)
    ? currentSkills.backend
    : [];

  return (
    <>
      <style>{`
        /* Reveal core styles */
        .reveal { opacity: 0; will-change: transform, opacity; transform: translate3d(0, var(--reveal-y, 8px), 0); }
        .reveal[data-variant="fade-up"] { --reveal-y: 8px; }
        .reveal[data-variant="slide-up"] { --reveal-y: 10px; }
        .reveal[data-variant="fade-down"] { transform: translate3d(0, -8px, 0); }
        .reveal[data-variant="fade-left"] { transform: translate3d(6px, 0, 0); }
        .reveal[data-variant="fade-right"] { transform: translate3d(-6px, 0, 0); }
        .reveal[data-variant="scale"] { transform: scale(0.98) translateZ(0); }
        .reveal.is-visible { opacity: 1; transform: translate3d(0,0,0); }

        /* Stagger container + items: ensure children render across browsers */
        .stagger-reveal { display: block; }
        .stagger-reveal .stagger-item { opacity: 0; transform: translate3d(0, 8px, 0); will-change: transform, opacity; }
        .stagger-reveal[data-visible="true"] .stagger-item { opacity: 1; transform: translate3d(0, 0, 0); }

        .reveal, .stagger-item { backface-visibility: hidden; perspective: 1000; }

        /* Ultra-smooth optimizations */
        .ultra-smooth-enabled .ultra-deco { will-change: transform, opacity; pointer-events: none; }
        .ultra-smooth-desktop .ultra-pulse { animation: none !important; opacity: 0.12 !important; }
        .ultra-smooth-desktop .ultra-blur { filter: blur(10px); }
        .ultra-smooth-desktop .card-backdrop { backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
        .ultra-smooth-desktop .card-shadow { box-shadow: 0 6px 18px rgba(0,0,0,0.05); }
        .skill-grid { contain: layout paint; }

        @media (prefers-reduced-motion: reduce) {
          .reveal, .stagger-item { transition: none !important; transform: none !important; opacity: 1 !important; }
        }

        /* small visual helpers for Skill cards */
        .skill-card { transition: transform .22s ease, box-shadow .22s ease; }
        .skill-card:hover { transform: translateY(-4px); }
      `}</style>

      <Motion.main
        initial={initial}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen pt-24 pb-12 relative overflow-hidden"
        aria-labelledby="skills-heading"
      >
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className={`absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full ultra-deco ultra-blur ${
              ULTRA_SMOOTH && isDesktop ? "ultra-pulse" : "animate-pulse-slow"
            }`}
            aria-hidden
          ></div>

          <div
            className={`absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full ultra-deco ultra-blur ${
              ULTRA_SMOOTH && isDesktop
                ? "ultra-pulse delay-1000"
                : "animate-pulse-slow delay-1000"
            }`}
            aria-hidden
          ></div>

          <div
            className={`absolute top-1/2 left-1/4 w-60 h-60 bg-indigo-500/5 rounded-full ultra-deco ultra-blur ${
              ULTRA_SMOOTH && isDesktop
                ? "ultra-pulse delay-2000"
                : "animate-pulse-slow delay-2000"
            }`}
            aria-hidden
          ></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center mb-16">
              <div className="space-y-4">
                <div className="h-12 bg-gray-300 rounded-lg mx-auto w-64 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded-lg mx-auto w-96 animate-pulse"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center mb-16">
              <div className="text-red-400">
                <p>Failed to load skills. Please refresh the page.</p>
              </div>
            </div>
          ) : (
            <Reveal
              variant="fade-down"
              duration={0.44}
              delay={0.08}
              className="text-center mb-16"
            >
              <div>
                <h1
                  id="skills-heading"
                  className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-700 via-purple-500 to-teal-600 bg-clip-text text-transparent relative"
                >
                  <span className="relative inline-block">
                    My Skills
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-teal-400 rounded-full"></span>
                  </span>
                </h1>

                <Reveal variant="fade-up" duration={0.36} delay={0.16}>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Technologies and tools I use to bring ideas to life
                  </p>
                </Reveal>
              </div>
            </Reveal>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto skill-grid mt-8">
              <SkeletonCard
                height="500px"
                showImage={false}
                showText={true}
                showButton={false}
                className="rounded-2xl p-8 border bg-white/80 border-gray-200/70 dark:bg-gray-900/70 dark:border-gray-700/50"
              />
              <SkeletonCard
                height="500px"
                showImage={false}
                showText={true}
                showButton={false}
                className="rounded-2xl p-8 border bg-white/80 border-gray-200/70 dark:bg-gray-900/70 dark:border-gray-700/50"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto skill-grid mt-8">
              {/* Frontend */}
              <Reveal variant="fade-right" duration={0.44} delay={0.12}>
                <div className="rounded-2xl p-8 transition-all duration-300 border bg-white/80 supports-[backdrop-filter]:bg-white/70 border-gray-200/70 shadow-lg relative overflow-hidden dark:bg-gray-900/70 dark:border-gray-700/50 group card-backdrop card-shadow skill-card">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-teal-400"></div>

                  <Reveal variant="fade-down" duration={0.36} delay={0.18}>
                    <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 text-center mb-8 relative">
                      <span className="relative z-10">
                        Frontend Development
                      </span>
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full opacity-70 group-hover:w-32 transition-all duration-500"></span>
                    </h2>
                  </Reveal>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StaggerReveal
                      staggerDelay={0.05}
                      variant="fade-up"
                      duration={0.36}
                    >
                      {frontendSkills.length ? (
                        frontendSkills.map((skill, index) => (
                          <div
                            key={skill.name ?? `frontend-${index}`}
                            className="p-2"
                          >
                            <SkillItem skill={skill} index={index} />
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-sm text-gray-600 dark:text-gray-300">
                          No frontend skills found.
                        </div>
                      )}
                    </StaggerReveal>
                  </div>
                </div>
              </Reveal>

              {/* Backend */}
              <Reveal variant="fade-left" duration={0.44} delay={0.16}>
                <div className="rounded-2xl p-8 transition-all duration-300 border bg-white/80 supports-[backdrop-filter]:bg-white/70 border-gray-200/70 shadow-lg relative overflow-hidden dark:bg-gray-900/70 dark:border-gray-700/50 group card-backdrop card-shadow skill-card">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-purple-400"></div>

                  <Reveal variant="fade-down" duration={0.36} delay={0.2}>
                    <h2 className="text-2xl font-bold text-teal-700 dark:text-teal-300 text-center mb-8 relative">
                      <span className="relative z-10">Backend Development</span>
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full opacity-70 group-hover:w-32 transition-all duration-500"></span>
                    </h2>
                  </Reveal>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StaggerReveal
                      staggerDelay={0.05}
                      variant="fade-up"
                      duration={0.36}
                    >
                      {backendSkills.length ? (
                        backendSkills.map((skill, index) => (
                          <div
                            key={skill.name ?? `backend-${index}`}
                            className="p-2"
                          >
                            <SkillItem skill={skill} index={index} />
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-sm text-gray-600 dark:text-gray-300">
                          No backend skills found.
                        </div>
                      )}
                    </StaggerReveal>
                  </div>
                </div>
              </Reveal>
            </div>
          )}

          {/* Bottom info (unchanged) */}
          <Reveal variant="zoom" duration={0.44} delay={0.5} threshold={0.2}>
            <div className="mt-16 text-center">
              <div className="rounded-2xl p-8 border bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 border-gray-200/70 shadow-lg relative overflow-hidden dark:bg-gray-900/70 dark:border-gray-700/30 group">
                <div className="absolute inset-0 -z-10 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-teal-400/10"></div>
                </div>

                <Reveal variant="fade-down" duration={0.36} delay={0.58}>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Continuous Learning & Growth
                  </h3>
                </Reveal>

                <Reveal variant="fade-up" duration={0.36} delay={0.66}>
                  <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    I'm passionate about staying up-to-date with the latest
                    technologies and best practices. These skills represent my
                    current expertise, but I'm always expanding my knowledge
                    through new projects, courses, and hands-on experience.
                  </p>
                </Reveal>

                <Reveal variant="fade-up" duration={0.36} delay={0.76}>
                  <div className="mt-6 flex justify-center">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500/10 to-teal-400/10 text-purple-700 dark:text-teal-300 border border-purple-500/20 dark:border-teal-400/20">
                      <span className="relative flex h-3 w-3 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                      </span>
                      Always learning new technologies
                    </span>
                  </div>
                </Reveal>
              </div>
            </div>
          </Reveal>

          <div
            className="absolute left-[10%] top-[30%] -translate-y-1/2 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl -z-10 ultra-deco ultra-blur"
            aria-hidden
          ></div>
          <div
            className="absolute right-[15%] bottom-[20%] translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -z-10 ultra-deco ultra-blur"
            aria-hidden
          ></div>
        </div>
      </Motion.main>
    </>
  );
}
