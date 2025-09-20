// src/components/Navbar.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeProvider";
import logoLight from "../assets/logo.png";
import logoDark from "../assets/logo_dark.png";

/* -------------------- Hook: prefersReducedMotion -------------------- */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mq.matches);
    handler();
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);
  return reduced;
}

/* -------------------- Custom hook for scroll-reveal -------------------- */
function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    margin: "0px 0px -10% 0px",
    ...options,
  });
  const prefersReducedMotion = usePrefersReducedMotion();

  return { ref, isInView, prefersReducedMotion };
}

/* -------------------- ScrollReveal Component -------------------- */
const ScrollReveal = ({
  children,
  variants = {},
  className = "",
  style = {},
  as = "div",
  revealOptions = {},
  ...props
}) => {
  const { ref, isInView, prefersReducedMotion } =
    useScrollReveal(revealOptions);

  // Create motion component based on 'as' prop - FIXED: Use motion.create() instead of motion()
  const MotionComponent = useMemo(() => {
    if (typeof as === "string") {
      return motion[as];
    }
    // If 'as' is a React component, create a motion wrapper using motion.create()
    if (typeof motion.create === "function") {
      return motion.create(as);
    } else {
      // Fallback for older versions of Framer Motion
      return motion(as);
    }
  }, [as]);

  const defaultVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: "easeOut",
      },
    },
  };

  const mergedVariants = { ...defaultVariants, ...variants };

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={mergedVariants}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

/* -------------------- Logo (crossfade) -------------------- */
const Logo = React.memo(function Logo({ isDark }) {
  const preloadedRef = useRef(false);
  useEffect(() => {
    if (!preloadedRef.current) {
      [logoLight, logoDark].forEach((s) => {
        const i = new Image();
        i.src = s;
        i.decoding = "async";
      });
      preloadedRef.current = true;
    }
  }, []);
  const shared = { willChange: "opacity", transform: "translateZ(0)" };
  return (
    <Link to="/" aria-label="Home" className="flex items-center gap-3">
      <span
        className="relative inline-block w-[120px] h-8 md:w-[160px] md:h-10 lg:w-[180px] lg:h-11"
        aria-hidden
      >
        <img
          src={logoLight}
          alt="logo"
          style={shared}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-200 ease-out ${
            isDark ? "opacity-0" : "opacity-100"
          }`}
        />
        <img
          src={logoDark}
          alt="logo dark"
          style={shared}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-200 ease-out ${
            isDark ? "opacity-100" : "opacity-0"
          }`}
        />
      </span>
      <span className="sr-only">Premium Portfolio</span>
    </Link>
  );
});

/* -------------------- IconCrossfade (animated) -------------------- */
function IconCrossfade({ open, size = 20 }) {
  const common =
    "absolute inset-0 flex items-center justify-center transform-gpu pointer-events-none";
  const menuClass = `${common} transition-opacity duration-180 ${
    open ? "opacity-0 scale-95" : "opacity-100 scale-100"
  }`;
  const xClass = `${common} transition-opacity duration-180 ${
    open ? "opacity-100 scale-100" : "opacity-0 scale-95"
  }`;
  // small rotation when toggled (parent may rotate too)
  return (
    <span
      style={{
        width: size,
        height: size,
        display: "inline-block",
        position: "relative",
      }}
      aria-hidden
    >
      <span className={menuClass}>
        <FiMenu size={size} />
      </span>
      <span className={xClass}>
        <FiX size={size} />
      </span>
    </span>
  );
}

