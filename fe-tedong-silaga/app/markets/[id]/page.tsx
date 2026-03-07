"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import {
  ArrowLeft, Share2, Users, Clock, TrendingUp,
  ShieldCheck, AlertCircle, CheckCircle2, MapPin, Flame, Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";

// ── Mock Data ──────────────────────────────────────────────────────────────────
const MATCHES: Record<string, {
  id: string; name: string; status: "Open" | "Locked" | "Resolved";
  time: string; countdown: string; pool: string; currency: string;
  players: number; loc: string;
  buffaloA: { name: string; owner: string; record: string; wins: number; losses: number; weight: string; age: string; origin: string; winRate: number; };
  buffaloB: { name: string; owner: string; record: string; wins: number; losses: number; weight: string; age: string; origin: string; winRate: number; };
  winner?: "A" | "B";
}> = {
  "1": {
    id: "1", name: "Match #12 — Grand Finals", status: "Open",
    time: "Mar 6, 2026 · 14:00 WIB", countdown: "00:19:42",
    pool: "2,400", currency: "WLD", players: 34, loc: "Bori Arena, Tana Toraja",
    buffaloA: { name: "Rambu Solon",  owner: "Datu Polopadang", record: "8W – 2L", wins: 8,  losses: 2, weight: "620 kg", age: "5 yr", origin: "Rantepao", winRate: 80 },
    buffaloB: { name: "Tanduk Biru",  owner: "Ne' Linggi",       record: "6W – 3L", wins: 6,  losses: 3, weight: "590 kg", age: "4 yr", origin: "Makale",   winRate: 67 },
  },
  "2": {
    id: "2", name: "Match #13 — Semi Final", status: "Locked",
    time: "Mar 15, 2026 · 14:00 WIB", countdown: "—",
    pool: "—", currency: "WLD", players: 12, loc: "Lemo Arena, Tana Toraja",
    buffaloA: { name: "Gorila Sakti", owner: "Ambe Rante",       record: "7W – 3L", wins: 7,  losses: 3, weight: "640 kg", age: "6 yr", origin: "Sangalla", winRate: 70 },
    buffaloB: { name: "Byson Mas",    owner: "Yusuf To",          record: "5W – 5L", wins: 5,  losses: 5, weight: "605 kg", age: "5 yr", origin: "Bittuang", winRate: 50 },
  },
  "3": {
    id: "3", name: "Match #10 — Quarter Finals", status: "Resolved",
    time: "Mar 4, 2026 · 10:00 WIB", countdown: "Resolved",
    pool: "1,200", currency: "WLD", players: 8, loc: "Kete Kesu Arena, Tana Toraja",
    winner: "A",
    buffaloA: { name: "Kerbau Silaga", owner: "Pong Tiku",       record: "8W – 5L", wins: 8, losses: 5, weight: "610 kg", age: "5 yr", origin: "Kesu",     winRate: 62 },
    buffaloB: { name: "Toraja King",   owner: "Layuk Rante",      record: "11W – 2L", wins: 11, losses: 2, weight: "660 kg", age: "7 yr", origin: "Tallunglipu", winRate: 85 },
  },
};

const DEFAULT_MATCH = MATCHES["1"];

