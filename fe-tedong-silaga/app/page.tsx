"use client";

import React, { useRef } from "react";
import ParticleSphere from "@/components/ParticleSphere";
import HeroSection from "@/components/HeroSection";
import ExplanationCards from "@/components/ExplanationCards";
import MatchCarousel from "@/components/MatchCarousel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useScroll } from "framer-motion";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll ONLY within the 650vh cinematic container.
  // offset: "start start" = when top of container hits top of viewport (scroll = 0)
  //         "end end"     = when bottom of container hits bottom of viewport (scroll = 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <>
      {/* Dark background base */}
      <div style={{ position: "fixed", inset: 0, zIndex: -2, background: "#020617" }} />

      {/* ── 3D Scene (Fixed Background) ── */}
      <ParticleSphere scrollYProgress={scrollYProgress} />

      {/* ── Fixed Header ── */}
      <Header />

      {/* ── Cinematic Scroll Track: 650vh ── */}
      <div ref={containerRef} style={{ height: "650vh", position: "relative" }}>

        {/* Sticky Viewport — all cinematic stages live here */}
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

          {/* Stage 1: Hero */}
          <HeroSection scrollYProgress={scrollYProgress} />

          {/* Stage 4: Explanation Cards — centered */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden"
          }}>
            <ExplanationCards scrollYProgress={scrollYProgress} />
          </div>

          {/* Stage 5: Match Carousel — centered vertically and horizontally */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden"
          }}>
            <MatchCarousel scrollYProgress={scrollYProgress} />
          </div>

        </div>
      </div>

      {/* ── Footer: outside the cinematic track ── */}
      <Footer />
    </>
  );
}
