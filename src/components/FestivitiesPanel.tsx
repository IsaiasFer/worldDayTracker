"use client";

import React, { useEffect, useState } from "react";
import { Calendar, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getFlagEmoji } from "@/lib/timeUtils";

interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  global?: boolean;
}

export default function FestivitiesPanel() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchHolidays() {
      try {
        const response = await fetch("https://date.nager.at/api/v3/NextPublicHolidaysWorldwide");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setHolidays(data.slice(0, 10)); // Top 10 upcoming holidays
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchHolidays();
  }, []);

  /* Mobile state */
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Toggle Button for Mobile/Desktop flexibility */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass hover:glow-box-cyan"
        style={{
          position: "absolute",
          top: isMobile ? "80px" : "100px",
          right: isMobile ? "20px" : "370px",
          padding: "10px",
          borderRadius: "50%",
          color: "var(--neon-green)",
          cursor: "pointer",
          border: "1px solid var(--neon-green)",
          zIndex: 50
        }}
        aria-label="Toggle Festivities"
      >
        <Calendar size={24} />
      </button>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="glass-card"
            style={{
              position: "absolute",
              top: "100px",
              right: "370px",
              width: "300px",
              maxHeight: "60vh",
              overflowY: "auto",
              padding: "20px",
              borderRadius: "16px",
              zIndex: 49,
              border: "1px solid var(--neon-green)"
            }}
          >
            <h3 className="glow-text-cyan" style={{ marginBottom: "16px", fontSize: "1.1rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "10px" }}>
              Próximas Festividades Globales
            </h3>

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                <Loader2 className="animate-spin" color="var(--neon-cyan)" />
              </div>
            ) : error ? (
              <div style={{ color: "var(--danger)", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={16} /> Error al cargar festividades
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {holidays.map((h, i) => (
                  <div key={i} style={{
                    padding: "10px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                    borderLeft: "3px solid var(--neon-green)"
                  }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{h.name}</div>
                    <div style={{ fontSize: "0.8rem", opacity: 0.7, fontStyle: "italic" }}>{h.localName}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontSize: "0.75rem", color: "var(--neon-cyan)" }}>
                      <span>{h.date}</span>
                      <span style={{ fontWeight: 700, fontSize: "1.2rem" }}>{getFlagEmoji(h.countryCode)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: "15px", fontSize: "0.7rem", opacity: 0.5, textAlign: "center" }}>
              Datos provistos por Nager.Date API
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
