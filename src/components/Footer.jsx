// src/components/Footer.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeProvider";
import { useScrollReveal } from "../hooks/useScrollReveal";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import logoLight from "../assets/logo.png";
import logoDark from "../assets/logo_dark.png";

export default function Footer() {
  const { isDark } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [footerRef, footerVisible] = useScrollReveal({ threshold: 0.1 });

  // Preload logos
  useEffect(() => {
    const lightImg = new Image();
    lightImg.src = logoLight;
    const darkImg = new Image();
    darkImg.src = logoDark;
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.6,
        ease: "easeOut",
      },
    },
  };

  const socialVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      {/* Animated Gradient Border Top */}
      <div className="relative w-full h-[1px] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400 via-purple-400 to-transparent"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  x: ["-100%", "100%"],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <motion.footer
        ref={footerRef}
        variants={containerVariants}
        initial="hidden"
        animate={prefersReducedMotion ? "visible" : footerVisible ? "visible" : "hidden"}
        className={`relative w-full py-8 px-4 md:px-12 ${
          isDark
            ? "bg-gradient-to-b from-indigo-900/40 via-purple-900/30 to-transparent"
            : "bg-gradient-to-b from-indigo-100 via-purple-100 to-transparent"
        }`}
        role="contentinfo"
        aria-label="Site footer"
      >
        {/* Background Glow Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }
            }
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl ${
              isDark ? "bg-indigo-500/20" : "bg-indigo-300/40"
            }`}
          />
          <motion.div
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scale: [1.1, 1, 1.1],
                    opacity: [0.2, 0.4, 0.2],
                  }
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl ${
              isDark ? "bg-purple-500/20" : "bg-purple-300/40"
            }`}
          />
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            {/* Logo Section */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col md:flex-row items-center md:items-start gap-6"
            >
              {/* Logo */}
              <motion.div
                whileHover={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: 1.05,
                        filter: "drop-shadow(0 0 20px rgba(99, 102, 241, 0.4))",
                      }
                }
                transition={{ duration: 0.3 }}
              >
                <Link to="/" aria-label="Home" className="block">
                  <div className="relative w-48 h-12 md:w-56 md:h-14">
                    <motion.img
                      src={logoLight}
                      alt="Portfolio Logo"
                      className="absolute inset-0 w-full h-full object-contain"
                      animate={{ opacity: isDark ? 0 : 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.img
                      src={logoDark}
                      alt="Portfolio Logo Dark"
                      className="absolute inset-0 w-full h-full object-contain"
                      animate={{ opacity: isDark ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </Link>
              </motion.div>

              {/* Copyright & Status */}
              <div className="text-center md:text-left space-y-2">
                <motion.div
                  className={`text-sm font-medium bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent`}
                  animate={prefersReducedMotion ? {} : {
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  © {new Date().getFullYear()} Arav - All rights reserved
                </motion.div>
                <div className={`text-xs flex items-center gap-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  <motion.span
                    animate={prefersReducedMotion ? {} : {
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    ✨
                  </motion.span>
                  Crafted with passion
                </div>
              </div>
            </motion.div>

            {/* Glassmorphism Social Icons Container */}
            <motion.div variants={itemVariants}>
              <div
                className={`flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-xl ${
                  isDark
                    ? "bg-black/20 border-white/20"
                    : "bg-white/10 border-white/20"
                } shadow-lg`}
              >
                {[
                  {
                    icon: FaGithub,
                    href: "https://github.com/aravind7lee",
                    label: "GitHub",
                  },
                  {
                    icon: FaLinkedin,
                    href: "https://www.linkedin.com/in/aravind042",
                    label: "LinkedIn",
                  },
                  {
                    icon: FaInstagram,
                    href: "https://www.instagram.com/aravvvv._.20",
                    label: "Instagram",
                  },
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    variants={socialVariants}
                    whileHover={
                      prefersReducedMotion
                        ? {}
                        : {
                            scale: 1.1,
                            filter: "drop-shadow(0 8px 16px rgba(99, 102, 241, 0.3))",
                          }
                    }
                    whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      isDark
                        ? "text-gray-300 hover:text-white hover:bg-white/10"
                        : "text-gray-700 hover:text-gray-900 hover:bg-white/20"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className={`h-px bg-gradient-to-r from-transparent via-indigo-400/30 via-purple-400/30 to-transparent mb-6`}
          />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Navigation Links */}
            <motion.div variants={itemVariants} className="flex items-center gap-6">
              {[
                { to: "/privacy", label: "Privacy" },
                { to: "/terms", label: "Terms" },
              ].map(({ to, label }) => (
                <div key={to} className="relative group">
                  <Link
                    to={to}
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isDark
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded px-2 py-1`}
                    aria-label={`Go to ${label} page`}
                  >
                    {label}
                  </Link>
                  {/* Glowing Underline Animation */}
                  <div className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              ))}
            </motion.div>

            {/* Thanks Message */}
            <motion.div
              variants={itemVariants}
              className={`text-sm font-medium tracking-wide ${
                isDark ? "text-gray-300" : "text-gray-700"
              } flex items-center gap-2`}
            >
              
              Thanks for visiting!
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </>
  );
}