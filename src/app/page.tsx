"use client";

import React from "react";
import WorldMap from "@/components/WorldMap";
import StatsPanel from "@/components/StatsPanel";
import FestivitiesPanel from "@/components/FestivitiesPanel";
import { Globe, Cpu } from "lucide-react";

export default function Home() {
  const [dateStr, setDateStr] = React.useState<string>("");

  React.useEffect(() => {
    setDateStr(new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase());
  }, []);

  return (
    <main className="app-container">
      {/* Header / Title */}
      {/* Header / Title */}
      <div className="header-container">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="glass glow-box-cyan" style={{ padding: "8px", borderRadius: "12px", pointerEvents: "auto", border: "1px solid var(--neon-cyan)" }}>
            <Globe color="var(--neon-cyan)" size={28} />
          </div>
          <div style={{ pointerEvents: "auto" }}>
            <h1 className="glow-text-cyan" style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-1px", textTransform: "uppercase" }}>
              RASTREADOR GLOBAL
            </h1>
            <p style={{ fontSize: "0.8rem", color: "var(--neon-purple)", fontWeight: 600, letterSpacing: "1px" }}>
              // MONITOREO DEL SISTEMA //
            </p>
          </div>
        </div>

        <div className="glass header-details" style={{
          padding: "8px 16px",
          fontSize: "0.8rem",
          pointerEvents: "auto",
          display: "flex",
          gap: "20px",
          border: "1px solid var(--neon-purple)",
          boxShadow: "0 0 10px rgba(91, 33, 182, 0.3)"
        }}>
          <div>
            <span style={{ opacity: 0.5 }}>FECHA: </span>
            <span style={{ color: "#fff" }}>{dateStr}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ opacity: 0.5 }}>NÚCLEO: </span>
            <span style={{ color: "var(--neon-green)", fontWeight: "bold" }}>EN LÍNEA</span>
            <Cpu size={14} color="var(--neon-green)" />
          </div>
        </div>
      </div>

      {/* Map Section */}
      {/* Map Section */}
      <div className="map-section">
        <WorldMap />
      </div>

      {/* Panels */}
      <StatsPanel />
      <FestivitiesPanel />

      {/* Visual background accents - Cyberpunk Glows */}
      <div style={{
        position: "absolute",
        top: "-10%",
        right: "-5%",
        width: "500px",
        height: "500px",
        background: "var(--neon-purple)",
        filter: "blur(180px)",
        opacity: 0.15,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 1
      }} />
      <div style={{
        position: "absolute",
        bottom: "-10%",
        left: "-5%",
        width: "600px",
        height: "600px",
        background: "var(--neon-cyan)",
        filter: "blur(200px)",
        opacity: 0.1,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 1
      }} />
    </main>
  );
}
