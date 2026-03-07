"use client";

import React from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

const MATCHES = [
  { id: 1, a: "Tanduk Biru", b: "Sakti Toraja", loc: "Bori Arena", pool: "2,400 WLD", status: "Open" },
  { id: 2, a: "Rambu Soli", b: "Putra Alam", loc: "Marante Stadium", pool: "1,200 USDC", status: "Locked" },
  { id: 3, a: "Gorila Sakti", b: "Tanduk Mas", loc: "Kete Kesu Arena", pool: "850 WLD", status: "Open" },
  { id: 4, a: "Byson Gila", b: "Raja Langit", loc: "Sesean Arena", pool: "3,100 WLD", status: "Resolved" },
];

const MatchCard = ({ match }: { match: typeof MATCHES[0] }) => {
  return (
    <motion.div
      whileHover={{ y: -8, borderColor: "rgba(79,107,255,0.4)", background: "rgba(255,255,255,0.04)" }}
      className="match-card"
      style={{
        background: "rgba(255,255,255,0.015)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        backdropFilter: "blur(24px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <span style={{
          fontSize: "9px", fontWeight: 800, letterSpacing: "0.1em",
          color: match.status === "Open" ? "#4ADE80" : "#94A3B8",
          background: match.status === "Open" ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.05)",
          padding: "3px 10px", borderRadius: "99px", textTransform: "uppercase",
          border: `1px solid ${match.status === "Open" ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.1)"}`
        }}>
          {match.status}
        </span>
        <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#EAB308", letterSpacing: "0.02em" }}>
          {match.pool}
        </span>
      </div>

      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "0.75rem 0",
        background: "rgba(255,255,255,0.02)",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.03)"
      }}>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div className="match-card-emoji">🐃</div>
          <div className="match-card-name">{match.a}</div>
        </div>
        
        <div style={{ 
          fontSize: "0.65rem", 
          fontWeight: 900, 
          color: "#475569", 
          background: "rgba(255,255,255,0.05)",
          padding: "4px 6px",
          borderRadius: "6px",
          margin: "0 0.3rem",
          letterSpacing: "0.05em"
        }}>VS</div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <div className="match-card-emoji">🐃</div>
          <div className="match-card-name">{match.b}</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748B", fontSize: "0.75rem", fontWeight: 500, marginTop: "0.5rem" }}>
        <MapPin size={12} /> {match.loc}
      </div>

      <button className="match-card-btn" style={{
        width: "100%",
        borderRadius: "12px",
        background: match.status === "Open" ? "linear-gradient(135deg, #4F6BFF, #6366F1)" : "rgba(255,255,255,0.05)",
        border: "none", color: match.status === "Open" ? "#fff" : "#475569", fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        cursor: match.status === "Open" ? "pointer" : "default",
        fontSize: "0.8rem",
        boxShadow: match.status === "Open" ? "0 4px 20px rgba(79,107,255,0.25)" : "none",
        transition: "all 0.2s ease",
        marginTop: "0.75rem",
      }}>
        Predict Now <ArrowRight size={14} />
      </button>
    </motion.div>
  );
};

export default function MatchCarousel({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0.86, 0.93], [0, 1]);
  const y = useTransform(scrollYProgress, [0.86, 0.93], [50, 0]);
  const scale = useTransform(scrollYProgress, [0.86, 0.93], [0.97, 1]);
  
  const pointerEvents = useTransform(scrollYProgress, (v: number) => v > 0.87 ? "auto" : "none");

  return (
    <motion.section
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        opacity,
        y,
        scale,
        pointerEvents,
        position: "relative",
        zIndex: 40,
      }}
      className="match-carousel-section"
    >
      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em",
          color: "#4F6BFF", textTransform: "uppercase", marginBottom: "0.4rem"
        }}>Live Predictions</p>
        <h2 className="match-carousel-title">
          Live <span style={{ color: "#4F6BFF" }}>Arena.</span>
        </h2>
        <p className="match-carousel-desc">
          Current buffalo prediction markets synchronized from the Highlands to the World Chain.
        </p>
      </div>

      {/* Scrollable card row */}
      <div style={{
        display: "flex",
        gap: "1rem",
        overflowX: "auto",
        padding: "0.25rem 0 1rem 0",
        scrollbarWidth: "none",
        msOverflowStyle: "none"
      }} className="no-scrollbar">
        {MATCHES.map((m) => <MatchCard key={m.id} match={m} />)}
      </div>
    </motion.section>
  );
}
