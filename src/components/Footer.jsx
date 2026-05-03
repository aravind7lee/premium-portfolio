// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeProvider";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className="relative w-full border-t border-white/5 bg-black/5 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Single clean row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left: Copyright */}
          <div className="text-sm text-white/60 order-2 sm:order-1">
            © {new Date().getFullYear()} Arav. All rights reserved.
          </div>

          {/* Center: Social Icons */}
          <div className="flex items-center gap-4 order-1 sm:order-2">
            <a
              href="https://github.com/aravind7lee"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-white/50 hover:text-white transition-colors duration-200"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/aravind042"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white/50 hover:text-blue-400 transition-colors duration-200"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/aravvvv._.22/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white/50 hover:text-pink-400 transition-colors duration-200"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-4 text-sm text-white/50 order-3">
            <Link to="/privacy" className="hover:text-white/80 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white/80 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}