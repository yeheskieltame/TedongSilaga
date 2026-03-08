"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Menu, X, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WalletButton from "@/components/WalletButton";
import MusicToggleButton from "@/components/MusicToggleButton";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isVerified = true; // Demo value
  const streak = 4; // Demo value

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.3s ease",
        background: "transparent",
        padding: isScrolled ? "0.75rem 0" : "1.25rem 0",
        pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }} className="hidden md:flex">
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem",
            borderRadius: "9999px",
            background: isScrolled ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
            pointerEvents: "auto",
            transition: "all 0.3s ease",
            boxShadow: isScrolled ? "0 4px 30px rgba(0, 0, 0, 0.1)" : "none",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", padding: "0 0.5rem" }} className="group">
            <div style={{
              width: "28px", height: "28px",
              background: "#6366F1",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "1rem",
              boxShadow: "0 0 15px rgba(99,102,241,0.4)",
            }}>🐃</div>
            <span style={{
              fontSize: "1rem", fontWeight: 800, color: "#F9FAFB",
              fontFamily: "var(--font-heading)", letterSpacing: "-0.01em"
            }} className="hidden lg:block">
              Tedong Silaga
            </span>
          </Link>

          {/* Separator */}
          <div style={{ width: "1px", height: "18px", background: "rgba(255, 255, 255, 0.15)", margin: "0 4px" }} />

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0 0.5rem" }}>
            <Link href="/markets" style={{ color: "#9CA3AF", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }} 
                  onMouseEnter={e => e.currentTarget.style.color = "#F9FAFB"}
                  onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>
              Markets
            </Link>
            <Link href="/leaderboard" style={{ color: "#9CA3AF", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#F9FAFB"}
                  onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>
              Leaderboard
            </Link>
          </div>

          {/* Separator */}
          <div style={{ width: "1px", height: "18px", background: "rgba(255, 255, 255, 0.15)", margin: "0 4px" }} />

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Streak Badge */}
            <div style={{
              display: "none", alignItems: "center", gap: "6px",
              padding: "5px 12px",
              background: "rgba(212,168,83,0.1)",
              border: "1px solid rgba(212,168,83,0.3)",
              borderRadius: "999px",
              color: "#D4A853", fontWeight: 700, fontSize: "13px",
            }} className="sm:flex">
              <Flame size={14} fill="#D4A853" />
              <span>{streak}</span>
            </div>

            {/* World ID Badge */}
            {isVerified && (
              <div style={{
                display: "none", alignItems: "center", gap: "6px",
                padding: "5px 12px",
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.25)",
                borderRadius: "999px",
                color: "#22C55E", fontWeight: 600, fontSize: "13px",
              }} className="lg:flex">
                <ShieldCheck size={14} />
                <span>Verified</span>
              </div>
            )}

            {/* Separator */}
            <div className="hidden sm:block" style={{ width: "1px", height: "18px", background: "rgba(255, 255, 255, 0.15)", margin: "0 4px" }} />

            <MusicToggleButton />
            
            {/* Wallet Button */}
            <WalletButton />
          </div>
        </nav>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden container-wide" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", pointerEvents: "auto" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }} className="group">
          <div style={{
            width: "32px", height: "32px",
            background: "#6366F1",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "1rem",
            boxShadow: "0 0 15px rgba(99,102,241,0.4)",
          }}>🐃</div>
          <span style={{
            fontSize: "1.1rem", fontWeight: 800, color: "#F9FAFB",
            fontFamily: "var(--font-heading)", letterSpacing: "-0.01em"
          }}>
            Tedong Silaga
          </span>
        </Link>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <MusicToggleButton />
          <button
            style={{ display: "flex", background: "none", border: "none", color: "#F9FAFB", cursor: "pointer", padding: "4px" }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: "#111827",
              borderBottom: "1px solid #1F2937",
              overflow: "hidden"
            }}
            className="md:hidden"
          >
            <div style={{ padding: "1.5rem 1.5rem 2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <Link href="/markets" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: "1.25rem", fontWeight: 700, color: "#F9FAFB", textDecoration: "none" }}>Markets</Link>
              <Link href="/leaderboard" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: "1.25rem", fontWeight: 700, color: "#F9FAFB", textDecoration: "none" }}>Leaderboard</Link>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", paddingTop: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.3)", borderRadius: "999px", color: "#D4A853", fontWeight: 700, fontSize: "13px" }}>
                  <Flame size={14} fill="#D4A853" /> {streak} Wins
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "999px", color: "#22C55E", fontWeight: 700, fontSize: "13px" }}>
                  <ShieldCheck size={14} /> Verified
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
