"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Trophy, Flame, Search, ShieldCheck, TrendingUp, Users, Star, Crown } from "lucide-react";

const LEADERBOARD_DATA = [
  { rank: 1, name: "0xAB..5678", winRate: 92, reward: "+12,240 WLD",  matches: 48, streak: 8,  verified: true  },
  { rank: 2, name: "0xDE..9012", winRate: 87, reward: "+9,980 WLD",   matches: 41, streak: 5,  verified: true  },
  { rank: 3, name: "0x7F..3456", winRate: 85, reward: "+8,870 WLD",   matches: 39, streak: 4,  verified: true  },
  { rank: 4, name: "0x98..1122", winRate: 82, reward: "+7,210 USDC",  matches: 35, streak: 3,  verified: true  },
  { rank: 5, name: "0x44..3344", winRate: 80, reward: "+6,650 WLD",   matches: 33, streak: 2,  verified: true  },
  { rank: 6, name: "0xDE..5566", winRate: 78, reward: "+5,420 WLD",   matches: 30, streak: 0,  verified: false },
  { rank: 7, name: "0x11..7788", winRate: 76, reward: "+4,910 USDC",  matches: 28, streak: 1,  verified: true  },
  { rank: 8, name: "0x90..9900", winRate: 75, reward: "+4,240 WLD",   matches: 25, streak: 2,  verified: true  },
  { rank: 9, name: "0xCC..2233", winRate: 73, reward: "+3,820 WLD",   matches: 22, streak: 0,  verified: true  },
  { rank: 10, name: "0xBB..4455", winRate: 71, reward: "+3,100 WLD",  matches: 20, streak: 1,  verified: false },
];

