"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { Search, SlidersHorizontal, ChevronDown, TrendingUp, Users, Zap } from "lucide-react";

const ALL_MATCHES = [
  { id: "1",  nameA: "Rambu Solon",    nameB: "Tanduk Biru",   owner_a: "Datu Polopadang", owner_b: "Ne' Linggi",    loc: "Bori Arena",        pool: "2,400 WLD",  players: 34, winRateA: 80, record_a: "8W-2L", record_b: "6W-3L",  status: "Open"     as const },
  { id: "4",  nameA: "Putra Alam",     nameB: "Sakti Toraja",  owner_a: "Layuk Allo",      owner_b: "Sanda Pitu",    loc: "Marante Stadium",   pool: "850 USDC",   players: 31, winRateA: 60, record_a: "6W-4L", record_b: "9W-2L",  status: "Open"     as const },
  { id: "5",  nameA: "Mega Watt",      nameB: "Silaga Prime",  owner_a: "Randa Bua",       owner_b: "Tato Dena",     loc: "Sesean Arena",      pool: "1,200 WLD",  players: 18, winRateA: 55, record_a: "5W-4L", record_b: "7W-3L",  status: "Open"     as const },
  { id: "2",  nameA: "Gorila Sakti",   nameB: "Byson Mas",     owner_a: "Ambe Rante",      owner_b: "Yusuf To",      loc: "Lemo Arena",        pool: "—",          players: 12, winRateA: 70, record_a: "7W-3L", record_b: "5W-5L",  status: "Locked"   as const },
  { id: "3",  nameA: "Kerbau Silaga",  nameB: "Toraja King",   owner_a: "Pong Tiku",       owner_b: "Layuk Rante",   loc: "Kete Kesu Arena",   pool: "1,200 WLD",  players: 8,  winRateA: 62, record_a: "8W-5L", record_b: "11W-2L", status: "Resolved" as const },
  { id: "6",  nameA: "Tanduk Mas",     nameB: "Putra Langit",  owner_a: "Ne' Bua",         owner_b: "Rante Allo",    loc: "Pallawa Arena",     pool: "1,450 USDC", players: 45, winRateA: 58, record_a: "7W-5L", record_b: "9W-3L",  status: "Resolved" as const },
];

