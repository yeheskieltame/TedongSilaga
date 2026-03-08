"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ArrowLeft, Share2, CheckCircle2, MapPin, Lock
} from "lucide-react";
import { motion } from "framer-motion";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { supabase } from "@/lib/supabase";
import { TEDONG_MARKET_ABI } from "@/constants/tedong_market_abi";

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; label: string; pulse: boolean }> = {
  Open:     { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",   border: "rgba(74,222,128,0.25)",   label: "Live · Open",     pulse: true  },
  Locked:   { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.25)",   label: "In Progress",     pulse: false },
  Resolved: { color: "#94A3B8", bg: "rgba(148,163,184,0.1)",  border: "rgba(148,163,184,0.2)",   label: "Resolved",        pulse: false },
};

// ── Buffalo Card Component ─────────────────────────────────────────────────────
function BuffaloCard({ side, name, embedUrl, color, isOpen, isSelected, isWinner, matchStatus, pool, onSelect }: {
  side: "A" | "B";
  name: string;
  embedUrl: string;
  color: string;
  isOpen: boolean;
  isSelected: boolean;
  isWinner: boolean;
  matchStatus: string;
  pool: string;
  onSelect: () => void;
}) {
  return (
    <motion.div
      whileHover={isOpen ? { scale: 1.01 } : {}}
      onClick={() => isOpen && onSelect()}
      className="detail-buffalo-card"
      style={{
        border: `1px solid ${isSelected ? color : isWinner ? color : "rgba(255,255,255,0.07)"}`,
        borderRadius: "16px",
        background: isSelected
          ? `rgba(${side === "A" ? "74,222,128" : "248,113,113"},0.06)`
          : isWinner ? "rgba(74,222,128,0.04)" : "rgba(255,255,255,0.02)",
        cursor: isOpen ? "pointer" : "default",
        position: "relative",
        transition: "all 0.25s",
        display: "flex", flexDirection: "column", gap: "1rem", padding: "1.25rem"
      }}
    >
      {isSelected && (
        <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}>
          <CheckCircle2 size={18} color={color} fill={color} stroke="#1E293B" />
        </div>
      )}
      {isWinner && matchStatus === "Resolved" && (
        <div style={{
          position: "absolute", top: "10px", right: "10px", zIndex: 10,
          padding: "2px 8px", borderRadius: "999px",
          background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)",
          fontSize: "10px", fontWeight: 700, color: "#4ADE80", letterSpacing: "0.08em"
        }}>WINNER</div>
      )}

      {/* Avatar + name */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
        <div className="detail-buffalo-avatar" style={{
          borderRadius: "50%",
          width: "48px", height: "48px",
          border: `2px solid ${isSelected ? color : "rgba(255,255,255,0.08)"}`,
          background: "linear-gradient(135deg, #1E293B, #0F172A)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
          transition: "border-color 0.25s",
        }}>🐃</div>
        <div>
          <div className="detail-buffalo-name" style={{ fontSize: "1.2rem", fontWeight: 800, color: "#F8FAFC" }}>{name}</div>
          <div style={{ fontSize: "0.8rem", color: color, fontWeight: 700 }}>Pool: {pool}</div>
        </div>
      </div>

      {/* Embed Container */}
      {embedUrl ? (
        <div style={{ width: "100%", borderRadius: "12px", overflow: "hidden", aspectRatio: "16/9", background: "#000", border: "1px solid rgba(255,255,255,0.1)" }}>
          <iframe 
            src={embedUrl} 
            allowFullScreen 
            style={{ width: "100%", height: "100%", border: "none" }}
            title={`${name} Video Embed`}
          />
        </div>
      ) : (
         <div style={{ width: "100%", borderRadius: "12px", aspectRatio: "16/9", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", fontSize: "0.8rem" }}>
           No embed link available
         </div>
      )}

      {/* Select button */}
      {isOpen && (
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          style={{
            width: "100%", padding: "0.8rem",
            borderRadius: "10px", marginTop: "0.5rem",
            border: `1px solid ${isSelected ? color : "rgba(255,255,255,0.08)"}`,
            background: isSelected ? `rgba(${side === "A" ? "74,222,128" : "248,113,113"},0.15)` : "rgba(255,255,255,0.04)",
            color: isSelected ? color : "#94A3B8",
            fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {isSelected ? `✓ ${name} Selected` : `Select ${name}`}
        </button>
      )}
    </motion.div>
  );
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });

  const [marketData, setMarketData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedBuffalo, setSelectedBuffalo] = useState<"A" | "B" | null>(null);
  const [stake, setStake] = useState("");

  const isVerified = true;

  // Supabase Fetch
  useEffect(() => {
    async function fetchMarket() {
      try {
        const { data, error } = await supabase
          .from("markets")
          .select("*")
          .eq("market_address", id)
          .single();
        if (error) throw error;
        setMarketData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchMarket();
  }, [id]);

  // Wagmi Contract Reads
  const { data: statusData } = useReadContract({
    address: id as `0x${string}`,
    abi: TEDONG_MARKET_ABI,
    functionName: "status",
  });

  const { data: poolDataA } = useReadContract({
    address: id as `0x${string}`,
    abi: TEDONG_MARKET_ABI,
    functionName: "totalPoolA",
  });

  const { data: poolDataB } = useReadContract({
    address: id as `0x${string}`,
    abi: TEDONG_MARKET_ABI,
    functionName: "totalPoolB",
  });

  const { data: winnerData } = useReadContract({
    address: id as `0x${string}`,
    abi: TEDONG_MARKET_ABI,
    functionName: "winner",
  });

  if (loading) return <div style={{ minHeight: "100vh", background: "#0B0F1A", color: "#E2E8F0", padding: "100px", textAlign: "center" }}>Loading Market...</div>;
  if (!marketData) return <div style={{ minHeight: "100vh", background: "#0B0F1A", color: "#E2E8F0", padding: "100px", textAlign: "center" }}>Market not found!</div>;

  let statusText = "Open";
  if (statusData === 1) statusText = "Locked";
  if (statusData === 2) statusText = "Resolved";
  
  const sc = STATUS_CONFIG[statusText] || STATUS_CONFIG["Open"];
  const isOpen = statusText === "Open";

  const poolA = poolDataA ? parseFloat(formatUnits(poolDataA as bigint, 6)) : 0;
  const poolB = poolDataB ? parseFloat(formatUnits(poolDataB as bigint, 6)) : 0;
  const totalPool = poolA + poolB;

  const winnerChoice = winnerData as number; // 1 for A, 2 for B

  const estimated = stake ? (Number(stake) * 1.84).toFixed(2) : "0.00";
  const displayBalance = balanceData ? `${parseFloat(formatUnits(balanceData.value, balanceData.decimals)).toFixed(4)} ${balanceData.symbol}` : "0.00";

  return (
    <div style={{ minHeight: "100vh", background: "#0B0F1A", color: "#E2E8F0" }}>
      <Navbar />

      <main style={{ paddingTop: "80px", paddingBottom: "6rem" }}>
        <div className="detail-container">

          {/* ── Breadcrumb ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 0 1.5rem" }}>
            <Link href="/markets" style={{
              display: "flex", alignItems: "center", gap: "6px",
              color: "#64748B", fontWeight: 600, fontSize: "0.8rem", textDecoration: "none",
              transition: "color 0.2s",
            }}>
              <ArrowLeft size={15} /> Back to Markets
            </Link>
            <button style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "5px 12px", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px", background: "rgba(255,255,255,0.03)",
              color: "#64748B", fontSize: "12px", cursor: "pointer",
            }}>
              <Share2 size={13} /> Share
            </button>
          </div>

          {/* ── Header ── */}
          <div style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            paddingBottom: "1.5rem", marginBottom: "1.5rem",
            display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  padding: "4px 12px", borderRadius: "999px",
                  background: sc.bg, border: `1px solid ${sc.border}`,
                  fontSize: "11px", fontWeight: 700, color: sc.color,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                  <span style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: sc.color, display: "inline-block",
                    ...(sc.pulse ? { animation: "pulse 2s infinite" } : {})
                  }} />
                  {sc.label}
                </span>
                <span style={{ color: "#475569", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={12} /> {(marketData.arena_name as string) || "Unknown Arena"}
                </span>
              </div>
              <h1 className="detail-match-title" style={{ marginTop: "1rem" }}>
                {marketData.buffalo_a_name as string} <span style={{ color: "#334155", margin: "0 10px", fontSize: "1.5rem" }}>VS</span> {marketData.buffalo_b_name as string}
              </h1>
              <p style={{ color: "#94A3B8", marginTop: "8px", fontSize: "1.1rem", fontWeight: 600 }}>
                {marketData.event_name as string}
              </p>
            </div>
            
            {/* Poster Embed */}
            {Boolean(marketData.embed_poster) && (
              <div style={{ 
                width: "200px", height: "120px", borderRadius: "12px", overflow: "hidden", 
                border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.5)" 
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={marketData.embed_poster as string} alt="Event Poster" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
          </div>

          {/* ── Main Layout: Buffalo cards + Staking ── */}
          <div className="detail-main-grid">

            {/* Left: Buffalo cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Buffalo cards */}
              <div className="detail-buffalos-grid">
                <BuffaloCard
                  side="A" 
                  name={marketData.buffalo_a_name as string} 
                  embedUrl={marketData.url_embed_buffalo_a as string}
                  pool={`${poolA.toLocaleString()} USDC`}
                  color="#4ADE80"
                  isOpen={isOpen} isSelected={selectedBuffalo === "A"}
                  isWinner={winnerChoice === 1} matchStatus={statusText}
                  onSelect={() => setSelectedBuffalo("A")}
                />
                
                {/* VS divider — desktop */}
                <div className="desktop-nav-only" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#475569", fontWeight: 900, fontSize: "12px", letterSpacing: "0.05em",
                  }}>VS</div>
                </div>
                
                {/* VS divider — mobile */}
                <div className="mobile-nav-only" style={{ textAlign: "center", padding: "0.25rem 0" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: "32px", height: "32px", borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    color: "#475569", fontWeight: 900, fontSize: "11px",
                  }}>VS</span>
                </div>
                
                <BuffaloCard
                  side="B" 
                  name={marketData.buffalo_b_name as string} 
                  embedUrl={marketData.url_embed_buffalo_b as string}
                  pool={`${poolB.toLocaleString()} USDC`}
                  color="#F87171"
                  isOpen={isOpen} isSelected={selectedBuffalo === "B"}
                  isWinner={winnerChoice === 2} matchStatus={statusText}
                  onSelect={() => setSelectedBuffalo("B")}
                />
              </div>
            </div>

            {/* Right: Staking Interface */}
            <div className="detail-staking-sidebar">

              {/* Main panel */}
              <div style={{
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "18px", padding: "1.5rem",
                background: "rgba(255,255,255,0.025)",
                backdropFilter: "blur(20px)",
                display: "flex", flexDirection: "column", gap: "1.25rem",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h2 style={{ fontWeight: 900, fontSize: "1.05rem", color: "#F8FAFC", marginBottom: "3px" }}>
                      Place Prediction
                    </h2>
                    <p style={{ color: "#475569", fontSize: "0.75rem" }}>Select your champion and stake tokens.</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                     <div style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>Total Market Pool</div>
                     <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#EAB308" }}>{totalPool.toLocaleString()} USDC</div>
                  </div>
                </div>

                {/* Locked / Resolved overlay */}
                {!isOpen && (
                  <div style={{
                    padding: "1rem", borderRadius: "12px",
                    background: statusText === "Locked" ? "rgba(245,158,11,0.08)" : "rgba(148,163,184,0.06)",
                    border: `1px solid ${statusText === "Locked" ? "rgba(245,158,11,0.2)" : "rgba(148,163,184,0.15)"}`,
                    display: "flex", alignItems: "center", gap: "8px",
                    color: statusText === "Locked" ? "#F59E0B" : "#94A3B8",
                    fontSize: "0.75rem", fontWeight: 600,
                  }}>
                    {statusText === "Locked" ? <Lock size={15} /> : <CheckCircle2 size={15} />}
                    {statusText === "Locked" ? "Predictions locked — match in progress." : `Match resolved. Winner claims available soon.`}
                  </div>
                )}

                {isOpen && (
                  <>
                    {/* Amount input */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#475569" }}>Amount (USDC)</label>
                        <span style={{ fontSize: "10px", color: "#475569" }}>
                          {isConnected ? `Bal: ${displayBalance}` : "Connect wallet"}
                        </span>
                      </div>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number" value={stake}
                          onChange={e => setStake(e.target.value)}
                          placeholder="0.00"
                          style={{
                            width: "100%", padding: "0.85rem 3.5rem 0.85rem 1rem",
                            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "12px", color: "#F8FAFC", fontSize: "1.1rem", fontWeight: 800, outline: "none",
                          }}
                        />
                        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", fontWeight: 700, color: "#475569" }}>USDC</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "5px", marginTop: "8px" }}>
                        {["25", "50", "100", "MAX"].map(a => (
                          <button key={a} onClick={() => setStake(a === "MAX" ? "1240" : a)}
                            style={{
                              padding: "5px", borderRadius: "8px",
                              border: stake === (a === "MAX" ? "1240" : a) ? "1px solid rgba(79,107,255,0.4)" : "1px solid rgba(255,255,255,0.07)",
                              background: "rgba(255,255,255,0.03)",
                              color: "#64748B", fontSize: "11px", fontWeight: 700, cursor: "pointer",
                            }}>{a}</button>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden" }}>
                      {[
                        { label: "Estimated Reward", value: `≈ ${estimated} USDC`, highlight: true },
                        { label: "Platform Fee",      value: "2.5%",                   highlight: false },
                        { label: "Your Stake",        value: `${stake || "0"} USDC`, highlight: false },
                      ].map((r, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.7rem 1rem", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                          <span style={{ fontSize: "0.75rem", color: "#64748B" }}>{r.label}</span>
                          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: r.highlight ? "#4ADE80" : "#F1F5F9" }}>{r.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      disabled={!isConnected || !selectedBuffalo || !stake || !isVerified}
                      style={{
                        width: "100%", padding: "0.9rem", borderRadius: "14px", border: "none",
                        background: isConnected && selectedBuffalo && stake && isVerified
                          ? "linear-gradient(135deg, #4F6BFF, #6366F1)" : "rgba(255,255,255,0.05)",
                        color: isConnected && selectedBuffalo && stake && isVerified ? "#fff" : "#334155",
                        fontSize: "0.85rem", fontWeight: 800,
                        cursor: (isConnected && selectedBuffalo && stake && isVerified) ? "pointer" : "not-allowed",
                        boxShadow: (isConnected && selectedBuffalo && stake && isVerified) ? "0 8px 24px rgba(79,107,255,0.3)" : "none",
                        transition: "all 0.25s",
                      }}
                    >
                      {!isConnected ? "Connect Wallet" : !selectedBuffalo ? "Select Buffalo First" : !stake ? "Enter amount" : "Confirm Prediction →"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
