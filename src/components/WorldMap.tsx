"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Sphere,
  Graticule,
} from "react-simple-maps";
import { getMidnightLongitude } from "@/lib/timeUtils";
import ModeSwitch from "./ModeSwitch";
import Tooltip from "./Tooltip";
import { motion } from "framer-motion";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Generate 24 vertical bands for timezones
const timezoneBands = Array.from({ length: 24 }).map((_, i) => {
  const startLon = -180 + i * 15;
  const endLon = startLon + 15;
  const centerLon = startLon + 7.5;

  // Create a polygon for the band
  const coordinates = [
    [startLon, 90],
    [endLon, 90],
    [endLon, -90],
    [startLon, -90],
    [startLon, 90]
  ];

  return {
    type: "Feature",
    geometry: { type: "Polygon", coordinates: [coordinates] },
    properties: {
      name: `UTC ${centerLon > 0 ? '+' : ''}${Math.round(centerLon / 15)}`,
      offset: Math.round(centerLon / 15)
    },
    rsmKey: `tz-${i}`
  };
});

export default function WorldMap() {
  const [mounted, setMounted] = useState(false);
  const [midnightLon, setMidnightLon] = useState(0);
  const [mode, setMode] = useState<"country" | "timezone">("country");
  const [tooltip, setTooltip] = useState<{ content: React.ReactNode, x: number, y: number, visible: boolean }>({
    content: null, x: 0, y: 0, visible: false
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMidnightLon(getMidnightLongitude(new Date()));

    const interval = setInterval(() => {
      setMidnightLon(getMidnightLongitude(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div style={{ height: "100%", width: "100%" }} />;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "radial-gradient(circle, #1a1a40 0%, #000 100%)" }}>

      {/* Controls */}
      <div style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
        <ModeSwitch mode={mode} setMode={setMode} />
      </div>

      <Tooltip {...tooltip} />

      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{ scale: 145 }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Glow effect for the globe */}
        <Sphere id="sphere-glow" stroke="none" strokeWidth={0} fill="rgba(80, 0, 255, 0.05)" />
        <Sphere id="sphere" stroke="var(--glass-border)" strokeWidth={0.5} fill="transparent" />
        <Graticule stroke="var(--glass-border)" strokeWidth={0.3} step={[15, 15]} />

        {/* TIMEZONE BANDS LAYER */}
        {mode === "timezone" && (
          <Geographies geography={{ type: "FeatureCollection", features: timezoneBands }}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="transparent"
                  stroke="transparent"
                  style={{
                    default: { fill: "transparent" },
                    hover: { fill: "rgba(0, 243, 255, 0.1)", stroke: "var(--neon-cyan)", strokeWidth: 1 },
                    pressed: { fill: "rgba(0, 243, 255, 0.2)" }
                  }}
                  onMouseEnter={(e) => {
                    setTooltip({
                      content: <div className="glow-text-cyan" style={{ fontWeight: "bold" }}>{geo.properties.name}</div>,
                      x: e.clientX,
                      y: e.clientY,
                      visible: true
                    });
                  }}
                  onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
                  onMouseMove={(e) => setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }))}
                />
              ))
            }
          </Geographies>
        )}

        {/* COUNTRIES LAYER */}
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => {
              // Highlight based on mode
              const isHoverEnabled = mode === "country";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={mode === "country" ? "rgba(40, 40, 80, 0.6)" : "rgba(20, 20, 50, 0.3)"}
                  stroke="rgba(100, 100, 255, 0.2)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: isHoverEnabled ? {
                      fill: "var(--neon-purple)",
                      stroke: "var(--neon-cyan)",
                      strokeWidth: 1,
                      filter: "drop-shadow(0 0 5px var(--neon-purple))",
                      outline: "none"
                    } : { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                  onMouseEnter={(e) => {
                    if (mode !== "country") return;
                    setTooltip({
                      content: (
                        <div style={{ textAlign: "center" }}>
                          {/* We don't have real flags in simplified geojson, using a placeholder icon or just name */}
                          <div style={{ fontSize: "1.2rem", marginBottom: "4px" }}>🏳️</div>
                          <div style={{ fontWeight: "bold", color: "#fff" }}>{geo.properties.name}</div>
                        </div>
                      ),
                      x: e.clientX,
                      y: e.clientY,
                      visible: true
                    });
                  }}
                  onMouseLeave={() => {
                    if (mode === "country") setTooltip(prev => ({ ...prev, visible: false }));
                  }}
                  onMouseMove={(e) => {
                    if (mode === "country") setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
                  }}
                />
              );
            })
          }
        </Geographies>

        {/* Neon Midnight Line */}
        <Line
          from={[midnightLon, -90]}
          to={[midnightLon, 90]}
          stroke="var(--neon-pink)"
          strokeWidth={4}
          // Removing dash array for solid line
          style={{
            filter: "drop-shadow(0 0 10px var(--neon-pink)) drop-shadow(0 0 20px var(--neon-pink))",
            strokeLinecap: "round"
          }}
        />

      </ComposableMap>

      {/* Legend */}
      <div className="glass" style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        padding: "10px 15px",
        borderRadius: "12px",
        fontSize: "0.8rem",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        border: "1px solid var(--neon-pink)",
        boxShadow: "0 0 10px rgba(188, 19, 254, 0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "40px", height: "4px", background: "var(--neon-pink)", borderRadius: "2px", boxShadow: "0 0 8px var(--neon-pink)" }} />
          <span className="glow-text-pink" style={{ fontWeight: 600 }}>MIDNIGHT FRONT</span>
        </div>
        <div style={{ opacity: 0.8, color: "var(--neon-cyan)" }}>
          Longitude: {midnightLon.toFixed(2)}°
        </div>
      </div>
    </div>
  );
}
