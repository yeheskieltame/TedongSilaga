"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const [seconds, setSeconds] = useState(19 * 60 + 42);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const timeLeft = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  return (
    <section
      style={{
        position: "relative",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#0B0F19",
      }}
    >
      {/* Background patterns */}
      <div style={{
        position: "absolute", top: "-10%", left: "-5%",
        width: "60%", height: "60%",
        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "-5%",
        width: "50%", height: "50%",
        background: "radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Main Content */}
      <div className="container-wide" style={{ position: "relative", zIndex: 10, padding: "8rem 1.5rem" }}>
        <div style={{ width: "100%" }}>

          {/* Live Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "6px 16px",
              background: "rgba(212,168,83,0.1)",
              border: "1px solid rgba(212,168,83,0.2)",
              borderRadius: "99px",
              marginBottom: "2.5rem",
            }}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#D4A853", boxShadow: "0 0 10px #D4A853" }} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4A853", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Arena is Live on World Chain
            </span>
          </motion.div>

          {/* Headline - Removed restrictive width */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(3rem, 8vw, 5.5rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              marginBottom: "2rem",
              color: "#F9FAFB",
              maxWidth: "1100px", // Increased from 760px
            }}
          >
            Predict the <span style={{ color: "#6366F1" }}>Champion.</span><br className="hidden md:block" />
            Experience <span style={{ color: "#D4A853" }}>Tedong Silaga.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "1.25rem",
              lineHeight: 1.6,
              color: "#9CA3AF",
              maxWidth: "700px", // Increased from 520px
              marginBottom: "3.5rem",
            }}
          >
            Predict the winner of traditional Toraja buffalo matches and earn rewards.
            The first premium on-chain arena for cultural heritage.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", marginBottom: "4rem" }}
          >
            <Link href="/markets" style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "1rem 2.5rem",
              background: "#6366F1",
              color: "#fff",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "1.1rem",
              textDecoration: "none",
              boxShadow: "0 10px 30px rgba(99,102,241,0.3)",
              transition: "transform 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              Explore Matches <ArrowRight size={20} />
            </Link>

            <button style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "1rem 2.5rem",
              background: "rgba(255,255,255,0.03)",
              color: "#F9FAFB",
              border: "1px solid rgba(212,168,83,0.3)",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "1.1rem",
              cursor: "pointer",
            }}>
              <ShieldCheck size={20} color="#D4A853" />
              Verify World ID
            </button>
          </motion.div>

          {/* Bottom stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              display: "flex", flexWrap: "wrap", gap: "3rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              maxWidth: "900px" // Wider stats bar
            }}
          >
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Next Arena Start</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#F9FAFB", fontFamily: "var(--font-mono)" }}>{timeLeft}</div>
            </div>
            <div style={{ width: "1px", height: "60px", background: "rgba(255,255,255,0.1)", alignSelf: "center" }} />
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Arena Players</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#22C55E", display: "flex", alignItems: "center", gap: "10px" }}>
                1,420 <span style={{ fontSize: "1rem", color: "#4B5563" }}>LIVE</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decor buffalo icon */}
      <div style={{
        position: "absolute", right: "5%",
        fontSize: "300px", opacity: 0.03, pointerEvents: "none", filter: "blur(2px)"
      }}>🐃</div>
    </section>
  );
};

export default Hero;
