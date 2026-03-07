"use client";

import React from "react";
import { UserCheck, Target, Trophy } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserCheck size={32} color="#6366F1" />,
      title: "Verify with World ID",
      description: "One human, one vote. Use World ID to ensure the arena stays fair and free of bots across the globe."
    },
    {
      icon: <Target size={32} color="#6366F1" />,
      title: "Predict the Winner",
      description: "Choose Buffalo A or B, enter your stake (WLD or USDC), and confirm your choice securely on-chain."
    },
    {
      icon: <Trophy size={32} color="#D4A853" />,
      title: "Win Rewards",
      description: "If your prediction is correct, you can claim your rewards instantly from your personal dashboard profile."
    }
  ];

  return (
    <section style={{ background: "#0B0F19", padding: "10rem 0", borderBottom: "1px solid #1F2937" }}>
      <div className="container-wide">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "6rem" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#D4A853", marginBottom: "1.25rem" }}>
            The Arena Path
          </div>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, color: "#F9FAFB", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
            How to Predict & Win
          </h2>
          <p style={{ fontSize: "1.2rem", color: "#9CA3AF", maxWidth: "800px", lineHeight: 1.6 }}>
            Join the most advanced tribal prediction market in three simple steps. We combine traditional legacy with futuristic technology.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "3rem",
        }}>
          {steps.map((step, i) => (
            <div key={i} style={{
              padding: "3rem 2rem",
              background: "rgba(17, 24, 39, 0.5)",
              border: "1px solid rgba(255,255,255,0.03)",
              borderRadius: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              transition: "border-color 0.3s"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,168,83,0.2)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.03)"}
            >
              <div style={{
                width: "80px", height: "80px",
                borderRadius: "20px",
                background: "#1A2035",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "2rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
              }}>
                {step.icon}
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#F9FAFB", marginBottom: "1rem" }}>{step.title}</h3>
              <p style={{ fontSize: "1rem", color: "#9CA3AF", lineHeight: 1.7, maxWidth: "340px" }}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
