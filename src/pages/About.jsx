// src/pages/About.jsx
import React, {
  useEffect,
  useRef,
  useState,
  cloneElement,
  Children,
} from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaExternalLinkAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import ParticleBackground from "../components/ParticleBackground";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import Profile1 from "../assets/Profile1.jpg";
import { SkeletonArticle, useSkeletonAsync } from "../components/skeleton";

/* ---------- Utility: combine class names ---------- */
const cx = (...args) => args.filter(Boolean).join(" ");

/* ---------- Prefers-reduced-motion fallback ---------- */
function usePrefersReducedMotionFallback() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function")
    return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------- Reveal component (scroll-reveal) ---------- */
function Reveal({
  as: Component = "div",
  className = "",
  threshold = 0.2,
  rootMargin = "0px 0px -10% 0px",
  stagger = 0,
  delay = 0,
  duration = 700,
  children,
  reduceMotion = false,
  style = {},
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true);
          else setVisible(false);
        });
      },
      { threshold, rootMargin }
    );
    observer.observe(el);

    const onFocusIn = () => setVisible(true);
    el.addEventListener("focusin", onFocusIn);

    if (el.getBoundingClientRect().top < window.innerHeight) setVisible(true);

    return () => {
      if (observer && observer.unobserve) observer.unobserve(el);
      el.removeEventListener("focusin", onFocusIn);
    };
  }, [reduceMotion, threshold, rootMargin]);

  const variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: duration / 1000,
        ease: [0.2, 0.9, 0.2, 1],
        delay: delay / 1000,
      },
    },
  };

  const renderChildren = () => {
    const childArray = Children.toArray(children);
    if (stagger > 0 && childArray.length > 1) {
      return childArray.map((child, idx) => {
        const childDelay = delay + idx * stagger;
        if (React.isValidElement(child)) {
          return cloneElement(child, {
            key: idx,
            style: { ...(child.props.style || {}) },
            "data-delay": childDelay,
          });
        }
        return (
          <span key={idx} data-delay={childDelay}>
            {child}
          </span>
        );
      });
    }
    return children;
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={variants}
      className={cx(
        className,
        "transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
      )}
      style={style}
      {...rest}
    >
      {renderChildren()}
    </motion.div>
  );
}

