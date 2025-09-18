import React from "react";
import { motion } from "framer-motion";

export default function ResumeButton() {
  const [loading, setLoading] = React.useState(false);

  const handleDownload = async () => {
    // simulate preparing resume on the server
    setLoading(true);
    // small artificial delay so user sees the skeleton/loader
    setTimeout(() => {
      setLoading(false);
      // programmatically trigger download
      const a = document.createElement("a");
      a.href = "/Aravind R-Updated-Resume.pdf";
      a.download = "Aravind R-Updated-Resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }, 900);
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        className="px-5 py-3 rounded-md bg-gradient-to-r from-purple-600 to-teal-400 text-black font-semibold shadow-md"
        aria-label="Download resume"
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="w-24 h-3 rounded bg-white/30 animate-pulse" />
            Preparing...
          </div>
        ) : (
          "Download Resume"
        )}
      </button>
    </div>
  );
}
