"use client";

import React from "react";
import { Zap, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function ActionPage() {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1.5rem",
          paddingBottom: "6rem", // space for mobile bottom nav
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: "center",
            maxWidth: "420px",
          }}
        >
          {/* Icon */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, rgba(79,107,255,0.15), rgba(99,102,241,0.08))",
              border: "1px solid rgba(79,107,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <Zap size={36} color="#818CF8" strokeWidth={1.5} />
          </motion.div>

          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#F1F5F9",
              fontFamily: "var(--font-heading)",
              marginBottom: "0.75rem",
              letterSpacing: "-0.02em",
            }}
          >
            Actions
          </h1>

          <p
            style={{
              fontSize: "0.95rem",
              color: "#64748B",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            Automated on-chain actions are coming soon. This section will
            trigger backend workflows including CRE oracle settlement and
            market management.
          </p>

          {/* Locked badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.6rem 1.25rem",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#475569",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            <Lock size={14} />
            Coming Soon — Backend Integration Pending
          </div>
        </motion.div>
      </main>
    </>
  );
}
