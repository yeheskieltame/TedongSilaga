"use client";

import React from "react";
import { motion, useTransform, MotionValue, useMotionValueEvent } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function HeroSection({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const [isVisible, setIsVisible] = React.useState(true);
  
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsVisible(v < 0.25);
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.22], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.22], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 0.22], [0, -40]);
  
  if (!isVisible) return null;

  return (
    <motion.section
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 1.5rem",
        opacity,
        scale,
        y,
        position: "absolute",
        inset: 0,
        zIndex: 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <span style={{
          fontSize: "13px", fontWeight: 700, letterSpacing: "0.25em",
          color: "#4F6BFF", textTransform: "uppercase", marginBottom: "1.5rem", display: "block"
        }}>
          Protocol · Arena · World Chain
        </span>
        
        <h1 style={{
          fontSize: "clamp(3.5rem, 10vw, 7rem)",
          fontWeight: 900,
          color: "#F8FAFC",
          lineHeight: 0.95,
          letterSpacing: "-0.05em",
          marginBottom: "1.5rem",
        }}>
          Predict the <span style={{ color: "#4F6BFF" }}>Champion.</span>
        </h1>
        
        <h2 style={{
          fontSize: "clamp(1.5rem, 5vw, 3rem)",
          fontWeight: 800,
          color: "#EAB308",
          letterSpacing: "-0.02em",
          marginBottom: "2.5rem",
        }}>
          Experience Tedong Silaga.
        </h2>

        <p style={{
          fontSize: "1.25rem",
          color: "#94A3B8",
          maxWidth: "640px",
          margin: "0 auto 0 auto",
          lineHeight: 1.7,
        }}>
          The first cinematic prediction market for traditional Toraja buffalo fights. 
          Preserving legacy through verified on-chain mechanics.
        </p>

        {/* Sphere focal area */}
        <div style={{ height: "42vh" }} />

        <div style={{ display: "flex", gap: "1.25rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
          <button style={{
            padding: "1.1rem 2.75rem", background: "#4F6BFF", color: "#fff",
            borderRadius: "16px", fontWeight: 700, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 10px 40px rgba(79,107,255,0.4)"
          }}>
            Explore Matches <ArrowRight size={20} />
          </button>
          
          <button style={{
            padding: "1.1rem 2.75rem", background: "rgba(255,255,255,0.03)", color: "#E5E7EB",
            borderRadius: "16px", fontWeight: 700, border: "1px solid rgba(255,255,255,0.12)", 
            cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
            backdropFilter: "blur(12px)"
          }}>
            <ShieldCheck size={20} color="#EAB308" />
            Verify with World ID
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}
