// Skills.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion as Motion } from "framer-motion";
import skills from "../data/skills";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import SkillItem from "../components/SkillCard";
import { SkeletonCard, useSkeletonAsync } from "../components/skeleton";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { revealVariants, staggerContainer, staggerItem, headingVariant } from "../utils/revealVariants";
import StickyHeader from "../components/StickyHeader";
import { FiCode } from "react-icons/fi";
import { WordReveal, LetterStagger, GradientTextWave } from "../components/TypographyAnimations";

/* --------------------
   Config
   -------------------- */
const ULTRA_SMOOTH = true;



/* --------------------
   Skills Grid Component
   -------------------- */
const SkillsGrid = ({ frontendSkills, backendSkills }) => {
  const [frontendRef, frontendVisible] = useScrollReveal({ threshold: 0.1 });
  const [backendRef, backendVisible] = useScrollReveal({ threshold: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto skill-grid mt-8">
      {/* Frontend Development */}
      <Motion.div
        ref={frontendRef}
        variants={revealVariants}
        initial="hidden"
        animate={prefersReducedMotion ? "visible" : frontendVisible ? "visible" : "hidden"}
        className="rounded-3xl p-8 transition-all duration-300 border bg-white/80 supports-[backdrop-filter]:bg-white/70 border-gray-200/70 shadow-2xl relative overflow-hidden dark:bg-gray-900/70 dark:border-gray-700/50 group card-backdrop card-shadow skill-card hover:shadow-purple-500/30"
        role="status"
        aria-busy={!frontendVisible}
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-teal-400 rounded-t-3xl"></div>
        
        {/* Decorative gradient orb */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold relative">
              <LetterStagger
                text="Frontend Development"
                delay={0.2}
                staggerDelay={0.03}
                className="text-purple-700 dark:text-purple-300"
              />
            </h2>
          </div>

          <Motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={prefersReducedMotion ? "visible" : frontendVisible ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {frontendSkills.length ? (
              frontendSkills.map((skill, index) => (
                <Motion.div
                  key={skill.name ?? `frontend-${index}`}
                  variants={staggerItem}
                  className="p-2"
                >
                  <SkillItem skill={skill} index={index} />
                </Motion.div>
              ))
            ) : (
              <div className="p-4 text-sm text-gray-600 dark:text-gray-300">
                No frontend skills found.
              </div>
            )}
          </Motion.div>
        </div>
      </Motion.div>

      {/* Backend Development */}
      <Motion.div
        ref={backendRef}
        variants={revealVariants}
        initial="hidden"
        animate={prefersReducedMotion ? "visible" : backendVisible ? "visible" : "hidden"}
        className="rounded-3xl p-8 transition-all duration-300 border bg-white/80 supports-[backdrop-filter]:bg-white/70 border-gray-200/70 shadow-2xl relative overflow-hidden dark:bg-gray-900/70 dark:border-gray-700/50 group card-backdrop card-shadow skill-card hover:shadow-teal-500/30"
        role="status"
        aria-busy={!backendVisible}
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-400 rounded-t-3xl"></div>
        
        {/* Decorative gradient orb */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400/20 to-teal-400/10 border border-teal-400/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold relative">
              <LetterStagger
                text="Backend Development"
                delay={0.2}
                staggerDelay={0.03}
                className="text-teal-700 dark:text-teal-300"
              />
            </h2>
          </div>

          <Motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={prefersReducedMotion ? "visible" : backendVisible ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {backendSkills.length ? (
              backendSkills.map((skill, index) => (
                <Motion.div
                  key={skill.name ?? `backend-${index}`}
                  variants={staggerItem}
                  className="p-2"
                >
                  <SkillItem skill={skill} index={index} />
                </Motion.div>
              ))
            ) : (
              <div className="p-4 text-sm text-gray-600 dark:text-gray-300">
                No backend skills found.
              </div>
            )}
          </Motion.div>
        </div>
      </Motion.div>
    </div>
  );
};

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
   Continuous Learning Section Component
   -------------------- */
const ContinuousLearningSection = () => {
  const [sectionRef, sectionVisible] = useScrollReveal({ threshold: 0.2 });
  const [titleRef, titleVisible] = useScrollReveal({ threshold: 0.2 });
  const [textRef, textVisible] = useScrollReveal({ threshold: 0.2 });
  const [badgeRef, badgeVisible] = useScrollReveal({ threshold: 0.2 });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Motion.div
      ref={sectionRef}
      variants={revealVariants}
      initial="hidden"
      animate={prefersReducedMotion ? "visible" : sectionVisible ? "visible" : "hidden"}
      className="mt-16 text-center"
      role="status"
      aria-busy={!sectionVisible}
    >
      <div className="rounded-2xl p-8 border bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 border-gray-200/70 shadow-lg relative overflow-hidden dark:bg-gray-900/70 dark:border-gray-700/30 group">
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-teal-400/10"></div>
        </div>

        <Motion.div
          ref={titleRef}
          variants={headingVariant}
          initial="hidden"
          animate={prefersReducedMotion ? "visible" : titleVisible ? "visible" : "hidden"}
        >
          <h3 className="text-xl font-semibold mb-4">
            <GradientTextWave
              text="Continuous Learning & Growth"
              colors={['#8B5CF6', '#EC4899', '#06B6D4']}
              className="text-gray-900 dark:text-white"
            />
          </h3>
        </Motion.div>

        <Motion.div
          ref={textRef}
          variants={revealVariants}
          initial="hidden"
          animate={prefersReducedMotion ? "visible" : textVisible ? "visible" : "hidden"}
        >
          <WordReveal
            text="I'm passionate about staying up-to-date with the latest technologies and best practices. These skills represent my current expertise, but I'm always expanding my knowledge through new projects, courses, and hands-on experience."
            delay={0.3}
            staggerDelay={0.03}
            className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          />
        </Motion.div>

        <Motion.div
          ref={badgeRef}
          variants={revealVariants}
          initial="hidden"
          animate={prefersReducedMotion ? "visible" : badgeVisible ? "visible" : "hidden"}
          className="mt-6 flex justify-center"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500/10 to-teal-400/10 text-purple-700 dark:text-teal-300 border border-purple-500/20 dark:border-teal-400/20">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
            Always learning new technologies
          </span>
        </Motion.div>
      </div>
    </Motion.div>
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
        /* Ultra-smooth optimizations */
        .ultra-smooth-enabled .ultra-deco { will-change: transform, opacity; pointer-events: none; }
        .ultra-smooth-desktop .ultra-pulse { animation: none !important; opacity: 0.12 !important; }
        .ultra-smooth-desktop .ultra-blur { filter: blur(10px); }
        .ultra-smooth-desktop .card-backdrop { backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
        .ultra-smooth-desktop .card-shadow { box-shadow: 0 6px 18px rgba(0,0,0,0.05); }
        .skill-grid { contain: layout paint; }

        /* Skill card hover effects */
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
          {/* STICKY HEADER */}
          <StickyHeader 
            title="My Skills" 
            icon={FiCode}
            sectionId="skills-section"
            className="mb-8"
          />

          {/* Subtitle - Separate container */}
          <div className="text-center mb-8 sm:mb-12 px-4">
            <Motion.div
              variants={revealVariants}
              initial="hidden"
              animate="visible"
              className="glass-modern rounded-xl px-6 py-4 border border-white/10 backdrop-blur-sm max-w-2xl mx-auto"
            >
              <WordReveal
                text="Technologies and tools I use to bring ideas to life"
                delay={0.3}
                staggerDelay={0.08}
                className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed font-medium"
              />
            </Motion.div>
          </div>

          <div id="skills-section">

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto skill-grid mt-8">
              <div className="h-[500px]"></div>
              <div className="h-[500px]"></div>
            </div>
          ) : (
            <SkillsGrid frontendSkills={frontendSkills} backendSkills={backendSkills} />
          )}

          {/* Continuous Learning Section */}
          <ContinuousLearningSection />
          </div>

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
