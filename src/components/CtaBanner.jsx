import React from "react";
import { Link } from "react-router-dom";

export default function CtaBanner() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl ring-1 bg-gradient-to-br from-purple-600/20 via-teal-500/20 to-blue-600/20 backdrop-blur-lg border border-white/10"
    >
      {/* Background Effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 -top-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 rounded-full blur-3xl opacity-30 bg-gradient-to-tr from-purple-500 to-purple-600"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -bottom-8 w-24 sm:w-36 md:w-56 h-24 sm:h-36 md:h-56 rounded-full blur-2xl opacity-25 bg-gradient-to-tr from-teal-400 to-teal-500"
      />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="text-center sm:text-left mb-6">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-sm">
              💼
            </span>
            <h3
              id="cta-heading"
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white"
            >
              Open to Opportunities
            </h3>
          </div>
          <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
            Available for full-time roles, part-time roles, and collaborations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <Link
            to="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4 4m4-4l-4-4" />
            </svg>
            View Projects
          </Link>
          
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Contact Me
          </Link>
        </div>
      </div>
    </section>
  );
}