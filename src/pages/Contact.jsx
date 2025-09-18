// src/pages/Contact.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion"; // keep only for small top-level mount
import ContactForm from "../components/ContactForm";
import ParticleBackground from "../components/ParticleBackground";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

/* -----------------------
   Config: Ultra-smooth forced ON
   ----------------------- */
const ULTRA_SMOOTH = true;

/* -----------------------
   Safe utilities
   ----------------------- */
const cx = (...args) => args.filter(Boolean).join(" ");

function safeMatchMedia(query) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

function connectionInfo() {
  if (typeof navigator === "undefined") return { saveData: false, effectiveType: "" };
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return { saveData: !!(conn && conn.saveData), effectiveType: (conn && conn.effectiveType) || "" };
}

/* -----------------------
   Shared intersection observer registry
   (reused observers grouped by options)
   ----------------------- */
const observerRegistry = new Map();

function useIntersectionSimple({ threshold = 0.12, rootMargin = "0px 0px -8% 0px", once = false } = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const key = `${Array.isArray(threshold) ? threshold.join(",") : threshold}|${rootMargin}`;

  const unregister = useCallback(
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
      // reduced motion or save-data -> reveal immediately, avoid observer
      const { saveData } = connectionInfo();
      if (prefersReducedMotion || saveData) {
        setIsVisible(true);
        if (elRef.current && elRef.current !== node) unregister(elRef.current);
        elRef.current = node;
        return;
      }

      if (elRef.current && elRef.current !== node) {
        unregister(elRef.current);
        elRef.current = null;
      }

      if (!node) {
        elRef.current = null;
        return;
      }

      elRef.current = node;

      let entry = observerRegistry.get(key);
      if (!entry) {
        const elements = new Map();
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((ent) => {
              const target = ent.target;
              const reg = observerRegistry.get(key)?.elements.get(target);
              if (!reg) return;
              if (ent.isIntersecting) {
                try {
                  reg.setVisible(true);
                } catch {}
                if (reg.once) {
                  try {
                    observer.unobserve(target);
                  } catch {}
                  observerRegistry.get(key)?.elements.delete(target);
                }
              } else {
                if (!reg.once) {
                  try {
                    reg.setVisible(false);
                  } catch {}
                }
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
    [key, prefersReducedMotion, unregister]
  );

  useEffect(() => {
    // if reduced motion preference toggles, show
    const { saveData } = connectionInfo();
    if (prefersReducedMotion || saveData) setIsVisible(true);
  }, [prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (elRef.current) unregister(elRef.current);
    };
  }, [unregister]);

  return [refCallback, isVisible];
}

/* -----------------------
   Reveal component: CSS-driven; uses shared observer
   - variant controls initial transform axis via data-variant
   - keeps transitions transform & opacity only (GPU-friendly)
   ----------------------- */
const Reveal = ({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.36,
  className = "",
  threshold = 0.12,
  rootMargin = "0px 0px -8% 0px",
  once = false,
  style = {},
  ...props
}) => {
  const [ref, isVisible] = useIntersectionSimple({ threshold, rootMargin, once });
  const hookPref = usePrefersReducedMotion();
  const prefersReducedMotion = typeof hookPref === "boolean" ? hookPref : false;

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className} style={style} {...props}>
        {children}
      </div>
    );
  }

  const transitionStyle = {
    transitionProperty: "transform, opacity",
    transitionTimingFunction: "cubic-bezier(0.22, 0.12, 0.12, 1)",
    transitionDuration: `${duration}s`,
    transitionDelay: `${delay}s`,
    willChange: "transform, opacity",
    ...style,
  };

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? "is-visible" : ""} ${className}`}
      data-variant={variant}
      style={transitionStyle}
      {...props}
    >
      {children}
    </div>
  );
};

/* -----------------------
   StaggerReveal: group-based staggering (no per-child observers)
   ----------------------- */
const StaggerReveal = ({ children, staggerDelay = 0.06, variant = "fade-up", duration = 0.36, className = "", ...props }) => {
  const [containerRef, containerVisible] = useIntersectionSimple({ threshold: 0.12, rootMargin: "0px 0px -8% 0px", once: false });

  return (
    <div ref={containerRef} className={`stagger-reveal ${className}`} data-visible={containerVisible ? "true" : "false"} {...props}>
      {React.Children.map(children, (child, idx) => {
        const delay = idx * staggerDelay;
        return (
          <div
            key={idx}
            className="stagger-item"
            data-variant={variant}
            style={{
              transitionProperty: "transform, opacity",
              transitionDuration: `${duration}s`,
              transitionTimingFunction: "cubic-bezier(0.22, 0.12, 0.12, 1)",
              transitionDelay: `${delay}s`,
              opacity: containerVisible ? 1 : 0,
              transform: containerVisible ? "translate3d(0,0,0)" : undefined,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

/* -----------------------
   Contact page
   ----------------------- */
export default function Contact() {
  const hookPref = usePrefersReducedMotion();
  const prefersReducedMotion = typeof hookPref === "boolean" ? hookPref : false;

  // Ensure global ultra-smooth classes (pause particles, reduce heavy CSS)
  useEffect(() => {
    if (ULTRA_SMOOTH) {
      document.documentElement.classList.add("ultra-smooth-enabled");
      document.documentElement.classList.add("ultra-smooth-desktop");
      document.documentElement.classList.add("ultra-smooth-mobile");
    } else {
      document.documentElement.classList.remove("ultra-smooth-enabled");
      document.documentElement.classList.remove("ultra-smooth-desktop");
      document.documentElement.classList.remove("ultra-smooth-mobile");
    }
    // keep intentionally minimal, no removal on unmount to keep site consistent
  }, []);

  // We do not attach scroll/resize heavy JS — rely on CSS + IntersectionObserver.

  return (
    <>
      <style>{`
        /* ---------- Reveal / Stagger Styles (GPU friendly) ---------- */
        .reveal { opacity: 0; will-change: transform, opacity; transform: translate3d(0, var(--reveal-y, 8px), 0); }
        .reveal[data-variant="fade-up"] { --reveal-y: 8px; }
        .reveal[data-variant="fade-down"] { transform: translate3d(0, -8px, 0); }
        .reveal[data-variant="slide-left"] { transform: translate3d(-6px, 0, 0); }
        .reveal[data-variant="slide-right"] { transform: translate3d(6px, 0, 0); }
        .reveal[data-variant="zoom-in"] { transform: scale(0.98) translateZ(0); }
        .reveal.is-visible { opacity: 1; transform: translate3d(0,0,0); }

        .stagger-reveal { display: block; }
        .stagger-reveal .stagger-item { opacity: 0; transform: translate3d(0, 8px, 0); will-change: transform, opacity; }
        .stagger-reveal[data-visible="true"] .stagger-item { opacity: 1; transform: translate3d(0,0,0); }

        .reveal, .stagger-item { backface-visibility: hidden; perspective: 1000; }

        /* ---------- Ultra-smooth optimizations ---------- */
        /* Desktop: slightly smaller translate and faster durations */
        html.ultra-smooth-desktop .reveal[data-variant="fade-up"] { --reveal-y: 6px; }
        html.ultra-smooth-desktop .reveal,
        html.ultra-smooth-desktop .stagger-item { transition-duration: 0.26s !important; transition-timing-function: cubic-bezier(.22,.12,.12,1) !important; }

        /* Mobile: reduce distances even more to avoid perceived jank and touch-responsiveness issues */
        html.ultra-smooth-mobile .reveal[data-variant="fade-up"] { --reveal-y: 4px; }
        html.ultra-smooth-mobile .reveal,
        html.ultra-smooth-mobile .stagger-item { transition-duration: 0.22s !important; }

        /* Pause decorative animations (particles/floating elements) */
        html.ultra-smooth-enabled .particle,
        html.ultra-smooth-enabled .floating-deco,
        html.ultra-smooth-enabled .bg-animated {
          animation: none !important;
          opacity: 0.12 !important;
        }

        /* Reduce heavy paint properties (backdrop-filter/shadow) */
        html.ultra-smooth-enabled .backdrop-heavy { backdrop-filter: blur(6px) !important; -webkit-backdrop-filter: blur(6px) !important; }
        html.ultra-smooth-enabled .shadow-heavy { box-shadow: 0 6px 18px rgba(0,0,0,0.05) !important; }

        /* Accessibility: respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .reveal, .stagger-item { transition: none !important; transform: none !important; opacity: 1 !important; }
          .particle, .floating-deco, .bg-animated { animation: none !important; }
        }

        /* Performance helpers */
        .contact-grid { contain: layout paint; }
        .pointer-events-none { pointer-events: none; }
        .card-smooth { transition: transform .18s ease, box-shadow .18s ease; will-change: transform; }
        .card-smooth:hover { transform: translateY(-4px); }
        .scrollable-area { -webkit-overflow-scrolling: touch; }

        /* Avoid heavy CSS filters on small screens */
        @media (max-width: 640px) {
          .backdrop-heavy { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
        }

        /* Helpful: reduce long-running paint during scroll */
        .no-blur-during-scroll * { transition: none !important; }
      `}</style>

      <motion.main
        initial={prefersReducedMotion ? false : { y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.36 }}
        className="relative min-h-screen pt-24"
        aria-labelledby="contact-heading"
      >
        {/* Background aura (cheap; uses transform & blur only) */}
        <div aria-hidden className="absolute inset-0 -z-20 pointer-events-none" style={{ mixBlendMode: "screen" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(30% 24% at 10% 12%, rgba(124,58,237,0.12), transparent 12%), radial-gradient(28% 18% at 90% 88%, rgba(20,184,166,0.06), transparent 18%)",
              filter: "blur(36px)",
              opacity: 1,
              transform: "translateZ(0)",
              willChange: "transform, opacity",
            }}
          />
        </div>

        {/* Particle background - heavy animations paused when ultra-smooth active
            Ensure ParticleBackground outputs .particle or .floating-deco elements so CSS targets them. */}
        <div className="absolute inset-0 -z-10">
          <ParticleBackground />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12 contact-grid">
          {/* Header */}
          <header className="mb-8">
            <Reveal variant="zoom-in" delay={0.06} duration={0.36}>
              <h1 id="contact-heading" className="text-3xl md:text-4xl font-extrabold">
                Contact
              </h1>
              <p className="mt-2 text-sm text-white/80 max-w-xl">
                Have a question, collaboration idea, or want to say hi? Drop a message.
              </p>
            </Reveal>
          </header>

          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Contact form */}
            <Reveal variant="fade-up" delay={0.12}>
              <div className="w-full h-full card-smooth">
                {/* contact form should be optimized inside component: avoid heavy animation in ContactForm */}
                <ContactForm />
              </div>
            </Reveal>

            {/* Right: Details */}
            <Reveal variant="slide-left" delay={0.16}>
              <aside className="space-y-6 w-full">
                <div className="glass rounded-lg p-6 w-full backdrop-heavy shadow-heavy">
                  <h2 className="text-lg font-semibold mb-3">Contact details</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="p-2 rounded-md bg-white/6 flex items-center justify-center pointer-events-none">
                        <FaEnvelope />
                      </span>
                      <div>
                        <div className="font-medium">Email</div>
                        <a className="text-sm text-white/80 hover:underline" href="mailto:aravindrajaa03@gmail.com">
                          aravindrajaa03@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="p-2 rounded-md bg-white/6 flex items-center justify-center pointer-events-none">
                        <FaPhone />
                      </span>
                      <div>
                        <div className="font-medium">Phone</div>
                        <a className="text-sm text-white/80 hover:underline" href="tel:9384605406">
                          +91 93846 05406
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="p-2 rounded-md bg-white/6 flex items-center justify-center pointer-events-none">
                        <FaMapMarkerAlt />
                      </span>
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-sm text-white/80">Chennai, Tamil Nadu, India</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-lg p-6 w-full backdrop-heavy shadow-heavy">
                  <h3 className="font-semibold">Availability</h3>
                  <p className="mt-2 text-sm text-white/80">
                    Open to full-time and contract opportunities. Available for projects, mentorship, and collaborations,
                    especially around MERN/PERN, UI/UX and performance engineering.
                  </p>
                </div>

                <div className="glass rounded-lg p-6 w-full backdrop-heavy shadow-heavy">
                  <h3 className="font-semibold">Quick links</h3>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <a
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md glass text-sm"
                      href="https://github.com/aravind7lee"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                    <a
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md glass text-sm"
                      href="https://www.linkedin.com/in/aravind042"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                    <a
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gradient-to-r from-purple-600 to-teal-400 text-black text-sm font-semibold"
                      href="/Aravind R-Updated-Resume.pdf"
                      download
                    >
                      Resume
                    </a>
                  </div>
                </div>
              </aside>
            </Reveal>
          </div>

          {/* Footer */}
          <Reveal variant="fade-up" delay={0.2}>
            <p className="mt-8 text-xs text-white/60">
              By contacting me you agree to keep things professional — I respond to reasonable messages and respect your privacy.
            </p>
          </Reveal>
        </div>
      </motion.main>
    </>
  );
}
