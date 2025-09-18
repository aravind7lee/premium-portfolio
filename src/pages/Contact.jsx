// src/pages/Contact.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ContactForm from "../components/ContactForm";
import ParticleBackground from "../components/ParticleBackground";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

/* ----------------------- Utilities ----------------------- */
const cx = (...args) => args.filter(Boolean).join(" ");

/* Safe matchMedia wrapper */
function safeMatchMedia(query) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

function detectPrefersReducedMotion() {
  return safeMatchMedia("(prefers-reduced-motion: reduce)");
}

function connectionInfo() {
  if (typeof navigator === "undefined") return { saveData: false, effectiveType: "" };
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return { saveData: !!(conn && conn.saveData), effectiveType: (conn && conn.effectiveType) || "" };
}

/* ----------------------- IntersectionObserver ----------------------- */
function useInView(ref, { threshold = 0.15, rootMargin = "0px 0px -10% 0px" } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Always trigger whenever it enters (both up & down scrolls)
          if (entry.isIntersecting) {
            setInView(true);
          } else {
            // Reset when leaving so it replays on next enter
            setInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);

    return () => {
      try {
        observer.disconnect();
      } catch {}
    };
  }, [ref, threshold, rootMargin]);

  return inView;
}

/* ----------------------- Reveal Component ----------------------- */
function Reveal({
  children,
  variant = "fade-up",
  duration = 0.6,
  delay = 0,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  className = "",
  as: Component = "div",
  style = {},
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold, rootMargin });

  const hookPref = detectPrefersReducedMotion();
  const { saveData, effectiveType } = connectionInfo();
  const reduceMotion = hookPref || saveData || /2g|slow-2g/i.test(effectiveType);

  // Animation presets
  const variants = {
    "fade-up": { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
    "fade-down": { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } },
    "slide-left": { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
    "slide-right": { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
    "zoom-in": { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } },
    none: { hidden: {}, visible: {} },
  };

  return (
    <motion.div
      ref={ref}
      as={Component}
      className={className}
      style={style}
      initial="hidden"
      animate={reduceMotion ? "visible" : inView ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{ duration: reduceMotion ? 0 : duration, delay: reduceMotion ? 0 : delay, ease: [0.25, 0.8, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------- Contact Page ----------------------- */
export default function Contact() {
  const hookPref = usePrefersReducedMotion();
  const reduce = typeof hookPref === "boolean" ? hookPref : undefined;

  return (
    <motion.main
      initial={reduce ? false : { y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="relative min-h-screen pt-24"
      aria-labelledby="contact-heading"
    >
      {/* Background aura */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 pointer-events-none"
        style={{ mixBlendMode: "screen" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(30% 24% at 10% 12%, rgba(124,58,237,0.12), transparent 12%), radial-gradient(28% 18% at 90% 88%, rgba(20,184,166,0.06), transparent 18%)",
            filter: "blur(36px)",
            opacity: 1,
            transform: "translateZ(0)",
          }}
        />
      </div>
      <div className="absolute inset-0 -z-10">
        <ParticleBackground />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-8">
          <Reveal variant="zoom-in" delay={0.1}>
            <h1 id="contact-heading" className="text-3xl md:text-4xl font-extrabold">
              Contact
            </h1>
            <p className="mt-2 text-sm text-white/70 max-w-xl">
              Have a question, collaboration idea, or want to say hi? Drop a message.
            </p>
          </Reveal>
        </header>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Contact form */}
          <Reveal variant="fade-up" delay={0.2}>
            <section className="glass rounded-lg p-8 w-full h-full flex flex-col">
              <div className="flex flex-col flex-1">
                <ContactForm />
              </div>
            </section>
          </Reveal>

          {/* Right: Details */}
          <Reveal variant="slide-left" delay={0.3}>
            <aside className="space-y-6 w-full">
              {/* Contact details */}
              <div className="glass rounded-lg p-6 w-full">
                <h2 className="text-lg font-semibold mb-3">Contact details</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-md bg-white/6 flex items-center justify-center">
                      <FaEnvelope />
                    </span>
                    <div>
                      <div className="font-medium">Email</div>
                      <a
                        className="text-sm text-white/80 hover:underline"
                        href="mailto:aravindrajaa03@gmail.com"
                      >
                        aravindrajaa03@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-md bg-white/6 flex items-center justify-center">
                      <FaPhone />
                    </span>
                    <div>
                      <div className="font-medium">Phone</div>
                      <a
                        className="text-sm text-white/80 hover:underline"
                        href="tel:9384605406"
                      >
                        +91 93846 05406
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-md bg-white/6 flex items-center justify-center">
                      <FaMapMarkerAlt />
                    </span>
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-white/80">Chennai, Tamil Nadu, India</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="glass rounded-lg p-6 w-full">
                <h3 className="font-semibold">Availability</h3>
                <p className="mt-2 text-sm text-white/80">
                  Open to full-time and contract opportunities. Available for projects, mentorship, and
                  collaborations, especially around MERN/PERN, UI/UX and performance engineering.
                </p>
              </div>

              {/* Quick links */}
              <div className="glass rounded-lg p-6 w-full">
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
        <Reveal variant="fade-up" delay={0.4}>
          <p className="mt-8 text-xs text-white/60">
            By contacting me you agree to keep things professional — I respond to reasonable messages
            and respect your privacy.
          </p>
        </Reveal>
      </div>
    </motion.main>
  );
}
