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

  /* Mobile state */
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="glass hover:glow-box-cyan"
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            padding: "12px",
            borderRadius: "50%",
            color: "var(--neon-pink)",
            cursor: "pointer",
            border: "1px solid var(--neon-pink)",
            zIndex: 60, // Above map controls
            pointerEvents: "auto"
          }}
          aria-label="Toggle Stats"
        >
          <Timer size={24} />
        </button>
      )}

      {/* Panel */}
      <AnimatePresence>
        {(!isMobile || isMobileOpen) && (
          <motion.div
            className="glass-card"
            initial={isMobile ? { x: "100%", opacity: 0 } : undefined}
            animate={isMobile ? { x: 0, opacity: 1 } : undefined}
            exit={isMobile ? { x: "100%", opacity: 0 } : undefined}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              width: isMobile ? "300px" : "350px",
              minWidth: isMobile ? "300px" : "350px",
              height: isMobile ? "auto" : "100%",
              maxHeight: isMobile ? "60vh" : "100%",
              position: isMobile ? "absolute" : "relative",
              bottom: isMobile ? "80px" : "auto",
              right: isMobile ? "20px" : "auto",
              borderRadius: isMobile ? "16px" : "0",
              display: "flex",
              flexDirection: "column",
              padding: "24px",
              paddingTop: isMobile ? "24px" : "100px",
              overflowY: "auto",
              zIndex: 50,
              borderRight: isMobile ? "1px solid var(--neon-purple)" : "1px solid var(--neon-purple)",
              border: isMobile ? "1px solid var(--neon-purple)" : "none", // full border for card look on mobile
              boxShadow: "5px 0 20px rgba(0,0,0,0.5)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <Timer size={24} color="var(--neon-pink)" />
              <h2 className="glow-text-pink" style={{ fontSize: "1.25rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                Próxima Medianoche
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
                        <div style={{ fontSize: "0.6rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "1px" }}>Hora Local</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", color: "var(--neon-cyan)" }}>
                          <Clock size={14} /> {country.localTime}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                        <div style={{ fontSize: "0.6rem", color: "var(--neon-pink)", textTransform: "uppercase", letterSpacing: "1px" }}>T-Menos</div>
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
                        CAMBIO INMINENTE
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
