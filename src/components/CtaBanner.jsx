import React from "react";

/**
 * CtaBanner.jsx
 * Enhanced CTA banner that supports both light and dark themes with
 * accessible contrast, clear focus states, and subtle decorative accents.
 *
 * Notes:
 * - Uses TailwindCSS utility classes (dark: prefixed classes for dark mode).
 * - Make sure your Tailwind config supports `dark` (class or media) and
 *   `backdrop-blur` if you want the frosted-glass effect on the secondary button.
 */

export default function CtaBanner() {
  return (
    <section
      aria-labelledby="cta-heading"
      className={
        "relative overflow-hidden rounded-2xl p-6 md:p-8 shadow-xl ring-1 " +
        // Light-mode gentle pastel gradient to keep a soft, professional tone
        "bg-gradient-to-r from-purple-50 via-teal-50 to-white text-slate-900 ring-black/5 " +
        // Dark-mode retains a bold purple→teal palette with lighter text
        "dark:from-purple-700 dark:via-teal-600 dark:to-teal-500 dark:text-slate-100 dark:ring-white/10"
      }
    >
      {/* Decorative blurred blobs (purely visual, aria-hidden) */}
      <div
        aria-hidden="true"
        className={
          "pointer-events-none absolute -left-10 -top-10 w-72 h-72 rounded-full blur-3xl opacity-70 " +
          // light / dark variants
          "bg-gradient-to-tr from-purple-200 to-purple-300 dark:from-purple-600 dark:to-purple-700/60"
        }
      />

      <div
        aria-hidden="true"
        className={
          "pointer-events-none absolute -right-10 -bottom-8 w-56 h-56 rounded-full blur-2xl opacity-60 " +
          "bg-gradient-to-tr from-teal-100 to-teal-200 dark:from-teal-500 dark:to-teal-600/60"
        }
      />

      {/* subtle soft glow overlay for shimmer — helps the CTA feel elevated */}
      <div
        aria-hidden="true"
        className={
          "pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay " +
          "[background:radial-gradient(1200px_300px_at_-5%_0%,rgba(255,255,255,0.25),transparent_60%)] " +
          // Reduce shimmer in dark mode to avoid glare
          "dark:opacity-20"
        }
      />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="max-w-xl">
          <h3
            id="cta-heading"
            className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100"
          >
            Open to Opportunities
          </h3>

          <p className="mt-1 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-200">
            Available for full-time roles, part-time roles, and collaborations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Primary call-to-action — high contrast in both modes */}
          <a
            href="/projects"
            className={
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors " +
              // Light mode: white pill with dark text for strong contrast on pastel background
              "bg-white text-slate-900 hover:bg-white/95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 " +
              // Dark mode: use a bold gradient button with white text to remain prominent
              "dark:bg-gradient-to-r dark:from-teal-400 dark:to-purple-600 dark:text-white dark:shadow-md"
            }
            aria-label="View Projects — open portfolio projects"
          >
            View Projects
          </a>

          {/* Secondary call-to-action — glass/frosted look that adapts to theme */}
          <a
            href="/contact"
            className={
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold backdrop-blur-sm transition-colors " +
              // Light glass: faint white with a slight tint so it reads on pastel background
              "bg-white/40 text-slate-900 hover:bg-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 " +
              // Dark glass: darker translucent surface for contrast on dark background
              "dark:bg-black/20 dark:text-slate-100 dark:hover:bg-black/30"
            }
            aria-label="Contact me — open contact form or email link"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}
