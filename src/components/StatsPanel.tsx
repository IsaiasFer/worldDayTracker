"use client";

import React, { useEffect, useState } from "react";
import { getCountriesChangingDay, CountryTimeInfo } from "@/lib/timeUtils";
import { Timer, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StatsPanel() {
  const [countries, setCountries] = useState<CountryTimeInfo[]>([]);

  useEffect(() => {
    const update = () => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCountries(getCountriesChangingDay());
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeRemaining = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="glass-card" style={{
      width: "350px",
      minWidth: "350px", // prevent shrinking
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "24px",
      overflowY: "auto",
      zIndex: 10,
      borderRight: "1px solid var(--neon-purple)",
      boxShadow: "5px 0 20px rgba(0,0,0,0.5)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <Timer size={24} color="var(--neon-pink)" />
        <h2 className="glow-text-pink" style={{ fontSize: "1.25rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
          Next Midnight
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <AnimatePresence>
          {countries.map((country, idx) => (
            <motion.div
              layout
              key={country.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass"
              style={{
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                cursor: "default",
                borderLeft: idx === 0 ? "4px solid var(--neon-pink)" : "1px solid var(--glass-border)",
                boxShadow: idx === 0 ? "0 0 15px rgba(188, 19, 254, 0.1)" : "none",
                transition: "all 0.3s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.2rem" }}>{country.flag}</span>
                  <span style={{ fontWeight: 500, color: idx === 0 ? "var(--neon-pink)" : "inherit" }}>{country.name}</span>
                </div>
                <span style={{ fontSize: "0.7rem", opacity: 0.6, fontFamily: "monospace" }}>{country.timezone.split('/')[1]}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "4px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: "0.6rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "1px" }}>Local Time</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", color: "var(--neon-cyan)" }}>
                    <Clock size={14} /> {country.localTime}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <div style={{ fontSize: "0.6rem", color: "var(--neon-pink)", textTransform: "uppercase", letterSpacing: "1px" }}>T-Minus</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>
                    {formatTimeRemaining(country.timeUntilMidnight)}
                  </div>
                </div>
              </div>

              {idx === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    fontSize: "0.6rem",
                    background: "rgba(188, 19, 254, 0.1)",
                    color: "var(--neon-pink)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    textAlign: "center",
                    marginTop: "6px",
                    border: "1px solid var(--neon-pink)",
                    boxShadow: "0 0 5px var(--neon-pink)",
                    fontWeight: "bold",
                    letterSpacing: "1px"
                  }}>
                  IMMINENT CHANGE
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
