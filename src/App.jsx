// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary"; // import ErrorBoundary

// Lazy loaded pages
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Projects = React.lazy(() => import("./pages/Projects"));
const Skills = React.lazy(() => import("./pages/Skills"));
const Contact = React.lazy(() => import("./pages/Contact"));

export default function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      {/* rely on CSS variables in index.css for background and text color */}
      <div className="min-h-screen relative overflow-x-hidden">
        {/* Background gradients */}
        <div className="gradient-layer pointer-events-none">
          <div className="gradient-1 absolute inset-0 mix-blend-screen"></div>
          <div className="gradient-2 absolute inset-0 mix-blend-screen"></div>
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Page transitions + lazy loading */}
        <React.Suspense
          fallback={<div className="pt-24 px-6 text-white/70">Loading...</div>}
        >
          <AnimatePresence mode="wait" initial={false}>
            <Routes key={location.pathname} location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/contact" element={<Contact />} />
              {/* fallback route */}
              <Route path="*" element={<Home />} />
            </Routes>
          </AnimatePresence>
        </React.Suspense>

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