/* -------------------- Navbar -------------------- */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const location = useLocation();
  const { isDark } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const fmReduced = useReducedMotion();
  const drawerRef = useRef(null);
  const lastActive = useRef(null);

  // Lightweight non-blocking loader shimmer on first mount
  useEffect(() => {
    const t = setTimeout(() => setShowLoader(false), fmReduced ? 0 : 420);
    return () => clearTimeout(t);
  }, [fmReduced]);

  useEffect(() => {
    // close on route change
    setOpen(false);
  }, [location.pathname]);

  // Menu links
  const links = useMemo(
    () => [
      { to: "/", label: "Home" },
      { to: "/about", label: "About" },
      { to: "/projects", label: "Projects" },
      { to: "/skills", label: "Skills" },
      { to: "/contact", label: "Contact" },
    ],
    []
  );

  // toggle / close
  const toggle = useCallback(() => setOpen((s) => !s), []);
  const close = useCallback(() => setOpen(false), []);

  /* -------------------- accessibility: focus trap & body lock -------------------- */
  useEffect(() => {
    if (!open) return;
    // save last active element
    lastActive.current = document.activeElement;
    // lock scroll
    const prevOverflow = document.body.style.overflow;
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0)
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    document.body.style.overflow = "hidden";

    // focus first focusable
    requestAnimationFrame(() => {
      const root = drawerRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) focusable[0].focus();
    });

    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        // basic focus trap
        const root = drawerRef.current;
        if (!root) return;
        const focusable = Array.from(
          root.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow || "";
      document.body.style.paddingRight = "";
      if (lastActive.current instanceof HTMLElement) {
        try {
          lastActive.current.focus();
        } catch {
          // ignore
        }
      }
    };
  }, [open, close]);

  /* -------------------- tsParticles init + options (aura) -------------------- */
  const particlesInit = useCallback(async (engine) => {
    try {
      await loadFull(engine);
    } catch (e) {
      // ignore if can't load plugins
      console.warn("tsparticles loadFull failed", e);
    }
    // no explicit else: core loaded
  }, []);

  // Guard particles on small/low-end or reduced motion
  const [canParticles, setCanParticles] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reducedMotion || fmReduced) {
      setCanParticles(false);
      return;
    }
    const w = window.innerWidth;
    const dpr = window.devicePixelRatio || 1;
    const cores = navigator.hardwareConcurrency || 2;
    setCanParticles(w >= 480 && cores >= 4 && dpr <= 2.5);
  }, [reducedMotion, fmReduced]);

  const particleCount =
    typeof window !== "undefined" && window.innerWidth < 768 ? 12 : 36;

  const particlesOptions = useMemo(() => {
    return {
      fullScreen: { enable: false },
      particles: {
        number: {
          value: particleCount,
          density: { enable: true, value_area: 800 },
        },
        color: { value: ["#9f7aea", "#06b6d4", "#ffffff", "#7c3aed"] },
        shape: { type: "circle" },
        opacity: {
          value: 0.9,
          random: { enable: true, minimumValue: 0.25 },
          anim: { enable: true, speed: 0.6, minimumValue: 0.2 },
        },
        size: { value: { min: 0.4, max: 3.6 }, random: true },
        move: {
          enable: true,
          speed: 0.22,
          direction: "none",
          random: true,
          straight: false,
          outModes: { default: "out" },
        },
        twinkle: {
          particles: {
            enable: true,
            color: "#fff",
            frequency: 0.01,
            opacity: 1,
          },
        },
        links: { enable: false },
      },
      interactivity: {
        detectsOn: "canvas",
        events: {
          onHover: {
            enable: true,
            mode: reducedMotion ? false : "repulse",
            parallax: { enable: true, force: 10, smooth: 20 },
          },
          onClick: { enable: true, mode: reducedMotion ? false : "push" },
          resize: true,
        },
        modes: {
          repulse: { distance: 90, duration: 0.6 },
          push: { quantity: 3 },
        },
      },
      retina_detect: true,
      background: { color: "transparent" },
    };
  }, [particleCount, reducedMotion]);

  /* -------------------- Motion variants (warp + reveal) -------------------- */
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: reducedMotion ? 0 : 0.22 } },
    exit: { opacity: 0, transition: { duration: 0.18 } },
  };

  // Mobile drawer animates with scaleY + opacity for smoother feel on mobile
  const drawerVariants = {
    hidden: {
      opacity: 0,
      scaleY: 0.86,
      filter: "blur(4px)",
      transformOrigin: "top right",
    },
    visible: {
      opacity: 1,
      scaleY: 1,
      filter: "blur(0px)",
      transition: reducedMotion
        ? { duration: 0 }
        : { type: "spring", stiffness: 340, damping: 30, mass: 0.85 },
    },
    exit: {
      opacity: 0,
      scaleY: 0.9,
      filter: "blur(3px)",
      transition: { duration: 0.16 },
    },
  };

  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: reducedMotion ? 0 : 0.42 },
    },
  };

  /* -------------------- micro hover/tilt props -------------------- */
  const itemHover = reducedMotion
    ? {}
    : {
        whileHover: { scale: 1.02, translateZ: 0 },
        whileTap: { scale: 0.985 },
        transition: { type: "spring", stiffness: 380, damping: 28 },
      };

  const ctaHover = reducedMotion
    ? {}
    : {
        whileHover: { scale: 1.03, y: -3 },
        whileTap: { scale: 0.985 },
        transition: { type: "spring", stiffness: 360, damping: 20 },
      };

  /* -------------------- aesthetic palettes -------------------- */
  const light = {
    drawerBg: "rgba(255,255,255,0.66)",
    border: "rgba(124,58,237,0.12)",
    overlay: "rgba(10,8,10,0.28)",
    text: "#0b1220",
    meta: "#374151",
    accent: "linear-gradient(90deg,#7c3aed,#06b6d4)",
  };

  const dark = {
    drawerBg: "rgba(6,8,18,0.6)",
    border: "rgba(159,122,234,0.08)",
    overlay: "rgba(2,6,23,0.6)",
    text: "#e6f0ff",
    meta: "#c7d2fe",
    accent: "linear-gradient(90deg,#9f7aea,#06b6d4)",
  };

  const p = isDark ? dark : light;

  /* -------------------- Infinity backdrop (rotating subtle ∞) -------------------- */
  const InfinityBackdrop = () => (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "220%",
          height: "220%",
          transform: "translate3d(0, -10%, 0)",
          opacity: 0.035,
          color: isDark ? "#fff" : "#000",
          mixBlendMode: isDark ? "screen" : "multiply",
          fontSize: 220,
          filter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "rotateSlow 30s linear infinite",
        }}
      >
        <div style={{ transform: "scale(1.2)", letterSpacing: 12 }}>
          ∞ ∞ ∞ ∞ ∞
        </div>
      </div>

      <style>{`
        @keyframes rotateSlow { from { transform: rotate(0deg) translate3d(0,-10%,0); } to { transform: rotate(360deg) translate3d(0,-10%,0); } }
      `}</style>
    </div>
  );

  /* -------------------- Render -------------------- */
  return (
    <ScrollReveal
      as="header"
      className="fixed top-6 left-0 right-0 z-50 px-6 pointer-events-auto"
      variants={{
        hidden: { opacity: 0, y: -50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: reducedMotion ? 0 : 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }}
      revealOptions={{ margin: "0px 0px -15% 0px" }}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Loader shimmer bar (non-blocking) */}
        {showLoader && (
          <motion.div
            aria-hidden
            initial={{ scaleX: 0, opacity: 0.6 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: -10,
              left: 24,
              right: 24,
              height: 2,
              transformOrigin: "left",
              background: "linear-gradient(90deg,#9f7aea,#06b6d4)",
              borderRadius: 4,
              pointerEvents: "none",
              filter: "blur(0.2px)",
            }}
          />
        )}
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <div
            className="text-xl font-bold tracking-tight"
            style={{ transform: "translateZ(0)" }}
          >
            <Logo isDark={isDark} />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex gap-4 items-center">
          <div className="flex gap-1">
            {links.map((l) => {
              const isActive = location.pathname === l.to;
              return (
                <motion.div key={l.to} className="relative group">
                  <Link
                    to={l.to}
                    className={`relative block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden border ${
                      isActive 
                        ? "text-white bg-gradient-to-r from-purple-600/40 to-teal-400/40 border-purple-500/30 shadow-lg shadow-purple-500/20" 
                        : "text-white/70 hover:text-white border-transparent hover:border-purple-500/20"
                    }`}
                  >
                    {/* Strong hover background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-teal-400/50 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl" />
                    
                    {/* Enhanced glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-teal-400/30 blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl" />
                    
                    {/* Prominent animated gradient underline */}
                    <div className="absolute bottom-1 left-2 right-2 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out origin-left shadow-lg shadow-purple-400/60" />
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-purple-400 to-teal-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50" />
                    )}
                    
                    {/* Enhanced text content */}
                    <span className="relative z-10 transition-all duration-300 group-hover:text-white group-hover:font-semibold group-hover:drop-shadow-lg">
                      {l.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="ml-3 mr-3">
            <ThemeToggle />
          </div>

          <motion.div 
            className="relative group"
            whileHover={reducedMotion ? {} : {
              scale: 1.05,
              y: -2,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={reducedMotion ? {} : {
              scale: 0.96,
              transition: { duration: 0.1 }
            }}
          >
            <a
              href="/Aravind R-Updated-Resume.pdf"
              download
              className="relative block px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-400 text-white font-semibold shadow-lg transform-gpu transition-all duration-300 overflow-hidden"
              aria-label="Download resume"
            >
              {/* Clean glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-teal-400/30 blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl" />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-out rounded-xl" />
              
              <span className="relative z-10 transition-all duration-300 group-hover:drop-shadow-lg">Resume</span>
            </a>
          </motion.div>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <div className="mr-1">
            <ThemeToggle className="text-white" />
          </div>

          <ScrollReveal
            as="button"
            onClick={toggle}
            aria-label={open ? "Close menu" : "Open menu"}
            className="p-2 rounded-md glass relative overflow-hidden"
            style={{
              willChange: "transform, opacity",
              background: isDark
                ? "rgba(255,255,255,0.04)"
                : "rgba(255,255,255,0.06)",
              backdropFilter: "blur(6px)",
            }}
            variants={{
              hidden: { opacity: 0, rotate: -90 },
              visible: {
                opacity: 1,
                rotate: 0,
                transition: {
                  duration: reducedMotion ? 0 : 0.5,
                  ease: "easeOut",
                },
              },
            }}
            revealOptions={{ margin: "0px 0px -10% 0px" }}
          >
            <motion.span
              animate={{ rotate: open && !reducedMotion ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
            >
              <IconCrossfade open={open} reduced={reducedMotion} />
            </motion.span>
          </ScrollReveal>
        </div>
      </nav>

      {/* Mobile drawer (AnimatePresence) */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              onClick={close}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 60,
                background: p.overlay,
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
              }}
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={drawerVariants}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 70,
                width: "92%",
                maxWidth: 420,
                padding: 20,
                borderRadius: 16,
                margin: 12,
                background: p.drawerBg,
                border: `1px solid ${p.border}`,
                boxShadow: isDark
                  ? "0 15px 60px rgba(0,0,0,0.6)"
                  : "0 10px 40px rgba(2,6,23,0.08)",
                overflow: "auto",
                WebkitOverflowScrolling: "touch",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                transformOrigin: "right center",
                willChange: "transform, opacity, filter",
              }}
            >
              {/* Infinity rotating backdrop */}
              <InfinityBackdrop />

              {/* particle aura layer */}
              {canParticles && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: "none",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <Particles
                    id="drawer-particles"
                    init={particlesInit}
                    options={particlesOptions}
                  />
                </div>
              )}

              {/* content layer */}
              <div style={{ position: "relative", zIndex: 2 }}>
                {/* header row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <Logo isDark={isDark} />
                  </div>

                  {/* close with morph visual */}
                  <button
                    onClick={() => {
                      // small spark visual (CSS)
                      setOpen(false);
                    }}
                    aria-label="Close"
                    className="p-2 rounded-md inline-flex items-center justify-center"
                    style={{ background: "transparent", border: "none" }}
                  >
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{
                        rotate: open && !reducedMotion ? 180 : 0,
                        scale: 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 30,
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FiX size={22} />
                    </motion.div>
                  </button>
                </div>

                {/* nav list */}
                <motion.nav
                  initial="hidden"
                  animate="visible"
                  variants={listVariants}
                  aria-label="Primary"
                >
                  <ul className="flex flex-col gap-3">
                    {links.map((l) => {
                      const active = location.pathname === l.to;
                      return (
                        <motion.li
                          key={l.to}
                          variants={itemVariants}
                          {...itemHover}
                        >
                          <Link
                            to={l.to}
                            onClick={close}
                            className="block w-full rounded-xl px-4 py-3 text-lg font-medium"
                            style={{
                              color: p.text,
                              background: active
                                ? isDark
                                  ? "rgba(255,255,255,0.03)"
                                  : "rgba(2,6,23,0.03)"
                                : "transparent",
                              boxShadow: active
                                ? `0 14px 40px ${
                                    isDark
                                      ? "rgba(159,122,234,0.06)"
                                      : "rgba(124,58,237,0.04)"
                                  }`
                                : "none",
                              transform: "translateZ(0)",
                              borderRadius: 12,
                              border: "1px solid transparent",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                position: "relative",
                              }}
                            >
                              {l.label}
                              <span
                                style={{
                                  display: active ? "inline-block" : "none",
                                  position: "absolute",
                                  left: -14,
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  width: 8,
                                  height: 8,
                                  borderRadius: 999,
                                  background:
                                    "linear-gradient(90deg,#9f7aea,#06b6d4)",
                                  boxShadow: `0 6px 18px ${
                                    isDark
                                      ? "rgba(159,122,234,0.12)"
                                      : "rgba(6,182,212,0.08)"
                                  }`,
                                }}
                              />
                            </span>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </motion.nav>

                {/* theme toggle row */}
                <motion.div
                  className="mt-5 flex items-center justify-between"
                  variants={itemVariants}
                >
                  <div style={{ color: p.meta }}>Theme</div>
                  <div>
                    <ThemeToggle />
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div className="mt-6" variants={itemVariants}>
                  <motion.a
                    {...ctaHover}
                    href="/Aravind R-Updated-Resume.pdf"
                    download
                    onClick={close}
                    className="w-full inline-flex items-center justify-center px-4 py-3 rounded-full font-bold"
                    style={{
                      background: p.accent,
                      color: isDark ? "#060814" : "#010214",
                      boxShadow: isDark
                        ? "0 12px 40px rgba(159,122,234,0.12)"
                        : "0 10px 32px rgba(6,182,212,0.12)",
                      borderRadius: 999,
                      transform: "translateZ(0)",
                    }}
                  >
                    Download Resume
                  </motion.a>
                </motion.div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </ScrollReveal>
  );
}
