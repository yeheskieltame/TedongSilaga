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
        padding: "0 1.25rem",
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
        <span className="hero-tag">
          Protocol · Arena · World Chain
        </span>
        
        <h1 className="hero-heading">
          Predict the <span style={{ color: "#4F6BFF" }}>Champion.</span>
        </h1>
        
        <h2 className="hero-subheading">
          Experience Tedong Silaga.
        </h2>

        <p className="hero-desc">
          The first cinematic prediction market for traditional Toraja buffalo fights. 
          Preserving legacy through verified on-chain mechanics.
        </p>

        {/* Sphere focal area — responsive */}
        <div className="hero-sphere-space" />

        <div className="hero-buttons">
          <button className="hero-btn-primary">
            Explore Matches <ArrowRight size={18} />
          </button>
          
          <button className="hero-btn-secondary">
            <ShieldCheck size={18} color="#EAB308" />
            Verify with World ID
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}
