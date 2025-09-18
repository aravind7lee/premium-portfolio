// src/components/Footer.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaInstagram, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeProvider";
import logoLight from "../assets/logo.png";
import logoDark from "../assets/logo_dark.png";

export default function Footer() {
  const { isDark } = useTheme();

  // Preload images for smoother transitions
  const preloadImages = useMemo(() => {
    const preloadLight = new Image();
    preloadLight.src = logoLight;
    const preloadDark = new Image();
    preloadDark.src = logoDark;
  }, []);

  return (
    <footer
      className="w-full"
      style={{ 
        paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
        background: isDark 
          ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" 
          : "linear-gradient(135deg, #6b46c1 0%, #805ad5 50%, #9f7aea 100%)",
        color: isDark ? "#e2e8f0" : "#f7fafc",
        boxShadow: isDark 
          ? "0 -4px 20px rgba(0, 0, 0, 0.3)" 
          : "0 -4px 20px rgba(102, 51, 204, 0.2)"
      }}
    >
      <div className="w-full mx-auto px-6 py-8 md:py-12">
        {/* Use column layout on mobile (centered), row layout on desktop */}
        <div className="flex flex-col-reverse md:flex-row items-center md:items-center justify-between gap-6">
          {/* Left: logo + meta */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full md:w-auto">
            {/* Logo (theme-aware crossfade like Navbar) */}
            <motion.div
              className="flex-shrink-0"
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45 }}
            >
              <Link to="/" aria-label="Home" className="inline-flex items-center">
                <span className="relative inline-block w-[120px] h-8 md:w-[160px] md:h-10 lg:w-[180px] lg:h-11">
                  <motion.img
                    src={logoLight}
                    alt="Logo"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-contain"
                    initial={false}
                    animate={{ 
                      opacity: isDark ? 0 : 1,
                    }}
                    transition={{ 
                      duration: 0.2,
                      ease: "easeInOut"
                    }}
                    style={{ 
                      willChange: "opacity",
                      transform: "translateZ(0)",
                      backfaceVisibility: "hidden"
                    }}
                  />
                  <motion.img
                    src={logoDark}
                    alt="Logo dark"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-contain"
                    initial={false}
                    animate={{ 
                      opacity: isDark ? 1 : 0,
                    }}
                    transition={{ 
                      duration: 0.2,
                      ease: "easeInOut"
                    }}
                    style={{ 
                      willChange: "opacity",
                      transform: "translateZ(0)",
                      backfaceVisibility: "hidden"
                    }}
                  />
                </span>
                <span className="sr-only">Premium Portfolio</span>
              </Link>
            </motion.div>

            {/* Copyright & meta */}
            <div className="text-center md:text-left">
              <div className="text-sm font-medium">© {new Date().getFullYear()} Aravvvv</div>
              <div className="text-xs opacity-80 mt-0.5">
                Built with React, Tailwind & Framer Motion
              </div>
            </div>
          </div>

          {/* Right: social icons */}
          <div className="w-full md:w-auto flex items-center justify-center md:justify-end gap-3">
            <motion.a
              whileHover={{ 
                scale: 1.1,
                y: -2,
                backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.25)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              href="https://github.com/aravind7lee"
              aria-label="Github"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 md:p-3 rounded-md inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
                color: isDark ? "#e2e8f0" : "#f7fafc"
              }}
            >
              <FaGithub className="w-5 h-5" />
            </motion.a>

            <motion.a
              whileHover={{ 
                scale: 1.1,
                y: -2,
                backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.25)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              href="https://www.linkedin.com/in/aravind042"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 md:p-3 rounded-md inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
                color: isDark ? "#e2e8f0" : "#f7fafc"
              }}
            >
              <FaLinkedin className="w-5 h-5" />
            </motion.a>

            <motion.a
              whileHover={{ 
                scale: 1.1,
                y: -2,
                backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.25)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              href="https://www.instagram.com/aravvvv._.20"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 md:p-3 rounded-md inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
                color: isDark ? "#e2e8f0" : "#f7fafc"
              }}
            >
              <FaInstagram className="w-5 h-5" />
            </motion.a>
          </div>
        </div>

        {/* Optional: small divider and extra links (mobile-friendly) */}
        <motion.div 
          className="mt-6 border-t pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ 
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)" 
          }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 text-sm opacity-80">
            <div className="flex items-center gap-3">
              <Link 
                to="/privacy" 
                className="hover:opacity-100 transition-opacity duration-200"
                style={{ opacity: 0.8 }}
              >
                Privacy
              </Link>
              <span className="hidden md:inline">•</span>
              <Link 
                to="/terms" 
                className="hover:opacity-100 transition-opacity duration-200"
                style={{ opacity: 0.8 }}
              >
                Terms
              </Link>
            </div>

            <div className="text-center md:text-right flex items-center justify-center gap-1">
              Thanks for visiting!
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}