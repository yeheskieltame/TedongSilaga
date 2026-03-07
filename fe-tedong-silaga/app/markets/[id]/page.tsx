"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ArrowLeft, Share2, Users, Clock, TrendingUp,
  ShieldCheck, AlertCircle, CheckCircle2, MapPin, Flame, Lock
} from "lucide-react";
import { motion } from "framer-motion";
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

// ── Buffalo Card Component ─────────────────────────────────────────────────────
function BuffaloCard({ side, buffalo, color, isOpen, isSelected, isWinner, matchStatus, onSelect }: {
  side: "A" | "B";
  buffalo: { name: string; owner: string; record: string; winRate: number; weight: string; age: string; origin: string };
  color: string;
  isOpen: boolean;
  isSelected: boolean;
  isWinner: boolean;
  matchStatus: string;
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
        display: "flex", flexDirection: "column", gap: "1rem",
      }}
    >
      {isSelected && (
        <div style={{ position: "absolute", top: "12px", right: "12px" }}>
          <CheckCircle2 size={18} color={color} />
        </div>
      )}
      {isWinner && matchStatus === "Resolved" && (
        <div style={{
          position: "absolute", top: "10px", right: "10px",
          padding: "2px 8px", borderRadius: "999px",
          background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)",
          fontSize: "10px", fontWeight: 700, color: "#4ADE80", letterSpacing: "0.08em"
        }}>WINNER</div>
      )}

      {/* Avatar + name */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div className="detail-buffalo-avatar" style={{
          borderRadius: "50%",
          border: `2px solid ${isSelected ? color : "rgba(255,255,255,0.08)"}`,
          background: "linear-gradient(135deg, #1E293B, #0F172A)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "border-color 0.25s",
        }}>🐃</div>
        <div>
          <div className="detail-buffalo-name">{buffalo.name}</div>
          <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "1px" }}>
            Owner: <span style={{ color: "#94A3B8", fontWeight: 600 }}>{buffalo.owner}</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="detail-stats-grid">
        {[
          { label: "Record",  value: buffalo.record },
          { label: "Win Rate", value: `${buffalo.winRate}%`, highlight: color },
          { label: "Weight",  value: buffalo.weight },
          { label: "Age",     value: buffalo.age },
          { label: "Origin",  value: buffalo.origin },
        ].map((s, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "8px", padding: "0.5rem 0.75rem",
          }}>
            <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569", marginBottom: "2px" }}>{s.label}</div>
            <div style={{ fontWeight: 800, fontSize: "0.8rem", color: s.highlight ?? "#F1F5F9" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Win rate bar */}
      <div>
        <div style={{ fontSize: "10px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>Win Rate</div>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "3px", height: "5px", overflow: "hidden" }}>
          <div style={{ width: `${buffalo.winRate}%`, height: "100%", background: color, borderRadius: "3px", transition: "width 0.5s" }} />
        </div>
      </div>

      {/* Select button */}
      {isOpen && (
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          style={{
            width: "100%", padding: "0.6rem",
            borderRadius: "10px",
            border: `1px solid ${isSelected ? color : "rgba(255,255,255,0.08)"}`,
            background: isSelected ? `rgba(${side === "A" ? "74,222,128" : "248,113,113"},0.15)` : "rgba(255,255,255,0.04)",
            color: isSelected ? color : "#64748B",
            fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {isSelected ? `✓ ${buffalo.name} Selected` : `Pilih ${buffalo.name}`}
        </button>
      )}
    </motion.div>
  );
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const match = MATCHES[id] ?? DEFAULT_MATCH;
  const sc = STATUS_CONFIG[match.status];

  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });

  const [selectedBuffalo, setSelectedBuffalo] = useState<"A" | "B" | null>(null);
  const [stake, setStake] = useState("");
  const [token, setToken] = useState<"WLD" | "USDC">("WLD");

  const isVerified = true;
  const isOpen = match.status === "Open";

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
                <Clock size={12} /> {match.time}
              </span>
            </div>
            <h1 className="detail-match-title">
              {match.buffaloA.name} <span style={{ color: "#334155" }}>vs</span> {match.buffaloB.name}
            </h1>
            <p style={{ color: "#475569", marginTop: "2px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "4px" }}>
              <MapPin size={12} /> {match.loc} · {match.name}
            </p>
          </div>

          {/* ── Stats Bar ── */}
          <div className="detail-stats-bar">
            {[
              { label: "Prize Pool", value: match.status !== "Locked" ? `${match.pool} ${match.currency}` : "TBD", icon: <TrendingUp size={13} />, color: "#EAB308" },
              { label: "Players",    value: match.players.toString(), icon: <Users size={13} />, color: "#4F6BFF" },
              { label: "Locks In",   value: match.countdown, icon: <Clock size={13} />, color: "#F8FAFC" },
              { label: "Arena",      value: match.loc.split(",")[0], icon: <MapPin size={13} />, color: "#F8FAFC" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "1rem 1.25rem",
                background: "rgba(255,255,255,0.015)",
                display: "flex", flexDirection: "column", gap: "4px",
              }}>
                <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569", display: "flex", alignItems: "center", gap: "5px" }}>
                  {s.icon} {s.label}
                </span>
                <span className="detail-stats-value" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* ── Main Layout: Buffalo cards + Staking ── */}
          <div className="detail-main-grid">

            {/* Left: Buffalo cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Buffalo cards */}
              <div className="detail-buffalos-grid">
                <BuffaloCard
                  side="A" buffalo={match.buffaloA} color="#4ADE80"
                  isOpen={isOpen} isSelected={selectedBuffalo === "A"}
                  isWinner={match.winner === "A"} matchStatus={match.status}
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
                  side="B" buffalo={match.buffaloB} color="#F87171"
                  isOpen={isOpen} isSelected={selectedBuffalo === "B"}
                  isWinner={match.winner === "B"} matchStatus={match.status}
                  onSelect={() => setSelectedBuffalo("B")}
                />
              </div>

              {/* Match History */}
              <div style={{
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px", overflow: "hidden",
                background: "rgba(255,255,255,0.015)",
              }}>
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <h3 style={{ fontWeight: 800, fontSize: "0.85rem", color: "#F1F5F9" }}>🏆 Rekam Jejak Terakhir</h3>
                </div>
                {[
                  { date: "Feb 28", matchup: `${match.buffaloA.name} vs Mega Watt`,   result: "WIN",  prize: "+240 WLD" },
                  { date: "Feb 14", matchup: `${match.buffaloA.name} vs Tanduk Prime`, result: "WIN",  prize: "+180 WLD" },
                  { date: "Jan 30", matchup: `${match.buffaloA.name} vs Bima Sakti`,   result: "LOSE", prize: "—" },
                  { date: "Jan 15", matchup: `${match.buffaloB.name} vs Putra Langit`, result: "WIN",  prize: "+320 WLD" },
                ].map((row, i) => (
                  <div key={i} className="detail-history-row" style={{
                    borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}>
                    <span style={{ fontSize: "0.7rem", color: "#475569", flexShrink: 0 }}>{row.date}</span>
                    <span style={{ fontSize: "0.75rem", color: "#94A3B8", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.matchup}</span>
                    <span style={{
                      fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em",
                      color: row.result === "WIN" ? "#4ADE80" : "#F87171", flexShrink: 0,
                    }}>{row.result}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: row.prize !== "—" ? "#EAB308" : "#334155", textAlign: "right", flexShrink: 0 }}>{row.prize}</span>
                  </div>
                ))}
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
                <div>
                  <h2 style={{ fontWeight: 900, fontSize: "1.05rem", color: "#F8FAFC", marginBottom: "3px" }}>
                    Place Prediction
                  </h2>
                  <p style={{ color: "#475569", fontSize: "0.75rem" }}>Select your champion and stake tokens.</p>
                </div>

                {/* Locked / Resolved overlay */}
                {!isOpen && (
                  <div style={{
                    padding: "1rem", borderRadius: "12px",
                    background: match.status === "Locked" ? "rgba(245,158,11,0.08)" : "rgba(148,163,184,0.06)",
                    border: `1px solid ${match.status === "Locked" ? "rgba(245,158,11,0.2)" : "rgba(148,163,184,0.15)"}`,
                    display: "flex", alignItems: "center", gap: "8px",
                    color: match.status === "Locked" ? "#F59E0B" : "#94A3B8",
                    fontSize: "0.75rem", fontWeight: 600,
                  }}>
                    {match.status === "Locked" ? <Lock size={15} /> : <CheckCircle2 size={15} />}
                    {match.status === "Locked" ? "Predictions locked — match in progress." : `Match resolved. ${match.winner === "A" ? match.buffaloA.name : match.buffaloB.name} won.`}
                  </div>
                )}

                {isOpen && (
                  <>
                    {/* Buffalo mini-select */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {(["A", "B"] as const).map(side => {
                        const b = side === "A" ? match.buffaloA : match.buffaloB;
                        const color = side === "A" ? "#4ADE80" : "#F87171";
                        const selected = selectedBuffalo === side;
                        return (
                          <button key={side} onClick={() => setSelectedBuffalo(side)}
                            style={{
                              padding: "0.75rem 0.5rem", borderRadius: "12px",
                              border: `1px solid ${selected ? color : "rgba(255,255,255,0.08)"}`,
                              background: selected ? `rgba(${side === "A" ? "74,222,128" : "248,113,113"},0.1)` : "rgba(255,255,255,0.03)",
                              cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                            }}>
                            <div style={{ fontSize: "1.3rem", marginBottom: "3px" }}>🐃</div>
                            <div style={{ fontWeight: 800, fontSize: "0.7rem", color: selected ? color : "#94A3B8" }}>{b.name}</div>
                            <div style={{ fontSize: "0.6rem", color: "#475569", marginTop: "1px" }}>Kerbau {side}</div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Token selector */}
                    <div>
                      <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#475569", display: "block", marginBottom: "8px" }}>Token</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                        {(["WLD", "USDC"] as const).map(t => (
                          <button key={t} onClick={() => setToken(t)} style={{
                            padding: "8px", borderRadius: "10px",
                            border: token === t ? "1px solid rgba(79,107,255,0.5)" : "1px solid rgba(255,255,255,0.07)",
                            background: token === t ? "rgba(79,107,255,0.1)" : "rgba(255,255,255,0.03)",
                            color: token === t ? "#818CF8" : "#64748B",
                            fontWeight: 700, fontSize: "12px", cursor: "pointer", transition: "all 0.2s",
                          }}>{t}</button>
                        ))}
                      </div>
                    </div>

                    {/* Amount input */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#475569" }}>Amount</label>
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
                        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", fontWeight: 700, color: "#475569" }}>{token}</span>
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
                        { label: "Estimated Reward", value: `≈ ${estimated} ${token}`, highlight: true },
                        { label: "Platform Fee",      value: "2.5%",                   highlight: false },
                        { label: "Your Stake",        value: `${stake || "0"} ${token}`, highlight: false },
                      ].map((r, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.7rem 1rem", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                          <span style={{ fontSize: "0.75rem", color: "#64748B" }}>{r.label}</span>
                          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: r.highlight ? "#4ADE80" : "#F1F5F9" }}>{r.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* World ID */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "0.6rem 0.85rem", borderRadius: "10px",
                      background: isVerified ? "rgba(74,222,128,0.06)" : "rgba(245,158,11,0.06)",
                      border: isVerified ? "1px solid rgba(74,222,128,0.2)" : "1px solid rgba(245,158,11,0.2)",
                      fontSize: "0.7rem", fontWeight: 600,
                      color: isVerified ? "#4ADE80" : "#F59E0B",
                    }}>
                      {isVerified ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}
                      {isVerified ? "World ID Verified · Eligible" : "World ID required"}
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
                      {!isConnected ? "Connect Wallet" : !selectedBuffalo ? "Pilih Kerbau dahulu" : !stake ? "Enter amount" : "Konfirmasi Prediksi →"}
                    </button>
                  </>
                )}
              </div>

              {/* Streak card */}
              <div style={{
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px", padding: "1rem 1.25rem",
                background: "rgba(255,255,255,0.015)",
                display: "flex", alignItems: "center", gap: "10px",
              }}>
                <Flame size={18} color="#F59E0B" fill="#F59E0B" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "#F1F5F9" }}>Hot Streak: +4</div>
                  <div style={{ fontSize: "0.7rem", color: "#475569" }}>Win to unlock Silver Buffalo badge</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
