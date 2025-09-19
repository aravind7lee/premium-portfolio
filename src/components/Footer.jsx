// src/components/Footer.jsx
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useTheme } from "../context/ThemeProvider";
import logoLight from "../assets/logo.png";
import logoDark from "../assets/logo_dark.png";

/**
 * useScrollReveal hook
 * - returns [ref, controls, prefersReducedMotion]
 * - plays 'visible' when element enters viewport and 'hidden' when it leaves (replay behavior)
 * - triggers on reload if already in view
 * - respects prefers-reduced-motion
 * - ensures controls.start() only runs after mount
 */
function useScrollReveal({
  threshold = 0.12,
  root = null,
  rootMargin = "0px",
  resetOnLeave = true,
} = {}) {
  const ref = useRef(null);
  const controls = useAnimation();
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // safe start wrapper
    const safeStart = (variant) => {
      if (mountedRef.current) {
        requestAnimationFrame(() => {
          if (ref.current) {
            controls.start(variant).catch(() => {});
          }
        });
      }
    };

    if (prefersReducedMotion) {
      safeStart("visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== node) return;

          if (entry.isIntersecting) {
            safeStart("visible");
          } else if (resetOnLeave) {
            safeStart("hidden");
          }
        });
      },
      { threshold, root, rootMargin }
    );

    observer.observe(node);

    // manual check for reload (already in view)
    const rect = node.getBoundingClientRect();
    const inView =
      rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom > 0;
    if (inView) {
      safeStart("visible");
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, resetOnLeave, prefersReducedMotion, controls]);

  return [ref, controls, prefersReducedMotion];
}

/**
 * Footer component
 */