const STATUS_STYLE = {
  Open:     { dot: "bg-green-400",   text: "text-green-400",   bg: "bg-green-400/10",   label: "Open"     },
  Locked:   { dot: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-400/10",   label: "Locked"   },
  Resolved: { dot: "bg-slate-400",   text: "text-slate-400",   bg: "bg-slate-400/10",   label: "Resolved" },
};

export default function MarketsPage() {
  const [activeFilter, setActiveFilter] = useState<"All" | "Open" | "Locked" | "Resolved">("All");
  const [search, setSearch] = useState("");

  const filtered = ALL_MATCHES.filter(m => {
    const matchesFilter = activeFilter === "All" || m.status === activeFilter;
    const matchesSearch = search === "" ||
      m.nameA.toLowerCase().includes(search.toLowerCase()) ||
      m.nameB.toLowerCase().includes(search.toLowerCase()) ||
      m.loc.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openCount = ALL_MATCHES.filter(m => m.status === "Open").length;
  const totalPool = "5,850 WLD + 2,300 USDC";

  return (
    <div style={{ minHeight: "100vh", background: "#0B0F1A", color: "#E2E8F0" }}>
      <Header />

      <main style={{ paddingTop: "88px" }}>

        {/* ── Page Header ── */}
        <div style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "2.5rem 0 0",
        }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
            {/* Title row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem" }}>
              <div>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#F8FAFC", marginBottom: "0.4rem" }}>
                  Arena Markets
                </h1>
                <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
                  Live and upcoming buffalo prediction markets on World Chain.
                </p>
              </div>

              {/* Top-right stat */}
              <div style={{
                padding: "0.6rem 1.2rem",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.03)",
                fontSize: "0.8rem", color: "#94A3B8",
                display: "flex", alignItems: "center", gap: "8px"
              }}>
                <Zap size={14} color="#4F6BFF" />
                Total Active Pool: <strong style={{ color: "#F8FAFC" }}>5,850 WLD + 2,300 USDC</strong>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "3rem", paddingBottom: "1.5rem" }}>
              {[
                { label: "Open Markets",    value: `${openCount} Active`,  icon: <TrendingUp size={14} style={{ color: "#4ADE80" }} /> },
                { label: "Total Players",   value: "148",                  icon: <Users size={14} style={{ color: "#4F6BFF" }} /> },
                { label: "Resolved Today",  value: "2 Matches",            icon: <Zap size={14} style={{ color: "#EAB308" }} /> },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#475569", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                    {s.icon} {s.label}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: "1rem", color: "#F8FAFC" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Table Container ── */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 2rem 8rem" }}>

          {/* Toolbar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "1.25rem", gap: "1rem", flexWrap: "wrap"
          }}>
            {/* Filter pills */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <SlidersHorizontal size={15} style={{ color: "#475569", marginRight: "4px" }} />
              {(["All", "Open", "Locked", "Resolved"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: "999px",
                    border: activeFilter === f ? "1px solid rgba(79,107,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    background: activeFilter === f ? "rgba(79,107,255,0.12)" : "rgba(255,255,255,0.03)",
                    color: activeFilter === f ? "#818CF8" : "#64748B",
                    fontWeight: 700, fontSize: "13px", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                type="text"
                placeholder="Search buffalo or arena..."
                style={{
                  paddingLeft: "36px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px", color: "#E2E8F0", fontSize: "13px",
                  outline: "none", width: "220px",
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            overflow: "hidden",
            background: "rgba(255,255,255,0.015)",
          }}>
            {/* Table Head */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 2fr 1.2fr 1.2fr 1fr 1fr 1fr",
              padding: "0.85rem 1.5rem",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}>
              {["Buffalo A", "Buffalo B", "Arena", "Prize Pool", "Players", "Win Rate A", "Status"].map((col, i) => (
                <div key={i} style={{
                  fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                  color: "#475569", display: "flex", alignItems: "center", gap: "4px"
                }}>
                  {col} {i === 3 && <ChevronDown size={11} />}
                </div>
              ))}
            </div>

            {/* Table Rows */}
            {filtered.length === 0 ? (
              <div style={{ padding: "5rem", textAlign: "center", color: "#475569" }}>
                No matches found.
              </div>
            ) : filtered.map((m, idx) => {
              const ss = STATUS_STYLE[m.status];
              return (
                <Link key={m.id} href={`/markets/${m.id}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 2fr 1.2fr 1.2fr 1fr 1fr 1fr",
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
                        <div style={{ fontWeight: 700, fontSize: "14px", color: "#F1F5F9" }}>{m.nameA}</div>
                        <div style={{ fontSize: "11px", color: "#475569" }}>{m.owner_a}</div>
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
                        <div style={{ fontWeight: 700, fontSize: "14px", color: "#F1F5F9" }}>{m.nameB}</div>
                        <div style={{ fontSize: "11px", color: "#475569" }}>{m.owner_b}</div>
                      </div>
                    </div>

                    {/* Arena */}
                    <div style={{ fontSize: "13px", color: "#94A3B8" }}>{m.loc}</div>

                    {/* Prize Pool */}
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "14px", color: "#EAB308" }}>{m.pool}</div>
                    </div>

                    {/* Players */}
                    <div style={{ fontSize: "13px", color: "#94A3B8", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Users size={13} style={{ color: "#475569" }} /> {m.players}
                    </div>

                    {/* Win Rate A */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{
                          height: "4px", width: "64px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden"
                        }}>
                          <div style={{ height: "100%", width: `${m.winRateA}%`, background: m.winRateA >= 70 ? "#4ADE80" : m.winRateA >= 55 ? "#EAB308" : "#F87171", borderRadius: "2px" }} />
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: m.winRateA >= 70 ? "#4ADE80" : m.winRateA >= 55 ? "#EAB308" : "#F87171" }}>
                          {m.winRateA}%
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        padding: "3px 10px", borderRadius: "999px",
                        background: ss.bg, fontSize: "11px", fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.08em",
                      }} className={ss.text}>
                        <span style={{
                          width: "6px", height: "6px", borderRadius: "50%",
                          display: "inline-block",
                          animation: m.status === "Open" ? "pulse 2s infinite" : "none"
                        }} className={ss.dot} />
                        {ss.label}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "12px", color: "#334155" }}>
            Showing {filtered.length} of {ALL_MATCHES.length} markets · Powered by World Chain
          </p>
        </div>
      </main>
    </div>
  );
}
