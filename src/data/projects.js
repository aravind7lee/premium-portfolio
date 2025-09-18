// src/data/projects.js
// Import project thumbnails from src/assets to ensure correct bundling in Vite.
import work1 from "../assets/work-1.png";
import work2 from "../assets/work-2.png";
import work3 from "../assets/work-3.png";
import work4 from "../assets/work-4.png";
import work5 from "../assets/work-5.png";
import work6 from "../assets/work-6.jpg";

const projects = [
  {
    id: "genora",
    title: "Genora.ai — AI SaaS (PERN)",
    summary:
      "AI SaaS with subscription billing, Clerk auth, Stripe subscriptions and Neon PostgreSQL.",
    tags: ["React", "Node", "Postgres", "Clerk", "Stripe", "AI"],
    image: work4,
    details:
      "Genora.ai is a production AI SaaS featuring article & blog title generators, image generation, background/object remover and resume analyzer. Built with a PERN stack, Clerk authentication, and Stripe subscription billing; deployed on Vercel with Neon Postgres.",
    liveUrl: "https://genora-ai-phi.vercel.app/",
    repoUrl: "#",
  },
  {
    id: "chattrix",
    title: "Chattrix — Real-time Chat (MERN)",
    summary:
      "Realtime chat application using Socket.IO and a polished UI for instant messaging.",
    tags: ["Socket.IO", "MERN", "Realtime", "Websockets"],
    image: work5,
    details:
      "Chattrix is a full-stack chat app built with the MERN stack and Socket.IO. Real-time messaging, presence and media preview with a focus on low-latency interactions and mobile responsiveness.",
    liveUrl: "https://chattrix-app.vercel.app/",
    repoUrl: "#",
  },
  {
    id: "cravezyy",
    title: "Cravezyy — Food Delivery (MERN)",
    summary:
      "Full MERN food delivery platform with Meal Planner, sticky cart and nutrition filters.",
    tags: ["MERN", "MongoDB", "Express", "React", "Node", "Socket"],
    image: work2,
    details:
      "Food delivery app built on the MERN stack — features meal planning, sticky cart and nutrition based filtering. Focused on mobile-first experiences and smooth ordering flows. Deployed with Render.",
    liveUrl: "https://cravezyy-foodcra-frontend.onrender.com",
    repoUrl: "#",
  },
  {
    id: "lms",
    title: "LMS — Learning Management System (MERN)",
    summary:
      "Full-stack LMS with secure auth (Clerk), Stripe payments, educator payouts and AI tools.",
    tags: ["MERN", "Clerk", "Stripe", "AI", "Payments"],
    image: work3,
    details:
      "End-to-end Learning Management System enabling educators to publish courses and students to enroll and purchase courses. Integrated Clerk for secure auth and Stripe for purchases; includes AI helpers such as a floating chatbot and smart study plans.",
    liveUrl: "https://lms-project-self.vercel.app/",
    repoUrl: "#",
  },
  {
    id: "shopper",
    title: "Shopper — E-commerce (React)",
    summary:
      "React-based e-commerce front-end with product browsing, cart, and routing.",
    tags: ["React", "Routing", "UX", "Accessibility", "Netlify"],
    image: work1,
    details:
      "A modern shopping website built with React — focuses on customer experience, performance and accessibility. Implemented product lists, routing, cart, and checkout UI patterns. Hosted on Netlify.",
    liveUrl: "https://main--shopper-e-commerce.netlify.app/",
    repoUrl: "#",
  },
  {
    id: "booknity",
    title: "Booknity — Book Finder (React + Tailwind)",
    summary:
      "Responsive book search app using Open Library API with advanced filters & theme persistence.",
    tags: ["React", "Tailwind", "Open Library API", "Dark/Light Theme"],
    image: work6,
    details:
      "Booknity provides real-time search suggestions, language/year filters and pagination. Built with React + Tailwind; includes dark/light theme switcher with persistence and mobile-first components.",
    liveUrl: "https://booknity.netlify.app/",
    repoUrl: "#",
  },
];

export default projects;