export default function Footer() {
  const { isDark } = useTheme();

  // preload logos for smooth crossfade
  useEffect(() => {
    const a = new Image();
    a.src = logoLight;
    const b = new Image();
    b.src = logoDark;
  }, []);

  const [ref, controls, prefersReducedMotion] = useScrollReveal({
    threshold: 0.12,
    rootMargin: "-6% 0px -6% 0px",
    resetOnLeave: true,
  });

  // Palettes
  const lightPalette = {
    background:
      "linear-gradient(180deg, #fbf8ff 0%, #f6f3ff 45%, #eef2ff 100%)",
    text: "#0f172a",
    meta: "#374151",
    accent: "#7c3aed",
    divider: "rgba(124,58,237,0.10)",
    socialBg: "rgba(2,6,23,0.04)",
    socialIcon: "#111827",
    cardShadow: "0 -6px 30px rgba(99,102,241,0.06)",
  };

  const darkPalette = {
    background:
      "linear-gradient(180deg, #071133 0%, #071732 45%, #031423 100%)",
    text: "#e6f0ff",
    meta: "#c7d2fe",
    accent: "#9f7aea",
    divider: "rgba(255,255,255,0.06)",
    socialBg: "rgba(255,255,255,0.04)",
    socialIcon: "#e6eef8",
    cardShadow: "0 -6px 30px rgba(2,6,23,0.6)",
  };

  const p = isDark ? darkPalette : lightPalette;

  // Variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0,
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.56,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const smallItem = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.46, ease: "easeOut" },
    },
  };

  const hoverProps = prefersReducedMotion
    ? {}
    : {
        whileHover: { scale: 1.06, y: -3 },
        whileTap: { scale: 0.96 },
        transition: { type: "spring", stiffness: 380, damping: 26 },
      };

  const socialFocusStyle = {
    outline: "none",
    boxShadow: `0 0 0 3px ${
      isDark ? "rgba(159,122,234,0.12)" : "rgba(124,58,237,0.12)"
    }`,
    borderRadius: 12,
  };

  return (
    <motion.footer
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={prefersReducedMotion ? "visible" : controls}
      variants={containerVariants}
      style={{
        paddingBottom: "calc(1.75rem + env(safe-area-inset-bottom))",
        background: p.background,
        color: p.text,
        boxShadow: p.cardShadow,
        willChange: "transform, opacity",
        transformStyle: "preserve-3d",
      }}
      aria-labelledby="footer-heading"
    >
      <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="flex flex-col-reverse md:flex-row items-center md:items-center justify-between gap-6">
          {/* Left */}
          <motion.div
            className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full md:w-auto"
            variants={itemVariant}
          >
            {/* Logo */}
            <motion.div
              className="flex-shrink-0 flex items-center gap-3"
              variants={itemVariant}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Link to="/" aria-label="Home" className="inline-flex items-center">
                <span
                  className="relative inline-block w-[130px] h-10 md:w-[170px] md:h-12 lg:w-[200px] lg:h-14"
                >
                  <motion.img
                    src={logoLight}
                    alt="Logo"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-contain"
                    initial={false}
                    animate={{ opacity: isDark ? 0 : 1 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.22,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.img
                    src={logoDark}
                    alt="Logo dark"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-contain"
                    initial={false}
                    animate={{ opacity: isDark ? 1 : 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.22,
                      ease: "easeInOut",
                    }}
                  />
                </span>
              </Link>
            </motion.div>

            {/* Copyright */}
            <motion.div className="text-center md:text-left" variants={smallItem}>
              <div style={{ color: p.text }} className="text-sm font-semibold">
                © {new Date().getFullYear()} Aravvvv
              </div>
              <div style={{ color: p.meta }} className="text-xs mt-0.5">
                Built with React, Tailwind & Framer Motion
              </div>
            </motion.div>
          </motion.div>

          {/* Socials */}
          <motion.div
            className="w-full md:w-auto flex items-center justify-center md:justify-end gap-3"
            variants={itemVariant}
          >
            <motion.a
              {...hoverProps}
              href="https://github.com/aravind7lee"
              aria-label="Github"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 md:p-3 rounded-lg inline-flex items-center justify-center focus:outline-none"
              style={{
                background: p.socialBg,
                color: p.socialIcon,
                borderRadius: 12,
                minWidth: 44,
                minHeight: 44,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 180ms ease",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = socialFocusStyle.boxShadow)
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              variants={smallItem}
            >
              <FaGithub className="w-5 h-5" />
            </motion.a>

            <motion.a
              {...hoverProps}
              href="https://www.linkedin.com/in/aravind042"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 md:p-3 rounded-lg inline-flex items-center justify-center focus:outline-none"
              style={{
                background: p.socialBg,
                color: p.socialIcon,
                borderRadius: 12,
                minWidth: 44,
                minHeight: 44,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 180ms ease",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = socialFocusStyle.boxShadow)
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              variants={smallItem}
            >
              <FaLinkedin className="w-5 h-5" />
            </motion.a>

            <motion.a
              {...hoverProps}
              href="https://www.instagram.com/aravvvv._.20"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 md:p-3 rounded-lg inline-flex items-center justify-center focus:outline-none"
              style={{
                background: p.socialBg,
                color: p.socialIcon,
                borderRadius: 12,
                minWidth: 44,
                minHeight: 44,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 180ms ease",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = socialFocusStyle.boxShadow)
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              variants={smallItem}
            >
              <FaInstagram className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="mt-6 pt-4"
          variants={smallItem}
          style={{
            borderTop: `1px solid ${p.divider}`,
            marginTop: 18,
          }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 text-sm opacity-90">
            <motion.div className="flex items-center gap-4" variants={smallItem}>
              <Link
                to="/privacy"
                className="hover:opacity-100 transition-opacity duration-200"
                style={{ color: p.meta }}
              >
                Privacy
              </Link>
              <span className="hidden md:inline" style={{ color: p.meta }}>
                •
              </span>
              <Link
                to="/terms"
                className="hover:opacity-100 transition-opacity duration-200"
                style={{ color: p.meta }}
              >
                Terms
              </Link>
            </motion.div>

            <motion.div
              className="text-center md:text-right flex items-center justify-center gap-1"
              variants={smallItem}
              style={{ color: p.meta }}
            >
              Thanks for visiting!
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