const STATUS_CONFIG = {
  Open:     { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",   border: "rgba(74,222,128,0.25)",   label: "Live · Open",     pulse: true  },
  Locked:   { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.25)",   label: "In Progress",     pulse: false },
  Resolved: { color: "#94A3B8", bg: "rgba(148,163,184,0.1)",  border: "rgba(148,163,184,0.2)",   label: "Resolved",        pulse: false },
};

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const match = MATCHES[id] ?? DEFAULT_MATCH;
  const sc = STATUS_CONFIG[match.status];

  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address: address,
  });

  const [selectedBuffalo, setSelectedBuffalo] = useState<"A" | "B" | null>(null);
  const [stake, setStake] = useState("");
  const [token, setToken] = useState<"WLD" | "USDC">("WLD");

  const isVerified = true; // Still demo for World ID
  const isOpen = match.status === "Open";

  const estimated = stake ? (Number(stake) * 1.84).toFixed(2) : "0.00";
  const displayBalance = balanceData ? `${parseFloat(formatUnits(balanceData.value, balanceData.decimals)).toFixed(4)} ${balanceData.symbol}` : "0.00";

  return (
    <div style={{ minHeight: "100vh", background: "#0B0F1A", color: "#E2E8F0" }}>
      <Header />

      <main style={{ paddingTop: "88px", paddingBottom: "6rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>

          {/* ── Breadcrumb ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.75rem 0 2rem" }}>
            <Link href="/markets" style={{
              display: "flex", alignItems: "center", gap: "8px",
              color: "#64748B", fontWeight: 600, fontSize: "14px", textDecoration: "none",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "#E2E8F0"}
              onMouseLeave={e => e.currentTarget.style.color = "#64748B"}
            >
              <ArrowLeft size={16} /> Back to Markets
            </Link>
            <button style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "7px 14px", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px", background: "rgba(255,255,255,0.03)",
              color: "#64748B", fontSize: "13px", cursor: "pointer",
            }}>
              <Share2 size={14} /> Share
            </button>
          </div>

          {/* ── Header Row ── */}
          <div style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            paddingBottom: "2rem", marginBottom: "2.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.75rem", flexWrap: "wrap" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "7px",
                padding: "5px 14px", borderRadius: "999px",
                background: sc.bg, border: `1px solid ${sc.border}`,
                fontSize: "12px", fontWeight: 700, color: sc.color,
                textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
                <span style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: sc.color, display: "inline-block",
                  ...(sc.pulse ? { animation: "pulse 2s infinite" } : {})
                }} />
                {sc.label}
              </span>
              <span style={{ color: "#475569", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Clock size={13} /> {match.time}
              </span>
              <span style={{ color: "#475569", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={13} /> {match.loc}
              </span>
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.04em", color: "#F8FAFC" }}>
              {match.buffaloA.name} <span style={{ color: "#334155" }}>vs</span> {match.buffaloB.name}
            </h1>
            <p style={{ color: "#475569", marginTop: "4px", fontSize: "14px" }}>{match.name}</p>
          </div>

          {/* ── Stats Bar (Morpho-style) ── */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1px", background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "14px", overflow: "hidden",
            marginBottom: "2.5rem",
          }}>
            {[
              { label: "Prize Pool",      value: match.status !== "Locked" ? `${match.pool} ${match.currency}` : "TBD",        icon: <TrendingUp size={14} />,  color: "#EAB308" },
              { label: "Total Players",   value: match.players.toString(),                                                        icon: <Users size={14} />,       color: "#4F6BFF" },
              { label: "Locks In",        value: match.countdown,                                                                  icon: <Clock size={14} />,       color: "#F8FAFC" },
              { label: "Arena",           value: match.loc.split(",")[0],                                                         icon: <MapPin size={14} />,      color: "#F8FAFC" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "1.5rem 1.75rem",
                background: "rgba(255,255,255,0.015)",
                display: "flex", flexDirection: "column", gap: "6px",
              }}>
                <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}>
                  {s.icon} {s.label}
                </span>
                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: s.color, letterSpacing: "-0.03em" }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          {/* ── Main 2-Col Grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "2rem", alignItems: "start" }}>

            {/* ── LEFT: Buffalo Info ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

              {/* Buffalo selector cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1rem", alignItems: "stretch" }}>

                {/* Buffalo A */}
                {[
                  { side: "A" as const, b: match.buffaloA, color: "#4ADE80" },
                  { side: "B" as const, b: match.buffaloB, color: "#F87171" },
                ].map(({ side, b, color }, idx) => {
                  const isSelected = selectedBuffalo === side;
                  const isWinner = match.winner === side;
                  return idx === 0 ? (
                    <React.Fragment key={side}>
                      <motion.div
                        whileHover={isOpen ? { scale: 1.01 } : {}}
                        onClick={() => isOpen && setSelectedBuffalo(side)}
                        style={{
                          border: `1px solid ${isSelected ? color : isWinner ? color : "rgba(255,255,255,0.07)"}`,
                          borderRadius: "16px",
                          padding: "2rem",
                          background: isSelected
                            ? `rgba(${side === "A" ? "74,222,128" : "248,113,113"},0.06)`
                            : isWinner ? `rgba(74,222,128,0.04)` : "rgba(255,255,255,0.02)",
                          cursor: isOpen ? "pointer" : "default",
                          position: "relative",
                          transition: "all 0.25s",
                          display: "flex", flexDirection: "column", gap: "1.5rem",
                        }}
                      >
                        {isSelected && (
                          <div style={{ position: "absolute", top: "14px", right: "14px" }}>
                            <CheckCircle2 size={20} color={color} />
                          </div>
                        )}
                        {isWinner && match.status === "Resolved" && (
                          <div style={{
                            position: "absolute", top: "12px", right: "12px",
                            padding: "3px 10px", borderRadius: "999px",
                            background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)",
                            fontSize: "11px", fontWeight: 700, color: "#4ADE80", letterSpacing: "0.08em"
                          }}>WINNER</div>
                        )}

                        {/* Photo + name */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <div style={{
                            width: "72px", height: "72px", borderRadius: "50%",
                            border: `2px solid ${isSelected ? color : "rgba(255,255,255,0.08)"}`,
                            background: "linear-gradient(135deg, #1E293B, #0F172A)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "2.2rem", transition: "border-color 0.25s",
                          }}>🐃</div>
                          <div>
                            <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "#F8FAFC", letterSpacing: "-0.03em" }}>{b.name}</div>
                            <div style={{ fontSize: "13px", color: "#64748B", marginTop: "2px" }}>
                              Owner: <span style={{ color: "#94A3B8", fontWeight: 600 }}>{b.owner}</span>
                            </div>
                          </div>
                        </div>

                        {/* Stats grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                          {[
                            { label: "Record",  value: b.record },
                            { label: "Win Rate", value: `${b.winRate}%`, highlight: color },
                            { label: "Weight",  value: b.weight },
                            { label: "Age",     value: b.age },
                            { label: "Origin",  value: b.origin },
                          ].map((s, i) => (
                            <div key={i} style={{
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.05)",
                              borderRadius: "10px", padding: "0.75rem 1rem",
                            }}>
                              <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569", marginBottom: "4px" }}>{s.label}</div>
                              <div style={{ fontWeight: 800, fontSize: "15px", color: s.highlight ?? "#F1F5F9" }}>{s.value}</div>
                            </div>
                          ))}
                        </div>

                        {/* Win rate bar */}
                        <div>
                          <div style={{ fontSize: "11px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Win Rate</div>
                          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                            <div style={{ width: `${b.winRate}%`, height: "100%", background: color, borderRadius: "4px", transition: "width 0.5s" }} />
                          </div>
                        </div>

                        {/* Select button */}
                        {isOpen && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedBuffalo(side); }}
                            style={{
                              width: "100%", padding: "0.75rem",
                              borderRadius: "10px",
                              border: `1px solid ${isSelected ? color : "rgba(255,255,255,0.08)"}`,
                              background: isSelected ? `rgba(${side === "A" ? "74,222,128" : "248,113,113"},0.15)` : "rgba(255,255,255,0.04)",
                              color: isSelected ? color : "#64748B",
                              fontWeight: 700, fontSize: "14px", cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            {isSelected ? `✓ Kerbau ${side} Selected` : `Pilih Kerbau ${side}`}
                          </button>
                        )}
                      </motion.div>

                      {/* VS divider */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{
                          width: "44px", height: "44px", borderRadius: "50%",
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(255,255,255,0.03)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#475569", fontWeight: 900, fontSize: "13px", letterSpacing: "0.05em",
                        }}>VS</div>
                      </div>
                    </React.Fragment>
                  ) : (
                    <motion.div
                      key={side}
                      whileHover={isOpen ? { scale: 1.01 } : {}}
                      onClick={() => isOpen && setSelectedBuffalo(side)}
                      style={{
                        border: `1px solid ${isSelected ? color : isWinner ? color : "rgba(255,255,255,0.07)"}`,
                        borderRadius: "16px",
                        padding: "2rem",
                        background: isSelected
                          ? `rgba(248,113,113,0.06)` : isWinner ? `rgba(74,222,128,0.04)` : "rgba(255,255,255,0.02)",
                        cursor: isOpen ? "pointer" : "default",
                        position: "relative",
                        transition: "all 0.25s",
                        display: "flex", flexDirection: "column", gap: "1.5rem",
                      }}
                    >
                      {isSelected && (
                        <div style={{ position: "absolute", top: "14px", right: "14px" }}>
                          <CheckCircle2 size={20} color={color} />
                        </div>
                      )}
                      {isWinner && match.status === "Resolved" && (
                        <div style={{
                          position: "absolute", top: "12px", right: "12px",
                          padding: "3px 10px", borderRadius: "999px",
                          background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)",
                          fontSize: "11px", fontWeight: 700, color: "#4ADE80", letterSpacing: "0.08em"
                        }}>WINNER</div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{
                          width: "72px", height: "72px", borderRadius: "50%",
                          border: `2px solid ${isSelected ? color : "rgba(255,255,255,0.08)"}`,
                          background: "linear-gradient(135deg, #1E293B, #0F172A)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "2.2rem", transition: "border-color 0.25s",
                        }}>🐃</div>
                        <div>
                          <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "#F8FAFC", letterSpacing: "-0.03em" }}>{b.name}</div>
                          <div style={{ fontSize: "13px", color: "#64748B", marginTop: "2px" }}>
                            Owner: <span style={{ color: "#94A3B8", fontWeight: 600 }}>{b.owner}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        {[
                          { label: "Record",  value: b.record },
                          { label: "Win Rate", value: `${b.winRate}%`, highlight: color },
                          { label: "Weight",  value: b.weight },
                          { label: "Age",     value: b.age },
                          { label: "Origin",  value: b.origin },
                        ].map((s, i) => (
                          <div key={i} style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            borderRadius: "10px", padding: "0.75rem 1rem",
                          }}>
                            <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569", marginBottom: "4px" }}>{s.label}</div>
                            <div style={{ fontWeight: 800, fontSize: "15px", color: s.highlight ?? "#F1F5F9" }}>{s.value}</div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Win Rate</div>
                        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                          <div style={{ width: `${b.winRate}%`, height: "100%", background: color, borderRadius: "4px", transition: "width 0.5s" }} />
                        </div>
                      </div>
                      {isOpen && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedBuffalo(side); }}
                          style={{
                            width: "100%", padding: "0.75rem",
                            borderRadius: "10px",
                            border: `1px solid ${isSelected ? color : "rgba(255,255,255,0.08)"}`,
                            background: isSelected ? `rgba(248,113,113,0.15)` : "rgba(255,255,255,0.04)",
                            color: isSelected ? color : "#64748B",
                            fontWeight: 700, fontSize: "14px", cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          {isSelected ? `✓ Kerbau ${side} Selected` : `Pilih Kerbau ${side}`}
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* ── Match History / Rekam Jejak ── */}
              <div style={{
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px", overflow: "hidden",
                background: "rgba(255,255,255,0.015)",
              }}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <h3 style={{ fontWeight: 800, fontSize: "14px", color: "#F1F5F9" }}>🏆 Rekam Jejak Terakhir</h3>
                </div>
                {[
                  { date: "Feb 28", matchup: `${match.buffaloA.name} vs Mega Watt`,   result: "WIN",  prize: "+240 WLD" },
                  { date: "Feb 14", matchup: `${match.buffaloA.name} vs Tanduk Prime`, result: "WIN",  prize: "+180 WLD" },
                  { date: "Jan 30", matchup: `${match.buffaloA.name} vs Bima Sakti`,   result: "LOSE", prize: "—" },
                  { date: "Jan 15", matchup: `${match.buffaloB.name} vs Putra Langit`, result: "WIN",  prize: "+320 WLD" },
                  { date: "Dec 28", matchup: `${match.buffaloB.name} vs Gorila Mas`,   result: "WIN",  prize: "+150 WLD" },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "80px 1fr 80px 100px",
                    padding: "0.9rem 1.5rem",
                    borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    alignItems: "center",
                  }}>
                    <span style={{ fontSize: "12px", color: "#475569" }}>{row.date}</span>
                    <span style={{ fontSize: "13px", color: "#94A3B8" }}>{row.matchup}</span>
                    <span style={{
                      fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em",
                      color: row.result === "WIN" ? "#4ADE80" : "#F87171",
                    }}>{row.result}</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: row.prize !== "—" ? "#EAB308" : "#334155", textAlign: "right" }}>{row.prize}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Staking Interface (sticky sidebar) ── */}
            <div style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Main panel */}
              <div style={{
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "20px", padding: "2rem",
                background: "rgba(255,255,255,0.025)",
                backdropFilter: "blur(20px)",
                display: "flex", flexDirection: "column", gap: "1.75rem",
              }}>
                <div>
                  <h2 style={{ fontWeight: 900, fontSize: "1.2rem", color: "#F8FAFC", marginBottom: "4px" }}>
                    Place Prediction
                  </h2>
                  <p style={{ color: "#475569", fontSize: "13px" }}>Select your champion and stake tokens.</p>
                </div>

                {/* Locked / Resolved overlay message */}
                {!isOpen && (
                  <div style={{
                    padding: "1.25rem", borderRadius: "12px",
                    background: match.status === "Locked" ? "rgba(245,158,11,0.08)" : "rgba(148,163,184,0.06)",
                    border: `1px solid ${match.status === "Locked" ? "rgba(245,158,11,0.2)" : "rgba(148,163,184,0.15)"}`,
                    display: "flex", alignItems: "center", gap: "10px",
                    color: match.status === "Locked" ? "#F59E0B" : "#94A3B8",
                    fontSize: "13px", fontWeight: 600,
                  }}>
                    {match.status === "Locked" ? <Lock size={16} /> : <CheckCircle2 size={16} />}
                    {match.status === "Locked" ? "Predictions are locked — match is in progress." : `Match resolved. ${match.winner === "A" ? match.buffaloA.name : match.buffaloB.name} won.`}
                  </div>
                )}

                {isOpen && (
                  <>
                    {/* Buffalo selector mini-buttons */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      {(["A", "B"] as const).map(side => {
                        const b = side === "A" ? match.buffaloA : match.buffaloB;
                        const color = side === "A" ? "#4ADE80" : "#F87171";
                        const selected = selectedBuffalo === side;
                        return (
                          <button
                            key={side}
                            onClick={() => setSelectedBuffalo(side)}
                            style={{
                              padding: "1rem 0.75rem", borderRadius: "12px",
                              border: `1px solid ${selected ? color : "rgba(255,255,255,0.08)"}`,
                              background: selected ? `rgba(${side === "A" ? "74,222,128" : "248,113,113"},0.1)` : "rgba(255,255,255,0.03)",
                              cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                            }}
                          >
                            <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>🐃</div>
                            <div style={{ fontWeight: 800, fontSize: "12px", color: selected ? color : "#94A3B8", letterSpacing: "-0.01em" }}>
                              {b.name}
                            </div>
                            <div style={{ fontSize: "10px", color: "#475569", marginTop: "2px" }}>Kerbau {side}</div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Token selector */}
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#475569", display: "block", marginBottom: "10px" }}>
                        Token
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        {(["WLD", "USDC"] as const).map(t => (
                          <button
                            key={t}
                            onClick={() => setToken(t)}
                            style={{
                              padding: "10px",
                              borderRadius: "10px",
                              border: token === t ? "1px solid rgba(79,107,255,0.5)" : "1px solid rgba(255,255,255,0.07)",
                              background: token === t ? "rgba(79,107,255,0.1)" : "rgba(255,255,255,0.03)",
                              color: token === t ? "#818CF8" : "#64748B",
                              fontWeight: 700, fontSize: "13px", cursor: "pointer", transition: "all 0.2s",
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount input */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#475569" }}>Amount</label>
                        <span style={{ fontSize: "11px", color: "#475569" }}>
                          {isConnected ? `Bal: ${displayBalance}` : "Connect to see balance"}
                        </span>
                      </div>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          value={stake}
                          onChange={e => setStake(e.target.value)}
                          placeholder="0.00"
                          style={{
                            width: "100%", padding: "1rem 4.5rem 1rem 1.25rem",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "12px", color: "#F8FAFC",
                            fontSize: "1.3rem", fontWeight: 800, outline: "none",
                          }}
                        />
                        <span style={{
                          position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                          fontSize: "13px", fontWeight: 700, color: "#475569",
                        }}>{token}</span>
                      </div>
                      {/* Quick amounts */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", marginTop: "10px" }}>
                        {["25", "50", "100", "MAX"].map(a => (
                          <button key={a} onClick={() => setStake(a === "MAX" ? "1240" : a)}
                            style={{
                              padding: "6px", borderRadius: "8px",
                              border: stake === (a === "MAX" ? "1240" : a) ? "1px solid rgba(79,107,255,0.4)" : "1px solid rgba(255,255,255,0.07)",
                              background: "rgba(255,255,255,0.03)",
                              color: "#64748B", fontSize: "12px", fontWeight: 700, cursor: "pointer",
                            }}>
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div style={{
                      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "12px", overflow: "hidden",
                    }}>
                      {[
                        { label: "Estimated Reward", value: `≈ ${estimated} ${token}`, highlight: true },
                        { label: "Platform Fee",      value: "2.5%",                   highlight: false },
                        { label: "Your Stake",        value: `${stake || "0"} ${token}`, highlight: false },
                      ].map((r, i) => (
                        <div key={i} style={{
                          display: "flex", justifyContent: "space-between",
                          padding: "0.85rem 1.25rem",
                          borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        }}>
                          <span style={{ fontSize: "13px", color: "#64748B" }}>{r.label}</span>
                          <span style={{ fontSize: "13px", fontWeight: 800, color: r.highlight ? "#4ADE80" : "#F1F5F9" }}>{r.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* World ID */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      padding: "0.75rem 1rem", borderRadius: "10px",
                      background: isVerified ? "rgba(74,222,128,0.06)" : "rgba(245,158,11,0.06)",
                      border: isVerified ? "1px solid rgba(74,222,128,0.2)" : "1px solid rgba(245,158,11,0.2)",
                      fontSize: "12px", fontWeight: 600,
                      color: isVerified ? "#4ADE80" : "#F59E0B",
                    }}>
                      {isVerified ? <ShieldCheck size={15} /> : <AlertCircle size={15} />}
                      {isVerified ? "World ID Verified · Eligible to Predict" : "World ID verification required"}
                    </div>

                    {/* CTA */}
                    <button
                      disabled={!isConnected || !selectedBuffalo || !stake || !isVerified}
                      style={{
                        width: "100%", padding: "1.1rem",
                        borderRadius: "14px", border: "none",
                        background: isConnected && selectedBuffalo && stake && isVerified
                          ? "linear-gradient(135deg, #4F6BFF, #6366F1)"
                          : "rgba(255,255,255,0.05)",
                        color: isConnected && selectedBuffalo && stake && isVerified ? "#fff" : "#334155",
                        fontSize: "15px", fontWeight: 800, cursor: (isConnected && selectedBuffalo && stake && isVerified) ? "pointer" : "not-allowed",
                        boxShadow: (isConnected && selectedBuffalo && stake && isVerified) ? "0 8px 24px rgba(79,107,255,0.3)" : "none",
                        transition: "all 0.25s",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {!isConnected ? "Connect Wallet to Predict" : 
                       !selectedBuffalo ? "Pilih Kerbau dahulu" : 
                       !stake ? "Enter amount" : "Konfirmasi Prediksi →"}
                    </button>
                  </>
                )}
              </div>

              {/* Streak card */}
              <div style={{
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px", padding: "1.25rem 1.5rem",
                background: "rgba(255,255,255,0.015)",
                display: "flex", alignItems: "center", gap: "12px",
              }}>
                <Flame size={20} color="#F59E0B" fill="#F59E0B" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: "14px", color: "#F1F5F9" }}>Hot Streak: +4</div>
                  <div style={{ fontSize: "12px", color: "#475569" }}>Win to unlock Silver Buffalo badge</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
