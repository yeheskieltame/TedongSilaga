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
        justifyContent: "space-between",
        textAlign: "center",
        padding: "0 1.25rem",
        paddingTop: "14vh",
        paddingBottom: "10vh",
        opacity,
        scale,
        y,
        position: "absolute",
        inset: 0,
        zIndex: 20,
      }}
    >
      {/* Background Image Area - Paling Belakang */}
      <div 
        style={{ 
          position: "absolute", 
          inset: 0, 
          zIndex: -1, 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          pointerEvents: "none",
          overflow: "hidden"
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/tedong-page.webp" 
          alt="Tedong Silaga Buffalos Background" 
          style={{ 
            width: "auto", 
            height: "100%", 
            objectFit: "cover",
            opacity: 0.85
          }} 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          flex: 1,
          justifyContent: "space-between",
          width: "100%"
        }}
      >
        {/* Top Text Group */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span className="hero-tag" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
            Protocol · Arena · World Chain
          </span>
          
          <h1 className="hero-heading" style={{ position: "relative", zIndex: 10, textShadow: "0 8px 40px rgba(0,0,0,0.8), 0 4px 10px rgba(0,0,0,0.6)" }}>
            Predict the <span style={{ color: "#4F6BFF" }}>Champion.</span>
          </h1>
          
          <h2 className="hero-subheading" style={{ position: "relative", zIndex: 10, textShadow: "0 6px 30px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)" }}>
            Experience Tedong Silaga.
          </h2>

          <p className="hero-desc" style={{ position: "relative", zIndex: 10, textShadow: "0 4px 15px rgba(0, 0, 0, 1), 0 1px 4px rgba(0, 0, 0, 1)" }}>
            The first cinematic prediction market for traditional Toraja buffalo fights. <br className="hidden md:block" />
            Preserving legacy through verified on-chain mechanics.
          </p>
        </div>

        {/* Bottom Button Group */}
        <div className="hero-buttons" style={{ position: "relative", zIndex: 10, display: "flex", gap: "1.5rem" }}>
          
          {/* Primary Button Wrapper */}
          <div style={{ position: "relative" }}>
            {/* Glow Core */}
            <div style={{ position: "absolute", bottom: "-2px", left: "15%", right: "15%", height: "2px", background: "linear-gradient(90deg, transparent, #A5B4FC, transparent)", zIndex: 2 }} />
            {/* Blur Core */}
            <div style={{ position: "absolute", bottom: "-6px", left: "5%", right: "5%", height: "12px", background: "#4F6BFF", filter: "blur(12px)", zIndex: -1, opacity: 0.9 }} />
            {/* Extended Line flare */}
            <div style={{ position: "absolute", bottom: "-1px", left: "-50%", right: "-50%", height: "1px", background: "linear-gradient(90deg, transparent 10%, rgba(130, 150, 255, 0.4) 50%, transparent 90%)", zIndex: 1 }} />
            
            <button className="hero-btn-primary" style={{ borderRadius: "9999px", position: "relative", zIndex: 10, background: "linear-gradient(135deg, #6E8BFF, #4F6BFF)" }}>
              Explore Matches <ArrowRight size={18} />
            </button>
          </div>
          
          {/* Secondary Button Wrapper */}
          <div style={{ position: "relative" }}>
            {/* Glow Core */}
            <div style={{ position: "absolute", bottom: "-2px", left: "20%", right: "20%", height: "2px", background: "linear-gradient(90deg, transparent, #FDE047, transparent)", zIndex: 2 }} />
            {/* Blur Core */}
            <div style={{ position: "absolute", bottom: "-6px", left: "15%", right: "15%", height: "12px", background: "#EAB308", filter: "blur(12px)", zIndex: -1, opacity: 0.5 }} />
            
            <button className="hero-btn-secondary" style={{ borderRadius: "9999px", position: "relative", zIndex: 10, background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
              <ShieldCheck size={18} color="#EAB308" />
              Verify with World ID
            </button>
          </div>
          
        </div>
      </motion.div>
    </motion.section>
  );
}