/* ---------- Main About Page ---------- */
export default function About() {
  let reduce = usePrefersReducedMotion();
  if (typeof reduce === "undefined") reduce = usePrefersReducedMotionFallback();

  // Simulate loading about data
  const {
    data: aboutData,
    isLoading,
    error,
  } = useSkeletonAsync(async () => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { loaded: true };
  });

  const person = {
    name: "Aravind Raja",
    title: "Full Stack Web Developer",
    location: "Chennai, India",
    email: "aravindrajaa03@gmail.com",
    phone: "9384605406",
    github: "https://github.com/aravind7lee",
    linkedin: "https://www.linkedin.com/in/aravind042",
    portfolio: "https://aravind-portfolio-page.netlify.app/",
    summary:
      "Passionate and detail-oriented Full Stack Developer with expertise in MERN/PERN stacks — building scalable, performant web applications. Proficient in React.js, JavaScript (ES6+), Node.js, Express.js, MongoDB, and PostgreSQL. Strong focus on UI/UX, accessibility, and shipping production-quality features.",
    experiences: [
      {
        role: "Full Stack Web Development Intern",
        company: "PrepInsta Technologies",
        period: "July 2024 – October 2024",
        bullets: [
          "Built responsive UIs with React.js, HTML5, CSS3 and modern JS (ES6+).",
          "Developed REST APIs using Node.js, Express.js and MongoDB.",
          "Integrated Stripe payments, implemented JWT authentication, and improved SEO & accessibility.",
        ],
      },
      {
        role: "Full Stack Development Intern",
        company: "AICTE Eduskills",
        period: "December 2024 – March 2025",
        bullets: [
          "Delivered full-stack features using React.js, Node.js, Express.js and Tailwind CSS with a mobile-first approach.",
          "Followed Agile workflows, used Git/GitHub for collaboration and ensured cross-browser compatibility.",
        ],
      },
    ],
    skills: {
      frontend: ["HTML5", "CSS3 (Tailwind CSS)", "React.js", "Framer Motion"],
      backend: ["Node.js", "Express.js", "RESTful APIs"],
      languages: ["JavaScript (ES6+)", "Python"],
      db: ["MongoDB (Mongoose)", "PostgreSQL"],
      tools: ["Git", "GitHub", "VS Code", "Chrome DevTools"],
      soft: ["Problem-Solving", "Communication", "Teamwork", "Decision-Making"],
    },
    projects: [
      {
        name: "Cravezy - Food Delivery Website",
        url: "https://foodcra-frontend.onrender.com/",
        details:
          "Food delivery web app with JWT auth, Stripe payments and real-time order management (MongoDB). Features: meal planner, sticky cart, dark mode and nutrition filters.",
      },
      {
        name: "Genora - AI SaaS Application",
        url: "https://genora-ai-phi.vercel.app/",
        details:
          "PERN Stack SaaS product with Clerk auth, Stripe subscription billing and AI-powered tools (article generator, resume analyzer, image tools).",
      },
      {
        name: "Chattrix - MERN Chat Application",
        url: "https://chattrix-app.vercel.app/",
        details:
          "Real-time chat using Socket.IO, React, Node, and MongoDB. Responsive UI, deployed on Vercel.",
      },
    ],
    education: [
      {
        degree: "Master of Computer Application (MCA)",
        institute: "SRM Institute of Science and Technology, Chennai",
        years: "2023 – 2025",
        cgpa: "9.73",
      },
      {
        degree: "Bachelor of Computer Application (BCA)",
        institute: "SRM Institute of Science and Technology, Chennai",
        years: "2020 – 2023",
        cgpa: "9.30",
      },
    ],
    certifications: [
      "Full Stack Web Development - Udemy",
      "Machine Learning Tools and Algorithms - Object Automation",
    ],
  };

  const chip = (text) => (
    <span
      key={text}
      className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-white/6 text-white/90"
    >
      {text}
    </span>
  );

  return (
    <motion.main
      initial={reduce ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.45 }}
      className="relative min-h-screen pt-24"
      aria-labelledby="about-heading"
    >
      {/* background */}
      <div className="absolute inset-0 -z-10">
        <ParticleBackground />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {isLoading ? (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded-lg w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded-lg w-64 animate-pulse"></div>
            </div>
            <SkeletonArticle />
          </div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p>Failed to load about content. Please refresh the page.</p>
          </div>
        ) : (
          <>
            <header className="mb-6">
              <Reveal delay={30} duration={500} reduceMotion={reduce}>
                <h1
                  id="about-heading"
                  className="text-3xl md:text-4xl font-extrabold"
                >
                  About
                </h1>
                <p className="mt-2 text-sm text-white/70">
                  My professional journey at a glance.
                </p>
              </Reveal>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile / Contact */}
              <aside className="order-1 md:order-1">
                <div className="glass rounded-xl border border-white/10 p-6 shadow-lg">
                  <Reveal stagger={120} duration={600} reduceMotion={reduce}>
                    <img
                      src={Profile1}
                      alt={`${person.name} profile`}
                      className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-2xl shadow-lg mx-auto"
                    />
                    <div className="mt-4 text-center">
                      <h2 className="text-xl font-bold">{person.name}</h2>
                      <div className="text-sm text-white/70 mt-1">
                        {person.title}
                      </div>

                      <div className="mt-4 flex flex-col gap-2 w-full">
                        <a
                          href={`mailto:${person.email}`}
                          className="inline-flex items-center gap-2 justify-center px-4 py-2 rounded-md glass"
                        >
                          <FaEnvelope /> {person.email}
                        </a>

                        <a
                          href={`tel:${person.phone}`}
                          className="inline-flex items-center gap-2 justify-center px-4 py-2 rounded-md glass"
                        >
                          <FaPhone /> {person.phone}
                        </a>

                        <div className="flex items-center justify-center gap-3 mt-2">
                          <a
                            aria-label="GitHub"
                            href={person.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-md glass"
                          >
                            <FaGithub />
                          </a>
                          <a
                            aria-label="LinkedIn"
                            href={person.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-md glass"
                          >
                            <FaLinkedin />
                          </a>
                          <a
                            aria-label="Portfolio"
                            href={person.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-md glass"
                          >
                            <FaExternalLinkAlt />
                          </a>
                        </div>

                        <a
                          href="/Aravind R-Updated-Resume.pdf"
                          download
                          className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-teal-400 text-black font-semibold"
                        >
                          Download Resume
                        </a>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </aside>

              {/* Main content */}
              <section className="order-2 md:order-2 md:col-span-2 space-y-6">
                {/* Summary */}
                <div className="glass rounded-xl border border-white/10 p-6 shadow-lg">
                  <Reveal duration={700} reduceMotion={reduce}>
                    <h3 className="text-lg font-semibold mb-2">Summary</h3>
                    <p className="text-white/80 leading-relaxed">
                      {person.summary}
                    </p>
                  </Reveal>
                </div>

                {/* Skills */}
                <div className="glass rounded-xl border border-white/10 p-6 shadow-lg">
                  <Reveal stagger={60} duration={600} reduceMotion={reduce}>
                    <h3 className="text-lg font-semibold mb-3">Skills</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <div className="text-xs text-white/60 mb-2">
                          Front-End
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {person.skills.frontend.map((s) => chip(s))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-white/60 mb-2">
                          Back-End & DB
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {person.skills.backend.map((s) => chip(s))}
                          {person.skills.db.map((s) => chip(s))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-white/60 mb-2">
                          Languages & Tools
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {person.skills.languages.map((s) => chip(s))}
                          {person.skills.tools.map((s) => chip(s))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-white/60">
                      <strong>Soft skills:</strong>{" "}
                      {person.skills.soft.join(", ")}
                    </div>
                  </Reveal>
                </div>

                {/* Experience */}
                <div className="glass rounded-xl border border-white/10 p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">Experience</h3>
                  <div className="space-y-4">
                    {person.experiences.map((exp, idx) => (
                      <Reveal
                        key={exp.company}
                        delay={idx * 150}
                        duration={650}
                        reduceMotion={reduce}
                      >
                        <div className="flex items-baseline justify-between">
                          <div>
                            <div className="font-medium">{exp.role}</div>
                            <div className="text-xs text-white/70">
                              {exp.company}
                            </div>
                          </div>
                          <div className="text-xs text-white/60">
                            {exp.period}
                          </div>
                        </div>
                        <ul className="mt-2 ml-4 list-disc text-white/70 space-y-1">
                          {exp.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </Reveal>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="glass rounded-xl border border-white/10 p-6 shadow-lg">
                  <Reveal stagger={80} reduceMotion={reduce}>
                    <h3 className="text-lg font-semibold mb-3">
                      Selected projects
                    </h3>
                    <div className="space-y-4">
                      {person.projects.map((p) => (
                        <div
                          key={p.name}
                          className="md:flex md:justify-between md:items-start"
                        >
                          <div>
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium inline-flex items-center gap-2 hover:underline"
                            >
                              {p.name} <FaExternalLinkAlt className="text-xs" />
                            </a>
                            <p className="text-xs text-white/70 mt-1">
                              {p.details}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                </div>

                {/* Education & Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass rounded-xl border border-white/10 p-6 shadow-lg">
                    <Reveal duration={650} reduceMotion={reduce}>
                      <h3 className="text-lg font-semibold mb-3">Education</h3>
                      <div className="space-y-3 text-sm">
                        {person.education.map((edu) => (
                          <div key={edu.degree}>
                            <div className="font-medium">{edu.degree}</div>
                            <div className="text-xs text-white/70">
                              {edu.institute}
                            </div>
                            <div className="text-xs text-white/60">
                              {edu.years} • CGPA: {edu.cgpa}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Reveal>
                  </div>

                  <div className="glass rounded-xl border border-white/10 p-6 shadow-lg">
                    <Reveal duration={650} reduceMotion={reduce}>
                      <h3 className="text-lg font-semibold mb-3">
                        Certifications
                      </h3>
                      <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
                        {person.certifications.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </Reveal>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </motion.main>
  );
}
