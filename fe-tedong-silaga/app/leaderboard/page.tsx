"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Trophy, Flame, Search, ShieldCheck, TrendingUp, Users, Star } from "lucide-react";

const LEADERBOARD_DATA = [
  { rank: 1, name: "Player_0x12..5678", winRate: 92, reward: "+12,240 WLD",  matches: 48, streak: 8,  verified: true  },
  { rank: 2, name: "Player_0xAB..9012", winRate: 87, reward: "+9,980 WLD",   matches: 41, streak: 5,  verified: true  },
  { rank: 3, name: "Player_0x7F..3456", winRate: 85, reward: "+8,870 WLD",   matches: 39, streak: 4,  verified: true  },
  { rank: 4, name: "Player_0x98..1122", winRate: 82, reward: "+7,210 USDC",  matches: 35, streak: 3,  verified: true  },
  { rank: 5, name: "Player_0x44..3344", winRate: 80, reward: "+6,650 WLD",   matches: 33, streak: 2,  verified: true  },
  { rank: 6, name: "Player_0xDE..5566", winRate: 78, reward: "+5,420 WLD",   matches: 30, streak: 0,  verified: false },
  { rank: 7, name: "Player_0x11..7788", winRate: 76, reward: "+4,910 USDC",  matches: 28, streak: 1,  verified: true  },
  { rank: 8, name: "Player_0x90..9900", winRate: 75, reward: "+4,240 WLD",   matches: 25, streak: 2,  verified: true  },
];

