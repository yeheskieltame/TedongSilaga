"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Search, SlidersHorizontal, ChevronDown, TrendingUp, Zap, ChevronRight, PlusCircle } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { supabase } from "@/lib/supabase";
import { TEDONG_MARKET_ABI } from "@/constants/tedong_market_abi";

const STATUS_COLORS: Record<string, { dot: string; text: string; bg: string }> = {
  Open:     { dot: "#4ADE80", text: "#4ADE80", bg: "rgba(74,222,128,0.1)" },
  Locked:   { dot: "#FBBF24", text: "#FBBF24", bg: "rgba(251,191,36,0.1)" },
  Resolved: { dot: "#94A3B8", text: "#94A3B8", bg: "rgba(148,163,184,0.1)" },
};

// Sub-component to fetch and render dynamic market state
function MarketDynamicData({ marketAddress }: { marketAddress: string }) {
  const { data: totalPoolData } = useReadContract({
    address: marketAddress as `0x${string}`,
    abi: TEDONG_MARKET_ABI,
    functionName: "getTotalPool",
  });
  
  const { data: statusData } = useReadContract({
    address: marketAddress as `0x${string}`,
    abi: TEDONG_MARKET_ABI,
    functionName: "status",
  });

  const pool = totalPoolData ? `${parseFloat(formatUnits(totalPoolData as bigint, 6)).toLocaleString()} USDC` : "0 USDC";
  
  // Status mapping: 0 = Open, 1 = Locked, 2 = Resolved
  let statusText = "Open";
  if (statusData === 1) statusText = "Locked";
  if (statusData === 2) statusText = "Resolved";
  
  const sc = STATUS_COLORS[statusText] || STATUS_COLORS["Open"];

  return (
    <>
      <div className="dynamic-pool" style={{ fontWeight: 800, fontSize: "14px", color: "#EAB308" }}>{pool}</div>
      <div className="dynamic-status">
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          padding: "3px 10px", borderRadius: "999px",
          background: sc.bg, fontSize: "11px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.08em", color: sc.text,
        }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            display: "inline-block", background: sc.dot,
            animation: statusText === "Open" ? "pulse 2s infinite" : "none"
          }} />
          {statusText}
        </span>
      </div>
    </>
  );
}


