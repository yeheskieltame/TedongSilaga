"use client";

import React from "react";
import { motion, useInView } from "framer-motion";

interface ScrollSectionProps {
  id?: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollSection: React.FC<ScrollSectionProps> = ({
  id, children, delay = 0, style,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.section>
  );
};

// ─── Specific feature/bento sections used on the main page ───────────────────

interface FeatureCardProps {
  icon: string;
  title: string;
  body: string;
  accent?: string;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon, title, body, accent = "#4F6BFF", delay = 0,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: "2.5rem",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "28px",
        display: "flex", flexDirection: "column", gap: "1.5rem",
        backdropFilter: "blur(8px)",
        transition: "border-color 0.3s, transform 0.3s",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${accent}40`;
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Glow accent in corner */}
      <div style={{
        position: "absolute", top: "-30px", right: "-30px",
        width: "120px", height: "120px",
        background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{
        width: "56px", height: "56px",
        background: `${accent}15`,
        border: `1px solid ${accent}30`,
        borderRadius: "16px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.75rem",
      }}>
        {icon}
      </div>

      <div>
        <h3 style={{
          fontSize: "1.25rem", fontWeight: 700,
          color: "#E5E7EB", marginBottom: "0.75rem",
          letterSpacing: "-0.01em",
        }}>{title}</h3>
        <p style={{ fontSize: "1rem", color: "#64748B", lineHeight: 1.7 }}>{body}</p>
      </div>
    </motion.div>
  );
};
