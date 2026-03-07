"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const NEXT_MATCH_SECONDS = 19 * 60 + 42;

const StatsBar: React.FC = () => {
  const [seconds, setSeconds] = useState(NEXT_MATCH_SECONDS);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const stats = [
    {
      label: "Next Arena Start",
      value: `00:${mm}:${ss}`,
      mono: true,
      accent: "#4F6BFF",
    },
    {
      label: "Live Players",
      value: "1,420",
      suffix: "ACTIVE",
      accent: "#22C55E",
    },
    {
      label: "Total Volume",
      value: "124.5k",
      suffix: "WLD",
      accent: "#EAB308",
    },
    {
      label: "Verified Humans",
      value: "12,048",
      suffix: "World ID",
      accent: "#4F6BFF",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        marginTop: "3.5rem",
        width: "100%",
        maxWidth: "900px",
      }}
    >
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            flex: "1 1 180px",
            padding: "1.25rem 1.75rem",
            borderRight: i < stats.length - 1
              ? "1px solid rgba(255,255,255,0.06)"
              : "none",
          }}
        >
          <div style={{
            fontSize: "10px", fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#64748B", marginBottom: "8px",
          }}>
            {s.label}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{
              fontSize: s.mono ? "1.6rem" : "1.75rem",
              fontWeight: 800,
              color: s.accent,
              fontFamily: s.mono ? "var(--font-mono), monospace" : "inherit",
              letterSpacing: s.mono ? "-0.02em" : "-0.03em",
            }}>
              {s.value}
            </span>
            {s.suffix && (
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#4B5563" }}>
                {s.suffix}
              </span>
            )}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default StatsBar;
