// src/components/Hero.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ParticleBackground from "./ParticleBackground";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import ResumeButton from "./ResumeButton";
import { FiMail } from "react-icons/fi";
import Profile1 from "../assets/Profile1.jpg"; // ensure path is correct

/**
 * useScrollReveal - lightweight IntersectionObserver hook
 * - returns [ref, visible]
 * - visible toggles true when element intersects, false when it leaves (replay on re-entry).
 * - honors prefers-reduced-motion by returning visible=true immediately.
 *
 * options:
 *  - threshold: Fraction or array of fractions (default 0.15)
 *  - rootMargin: rootMargin string for early/late reveal (default "0px 0px -10% 0px")
 *  - once: if true, reveal only once (we default to false so it replays)
 */
function useScrollReveal({ threshold = 0.15, rootMargin = "0px 0px -10% 0px", once = false } = {}) {
  const ref = useRef(null);
  const reduce = usePrefersReducedMotion();
  const [visible, setVisible] = useState(reduce ? true : false);

  useEffect(() => {
    // If reduced motion is preferred, skip observer and keep visible true for instant content
    if (reduce) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    let mounted = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // use rAF for smoother DOM update scheduling
          window.requestAnimationFrame(() => {
            if (!mounted) return;
            if (entry.isIntersecting) {
              setVisible(true);
              if (once) {
                observer.unobserve(entry.target);
              }
            } else {
              // when leaving viewport, set visible false so it can replay on re-entry
              if (!once) {
                setVisible(false);
              }
            }
          });
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, [threshold, rootMargin, once, reduce]);

  return [ref, visible];
}

/* -----------------------
   Motion variants
   ----------------------- */
const contentVariant = {
  hidden: { opacity: 0, x: -36, willChange: "transform, opacity" },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const imageWrapVariant = {
  hidden: { opacity: 0, y: 28, scale: 0.99, willChange: "transform, opacity" },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Hero() {
  const reduce = usePrefersReducedMotion();

  // Two independent reveals: content column and profile-image column.
  // They replay on re-entry (once: false)
  const [contentRef, contentVisible] = useScrollReveal({ threshold: 0.12, rootMargin: "0px 0px -18% 0px", once: false });
  const [imageRef, imageVisible] = useScrollReveal({ threshold: 0.15, rootMargin: "0px 0px -20% 0px", once: false });

  // Mail setup (keeps your existing behavior)
  const EMAIL = "aravindrajaa03@gmail.com";
  const SUBJECT = "Inquiry from portfolio";
  const BODY = "";
  const mailtoHref = `mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    EMAIL
  )}&su=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}&tf=1`;

  const handleMailClick = useCallback(
    (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button === 1) return;
      e.preventDefault();

      try {
        const a = document.createElement("a");
        a.href = mailtoHref;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch {
        window.location.href = mailtoHref;
      }

      // open Gmail compose as fallback after a short delay (keeps previous logic)
      setTimeout(() => {
        if (document.visibilityState === "visible") {
          window.open(gmailComposeUrl, "_blank", "noopener,noreferrer");
        }
      }, 800);
    },
    [mailtoHref, gmailComposeUrl]
  );

  return (
    // pt-[120px] prevents overlap with a fixed navbar on mobile (adjust to match your layout)
    <section
      aria-label="Hero"
      className="relative min-h-[70vh] md:min-h-[85vh] flex items-start md:items-center pt-[120px] md:pt-0 pb-6 md:pb-8"
    >
      {/* Particle background (unchanged) */}
      <div className="absolute inset-0 -z-10">
        <ParticleBackground />
      </div>

      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start md:items-center">
          {/* CONTENT COLUMN (left on md, second on mobile) */}
          <motion.div
            // attach the observer ref to the content wrapper
            ref={contentRef}
            variants={reduce ? {} : contentVariant}
            initial="hidden"
            animate={reduce ? "visible" : contentVisible ? "visible" : "hidden"}
            className="order-2 md:order-1 space-y-6 z-10 text-center md:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              I build{" "}
              <span className="bg-gradient-to-r from-purple-400 to-teal-300 bg-clip-text text-transparent">
                premium
              </span>{" "}
              interactive web experiences.
            </h1>

            <p className="text-lg text-white/80 max-w-xl mx-auto md:mx-0">
              I craft responsive, fast, and accessible web experiences. Polished micro-interactions and performance-first design that feel premium.
            </p>

            <div className="flex gap-4 items-center justify-center md:justify-start">
              <ResumeButton />

              <a
                href={mailtoHref}
                onClick={handleMailClick}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md glass hover:scale-[1.02] transition"
                aria-label="Send me an email"
              >
                <FiMail /> Mail Me
              </a>
            </div>

            <div className="mt-6">
              <a href="#projects" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
                <span className="animate-bounce">↓</span> Scroll to projects
              </a>
            </div>
          </motion.div>

          {/* IMAGE COLUMN (right on md, first on mobile) */}
          <motion.div
            ref={imageRef}
            variants={reduce ? {} : imageWrapVariant}
            initial="hidden"
            animate={reduce ? "visible" : imageVisible ? "visible" : "hidden"}
            className="order-1 md:order-2 flex flex-col items-center md:items-end z-10"
          >
            {/* Profile card + breathing effect that runs only when image is visible & not reduced motion */}
            <div className="w-64 md:w-80 lg:w-[360px] aspect-square relative">
              <div className="absolute inset-0 rounded-2xl glass p-4 tilt-card shadow-2xl transform-gpu overflow-hidden">
                {reduce ? (
                  // reduced motion: static img
                  <img src={Profile1} alt="Aravind profile" loading="lazy" className="w-full h-full object-cover block" />
                ) : (
                  // normal: outer wrapper controlled by IntersectionObserver; inner img does a slow breathing animation while visible
                  <motion.img
                    src={Profile1}
                    alt="Aravind profile"
                    loading="lazy"
                    style={{ transformOrigin: "50% 50%" }}
                    // breathing: animate scale loop only when imageVisible
                    animate={
                      imageVisible
                        ? { scale: [1.02, 1.0, 1.02] }
                        : { scale: 1 } // reset when not visible so it will animate again on re-entry
                    }
                    transition={
                      imageVisible
                        ? { repeat: Infinity, duration: 12, ease: "easeInOut" }
                        : { duration: 0.25 }
                    }
                    className="w-full h-full object-cover block"
                  />
                )}
              </div>

              {/* Decorative glows */}
              <div className="absolute -left-12 -bottom-8 w-40 h-40 rounded-full bg-purple-600/20 blur-3xl mix-blend-screen pointer-events-none" />
              <div className="absolute -right-8 -top-6 w-28 h-28 rounded-full bg-teal-400/20 blur-2xl mix-blend-screen pointer-events-none" />
            </div>

            {/* FULLSTACK label (under the profile card) */}
            <div className="mt-6 px-14 text-sm uppercase tracking-wider text-center md:text-right font-semibold text-primary-600 dark:text-primary-400">
              Fullstack Web Developer
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
