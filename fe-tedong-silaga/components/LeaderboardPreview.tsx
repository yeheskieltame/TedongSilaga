"use client";

import React from "react";
import { ArrowRight, Trophy, Flame } from "lucide-react";
import Link from "next/link";

const TOP_PREDICTORS = [
  { rank: 1, name: "Player_0x12..5678", winRate: "92%", reward: "+12,240 WLD", streak: 8, emoji: "🥇" },
  { rank: 2, name: "Player_0xAB..9012", winRate: "87%", reward: "+9,980 WLD", streak: 5, emoji: "🥈" },
  { rank: 3, name: "Player_0x7F..3456", winRate: "85%", reward: "+8,870 WLD", streak: 4, emoji: "🥉" },
];

const LeaderboardPreview = () => {
  return (
    <section style={{ background: "#0B0F19", padding: "10rem 0" }}>
      <div className="container-wide">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "6rem",
          alignItems: "center",
        }}>
          {/* Left Side */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#6366F1", marginBottom: "1.25rem" }}>
                Elite Hall of Fame
              </div>
              <h2 style={{
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                fontWeight: 800,
                color: "#F9FAFB",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                marginBottom: "2rem",
              }}>
                The Arena&apos;s Top <br />
                <span style={{ color: "#D4A853" }}>Arena Masters</span>
              </h2>
              <p style={{ fontSize: "1.2rem", color: "#9CA3AF", lineHeight: 1.7, maxWidth: "600px" }}>
                Join the most successful predictors on World Chain. These masters have built their streaks and earned legendary status through skill and cultural knowledge.
              </p>
            </div>

            <Link href="/leaderboard" style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "1rem 2rem",
              border: "1px solid rgba(99,102,241,0.3)",
              background: "rgba(99,102,241,0.05)",
              borderRadius: "12px",
              color: "#6366F1", fontWeight: 700,
              textDecoration: "none", transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.transform = "translateX(5px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.05)"; e.currentTarget.style.transform = "translateX(0)"; }}
            >
              View Full Rankings <ArrowRight size={18} />
            </Link>
          </div>

          {/* Right Side - Leaderboard Cards */}
          <div style={{
            background: "#111827",
            border: "1px solid #1F2937",
            borderRadius: "32px",
            padding: "2.5rem",
            boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
            position: "relative",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {TOP_PREDICTORS.map((player, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "1.5rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.03)",
                  borderRadius: "20px",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,168,83,0.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.03)"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div style={{ fontSize: "2rem" }}>{player.emoji}</div>
                    <div>
                      <div style={{ fontWeight: 800, color: "#F9FAFB", fontSize: "1.1rem" }}>{player.name}</div>
                      <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
                        <span style={{ fontSize: "13px", color: "#6B7280", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Trophy size={12} /> {player.winRate} Win
                        </span>
                        <span style={{ fontSize: "13px", color: "#D4A853", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px" }}>
                          <Flame size={12} fill="#D4A853" /> {player.streak} Streak
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#22C55E", fontWeight: 900, fontSize: "1.25rem" }}>{player.reward}</div>
                    <div style={{ fontSize: "10px", color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Earned</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardPreview;