export default function MarketsPage() {
  const { address } = useAccount();
  const isAdmin = address?.toLowerCase() === "0x7c1f9bcdea7c160e4763d6da06399a7d363a9e22";

  const [markets, setMarkets] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchMarkets() {
      try {
        const { data, error } = await supabase
          .from("markets")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        setMarkets(data || []);
      } catch (e) {
        console.error("Failed to fetch markets", e);
      } finally {
        setLoading(false);
      }
    }
    fetchMarkets();
  }, []);

  // For now, filtering only by search text since status is dynamic in contract
  const filtered = markets.filter(m => {
    const marketObj = m as Record<string, string>;
    const matchesSearch = search === "" ||
      (marketObj.buffalo_a_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (marketObj.buffalo_b_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (marketObj.arena_name?.toLowerCase() || "").includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0B0F1A", color: "#E2E8F0" }}>
      <Navbar />

      <main style={{ paddingTop: "80px", paddingBottom: "6rem" }}>

        {/* ── Page Header ── */}
        <div style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "1.5rem 0 0",
        }}>
          <div className="markets-container">
            {/* Title row */}
            <div className="markets-header-row">
              <div>
                <h1 className="markets-title">Arena Markets</h1>
                <p className="markets-subtitle">Live and upcoming buffalo prediction markets on World Chain.</p>
              </div>

              {/* Top-right stat & Admin Actions — desktop only */}
              <div className="desktop-nav-only" style={{ display: "flex", alignItems: "center" }}>
                
                {/* Admin Create Market Button */}
                {isAdmin && (
                  <Link href="/admin/create-market" style={{ textDecoration: "none" }}>
                    <button style={{
                      padding: "0.6rem 1.2rem",
                      borderRadius: "999px",
                      background: "linear-gradient(135deg, #4F6BFF, #6366F1)",
                      border: "1px solid rgba(79,107,255,0.4)",
                      fontSize: "0.8rem", color: "#FFF", fontWeight: 700,
                      display: "flex", alignItems: "center", gap: "8px",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(79,107,255,0.3)",
                      marginBottom: "10px"
                    }}>
                      <PlusCircle size={16} />
                      Create Market
                    </button>
                  </Link>
                )}

                <div style={{
                  padding: "0.6rem 1.2rem",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.03)",
                  fontSize: "0.8rem", color: "#94A3B8",
                  display: "flex", alignItems: "center", gap: "8px"
                }}>
                  <Zap size={14} color="#4F6BFF" />
                  Markets: <strong style={{ color: "#F8FAFC" }}>{markets.length} Deployed</strong>
                </div>
              </div>
            </div>

            {/* Stats row - Removed Players and Resolved Today as requested */}
            <div className="markets-stats-row" style={{ paddingBottom: "1.5rem" }}>
              {[
                { label: "Active Markets",    value: `${markets.length} Markets`,  icon: <TrendingUp size={12} style={{ color: "#4ADE80" }} /> },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                    {s.icon} {s.label}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#F8FAFC" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="markets-container" style={{ paddingTop: "1.25rem" }}>

          {/* Toolbar */}
          <div className="markets-toolbar">
            {/* Filter pills */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
              <SlidersHorizontal size={14} style={{ color: "#475569", marginRight: "2px" }} />
              <button
                style={{
                  padding: "4px 12px",
                  borderRadius: "999px",
                  border: "1px solid rgba(79,107,255,0.5)",
                  background: "rgba(79,107,255,0.12)",
                  color: "#818CF8",
                  fontWeight: 700, fontSize: "12px", cursor: "pointer",
                }}
              >
                All Markets
              </button>
            </div>

            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                type="text"
                placeholder="Search buffalo..."
                style={{
                  paddingLeft: "32px", paddingRight: "12px", paddingTop: "6px", paddingBottom: "6px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px", color: "#E2E8F0", fontSize: "12px",
                  outline: "none", width: "100%", maxWidth: "200px",
                }}
              />
            </div>
          </div>

          {/* ── Desktop Table (hidden on mobile) ── */}
          <div className="desktop-nav-only" style={{
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            overflow: "hidden",
            background: "rgba(255,255,255,0.015)",
          }}>
            {/* Table Head */}
            <div style={{
              display: "grid",
              // Adjusted grid columns since we removed Players and Winrate
              gridTemplateColumns: "2.5fr 2.5fr 1.5fr 1.5fr 1fr",
              padding: "0.85rem 1.5rem",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}>
              {["Buffalo A", "Buffalo B", "Arena", "Prize Pool", "Status"].map((col, i) => (
                <div key={i} style={{
                  fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                  color: "#475569", display: "flex", alignItems: "center", gap: "4px"
                }}>
                  {col} {i === 3 && <ChevronDown size={11} />}
                </div>
              ))}
            </div>

            {/* Table Rows */}
            {loading ? (
               <div style={{ padding: "5rem", textAlign: "center", color: "#475569", fontWeight: 600 }}>
                 Loading markets from blockchain...
               </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "5rem", textAlign: "center", color: "#475569" }}>
                No markets found matching your search.
              </div>
            ) : filtered.map((mObj, idx) => {
              const m = mObj as Record<string, string>;
              return (
                <Link key={m.market_address} href={`/markets/${m.market_address}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      display: "grid",
                      // Matching grid template
                      gridTemplateColumns: "2.5fr 2.5fr 1.5fr 1.5fr 1fr",
                      padding: "1.1rem 1.5rem",
                      borderBottom: idx < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Buffalo A */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "34px", height: "34px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #1E293B, #0F172A)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
                      }}>🐃</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "14px", color: "#F1F5F9" }}>{m.buffalo_a_name}</div>
                      </div>
                    </div>
                    {/* Buffalo B */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "34px", height: "34px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #1E293B, #0F172A)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
                      }}>🐃</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "14px", color: "#F1F5F9" }}>{m.buffalo_b_name}</div>
                      </div>
                    </div>
                    {/* Arena */}
                    <div style={{ fontSize: "13px", color: "#94A3B8" }}>{m.arena_name}</div>
                    
                    {/* Dynamic Pool & Status from Subcomponent */}
                    <MarketDynamicData marketAddress={m.market_address} />

                  </div>
                </Link>
              );
            })}
          </div>

          {/* ── Mobile Card View (hidden on desktop) ── */}
          <div className="mobile-nav-only" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#475569", fontSize: "0.85rem" }}>
                No matches found.
              </div>
            ) : filtered.map((mObj) => {
              const m = mObj as Record<string, string>;
              return (
                <Link key={m.market_address} href={`/markets/${m.market_address}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    padding: "1rem",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    transition: "all 0.2s ease",
                  }}>
                    {/* Top row: Status + Pool */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <MarketDynamicData marketAddress={m.market_address} />
                    </div>

                    {/* VS Row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {/* Buffalo A */}
                      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                          background: "linear-gradient(135deg, #1E293B, #0F172A)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px",
                        }}>🐃</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "#F1F5F9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.buffalo_a_name}</div>
                        </div>
                      </div>

                      {/* VS */}
                      <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#475569", flexShrink: 0, padding: "0 2px" }}>VS</span>

                      {/* Buffalo B */}
                      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end", minWidth: 0 }}>
                        <div style={{ minWidth: 0, textAlign: "right" }}>
                          <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "#F1F5F9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.buffalo_b_name}</div>
                        </div>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                          background: "linear-gradient(135deg, #1E293B, #0F172A)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px",
                        }}>🐃</div>
                      </div>
                    </div>

                    {/* Bottom row: arena, chevron */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.6rem", paddingTop: "0.6rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ fontSize: "0.7rem", color: "#64748B" }}>{m.arena_name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <ChevronRight size={14} color="#475569" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "11px", color: "#334155" }}>
            Showing {filtered.length} markets
          </p>
        </div>
      </main>
    </div>
  );
}