const RANK_MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };
const RANK_COLOR: Record<number, string> = { 1: "#EAB308", 2: "#94A3B8", 3: "#CD7F32" };
const PODIUM_HEIGHT: Record<number, string> = { 1: "5.5rem", 2: "4rem", 3: "3rem" };
const PODIUM_BG: Record<number, string> = {
  1: "linear-gradient(180deg, rgba(234,179,8,0.25) 0%, rgba(234,179,8,0.05) 100%)",
  2: "linear-gradient(180deg, rgba(148,163,184,0.2) 0%, rgba(148,163,184,0.05) 100%)",
  3: "linear-gradient(180deg, rgba(205,127,50,0.2) 0%, rgba(205,127,50,0.05) 100%)",
};

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"Season" | "Monthly" | "All-Time">("Season");
  const [search, setSearch] = useState("");

  const filtered = LEADERBOARD_DATA.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const top3 = LEADERBOARD_DATA.slice(0, 3);
  const rest = filtered.filter(p => p.rank > 3);

  // Reorder for podium display: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]];

  return (
    <div style={{ minHeight: "100vh", background: "#0B0F1A", color: "#E2E8F0" }}>
      <Navbar />

      <main style={{ paddingTop: "80px", paddingBottom: "6rem" }}>

        {/* ── Page Header ── */}
        <div className="lb-container" style={{ paddingTop: "1.5rem" }}>
          {/* Title + subtitle */}
          <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#EAB308", marginBottom: "0.5rem" }}>
              Global Rankings
            </p>
            <h1 className="lb-title">Hall of Fame</h1>
            <p className="lb-subtitle">Top predictors across the Tedong Silaga Arena</p>
          </div>

          {/* Stats summary — desktop */}
          <div className="desktop-nav-only" style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Predictors", value: "12,420", icon: <Users size={13} style={{ color: "#4F6BFF" }} /> },
              { label: "WLD Paid",   value: "58,740", icon: <TrendingUp size={13} style={{ color: "#4ADE80" }} /> },
              { label: "Top Win %",  value: "92%",     icon: <Star size={13} style={{ color: "#EAB308" }} /> },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                  {s.icon} {s.label}
                </span>
                <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#F8FAFC" }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Tab pills */}
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "2rem" }}>
            {(["Season", "Monthly", "All-Time"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "6px 18px",
                  borderRadius: "999px",
                  border: activeTab === tab ? "1px solid rgba(79,107,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                  background: activeTab === tab ? "rgba(79,107,255,0.12)" : "rgba(255,255,255,0.03)",
                  color: activeTab === tab ? "#818CF8" : "#64748B",
                  fontWeight: 700, fontSize: "12px", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── Podium Top 3 ── */}
          <div className="lb-podium">
            {podiumOrder.map((player, idx) => {
              const actualRank = player.rank;
              const isFirst = actualRank === 1;
              return (
                <div key={actualRank} style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: "0.25rem",
                  alignSelf: "flex-end",
                }}>
                  {/* Crown for #1 */}
                  {isFirst && (
                    <Crown size={24} color="#EAB308" fill="#EAB308" style={{ marginBottom: "0.25rem" }} />
                  )}

                  {/* Avatar circle */}
                  <div style={{
                    width: isFirst ? "64px" : "52px",
                    height: isFirst ? "64px" : "52px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1E293B, #0F172A)",
                    border: `3px solid ${RANK_COLOR[actualRank]}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: isFirst ? "1.5rem" : "1.2rem",
                    boxShadow: `0 0 20px ${RANK_COLOR[actualRank]}33`,
                    position: "relative",
                  }}>
                    👤
                  </div>

                  {/* Name */}
                  <span className="lb-podium-name">{player.name}</span>

                  {/* Reward */}
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#EAB308" }}>
                    {player.reward}
                  </span>

                  {/* Podium block */}
                  <div style={{
                    width: isFirst ? "100px" : "85px",
                    height: PODIUM_HEIGHT[actualRank],
                    background: PODIUM_BG[actualRank],
                    borderRadius: "12px 12px 0 0",
                    border: `1px solid ${RANK_COLOR[actualRank]}33`,
                    borderBottom: "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginTop: "0.4rem",
                  }}>
                    <span style={{
                      fontSize: isFirst ? "1.5rem" : "1.2rem",
                      fontWeight: 900,
                      color: RANK_COLOR[actualRank],
                    }}>
                      {actualRank}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Your Position ── */}
          <div style={{
            margin: "1.5rem auto", maxWidth: "500px",
            border: "1px solid rgba(79,107,255,0.3)",
            borderRadius: "14px",
            padding: "0.85rem 1.25rem",
            background: "rgba(79,107,255,0.06)",
          }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: "0.5rem" }}>
              You
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontWeight: 900, fontSize: "0.9rem", color: "#64748B", width: "32px" }}>#42</span>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "linear-gradient(135deg, #1E293B, #0F172A)",
                border: "2px solid rgba(79,107,255,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
              }}>👤</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#F1F5F9" }}>0x77c4...ca82 (You)</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#EAB308" }}>+320 WLD</div>
              </div>
            </div>
          </div>

          {/* ── Top 100 List ── */}
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", color: "#F8FAFC" }}>Top 100</h3>
              {/* Search */}
              <div style={{ position: "relative" }}>
                <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search..."
                  style={{
                    paddingLeft: "32px", paddingRight: "12px", paddingTop: "6px", paddingBottom: "6px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px", color: "#E2E8F0", fontSize: "12px",
                    outline: "none", width: "160px",
                  }}
                />
              </div>
            </div>

            {/* List items */}
            <div style={{
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              overflow: "hidden",
              background: "rgba(255,255,255,0.015)",
            }}>
              {(search ? filtered : LEADERBOARD_DATA).map((player, idx, arr) => (
                <div
                  key={player.rank}
                  className="lb-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.85rem 1.25rem",
                    borderBottom: idx < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    transition: "background 0.15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Rank */}
                  <span style={{
                    width: "28px", fontWeight: 900, fontSize: "0.85rem",
                    color: player.rank <= 3 ? RANK_COLOR[player.rank] : "#475569",
                    textAlign: "center", flexShrink: 0,
                  }}>
                    {player.rank <= 3 ? RANK_MEDAL[player.rank] : `#${player.rank}`}
                  </span>

                  {/* Avatar */}
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #1E293B, #0F172A)",
                    border: player.rank <= 3 ? `2px solid ${RANK_COLOR[player.rank]}66` : "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.9rem",
                  }}>👤</div>

                  {/* Name + verified */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#F1F5F9", display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{player.name}</span>
                      {player.verified && <ShieldCheck size={12} color="#4ADE80" />}
                    </div>
                    <div className="lb-row-meta" style={{ fontSize: "0.7rem", color: "#475569", marginTop: "1px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>{player.winRate}% win</span>
                      <span>·</span>
                      <span>{player.matches} matches</span>
                      {player.streak > 0 && (
                        <>
                          <span>·</span>
                          <span style={{ color: "#EAB308", display: "flex", alignItems: "center", gap: "2px" }}>
                            <Flame size={10} fill="#EAB308" /> {player.streak}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Reward */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "#EAB308" }}>{player.reward}</div>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "11px", color: "#334155" }}>
              Season S1: Toraja Rise · Showing top {LEADERBOARD_DATA.length}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
