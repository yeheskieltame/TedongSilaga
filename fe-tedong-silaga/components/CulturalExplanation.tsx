"use client";

import React from "react";
import { Globe, Info, History } from "lucide-react";

const CulturalExplanation = () => {
  return (
    <section style={{
      background: "#111827",
      padding: "10rem 0",
      borderTop: "1px solid #1F2937",
      borderBottom: "1px solid #1F2937",
      position: "relative",
    }}>
      <div className="container-wide">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
          gap: "6rem",
          alignItems: "center",
        }}>
          {/* Left: Culture Illustration Card */}
          <div style={{ position: "relative" }}>
            <div style={{
              aspectRatio: "1.2/1.4",
              background: "linear-gradient(180deg, #1A2035 0%, #111827 100%)",
              border: "1px solid rgba(212,168,83,0.15)",
              borderRadius: "32px",
              padding: "4rem 3rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6)"
            }}>
               {/* Pattern Overlay */}
               <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "radial-gradient(rgba(139,94,60,0.2) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
                opacity: 0.3
              }} />

              <div style={{ position: "relative", zIndex: 10 }}>
                <div style={{
                  fontSize: "3.5rem",
                  fontWeight: 900,
                  color: "#D4A853",
                  lineHeight: 1,
                  fontFamily: "var(--font-heading)",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                  letterSpacing: "-0.02em"
                }}>
                  Warisan<br />Toraja.
                </div>
                <div style={{ width: "60px", height: "4px", background: "#D4A853", marginBottom: "2rem" }} />
                <p style={{ color: "#9CA3AF", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "450px" }}>
                  The buffalo arena is a timeless tradition of honor and strength in the Toraja highlands.
                </p>
              </div>

              {/* Big Buffalo Shadow */}
              <div style={{
                position: "absolute", top: "10%", right: "10%",
                fontSize: "180px", opacity: 0.1, userSelect: "none"
              }}>🐃</div>
            </div>

            {/* History Badge */}
            <div style={{
              position: "absolute", top: "-20px", right: "20px",
              width: "70px", height: "70px",
              background: "#6366F1",
              borderRadius: "20px",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 30px rgba(99,102,241,0.5)",
              zIndex: 20
            }}>
              <History size={32} color="#fff" />
            </div>
          </div>

          {/* Right: Text Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#D4A853", marginBottom: "1.25rem" }}>
                Authentic Heritage
              </div>
              <h2 style={{
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                fontWeight: 800,
                color: "#F9FAFB",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                marginBottom: "2rem",
              }}>
                The Spirit of <br />
                <span style={{ color: "#D4A853" }}>Tedong Silaga</span>
              </h2>
              <p style={{ fontSize: "1.125rem", color: "#9CA3AF", lineHeight: 1.8, maxWidth: "600px" }}>
                Tedong Silaga Arena brings the thrill of authentic Toraja buffalo competition to a digital global audience, ensuring transparency through verified on-chain mechanics.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {[
                {
                  icon: <Globe size={24} color="#6366F1" />,
                  title: "Preserving Ancient Culture",
                  body: "We digitise the arena while respecting the deep cultural roots of Tana Toraja's traditional ceremonies."
                },
                {
                  icon: <Info size={24} color="#D4A853" />,
                  title: "Fairness & Honor",
                  body: "Blockchain ensures that every prediction is verifiably fair, mirroring the honor of the original arena."
                }
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                  <div style={{
                    width: "56px", height: "56px", flexShrink: 0,
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "16px",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#F9FAFB", marginBottom: "8px" }}>{item.title}</h3>
                    <p style={{ fontSize: "1rem", color: "#9CA3AF", lineHeight: 1.7, maxWidth: "450px" }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CulturalExplanation;
