"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Search, Users, TrendingUp, Crown } from "lucide-react";
import { supabase } from "@/lib/supabase";

const RANK_MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };
const RANK_COLOR: Record<number, string> = { 1: "#EAB308", 2: "#94A3B8", 3: "#CD7F32" };
const PODIUM_HEIGHT: Record<number, string> = { 1: "5.5rem", 2: "4rem", 3: "3rem" };
const PODIUM_BG: Record<number, string> = {
  1: "linear-gradient(180deg, rgba(234,179,8,0.25) 0%, rgba(234,179,8,0.05) 100%)",
  2: "linear-gradient(180deg, rgba(148,163,184,0.2) 0%, rgba(148,163,184,0.05) 100%)",
  3: "linear-gradient(180deg, rgba(205,127,50,0.2) 0%, rgba(205,127,50,0.05) 100%)",
};

interface BuffaloRank {
  rank: number;
  id: number;
  name: string;
  total_match: number;
  total_wins: number;
  total_winning_pool: number;
  url_embed?: string;
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"Season" | "Monthly" | "All-Time">("All-Time");
  const [search, setSearch] = useState("");
  
  const [leaderboardData, setLeaderboardData] = useState<BuffaloRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const { data, error } = await supabase
          .from("buffalo")
          .select("id, buffalo_name, total_match, total_wins, total_winning_pool, url_embed")
          .order("total_wins", { ascending: false })
          .order("total_winning_pool", { ascending: false });

        if (error) throw error;

        // Map data to rank format
        const sorted = (data || []).map((b, i) => ({
             rank: i + 1,
             id: b.id,
             name: b.buffalo_name,
             total_match: b.total_match || 0,
             total_wins: b.total_wins || 0,
             total_winning_pool: b.total_winning_pool || 0,
             url_embed: b.url_embed,
        }));

        setLeaderboardData(sorted);
      } catch (err) {
        console.error("Error fetching buffalo leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLeaderboard();
  }, []);

  const filtered = leaderboardData.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const top3 = leaderboardData.slice(0, 3);
  
  // Reorder for podium display: 2nd, 1st, 3rd (if they exist)
  const podiumOrder = [];
  if (top3[1]) podiumOrder.push(top3[1]);
  if (top3[0]) podiumOrder.push(top3[0]);
  if (top3[2]) podiumOrder.push(top3[2]);

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
            <h1 className="lb-title">Buffalo Hall of Fame</h1>
            <p className="lb-subtitle">Top champion buffaloes across the Tedong Silaga Arena</p>
          </div>

          {/* Stats summary — desktop */}
          <div className="desktop-nav-only" style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Buffaloes", value: leaderboardData.length.toLocaleString(), icon: <Users size={13} style={{ color: "#4F6BFF" }} /> },
              { label: "Total Winning Pools Generated", value: `${leaderboardData.reduce((acc, b) => acc + (b.total_winning_pool || 0), 0).toLocaleString()} USDC`, icon: <TrendingUp size={13} style={{ color: "#4ADE80" }} /> },
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

          {loading ? (
             <div style={{ textAlign: "center", padding: "3rem", color: "#64748B" }}>Loading buffalo rankings...</div>
          ) : leaderboardData.length === 0 ? (
             <div style={{ textAlign: "center", padding: "3rem", color: "#64748B", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "14px", maxWidth: "400px", margin: "0 auto" }}>
               No buffaloes have been recorded yet.
             </div>
          ) : (
            <>
              {/* ── Podium Top 3 ── */}
              {podiumOrder.length > 0 && (
                <div className="lb-podium">
                  {podiumOrder.map((player) => {
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
                          width: isFirst ? "100px" : "80px",
                          height: isFirst ? "100px" : "80px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #1E293B, #0F172A)",
                          border: `4px solid ${RANK_COLOR[actualRank] || '#64748B'}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: isFirst ? "2rem" : "1.5rem",
                          boxShadow: `0 0 30px ${RANK_COLOR[actualRank] || '#64748B'}44`,
                          position: "relative",
                          overflow: "hidden"
                        }}>
                          {player.url_embed && (
                            <img 
                              src={player.url_embed} 
                              alt={player.name} 
                              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                            />
                          )}
                        </div>

                        {/* Name */}
                        <span className="lb-podium-name">{player.name}</span>

                        {/* Reward */}
                        <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#EAB308" }}>
                          {player.total_wins} Wins
                        </span>

                        {/* Podium block */}
                        <div style={{
                          width: isFirst ? "120px" : "100px",
                          height: PODIUM_HEIGHT[actualRank] || "2rem",
                          background: PODIUM_BG[actualRank] || "rgba(255,255,255,0.05)",
                          borderRadius: "12px 12px 0 0",
                          border: `1px solid ${RANK_COLOR[actualRank] || '#64748B'}33`,
                          borderBottom: "none",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          marginTop: "0.4rem",
                        }}>
                          <span style={{
                            fontSize: isFirst ? "1.5rem" : "1.2rem",
                            fontWeight: 900,
                            color: RANK_COLOR[actualRank] || '#64748B',
                          }}>
                            {actualRank}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── Top 100 List ── */}
              <div style={{ maxWidth: "700px", margin: "0 auto", marginTop: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <h3 style={{ fontWeight: 800, fontSize: "1rem", color: "#F8FAFC" }}>Top Buffaloes</h3>
                  {/* Search */}
                  <div style={{ position: "relative" }}>
                    <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      type="text"
                      placeholder="Search buffalo name..."
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
                {filtered.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "14px", color: "#64748B" }}>
                     No buffaloes match your search.
                  </div>
                ) : (
                  <div style={{
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.015)",
                  }}>
                    {filtered.map((player, idx, arr) => (
                      <div
                        key={player.rank}
                        className="lb-row"
                        style={{
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
                          width: "48px", height: "48px", borderRadius: "50%", flexShrink: 0,
                          background: "linear-gradient(135deg, #1E293B, #0F172A)",
                          border: player.rank <= 3 ? `2px solid ${RANK_COLOR[player.rank]}66` : "1px solid rgba(255,255,255,0.08)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "1.2rem",
                          overflow: "hidden",
                        }}>
                          {player.url_embed && (
                            <img 
                              src={player.url_embed} 
                              alt={player.name} 
                              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                            />
                          )}
                        </div>

                        {/* Name + verified */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#F1F5F9", display: "flex", alignItems: "center", gap: "5px" }}>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{player.name}</span>
                          </div>
                          <div className="lb-row-meta" style={{ fontSize: "0.7rem", color: "#475569", marginTop: "1px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>{player.total_match} matches fought</span>
                          </div>
                        </div>

                        {/* Middle Stats */}
                        <div style={{ textAlign: "right", flexShrink: 0, paddingRight: "20px" }}>
                          <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "#4ADE80" }}>{player.total_wins}</div>
                          <div style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Wins</div>
                        </div>

                        {/* Reward */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "#EAB308" }}>{player.total_winning_pool.toLocaleString(undefined, { maximumFractionDigits: 1 })}</div>
                          <div style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Pool Won</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
