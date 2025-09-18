import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion as Motion } from "framer-motion";
import skills from "../data/skills";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import SkillItem from "../components/SkillCard";

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const elementRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) {
      setIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options, prefersReducedMotion]);

  return [elementRef, isIntersecting];
};

// Reveal component for scroll animations
const Reveal = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.6,
  className = '',
  threshold = 0.1,
  triggerOnce = true,
  ...props
}) => {
  const [elementRef, isIntersecting] = useIntersectionObserver({
    threshold,
    triggerOnce,
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // If user prefers reduced motion, show content immediately
  if (prefersReducedMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  const variants = {
    'fade-up': {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    },
    'fade-down': {
      hidden: { opacity: 0, y: -40 },
      visible: { opacity: 1, y: 0 },
    },
    'fade-left': {
      hidden: { opacity: 0, x: 40 },
      visible: { opacity: 1, x: 0 },
    },
    'fade-right': {
      hidden: { opacity: 0, x: -40 },
      visible: { opacity: 1, x: 0 },
    },
    'fade': {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    'scale': {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    'flip': {
      hidden: { opacity: 0, rotateY: 90 },
      visible: { opacity: 1, rotateY: 0 },
    },
    'zoom': {
      hidden: { opacity: 0, scale: 1.2 },
      visible: { opacity: 1, scale: 1 },
    },
    'slide-up': {
      hidden: { opacity: 0, y: 60 },
      visible: { opacity: 1, y: 0 },
    },
  };

  const selectedVariant = variants[variant] || variants['fade-up'];

  return (
    <Motion.div
      ref={elementRef}
      initial="hidden"
      animate={isIntersecting ? "visible" : "hidden"}
      variants={selectedVariant}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
      {...props}
    >
      {children}
    </Motion.div>
  );
};

// Stagger reveal for groups of elements
const StaggerReveal = ({
  children,
  staggerDelay = 0.1,
  variant = 'fade-up',
  duration = 0.6,
  className = '',
  ...props
}) => {
  return (
    <div className={className} {...props}>
      {React.Children.map(children, (child, index) => (
        <Reveal
          key={index}
          variant={variant}
          delay={index * staggerDelay}
          duration={duration}
        >
          {child}
        </Reveal>
      ))}
    </div>
  );
};

export default function Skills() {
  const reduce = usePrefersReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <Motion.main
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-12 relative overflow-hidden"
      aria-labelledby="skills-heading"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <Reveal variant="fade-down" duration={0.8} delay={0.1}>
          <div className="text-center mb-16">
            <h1
              id="skills-heading"
              className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-700 via-purple-500 to-teal-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-teal-400 relative"
            >
              <span className="relative inline-block">
                My Skills
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-teal-400 rounded-full"></span>
              </span>
            </h1>
            <Reveal variant="fade-up" duration={0.6} delay={0.3}>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Technologies and tools I use to bring ideas to life
              </p>
            </Reveal>
          </div>
        </Reveal>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Frontend Development Card */}
          <Reveal variant="fade-right" duration={0.8} delay={0.2}>
            <Motion.div
              variants={cardVariants}
              className="rounded-2xl p-8 transition-all duration-300 border
                         bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70
                         border-gray-200/70 shadow-lg hover:shadow-xl relative overflow-hidden
                         dark:bg-gray-900/70 dark:border-gray-700/50 dark:hover:border-purple-400/30
                         group"
            >
              {/* Card accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-teal-400"></div>
              
              <Reveal variant="fade-down" duration={0.6} delay={0.3}>
                <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 text-center mb-8 relative">
                  <span className="relative z-10">Frontend Development</span>
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full opacity-70 group-hover:w-32 transition-all duration-500"></span>
                </h2>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StaggerReveal staggerDelay={0.05} variant="fade-up" duration={0.5}>
                  {skills.frontend.map((skill, index) => (
                    <SkillItem key={skill.name} skill={skill} index={index} />
                  ))}
                </StaggerReveal>
              </div>
            </Motion.div>
          </Reveal>

          {/* Backend Development Card */}
          <Reveal variant="fade-left" duration={0.8} delay={0.3}>
            <Motion.div
              variants={cardVariants}
              className="rounded-2xl p-8 transition-all duration-300 border
                         bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70
                         border-gray-200/70 shadow-lg hover:shadow-xl relative overflow-hidden
                         dark:bg-gray-900/70 dark:border-gray-700/50 dark:hover:border-teal-400/30
                         group"
            >
              {/* Card accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-purple-400"></div>
              
              <Reveal variant="fade-down" duration={0.6} delay={0.4}>
                <h2 className="text-2xl font-bold text-teal-700 dark:text-teal-300 text-center mb-8 relative">
                  <span className="relative z-10">Backend Development</span>
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full opacity-70 group-hover:w-32 transition-all duration-500"></span>
                </h2>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StaggerReveal staggerDelay={0.05} variant="fade-up" duration={0.5}>
                  {skills.backend.map((skill, index) => (
                    <SkillItem key={skill.name} skill={skill} index={index} />
                  ))}
                </StaggerReveal>
              </div>
            </Motion.div>
          </Reveal>
        </div>

        {/* Additional Info Section */}
        <Reveal variant="zoom" duration={0.8} delay={0.6} threshold={0.2}>
          <div className="mt-16 text-center">
            <div className="rounded-2xl p-8 border bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 border-gray-200/70 shadow-lg relative overflow-hidden dark:bg-gray-900/70 dark:border-gray-700/30 group">
              {/* Animated background effect */}
              <div className="absolute inset-0 -z-10 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-teal-400/10"></div>
              </div>
              
              <Reveal variant="fade-down" duration={0.6} delay={0.7}>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Continuous Learning & Growth
                </h3>
              </Reveal>
              
              <Reveal variant="fade-up" duration={0.6} delay={0.8}>
                <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  I'm passionate about staying up-to-date with the latest
                  technologies and best practices. These skills represent my current
                  expertise, but I'm always expanding my knowledge through new
                  projects, courses, and hands-on experience.
                </p>
              </Reveal>
              
              <Reveal variant="fade-up" duration={0.6} delay={0.9}>
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

        {/* Decorative elements */}
        <Reveal variant="fade" duration={1} delay={1.2}>
          <div className="absolute left-10% top-30% -translate-y-1/2 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl -z-10"></div>
        </Reveal>
        <Reveal variant="fade" duration={1} delay={1.4}>
          <div className="absolute right-15% bottom-20% translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -z-10"></div>
        </Reveal>
      </div>
    </Motion.main>
  );
}