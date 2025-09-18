import React from "react";
import { Link } from "react-router-dom";

export default function CtaBanner() {
  return (
    <section
      aria-labelledby="cta-heading"
      className={
        "relative overflow-hidden rounded-2xl p-6 md:p-8 shadow-xl ring-1 " +
        "bg-gradient-to-r from-purple-50 via-teal-50 to-white text-slate-900 ring-black/5 " +
        "dark:from-purple-700 dark:via-teal-600 dark:to-teal-500 dark:text-slate-100 dark:ring-white/10"
      }
    >
      <div
        aria-hidden="true"
        className={
          "pointer-events-none absolute -left-10 -top-10 w-72 h-72 rounded-full blur-3xl opacity-70 " +
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
      <div
        aria-hidden="true"
        className={
          "pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay " +
          "[background:radial-gradient(1200px_300px_at_-5%_0%,rgba(255,255,255,0.25),transparent_60%)] " +
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
          <Link
            to="/projects"
            className={
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors " +
              "bg-white text-slate-900 hover:bg-white/95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 " +
              "dark:bg-gradient-to-r dark:from-teal-400 dark:to-purple-600 dark:text-white dark:shadow-md"
            }
          >
            View Projects
          </Link>
          <Link
            to="/contact"
            className={
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold backdrop-blur-sm transition-colors " +
              "bg-white/40 text-slate-900 hover:bg-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 " +
              "dark:bg-black/20 dark:text-slate-100 dark:hover:bg-black/30"
            }
          >
            Contact Me
          </Link>
        </div>
      </div>
    </section>
  );
}
