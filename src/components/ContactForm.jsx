// src/components/ContactForm.jsx
import React from "react";
import { motion as Motion } from "framer-motion";
import confetti from "canvas-confetti";
import { FiUser, FiMail, FiTag, FiSend, FiCheck, FiCopy } from "react-icons/fi";
import { useTheme } from "../context/ThemeProvider";

/**
 * Responsive, mobile-first, accessible ContactForm.
 * Submits to Web3Forms directly.
 */

const DEST_EMAIL = "aravindrajaa03@gmail.com";
// Replace with your own web3forms access key when ready
const WEB3FORMS_ACCESS_KEY = "5d71368d-2672-4f5c-91e1-dbb7cc66c8b3";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export default function ContactForm() {
  const [status, setStatus] = React.useState("idle"); // idle | loading | success | error
  const [copied, setCopied] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const textareaRef = React.useRef(null);
  const { isDark } = useTheme();

  // auto-resize textarea
  React.useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const resize = () => {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(600, ta.scrollHeight)}px`;
    };
    resize();
    ta.addEventListener("input", resize);
    return () => ta.removeEventListener("input", resize);
  }, []);

  // reset status after success
  React.useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => setStatus("idle"), 4200);
      return () => clearTimeout(t);
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const form = e.target;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject?.value.trim() ?? "";
    const message = form.message.value.trim();
    const honeypot = form.honeypot?.value;

    if (honeypot) {
      setStatus("error");
      setErrorMessage("Spam detected.");
      return;
    }
    if (!name || !email || !message) {
      setStatus("error");
      setErrorMessage("Please fill name, email and message.");
      return;
    }

    setStatus("loading");

    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        name,
        email,
        subject,
        message,
        source: "portfolio-contact-form",
      };

      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));

      if (
        res.ok &&
        (body.success === true || typeof body.success === "undefined")
      ) {
        setStatus("success");
        form.reset();

        // small confetti
        try {
          confetti({
            particleCount: 60,
            spread: 110,
            origin: { y: 0.6 },
          });
        } catch {
          /* noop */
        }
      } else {
        console.error("Web3Forms error:", body);
        setStatus("error");
        setErrorMessage(body?.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Network error:", err);
      setStatus("error");
      setErrorMessage("Network error, please try again.");
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DEST_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  const openMailClient = () => {
    window.location.href = `mailto:${DEST_EMAIL}`;
  };

  // small spinner icon
  const Spinner = () => (
    <svg
      className="animate-spin h-5 w-5"
      viewBox="0 0 24 24"
      aria-hidden
      style={{ color: isDark ? "#ffffff" : "#111827" }}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  );

  // THE CHANGE: make the form itself the grey box (light/dark aware) and remove outer border
  const formStyles = {
    // Light theme: neutral grey background; Dark theme: subtle translucent panel
    background: isDark
      ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.03))"
      : "#f3f4f6", // tailwind gray-100 / nice soft grey
    // remove visible border (user requested no grey border around the form)
    border: "none",
    color: isDark ? "#e6eefb" : "#111827",
    // keep a subtle shadow for depth
    boxShadow: isDark
      ? "0 8px 30px -10px rgba(0,0,0,0.6)"
      : "0 6px 20px -6px rgba(16,24,40,0.06)",
  };

  // inputs keep subtle inner borders so fields are still visible
  const inputStyles = {
    background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)",
    border: isDark
      ? "1px solid rgba(255,255,255,0.06)"
      : "1px solid rgba(0,0,0,0.08)",
    color: isDark ? "#ffffff" : "#111827",
    placeholderColor: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
    focusBorder: isDark
      ? "1px solid rgba(255,255,255,0.24)"
      : "1px solid rgba(59,130,246,0.5)",
  };

  const buttonStyles = {
    background:
      "linear-gradient(to right, #8B5CF6, #06B6D4)", // keeps the accent gradient
    text: isDark ? "#000000" : "#FFFFFF",
    glass: {
      background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
      border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.08)",
      color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)",
    },
  };

  return (
    <Motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-3xl mx-auto p-6 md:p-8 rounded-2xl"
      style={formStyles}
      aria-label="Contact form"
      noValidate
    >
      {/* honeypot */}
      <input
        type="text"
        name="honeypot"
        tabIndex="-1"
        autoComplete="off"
        className="hidden"
      />

      {/* Loading overlay */}
      {status === "loading" && (
        <div
          className="absolute inset-0 z-40 rounded-2xl flex items-center justify-center"
          style={{
            background: isDark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.7)",
            borderRadius: 18,
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <Spinner />
            <div
              className="text-sm"
              style={{
                color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
              }}
            >
              Sending message...
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 sm:mb-6 text-center">
        <h3
          className="text-lg sm:text-2xl font-semibold"
          style={{ color: isDark ? "#ffffff" : "#111827" }}
        >
          Get in touch
        </h3>
        <p
          className="mt-1 text-xs sm:text-sm max-w-xl mx-auto"
          style={{
            color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
          }}
        >
          Have a project, job offer or simply want to say hi? Drop a message — I’ll reply as soon as
          possible.
        </p>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-5">
        <label className="flex flex-col text-sm">
          <span
            className="mb-2 flex items-center gap-2"
            style={{
              color: isDark ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.72)",
            }}
          >
            <FiUser /> Name
          </span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your full name"
            aria-label="Name"
            className="w-full px-4 py-3 rounded-xl outline-none transition"
            style={{
              background: inputStyles.background,
              border: inputStyles.border,
              color: inputStyles.color,
              caretColor: inputStyles.color,
            }}
            onFocus={(e) => {
              e.target.style.border = inputStyles.focusBorder;
            }}
            onBlur={(e) => {
              e.target.style.border = inputStyles.border;
            }}
          />
        </label>

        <label className="flex flex-col text-sm">
          <span
            className="mb-2 flex items-center gap-2"
            style={{
              color: isDark ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.72)",
            }}
          >
            <FiMail /> Email
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@domain.com"
            aria-label="Email"
            className="w-full px-4 py-3 rounded-xl outline-none transition"
            style={{
              background: inputStyles.background,
              border: inputStyles.border,
              color: inputStyles.color,
              caretColor: inputStyles.color,
            }}
            onFocus={(e) => {
              e.target.style.border = inputStyles.focusBorder;
            }}
            onBlur={(e) => {
              e.target.style.border = inputStyles.border;
            }}
          />
        </label>
      </div>

      <div className="mb-3 md:mb-5">
        <label className="flex flex-col text-sm">
          <span
            className="mb-2 flex items-center gap-2"
            style={{
              color: isDark ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.72)",
            }}
          >
            <FiTag /> Subject (optional)
          </span>
          <input
            name="subject"
            type="text"
            placeholder="Short subject"
            aria-label="Subject"
            className="w-full px-4 py-3 rounded-xl outline-none transition"
            style={{
              background: inputStyles.background,
              border: inputStyles.border,
              color: inputStyles.color,
              caretColor: inputStyles.color,
            }}
            onFocus={(e) => {
              e.target.style.border = inputStyles.focusBorder;
            }}
            onBlur={(e) => {
              e.target.style.border = inputStyles.border;
            }}
          />
        </label>
      </div>

      <div className="mb-3 md:mb-5">
        <label className="flex flex-col text-sm">
          <span
            className="mb-2"
            style={{
              color: isDark ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.72)",
            }}
          >
            Message
          </span>
          <textarea
            ref={textareaRef}
            name="message"
            required
            placeholder="Tell me about your project..."
            aria-label="Message"
            rows={4}
            className="w-full px-4 py-3 rounded-xl outline-none transition resize-none"
            style={{
              background: inputStyles.background,
              border: inputStyles.border,
              color: inputStyles.color,
              caretColor: inputStyles.color,
            }}
            onFocus={(e) => {
              e.target.style.border = inputStyles.focusBorder;
            }}
            onBlur={(e) => {
              e.target.style.border = inputStyles.border;
            }}
          />
        </label>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
        <Motion.button
          type="submit"
          whileTap={{ scale: 0.985 }}
          whileHover={{ scale: 1.02 }}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-medium shadow-md"
          style={{
            background: buttonStyles.background,
            color: buttonStyles.text,
          }}
          disabled={status === "loading"}
          aria-busy={status === "loading" ? "true" : "false"}
        >
          {status === "loading" ? <Spinner /> : <FiSend />}
          <span className="text-sm">
            {status === "loading" ? "Sending..." : "Submit now"}
          </span>
        </Motion.button>

        <div className="flex flex-wrap items-center gap-2 ml-0 md:ml-auto">
          <button
            type="button"
            onClick={openMailClient}
            className="px-4 py-2 rounded-lg text-sm"
            style={buttonStyles.glass}
          >
            Open Mail Client
          </button>

          <button
            type="button"
            onClick={copyEmail}
            className="px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2"
            style={buttonStyles.glass}
            aria-label="Copy email"
          >
            <FiCopy />
            <span>{copied ? "Copied!" : "Copy Email"}</span>
          </button>

          <a
            href={`mailto:${DEST_EMAIL}`}
            className="ml-0 md:ml-3 text-sm underline"
            style={{
              color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
            }}
            aria-label="Email address"
          >
            {DEST_EMAIL}
          </a>
        </div>
      </div>

      {/* status & error messages */}
      <div className="mt-3">
        {status === "success" && (
          <div
            role="status"
            className="text-sm text-green-500 flex items-center gap-2"
          >
            <FiCheck /> Message sent — thank you!
          </div>
        )}
        {status === "error" && (
          <div role="alert" className="text-sm text-red-500">
            {errorMessage || "Something went wrong. Try again or use mailto."}
          </div>
        )}
      </div>
    </Motion.form>
  );
}
