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
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeProvider";
import logoLight from "../assets/logo.png";
import logoDark from "../assets/logo_dark.png";

/**
 * Navbar.jsx
 *
 * Goals:
 *  - Make theme toggling feel buttery-smooth (60fps) for the Navbar.
 *  - Use GPU-friendly properties (opacity / transform) and will-change hints.
 *  - Preload logo images to avoid flicker on theme change.
 *  - Keep DOM updates minimal; crossfade visuals instead of re-mounting when toggling.
 *
 * Tailwind utilities assumed:
 *  - motion-reduce utilities are available (Tailwind v2.2+ or configured).
 *  - transform-gpu (optional) available; otherwise transform still works.
 *
 * Notes:
 *  - This file intentionally avoids heavy JS animation libraries for the Navbar itself.
 *  - If your global theme toggle adds heavy effects (big backdrop-blurs across the page),
 *    you may still see a brief frame drop — those should be reduced globally. This Navbar
 *    code minimizes its own expensive work.
 */

/* -------------------- Utility: prefersReducedMotion -------------------- */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mq.matches);
    handler();
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
    } else {
      // Safari fallback
      mq.addListener(handler);
    }
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", handler);
      } else {
        mq.removeListener(handler);
      }
    };
  }, []);
  return reduced;
}

/* -------------------- Logo: preloads and crossfades two images -------------------- */
const Logo = React.memo(function Logo({ isDark }) {
  const preloadedRef = useRef(false);

  useEffect(() => {
    // Preload both logos (only once). Preloading reduces flicker on toggle.
    if (!preloadedRef.current) {
      [logoLight, logoDark].forEach((src) => {
        const img = new Image();
        img.src = src;
        img.decoding = "async";
      });
      preloadedRef.current = true;
    }
  }, []);

  // Inline styles used for precise GPU hints (will-change & translateZ)
  const sharedImgStyle = {
    willChange: "opacity",
    transform: "translateZ(0)",
    imageRendering: "auto",
  };

  return (
    <Link to="/" aria-label="Home" className="flex items-center gap-3">
      <span
        className="relative inline-block w-[120px] h-8 md:w-[160px] md:h-10 lg:w-[180px] lg:h-11"
        aria-hidden="true"
      >
        {/* Light logo */}
        <img
          src={logoLight}
          alt="Logo"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          style={sharedImgStyle}
          className={`absolute inset-0 w-full h-full object-contain pointer-events-none
                      transition-opacity duration-200 ease-out motion-reduce:transition-none
                      ${isDark ? "opacity-0" : "opacity-100"}`}
        />

        {/* Dark logo */}
        <img
          src={logoDark}
          alt="Logo dark"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          style={sharedImgStyle}
          className={`absolute inset-0 w-full h-full object-contain pointer-events-none
                      transition-opacity duration-200 ease-out motion-reduce:transition-none
                      ${isDark ? "opacity-100" : "opacity-0"}`}
        />
      </span>

      <span className="sr-only">Premium Portfolio</span>
    </Link>
  );
});

/* -------------------- NavLinks: memoized list (depends only on pathname) -------------------- */
const NavLinks = React.memo(function NavLinks({ links, pathname }) {
  return (
    <>
      {links.map((l) => {
        const active = pathname === l.to;
        return (
          <Link
            key={l.to}
            to={l.to}
            className={`px-3 py-2 rounded-md text-sm transition-colors duration-150 motion-reduce:transition-none
                        ${
                          active
                            ? "bg-white/6 text-white dark:bg-white/10 dark:text-white"
                            : "text-white hover:bg-white/3 dark:text-white/90 dark:hover:bg-white/8"
                        }`}
            aria-current={active ? "page" : undefined}
          >
            {l.label}
          </Link>
        );
      })}
    </>
  );
});

/* -------------------- IconCrossfade: keeps both icons mounted and crossfades -------------------- */
function IconCrossfade({ open, size = 20 }) {
  // Use GPU-friendly properties and will-change
  const commonClass =
    "absolute inset-0 flex items-center justify-center transition-opacity transition-transform duration-180 ease-out motion-reduce:transition-none transform-gpu";
  return (
    <span
      className="relative inline-block"
      style={{ width: size, height: size, willChange: "opacity, transform" }}
      aria-hidden="true"
    >
      <FiMenu
        size={size}
        className={
          commonClass + (open ? " opacity-0 scale-95 pointer-events-none" : " opacity-100 scale-100")
        }
      />
      <FiX
        size={size}
        className={
          commonClass + (open ? " opacity-100 scale-100" : " opacity-0 scale-95 pointer-events-none")
        }
      />
    </span>
  );
}

/* -------------------- Navbar (main) -------------------- */
export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const { isDark } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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

  // Toggle handler memoized
  const toggleMenu = useCallback(() => setOpen((s) => !s), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-6 pointer-events-auto">
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <div
            // Using transform-gpu and a tiny non-layout animation for mount
            className="text-xl font-bold tracking-tight"
            style={{ transform: "translateZ(0)" }}
          >
            <Logo isDark={isDark} />
          </div>
        </div>

        {/* Desktop links + toggle */}
        <div className="hidden md:flex gap-4 items-center">
          <NavLinks links={links} pathname={location.pathname} />

          <div className="ml-1 mr-1">
            {/* ThemeToggle itself is responsible for toggling the theme context */}
            <ThemeToggle className="text-white" />
          </div>

          <a
            href="/Aravind R-Updated-Resume.pdf"
            download
            className="ml-2 px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-teal-400 text-black font-semibold shadow transform-gpu transition-transform duration-150 motion-reduce:transition-none"
            aria-label="Download resume"
            // Small transform on hover is GPU friendly; remove if user prefers reduced motion.
            onMouseDown={(e) => e.currentTarget.classList.add("active")}
            onMouseUp={(e) => e.currentTarget.classList.remove("active")}
          >
            Resume
          </a>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <div className="mr-1">
            <ThemeToggle className="text-white" />
          </div>

          <button
            onClick={toggleMenu}
            aria-label={open ? "Close menu" : "Open menu"}
            className="p-2 rounded-md glass relative overflow-hidden"
            style={{ willChange: "opacity, transform" }}
          >
            {/* Crossfading icons instead of mounting/unmounting */}
            <IconCrossfade open={open} size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile menu: keep simple, fade on mount (prefers-reduced-motion respected) */}
      {/* We intentionally render conditionally to avoid always-in-DOM mobile menu on desktop. */}
      {open && (
        <div
          className={`md:hidden mt-3 transition-opacity duration-200 motion-reduce:transition-none`}
          style={{ animationFillMode: "both" }}
          aria-hidden={false}
        >
          <div
            className="glass rounded-lg p-4 max-w-md mx-auto"
            // Keep animations GPU-friendly if any are added later
            style={{ willChange: "opacity, transform" }}
          >
            <div className="flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="py-2 px-3 rounded hover:bg-white/5 text-white transition-colors duration-150 motion-reduce:transition-none"
                  onClick={closeMenu}
                >
                  {l.label}
                </Link>
              ))}

              <div className="py-2 px-3 flex items-center gap-3">
                <span className="text-sm text-white/70">Theme</span>
                <ThemeToggle className="text-white" />
              </div>

              <a
                href="/Aravind R-Updated-Resume.pdf"
                download
                className="mt-2 inline-block px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-teal-400 text-black font-semibold"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
