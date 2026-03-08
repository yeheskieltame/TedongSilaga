"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ArrowLeft, Share2, CheckCircle2, MapPin, Lock
} from "lucide-react";
import { motion } from "framer-motion";
import { useAccount, useReadContracts, useReadContract, useWriteContract, usePublicClient } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { supabase } from "@/lib/supabase";
import { TEDONG_MARKET_ABI } from "@/constants/tedong_market_abi";
import { MOCK_USDC_ADDRESS, MOCK_USDC_ABI } from "@/constants/contracts";

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
        display: "flex", flexDirection: "column", gap: "0.85rem", padding: "1rem"
      }}
    >
      {isSelected && (
        <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}>
          <CheckCircle2 size={16} color={color} fill={color} stroke="#1E293B" />
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

      {/* Name and Pool */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.25rem", marginBottom: "0.75rem" }}>
        <div className="detail-buffalo-name" style={{ fontSize: "0.95rem", fontWeight: 800, color: "#F8FAFC", wordBreak: "break-word" }}>{name}</div>
        <div style={{ fontSize: "0.7rem", color: color, fontWeight: 700 }}>Pool: {pool}</div>
      </div>

      {/* Embed Container */}
      {embedUrl ? (
        <div style={{ width: "100%", borderRadius: "10px", overflow: "hidden", height: "200px", background: "#000", border: "1px solid rgba(255,255,255,0.1)" }}>
          <iframe 
            src={embedUrl}
            allowFullScreen 
            scrolling="no"
            frameBorder="0"
            style={{ width: "100%", height: "100%", border: "none", overflow: "hidden" }}
            title={`${name} Video Embed`}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          />
        </div>
      ) : (
         <div style={{ width: "100%", borderRadius: "10px", height: "200px", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", fontSize: "0.75rem" }}>
           No embed link available
         </div>
      )}

      {/* Select button */}
      {isOpen && (
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          style={{
            width: "100%", padding: "0.65rem",
            borderRadius: "10px", marginTop: "0.25rem",
            border: `1px solid ${isSelected ? color : "rgba(255,255,255,0.08)"}`,
            background: isSelected ? `rgba(${side === "A" ? "74,222,128" : "248,113,113"},0.15)` : "rgba(255,255,255,0.04)",
            color: isSelected ? color : "#94A3B8",
            fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {isSelected ? `✓ Selected` : `Select`}
        </button>
      )}
    </motion.div>
  );
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const { address, isConnected } = useAccount();
  
  const { data: usdcData } = useReadContracts({
    contracts: [
      {
        address: MOCK_USDC_ADDRESS as `0x${string}`,
        abi: MOCK_USDC_ABI,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      },
      {
        address: MOCK_USDC_ADDRESS as `0x${string}`,
        abi: MOCK_USDC_ABI,
        functionName: "decimals",
      },
      {
        address: MOCK_USDC_ADDRESS as `0x${string}`,
        abi: MOCK_USDC_ABI,
        functionName: "symbol",
      }
    ],
    query: {
      enabled: !!address,
    }
  });

  const balanceValue = usdcData?.[0]?.result as bigint | undefined;
  const balanceDecimals = usdcData?.[1]?.result as number | undefined;
  const balanceSymbol = usdcData?.[2]?.result as string | undefined;

  const [marketData, setMarketData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedBuffalo, setSelectedBuffalo] = useState<"A" | "B" | null>(null);
  const [stake, setStake] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const isVerified = true;

  const handleStake = async () => {
    if (!isConnected || !selectedBuffalo || !stake || !isVerified) return;
    
    setIsStaking(true);
    setStatusMsg({ type: "loading", text: "Initiating Transaction..." });

    try {
      const parsedAmount = parseUnits(stake, 6); // USDC 6 decimals
      const choice = selectedBuffalo === "A" ? 1 : 2;

      // 1. Approve USDC
      setStatusMsg({ type: "loading", text: "Approving USDC..." });
      const approveTxHash = await writeContractAsync({
        address: MOCK_USDC_ADDRESS as `0x${string}`,
        abi: MOCK_USDC_ABI,
        functionName: "approve",
        args: [id as `0x${string}`, parsedAmount],
      });

      setStatusMsg({ type: "loading", text: "Waiting for approval confirmation..." });
      await publicClient!.waitForTransactionReceipt({ hash: approveTxHash });

      // 2. Stake in Market Contract
      setStatusMsg({ type: "loading", text: "Confirming prediction in wallet..." });
      const stakeTxHash = await writeContractAsync({
        address: id as `0x${string}`,
        abi: TEDONG_MARKET_ABI,
        functionName: "stake",
        args: [choice, parsedAmount],
      });

      setStatusMsg({ type: "loading", text: "Waiting for stake confirmation..." });
      await publicClient!.waitForTransactionReceipt({ hash: stakeTxHash });

      setStatusMsg({ type: "success", text: "Prediction confirmed! Good luck." });
      setStake("");
      setTimeout(() => setStatusMsg({ type: "", text: "" }), 5000);
      
    } catch (err: unknown) {
      console.error(err);
      let errMsg = "Transaction failed";
      if (err instanceof Error) {
        errMsg = (err as { shortMessage?: string }).shortMessage || err.message;
      }
      setStatusMsg({ type: "error", text: errMsg });
      setTimeout(() => setStatusMsg({ type: "", text: "" }), 5000);
    } finally {
      setIsStaking(false);
    }
  };

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

  // Wagmi Contract Reads for Prize Pools
  // Status and winner are now completely sourced from Supabase for instant sync!

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



  if (loading) return <div style={{ minHeight: "100vh", background: "#0B0F1A", color: "#E2E8F0", padding: "100px", textAlign: "center" }}>Loading Market...</div>;
  if (!marketData) return <div style={{ minHeight: "100vh", background: "#0B0F1A", color: "#E2E8F0", padding: "100px", textAlign: "center" }}>Market not found!</div>;

  const statusText = (marketData.status as string) || "Open";
  
  const sc = STATUS_CONFIG[statusText] || STATUS_CONFIG["Open"];
  const isOpen = statusText === "Open";

  const poolA = poolDataA ? parseFloat(formatUnits(poolDataA as bigint, 6)) : 0;
  const poolB = poolDataB ? parseFloat(formatUnits(poolDataB as bigint, 6)) : 0;
  const totalPool = poolA + poolB;

  const winnerChoice = parseInt(marketData.winner as string) || 0; // 1 for A, 2 for B

  const estimated = stake ? (Number(stake) * 1.84).toFixed(2) : "0.00";
  const displayBalance = (balanceValue !== undefined && balanceDecimals !== undefined) 
    ? `${parseFloat(formatUnits(balanceValue, balanceDecimals)).toFixed(4)} ${balanceSymbol || "USDC"}` 
    : "0.00";

  return (
    <div style={{ minHeight: "100vh", background: "#0B0F1A", color: "#E2E8F0" }}>
      <Navbar />

      <main style={{ paddingTop: "80px", paddingBottom: "6rem" }}>
        <div className="detail-container">

          {/* ── Breadcrumb ── */}
          <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 0 1.5rem" }}>
            <Link href="/markets" style={{
              display: "flex", alignItems: "center", gap: "6px",
              color: "#64748B", fontWeight: 600, fontSize: "0.8rem", textDecoration: "none",
              transition: "color 0.2s",
              pointerEvents: "auto",
            }}>
              <ArrowLeft size={15} /> Back to Markets
            </Link>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
              style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "5px 12px", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px", background: "rgba(255,255,255,0.03)",
              color: "#64748B", fontSize: "12px", cursor: "pointer",
              pointerEvents: "auto",
            }}>
              <Share2 size={13} /> Share
            </button>
          </div>

          {/* ── Header ── */}
          <div style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            paddingBottom: "1.5rem", marginBottom: "1.5rem",
          }}>
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

          {/* ── Main Layout: Buffalo cards + Staking ── */}
          <div className="detail-main-grid">

            {/* Left: Event Poster + Buffalo cards (Vertical Stack) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              
              {/* Event Poster (Main & Vertically large) */}
              {Boolean(marketData.embed_poster) && (
                <div style={{ 
                  width: "100%", 
                  borderRadius: "20px", overflow: "hidden", 
                  border: "1px solid rgba(255,255,255,0.1)", background: "#fff",
                  display: "flex", justifyContent: "center", alignItems: "center",
                  minHeight: "400px",
                }}>
                  {((marketData.embed_poster as string).includes("facebook.com") || (marketData.embed_poster as string).includes("youtube.com")) ? (
                    <iframe 
                      src={marketData.embed_poster as string}
                      allowFullScreen 
                      scrolling="no"
                      frameBorder="0"
                      style={{ width: "100%", height: "650px", border: "none", overflow: "hidden" }}
                      title="Event Poster Embed"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={marketData.embed_poster as string} alt="Event Poster" loading="lazy" style={{ width: "100%", maxHeight: "800px", objectFit: "contain" }} />
                  )}
                </div>
              )}

            </div>

            {/* Right: Staking Interface */}
            <div className="detail-staking-sidebar">

              {/* Buffalo cards Side-by-Side Grid */}
              <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.5rem" }}>
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
                
                {/* Custom VS Image */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10, width: "64px", height: "64px", pointerEvents: "none" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/vs.png" alt="VS" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }} />
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

                    {/* Status Message */}
                    {statusMsg.text && (
                      <div style={{
                        padding: "0.85rem", borderRadius: "12px", marginBottom: "0.75rem",
                        background: statusMsg.type === "error" ? "rgba(239,68,68,0.1)" : statusMsg.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(79,107,255,0.1)",
                        border: `1px solid ${statusMsg.type === "error" ? "rgba(239,68,68,0.3)" : statusMsg.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(79,107,255,0.3)"}`,
                        color: statusMsg.type === "error" ? "#F87171" : statusMsg.type === "success" ? "#4ADE80" : "#818CF8",
                        fontSize: "0.75rem", fontWeight: 600, textAlign: "center"
                      }}>
                        {statusMsg.text}
                      </div>
                    )}

                    {/* CTA */}
                    <button
                      onClick={handleStake}
                      disabled={!isConnected || !selectedBuffalo || !stake || !isVerified || isStaking}
                      style={{
                        width: "100%", padding: "0.9rem", borderRadius: "14px", border: "none",
                        background: (isConnected && selectedBuffalo && stake && isVerified && !isStaking)
                          ? "linear-gradient(135deg, #4F6BFF, #6366F1)" : "rgba(255,255,255,0.05)",
                        color: (isConnected && selectedBuffalo && stake && isVerified && !isStaking) ? "#fff" : "#334155",
                        fontSize: "0.85rem", fontWeight: 800,
                        cursor: (isConnected && selectedBuffalo && stake && isVerified && !isStaking) ? "pointer" : "not-allowed",
                        boxShadow: (isConnected && selectedBuffalo && stake && isVerified && !isStaking) ? "0 8px 24px rgba(79,107,255,0.3)" : "none",
                        transition: "all 0.25s",
                      }}
                    >
                      {isStaking ? "Processing..." : !isConnected ? "Connect Wallet" : !selectedBuffalo ? "Select Buffalo First" : !stake ? "Enter amount" : "Confirm Prediction →"}
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
