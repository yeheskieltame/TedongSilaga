"use client";

import React, { useState, useEffect } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useReadContract } from "wagmi";
import { TEDONG_MARKET_ABI } from "@/constants/tedong_market_abi";
import { formatUnits } from "viem";

const STATUS_COLORS: Record<string, { dot: string; text: string; bg: string }> = {
  Open:     { dot: "#4ADE80", text: "#4ADE80", bg: "rgba(74,222,128,0.1)" },
  Locked:   { dot: "#FBBF24", text: "#FBBF24", bg: "rgba(251,191,36,0.1)" },
  Resolved: { dot: "#94A3B8", text: "#94A3B8", bg: "rgba(148,163,184,0.1)" },
};

const CarouselMatchCard = ({ match }: { match: Record<string, unknown> }) => {
  const marketAddress = match.market_address as string;
  const { data: totalPoolData } = useReadContract({
    address: marketAddress as `0x${string}`,
    abi: TEDONG_MARKET_ABI,
    functionName: "getTotalPool",
  });
  
  const pool = totalPoolData ? `${parseFloat(formatUnits(totalPoolData as bigint, 6)).toLocaleString()} USDC` : "0 USDC";
  
  // Directly use Supabase string status
  const statusText = (match.status as string) || "Open";
  
  const sc = STATUS_COLORS[statusText] || STATUS_COLORS["Open"];

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
        minWidth: "280px",
        height: "100%",
        padding: "0" // Padding handled internally to stretch link
      }}
    >
      <Link href={`/markets/${marketAddress}`} style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%", padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span style={{
            fontSize: "9px", fontWeight: 800, letterSpacing: "0.1em",
            color: sc.text,
            background: sc.bg,
            padding: "3px 10px", borderRadius: "99px", textTransform: "uppercase",
            border: `1px solid ${sc.bg}`,
            display: "flex", alignItems: "center", gap: "5px"
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              display: "inline-block", background: sc.dot,
              animation: statusText === "Open" ? "pulse 2s infinite" : "none"
            }} />
            {statusText}
          </span>
          <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#EAB308", letterSpacing: "0.02em" }}>
            {pool}
          </span>
        </div>

        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center", 
          padding: "1.5rem 0",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.03)",
          marginTop: "0.5rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", marginBottom: "1rem" }}>
            {/* Buffalo A Box */}
            <div style={{ 
              width: "100px", height: "100px", borderRadius: "20px", overflow: "hidden", 
              background: "rgba(255,255,255,0.05)", border: "2px solid rgba(74,222,128,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginRight: "2px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
            }}>
              {match.url_embed_buffalo_a ? (
                <img src={match.url_embed_buffalo_a as string} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "2rem" }}>🐃</span>
              )}
            </div>
            
            {/* VS Image Overlapping */}
            <div style={{ 
              position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
              width: "56px", height: "56px", zIndex: 10, flexShrink: 0 
            }}>
              <img src="/vs.png" alt="VS" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 0 16px rgba(0,0,0,0.8))" }} />
            </div>

            {/* Buffalo B Box */}
            <div style={{ 
              width: "100px", height: "100px", borderRadius: "20px", overflow: "hidden", 
              background: "rgba(255,255,255,0.05)", border: "2px solid rgba(248,113,113,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginLeft: "2px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
            }}>
              {match.url_embed_buffalo_b ? (
                <img src={match.url_embed_buffalo_b as string} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "2rem" }}>🐃</span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 0.5rem" }}>
            <div style={{ flex: 1, textAlign: "center", fontSize: "0.75rem", fontWeight: 800, color: "#F1F5F9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {match.buffalo_a_name as string}
            </div>
            <div style={{ width: "20px" }} />
            <div style={{ flex: 1, textAlign: "center", fontSize: "0.75rem", fontWeight: 800, color: "#F1F5F9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {match.buffalo_b_name as string}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748B", fontSize: "0.75rem", fontWeight: 500, margin: "1rem 0" }}>
          <MapPin size={12} /> {match.arena_name as string}
        </div>

        <div style={{ marginTop: "auto" }}>
          <button style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "12px",
            background: statusText === "Open" ? "linear-gradient(135deg, #4F6BFF, #6366F1)" : "rgba(255,255,255,0.05)",
            border: "none", color: statusText === "Open" ? "#fff" : "#475569", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            cursor: "pointer",
            fontSize: "0.8rem",
            boxShadow: statusText === "Open" ? "0 4px 20px rgba(79,107,255,0.25)" : "none",
            transition: "all 0.3s ease",
          }}>
            {statusText === "Open" ? "Predict Now" : "View Details"} <ArrowRight size={14} />
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default function MatchCarousel({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const [markets, setMarkets] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const { data: marketsData, error: marketsError } = await supabase
          .from("markets")
          .select("*")
          .eq("status", "Open")
          .order("created_at", { ascending: false })
          .limit(8); 
        
        if (marketsError) throw marketsError;

        // Fetch buffalo images separately to ensure we have the correct ones
        const { data: buffaloData, error: buffaloError } = await supabase
          .from("buffalo")
          .select("buffalo_name, url_embed");

        if (buffaloError) throw buffaloError;

        const buffaloMap: Record<string, string> = {};
        buffaloData?.forEach(b => {
          buffaloMap[b.buffalo_name] = b.url_embed || "";
        });

        const enhancedMarkets = (marketsData || []).map((m: any) => ({
          ...m,
          url_embed_buffalo_a: buffaloMap[m.buffalo_a_name] || m.url_embed_buffalo_a,
          url_embed_buffalo_b: buffaloMap[m.buffalo_b_name] || m.url_embed_buffalo_b,
        }));

        setMarkets(enhancedMarkets);
      } catch (err) {
        console.error("Failed to load carousel markets:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

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
        paddingLeft: "2rem", // Give some offset on large screens
        maxWidth: "1100px",
        margin: "0 auto",
      }}
      className="match-carousel-section"
    >
      {/* Header */}
      <div style={{ marginBottom: "1.25rem", paddingRight: "2rem" }}>
        <p style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em",
          color: "#4F6BFF", textTransform: "uppercase", marginBottom: "0.4rem"
        }}>Live Predictions</p>
        <h2 className="match-carousel-title" style={{ fontSize: "2.5rem", fontWeight: 900, color: "#fff", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Live <span style={{ color: "#4F6BFF" }}>Arena.</span>
        </h2>
        <p className="match-carousel-desc" style={{ color: "#94A3B8", maxWidth: "450px", lineHeight: "1.5" }}>
          Current buffalo prediction markets synchronized from the Highlands to the World Chain.
        </p>
      </div>

      {/* Scrollable card row */}
      <div style={{
        display: "flex",
        gap: "1.25rem",
        overflowX: "auto",
        padding: "1rem 2rem 2rem 0",
        scrollbarWidth: "none",
        msOverflowStyle: "none"
      }} className="no-scrollbar">
        {loading ? (
          <div style={{ padding: "2rem", color: "#64748B", fontWeight: 600 }}>Syncing live arenas...</div>
        ) : markets.length === 0 ? (
          <div style={{ padding: "2rem", color: "#64748B", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "16px", flex: 1, maxWidth: "400px" }}>
            No live markets available right now. Wait for admin to deploy new markets.
          </div>
        ) : (
          markets.map((m) => <CarouselMatchCard key={m.market_address as string} match={m} />)
        )}
      </div>
    </motion.section>
  );
}
