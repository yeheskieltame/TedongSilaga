"use client";

import React from "react";
import Link from "next/link";
import { Twitter, Github, Globe, MessageSquare } from "lucide-react";

const Footer = () => {
  return (
    <footer style={{
      padding: "6rem 0 3rem",
      background: "#111827",
      borderTop: "1px solid #1F2937",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative top pattern */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "repeating-linear-gradient(90deg, #D4A853 0px, #D4A853 1px, transparent 1px, transparent 8px)",
        opacity: 0.2
      }} />

      <div className="container-wide">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "4rem",
          marginBottom: "4rem",
        }}>
          {/* Brand Col */}
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "1.5rem" }} className="md:col-span-2">
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <div style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Tedong Silaga" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#F9FAFB", fontFamily: "var(--font-heading)" }}>Tedong Silaga</span>
            </Link>
            <p style={{ fontSize: "0.95rem", color: "#9CA3AF", lineHeight: 1.6, maxWidth: "420px" }}>
              The world&apos;s first premium prediction market for Tana Toraja&apos;s traditional buffalo competitions. 
              Preserving culture through blockchain innovation on World Chain.
            </p>
            <div style={{ display: "flex", gap: "1.25rem" }}>
              {[Twitter, Github, Globe, MessageSquare].map((Icon, i) => (
                <Icon key={i} size={20} color="#6B7280" style={{ cursor: "pointer", transition: "color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#6366F1"}
                      onMouseLeave={e => e.currentTarget.style.color = "#6B7280"} />
              ))}
            </div>
          </div>

          {/* Links Col 1 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#F9FAFB", textTransform: "uppercase", letterSpacing: "0.05em" }}>Arena</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["Markets Dashboard", "Global Leaderboard", "My Predictions", "Claim Rewards"].map((link, i) => (
                <Link key={i} href="#" style={{ fontSize: "0.9rem", color: "#9CA3AF", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#6366F1"}
                      onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>{link}</Link>
              ))}
            </div>
          </div>

          {/* Links Col 2 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#F9FAFB", textTransform: "uppercase", letterSpacing: "0.05em" }}>Protocol</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["Whitepaper", "Audits", "Governance", "World Chain Info"].map((link, i) => (
                <Link key={i} href="#" style={{ fontSize: "0.9rem", color: "#9CA3AF", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#6366F1"}
                      onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>{link}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: "2rem",
          borderTop: "1px solid #1F2937",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1.5rem",
        }}>
          <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>© 2026 Tedong Silaga Arena. Built for World Chain.</span>
          <div style={{ display: "flex", gap: "2rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4B5563", cursor: "pointer" }}>Privacy Policy</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4B5563", cursor: "pointer" }}>Terms of Arena</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
