"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

const MATCHES = [
  { id: "1",  nameA: "Rambu",   nameB: "Tanduk", time: "00:19:42",        pool: "2,400 WLD",  players: 34, status: "Open"     },
  { id: "4",  nameA: "Putra",   nameB: "Sakti",  time: "Starts in 2h 15m",pool: "850 USDC",   players: 31, status: "Open"     },
  { id: "2",  nameA: "Gorila",  nameB: "Byson",  time: "Mar 15, 14:00",   pool: "—",          players: 12, status: "Locked"   },
  { id: "3",  nameA: "Silaga",  nameB: "Toraja", time: "Resolved 2h ago", pool: "1,200 WLD",  players: 8,  status: "Resolved" },
];

const statusConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Open:     { bg: "rgba(34,197,94,0.08)",  text: "#22C55E", border: "rgba(34,197,94,0.25)",  dot: "#22C55E"  },
  Locked:   { bg: "rgba(245,158,11,0.08)", text: "#F59E0B", border: "rgba(245,158,11,0.25)", dot: "#F59E0B"  },
  Resolved: { bg: "rgba(107,114,128,0.1)", text: "#6B7280", border: "rgba(107,114,128,0.2)", dot: "#6B7280"  },
};

function MatchCard({ id, nameA, nameB, time, pool, players, status }: (typeof MATCHES)[0]) {
  const sc = statusConfig[status];
  return (
    <div style={{
      background: "#111827",
      border: "1px solid #1F2937",
      borderRadius: "16px",
      padding: "1.5rem",
      minWidth: "300px",
      width: "300px",
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      transition: "border-color 0.2s, transform 0.2s",
      cursor: "pointer",
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#374151"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1F2937"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
    >
      {/* Status + Time Row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "3px 10px",
          background: sc.bg, border: `1px solid ${sc.border}`,
          borderRadius: "999px",
          fontSize: "11px", fontWeight: 700, color: sc.text,
          textTransform: "uppercase", letterSpacing: "0.1em",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, display: "inline-block", animation: status === "Open" ? "pulse 2s infinite" : "none" }} />
          {status}
        </div>
        <span style={{ fontSize: "12px", color: "#6B7280" }}>{time}</span>
      </div>

      {/* Buffalo VS Buffalo */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "0.5rem 0" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: 1 }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "#1A2035", border: "1px solid #1F2937",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px",
          }}>🐃</div>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#F9FAFB", textAlign: "center" }}>{nameA}</span>
        </div>

        <div style={{ fontSize: "14px", fontWeight: 800, color: "#6B7280", fontStyle: "italic" }}>VS</div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: 1 }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "#1A2035", border: "1px solid #1F2937",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px",
          }}>🐃</div>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#F9FAFB", textAlign: "center" }}>{nameB}</span>
        </div>
      </div>

      {/* Stats Divider */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 0",
        borderTop: "1px solid #1F2937", borderBottom: "1px solid #1F2937",
      }}>
        <div>
          <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B7280" }}>Prize Pool</div>
          <div style={{ fontSize: "15px", fontWeight: 800, color: "#F9FAFB", marginTop: "2px" }}>{pool}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B7280" }}>Players</div>
          <div style={{ fontSize: "15px", fontWeight: 800, color: "#F9FAFB", marginTop: "2px" }}>{players}</div>
        </div>
      </div>

      {/* CTA */}
      <Link href={`/markets/${id}`} style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
        padding: "10px 0",
        background: status === "Open" ? "#6366F1" : "rgba(30,40,65,0.8)",
        color: "#fff",
        borderRadius: "10px",
        border: status === "Open" ? "none" : "1px solid #374151",
        fontWeight: 700, fontSize: "14px",
        textDecoration: "none",
        transition: "background 0.15s",
      }}
      onMouseEnter={e => { if (status === "Open") (e.currentTarget as HTMLAnchorElement).style.background = "#818CF8"; }}
      onMouseLeave={e => { if (status === "Open") (e.currentTarget as HTMLAnchorElement).style.background = "#6366F1"; }}
      >
        {status === "Open" ? "Predict Now" : status === "Locked" ? "View Details" : "View Results"}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

const LiveMatches = () => {
  return (
    <section style={{ background: "#0B0F19", padding: "6rem 0", position: "relative" }}>
      {/* Background accent */}
      <div style={{
        position: "absolute", top: "30%", right: "-10%",
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="container-wide">
        {/* Section Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: 700, color: "#D4A853", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>
              <Flame size={13} color="#D4A853" fill="#D4A853" />
              Arena Dashboard
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, color: "#F9FAFB", letterSpacing: "-0.02em" }}>
              Active Predictions
            </h2>
          </div>
          <Link href="/markets" style={{
            display: "flex", alignItems: "center", gap: "6px",
            color: "#6366F1", fontWeight: 700, fontSize: "14px",
            textDecoration: "none",
            transition: "gap 0.2s",
          }}>
            Browse All <ArrowRight size={16} />
          </Link>
        </div>

        {/* Horizontal Scroll Strip */}
        <div style={{
          display: "flex",
          gap: "1.5rem",
          overflowX: "auto",
          paddingBottom: "1rem",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}>
          {MATCHES.map(m => <MatchCard key={m.id} {...m} />)}
        </div>
      </div>
    </section>
  );
};

export default LiveMatches;
