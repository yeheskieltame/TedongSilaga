"use client";

import React from "react";
import { motion, useTransform, MotionValue } from "framer-motion";

const Card = ({ title, body, delay }: { title: string; body: string; delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="explanation-card"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        width: "100%",
        flexShrink: 0,
      }}
    >
      <h3 className="explanation-card-title">
        {title}
      </h3>
      <p style={{
        fontSize: "1rem", color: "#94A3B8",
        lineHeight: 1.75, fontWeight: 400
      }}>
        {body}
      </p>
    </motion.div>
  );
};

export default function ExplanationCards({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Section appears: [60% → 66%] fade+rise in, holds till [82% → 86%] fades out
  const sectionOpacity = useTransform(scrollYProgress, [0.58, 0.64, 0.82, 0.86], [0, 1, 1, 0]);
  // Scroll-from-below: section rises significantly (120px → 0)
  const sectionY = useTransform(scrollYProgress, [0.58, 0.64], [120, 0]);
  const pointerEvents = useTransform(
    scrollYProgress,
    (v: number) => (v > 0.60 && v < 0.85) ? "auto" : "none"
  );

  return (
    <motion.section
      style={{
        width: "100%",
        maxWidth: "780px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 1.5rem",
        opacity: sectionOpacity,
        y: sectionY,
        pointerEvents,
        position: "relative",
        zIndex: 30,
        // Prevent content from overflowing outside viewport
        maxHeight: "100vh",
        overflowY: "auto",
        scrollbarWidth: "none",
      }}
      className="no-scrollbar"
    >
      {/* Section headline */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem", paddingTop: "1rem" }}>
        <p style={{
          fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em",
          color: "#4F6BFF", textTransform: "uppercase", marginBottom: "0.75rem"
        }}>
          The Arena
        </p>
        <h2 style={{
          fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
          fontWeight: 900,
          color: "#E5E7EB",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginBottom: "0"
        }}>
          Ancient Heritage.<br />
          <span style={{ color: "#EAB308" }}>Modern Economy.</span>
        </h2>
      </div>

      {/* Cards — scroll up from below one by one */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <Card
          delay={0}
          title="🐃 What is Tedong Silaga?"
          body="Tedong Silaga is a centuries-old tradition from the Toraja Highlands, representing honor, strength, and community. Prized buffalos compete in sacred arenas, drawing thousands to witness the spirit of the ancestors. We are bringing this legacy into the digital age."
        />
        <Card
          delay={0.15}
          title="⛓ Why the Prediction Arena?"
          body="By combining blockchain transparency with cultural legacy, we create a fair, bot-proof prediction market. World ID verification ensures one-human-one-vote, while WLD/USDC rewards empower community participants globally in a verifiably honest environment."
        />
      </div>
    </motion.section>
  );
}