const RANK_MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };
const RANK_COLOR: Record<number, string> = {
  1: "#EAB308",
  2: "#94A3B8",
  3: "#CD7F32",
};

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"Today" | "Week" | "All-Time">("Week");
  const [search, setSearch] = useState("");

  const filtered = LEADERBOARD_DATA.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0B0F1A", color: "#E2E8F0" }}>
      <Header />

      <main style={{ paddingTop: "88px" }}>

        {/* ── Page Header ── */}
        <div style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "2.5rem 0 0",
        }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>

            {/* Title + season badge */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#EAB308", marginBottom: "0.5rem" }}>
                  Global Rankings
                </p>
                <h1 style={{ fontSize: "2.2rem", fontWeight: 900, letterSpacing: "-0.04em", color: "#F8FAFC", marginBottom: "0.4rem" }}>
                  Hall of Fame
                </h1>
                <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
                  Top predictors across the Tedong Silaga Arena.
                </p>
              </div>

              {/* Season badge */}
              <div style={{
                padding: "0.75rem 1.5rem",
                border: "1px solid rgba(234,179,8,0.25)",
                borderRadius: "12px",
                background: "rgba(234,179,8,0.06)",
                display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px",
              }}>
                <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#64748B" }}>Current Season</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#EAB308", letterSpacing: "-0.02em" }}>S1: Toraja Rise</span>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "3rem", paddingBottom: "1.5rem" }}>
              {[
                { label: "Total Predictors", value: "12,420",    icon: <Users size={14} style={{ color: "#4F6BFF" }} /> },
                { label: "Total WLD Paid",   value: "58,740 WLD", icon: <TrendingUp size={14} style={{ color: "#4ADE80" }} /> },
                { label: "Top Win Rate",     value: "92%",         icon: <Star size={14} style={{ color: "#EAB308" }} /> },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#475569", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                    {s.icon} {s.label}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: "1rem", color: "#F8FAFC" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Table Container ── */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 2rem 8rem" }}>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", gap: "1rem", flexWrap: "wrap" }}>

            {/* Tab pills */}
            <div style={{ display: "flex", gap: "8px" }}>
              {(["Today", "Week", "All-Time"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "6px 18px",
                    borderRadius: "999px",
                    border: activeTab === tab ? "1px solid rgba(79,107,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    background: activeTab === tab ? "rgba(79,107,255,0.12)" : "rgba(255,255,255,0.03)",
                    color: activeTab === tab ? "#818CF8" : "#64748B",
                    fontWeight: 700, fontSize: "13px", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                type="text"
                placeholder="Search player..."
                style={{
                  paddingLeft: "36px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px", color: "#E2E8F0", fontSize: "13px",
                  outline: "none", width: "220px",
                }}
              />
            </div>
          </div>

          {/* Top 3 Podium */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            {LEADERBOARD_DATA.slice(0, 3).map(player => (
              <div
                key={player.rank}
                style={{
                  border: `1px solid ${RANK_COLOR[player.rank]}33`,
                  borderRadius: "16px",
                  padding: "1.5rem",
                  background: `rgba(${player.rank === 1 ? "234,179,8" : player.rank === 2 ? "148,163,184" : "205,127,50"},0.05)`,
                  display: "flex", flexDirection: "column", gap: "1rem",
                  position: "relative", overflow: "hidden",
                }}
              >
                {/* Glow */}
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: "80px", height: "80px",
                  background: `radial-gradient(circle, ${RANK_COLOR[player.rank]}22, transparent 70%)`,
                  pointerEvents: "none",
                }} />

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "1.8rem" }}>{RANK_MEDAL[player.rank]}</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: RANK_COLOR[player.rank] }}>
                    #{player.rank}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #1E293B, #0F172A)",
                    border: `1px solid ${RANK_COLOR[player.rank]}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px",
                  }}>👤</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "14px", color: "#F1F5F9" }}>{player.name}</div>
                    {player.streak > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#EAB308", fontSize: "11px", fontWeight: 700 }}>
                        <Flame size={11} fill="#EAB308" /> {player.streak} Streak
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                  {[
                    { label: "Win Rate", value: `${player.winRate}%`, color: "#4ADE80" },
                    { label: "Rewards",  value: player.reward,     color: "#EAB308" },
                    { label: "Matches",  value: player.matches.toString(), color: "#F1F5F9" },
                  ].map((s, i) => (
                    <div key={i} style={{
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: "8px", padding: "0.6rem 0.75rem",
                    }}>
                      <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569", marginBottom: "3px" }}>{s.label}</div>
                      <div style={{ fontWeight: 800, fontSize: "13px", color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Main Table ── */}
          <div style={{
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px", overflow: "hidden",
            background: "rgba(255,255,255,0.015)",
          }}>
            {/* Table Head */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 120px 120px 160px 100px 100px",
              padding: "0.85rem 1.5rem",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}>
              {["Rank", "Player", "Win Rate", "Matches", "Total Rewards", "Streak", "Status"].map((col, i) => (
                <div key={i} style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569" }}>
                  {col}
                </div>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((player, idx) => (
              <div
                key={player.rank}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 120px 120px 160px 100px 100px",
                  padding: "1.1rem 1.5rem",
                  borderBottom: idx < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  alignItems: "center",
                  transition: "background 0.15s",
                  cursor: "pointer",
                  position: "relative",
                  background: player.rank <= 3 ? `rgba(${player.rank === 1 ? "234,179,8" : player.rank === 2 ? "148,163,184" : "205,127,50"},0.03)` : "transparent",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                onMouseLeave={e => (e.currentTarget.style.background = player.rank <= 3 ? `rgba(${player.rank === 1 ? "234,179,8" : player.rank === 2 ? "148,163,184" : "205,127,50"},0.03)` : "transparent")}
              >
                {/* Rank */}
                <div style={{ fontWeight: 900, fontSize: "15px", color: player.rank <= 3 ? RANK_COLOR[player.rank] : "#475569" }}>
                  {player.rank <= 3 ? RANK_MEDAL[player.rank] : `#${player.rank}`}
                </div>

                {/* Player */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #1E293B, #0F172A)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px",
                  }}>👤</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#F1F5F9" }}>{player.name}</div>
                    {player.verified && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#4ADE80", fontSize: "11px", fontWeight: 700, marginTop: "2px" }}>
                        <ShieldCheck size={11} /> World ID Verified
                      </div>
                    )}
                  </div>
                </div>

                {/* Win Rate */}
                <div>
                  <div style={{ fontWeight: 800, fontSize: "14px", color: player.winRate >= 85 ? "#4ADE80" : player.winRate >= 75 ? "#EAB308" : "#F87171" }}>
                    {player.winRate}%
                  </div>
                  <div style={{ marginTop: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", height: "3px", width: "60px" }}>
                    <div style={{ width: `${player.winRate}%`, height: "100%", borderRadius: "2px", background: player.winRate >= 85 ? "#4ADE80" : player.winRate >= 75 ? "#EAB308" : "#F87171" }} />
                  </div>
                </div>

                {/* Matches */}
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#94A3B8" }}>{player.matches}</div>

                {/* Total Rewards */}
                <div style={{ fontWeight: 800, fontSize: "14px", color: "#EAB308" }}>{player.reward}</div>

                {/* Streak */}
                <div>
                  {player.streak > 0 ? (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "5px",
                      padding: "3px 10px", borderRadius: "999px",
                      background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)",
                      color: "#EAB308", fontSize: "12px", fontWeight: 700,
                    }}>
                      <Flame size={12} fill="#EAB308" /> {player.streak}
                    </span>
                  ) : (
                    <span style={{ color: "#334155", fontSize: "13px" }}>—</span>
                  )}
                </div>

                {/* Status */}
                <div>
                  {player.verified ? (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "5px",
                      padding: "3px 10px", borderRadius: "999px",
                      background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)",
                      color: "#4ADE80", fontSize: "11px", fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.06em",
                    }}>
                      <ShieldCheck size={11} /> Verified
                    </span>
                  ) : (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "5px",
                      padding: "3px 10px", borderRadius: "999px",
                      background: "rgba(100,116,139,0.08)", border: "1px solid rgba(100,116,139,0.2)",
                      color: "#64748B", fontSize: "11px", fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.06em",
                    }}>
                      Unverified
                    </span>
                  )}
                </div>

                {/* Gold shimmer for top 3 */}
                {player.rank <= 3 && (
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    width: "120px", height: "100%",
                    background: `linear-gradient(to left, ${RANK_COLOR[player.rank]}08, transparent)`,
                    pointerEvents: "none",
                  }} />
                )}
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "12px", color: "#334155" }}>
            Showing {filtered.length} of 12,420 gladiators · Season S1: Toraja Rise
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
