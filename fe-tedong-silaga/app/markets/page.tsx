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
function MarketDynamicData({ marketAddress, initialStatus }: { marketAddress: string, initialStatus?: string }) {
  const { data: totalPoolData } = useReadContract({
    address: marketAddress as `0x${string}`,
    abi: TEDONG_MARKET_ABI,
    functionName: "getTotalPool",
  });
  
  // Directly use Supabase DB status so UI is instantly synced and looks properly, without waiting for wallet/RPC connection
  const statusText = initialStatus || "Open";
  
  const pool = totalPoolData ? `${parseFloat(formatUnits(totalPoolData as bigint, 6)).toLocaleString()} USDC` : "0 USDC";
  
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
  const [buffaloMap, setBuffaloMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Markets");

  useEffect(() => {
    async function fetchFromSupabase() {
      const [
        { data: marketsData, error: marketsError },
        { data: buffaloData, error: buffaloError }
      ] = await Promise.all([
        supabase.from("markets").select("*").order("created_at", { ascending: false }),
        supabase.from("buffalo").select("buffalo_name, url_embed")
      ]);
      
      if (!marketsError) {
        setMarkets(marketsData || []);
      }

      if (!buffaloError && buffaloData) {
         const bMap: Record<string, string> = {};
         buffaloData.forEach(b => {
             if (b.buffalo_name && b.url_embed) {
                 bMap[b.buffalo_name] = b.url_embed;
             }
         });
         setBuffaloMap(bMap);
      }
      setLoading(false);
    }

    async function processMarkets() {
      // 1. Initial quick load from Supabase
      await fetchFromSupabase();

      // 2. Background sync from blockchain
      try {
        const syncRes = await fetch("/api/market/sync");
        const syncData = await syncRes.json();
        
        // 3. If new markets were synced, refresh the UI
        if (syncData && syncData.synced > 0) {
          await fetchFromSupabase();
        }
      } catch (e) {
        console.error("Failed to sync markets", e);
      }
    }
    processMarkets();
  }, []);

  // Filtering by search text and status
  const filtered = markets.filter(m => {
    const marketObj = m as Record<string, string>;
    const matchesSearch = search === "" ||
      (marketObj.buffalo_a_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (marketObj.buffalo_b_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (marketObj.arena_name?.toLowerCase() || "").includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === "All Markets" || marketObj.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
              {(["All Markets", "Open", "Locked", "Resolved"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "999px",
                    border: statusFilter === tab ? "1px solid rgba(79,107,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    background: statusFilter === tab ? "rgba(79,107,255,0.12)" : "transparent",
                    color: statusFilter === tab ? "#818CF8" : "#94A3B8",
                    fontWeight: 700, fontSize: "12px", cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {tab}
                </button>
              ))}
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
              gridTemplateColumns: "1.5fr 3.5fr 1.5fr 1fr",
              padding: "0.85rem 1.5rem",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}>
              {["Event Name", "Buffalo Match", "Prize Pool", "Status"].map((col, i) => (
                <div key={i} style={{
                  fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                  color: "#475569", display: "flex", alignItems: "center", gap: "4px",
                  justifyContent: col === "Prize Pool" || col === "Status" ? "flex-start" : "flex-start",
                }}>
                  {col} {col === "Prize Pool" && <ChevronDown size={11} />}
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
                      gridTemplateColumns: "1.5fr 3.5fr 1.5fr 1fr",
                      padding: "1.1rem 1.5rem",
                      borderBottom: idx < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Event Name */}
                    <div style={{ paddingRight: "1rem" }}>
                      <div style={{ fontWeight: 800, fontSize: "15px", color: "#F8FAFC", marginBottom: "4px" }}>{m.event_name}</div>
                      <div style={{ fontSize: "12px", color: "#94A3B8", display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#4F6BFF" }} />
                        {m.arena_name}
                      </div>
                    </div>

                    {/* Buffalo Match (2 Images + VS) */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "16px", padding: "10px 0" }}>
                      {/* Buffalo A */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100px" }}>
                        {buffaloMap[m.buffalo_a_name] ? (
                          <img src={buffaloMap[m.buffalo_a_name]} alt={m.buffalo_a_name} style={{ width: "70px", height: "70px", borderRadius: "14px", objectFit: "cover", border: "2px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }} />
                        ) : (
                          <div style={{ width: "70px", height: "70px", borderRadius: "14px", background: "#1E293B", border: "2px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🐃</div>
                        )}
                        <div style={{ fontWeight: 800, fontSize: "13px", color: "#F1F5F9", marginTop: "8px", textAlign: "center", lineHeight: 1.1 }}>{m.buffalo_a_name}</div>
                      </div>

                      {/* VS Image */}
                      <img src="/vs.png" alt="VS" style={{ width: "45px", objectFit: "contain", flexShrink: 0, marginTop: "-15px" }} />

                      {/* Buffalo B */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100px" }}>
                        {buffaloMap[m.buffalo_b_name] ? (
                          <img src={buffaloMap[m.buffalo_b_name]} alt={m.buffalo_b_name} style={{ width: "70px", height: "70px", borderRadius: "14px", objectFit: "cover", border: "2px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }} />
                        ) : (
                          <div style={{ width: "70px", height: "70px", borderRadius: "14px", background: "#1E293B", border: "2px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🐃</div>
                        )}
                        <div style={{ fontWeight: 800, fontSize: "13px", color: "#F1F5F9", marginTop: "8px", textAlign: "center", lineHeight: 1.1 }}>{m.buffalo_b_name}</div>
                      </div>
                    </div>
                    
                    {/* Dynamic Pool & Status from Subcomponent */}
                    <MarketDynamicData marketAddress={m.market_address} initialStatus={m.status} />

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
                      <MarketDynamicData marketAddress={m.market_address} initialStatus={m.status} />
                    </div>

                    {/* Event Name */}
                    <div style={{ marginBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.5rem" }}>
                       <div style={{ fontWeight: 800, fontSize: "14px", color: "#F8FAFC" }}>{m.event_name}</div>
                    </div>
                    {/* VS Row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                      {/* Buffalo A */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                        {buffaloMap[m.buffalo_a_name] ? (
                          <img src={buffaloMap[m.buffalo_a_name]} alt={m.buffalo_a_name} style={{ width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }} />
                        ) : (
                          <div style={{ width: "60px", height: "60px", borderRadius: "12px", background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🐃</div>
                        )}
                        <div style={{ fontWeight: 800, fontSize: "0.75rem", color: "#F1F5F9", marginTop: "6px", textAlign: "center", lineHeight: 1.1 }}>{m.buffalo_a_name}</div>
                      </div>

                      {/* VS */}
                      <img src="/vs.png" alt="VS" style={{ width: "35px", objectFit: "contain", flexShrink: 0, marginTop: "-15px" }} />

                      {/* Buffalo B */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                        {buffaloMap[m.buffalo_b_name] ? (
                          <img src={buffaloMap[m.buffalo_b_name]} alt={m.buffalo_b_name} style={{ width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }} />
                        ) : (
                          <div style={{ width: "60px", height: "60px", borderRadius: "12px", background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🐃</div>
                        )}
                        <div style={{ fontWeight: 800, fontSize: "0.75rem", color: "#F1F5F9", marginTop: "6px", textAlign: "center", lineHeight: 1.1 }}>{m.buffalo_b_name}</div>
                      </div>
                    </div>

                    {/* Bottom row: arena, chevron */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.8rem", paddingTop: "0.8rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ fontSize: "0.7rem", color: "#94A3B8", display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", background: "#4F6BFF" }} />
                        {m.arena_name}
                      </div>
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
