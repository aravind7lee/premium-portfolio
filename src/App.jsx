// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./components/Toast";
import Breadcrumb from "./components/Breadcrumb";
import FloatingActionButton from "./components/FloatingActionButton";

// Lazy loaded pages
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Projects = React.lazy(() => import("./pages/Projects"));
const Skills = React.lazy(() => import("./pages/Skills"));
const Contact = React.lazy(() => import("./pages/Contact"));

// SIMPLE PAGE TRANSITION - WORKS 100%
function PageTransition({ children }) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// SCROLL PROGRESS INDICATOR - direct DOM, zero React state on scroll
function ScrollProgressIndicator() {
  const barRef = React.useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? window.scrollY / total : 0;
      bar.style.transform = `scaleX(${pct})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #7c3aed 0%, #06b6d4 50%, #10b981 100%)',
        transformOrigin: 'left',
        transform: 'scaleX(0)',
        zIndex: 99999,
        boxShadow: '0 0 8px rgba(124, 58, 237, 0.5)',
        willChange: 'transform',
      }}
    />
  );
}

// ROUTE PROGRESS BAR - Shows on page transitions
function RouteProgressBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    setProgress(0);
    
    const timer1 = setTimeout(() => setProgress(50), 100);
    const timer2 = setTimeout(() => setProgress(100), 300);
    const timer3 = setTimeout(() => setShow(false), 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [location.pathname]);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #06b6d4)',
      transform: `scaleX(${progress / 100})`,
      transformOrigin: 'left',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 100000,
      boxShadow: '0 0 20px rgba(236, 72, 153, 0.6)',
    }} />
  );
}

export default function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <ToastProvider>
      {/* SCROLL PROGRESS INDICATOR */}
      <ScrollProgressIndicator />
      
      {/* ROUTE PROGRESS BAR */}
      <RouteProgressBar />
      
      <div className="min-h-screen relative overflow-x-hidden">
        {/* Background gradients */}
        <div className="gradient-layer pointer-events-none">
          <div className="gradient-1 absolute inset-0 mix-blend-screen"></div>
          <div className="gradient-2 absolute inset-0 mix-blend-screen"></div>
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Floating Action Button */}
        <FloatingActionButton />

        {/* PAGE TRANSITIONS */}
        <React.Suspense fallback={null}>
          <PageTransition>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </PageTransition>

          {/* Footer */}
          <Footer />
        </React.Suspense>
      </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}
