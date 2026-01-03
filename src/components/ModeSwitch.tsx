"use client";

import { motion } from "framer-motion";

interface ModeSwitchProps {
  mode: "country" | "timezone";
  setMode: (mode: "country" | "timezone") => void;
}

export default function ModeSwitch({ mode, setMode }: ModeSwitchProps) {
  return (
    <div className="glass" style={{
      display: "flex",
      padding: "4px",
      borderRadius: "20px",
      gap: "4px",
      position: "relative"
    }}>
      <button
        onClick={() => setMode("country")}
        style={{
          background: "transparent",
          border: "none",
          padding: "6px 12px",
          color: mode === "country" ? "#fff" : "var(--foreground)",
          fontSize: "0.8rem",
          fontWeight: 600,
          cursor: "pointer",
          zIndex: 2,
          position: "relative",
          transition: "color 0.3s"
        }}
      >
        COUNTRIES
      </button>
      <button
        onClick={() => setMode("timezone")}
        style={{
          background: "transparent",
          border: "none",
          padding: "6px 12px",
          color: mode === "timezone" ? "#fff" : "var(--foreground)",
          fontSize: "0.8rem",
          fontWeight: 600,
          cursor: "pointer",
          zIndex: 2,
          position: "relative",
          transition: "color 0.3s"
        }}
      >
        TIMEZONES
      </button>

      {/* Animated pill background */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "absolute",
          top: "4px",
          bottom: "4px",
          left: mode === "country" ? "4px" : "calc(50% + 2px)",
          width: "calc(50% - 6px)",
          background: "var(--neon-purple)",
          borderRadius: "16px",
          boxShadow: "0 0 10px var(--neon-purple)",
          zIndex: 1
        }}
      />
    </div>
  );
}
