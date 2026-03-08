"use client";

/**
 * ============================================================================
 * TESTING PAGE FOR HACATHON JURY
 * ============================================================================
 * 
 * This page is ONLY for testing purposes so Hacathon Jury can try full features.
 * Uses admin privatekey automatically via env variables.
 * 
 * WARNING: In production, this page MUST BE REMOVED!
 * Because lock & resolve should only be executable by admin wallet,
 * not through public web page.
 * 
 * In production, admin will use:
 * - Dedicated admin CLI tool, or
 * - Separate admin dashboard with strict authentication
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import { Lock, ShieldAlert, CheckCircle, X, Loader2, Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useReadContracts } from "wagmi";
import { TEDONG_MARKET_ABI } from "@/constants/tedong_market_abi";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

type Market = {
  id: string;
  market_address: string;
  event_name: string;
  buffalo_a_name: string;
  buffalo_b_name: string;
  status: string;
  tx_locked_hash?: string;
};

export default function ActionPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loadingMarkets, setLoadingMarkets] = useState(true);
  
  // Modal states
  const [activeModal, setActiveModal] = useState<"none" | "lock" | "resolve" | "claim">("none");
  const [selectedMarketAddress, setSelectedMarketAddress] = useState<string>("");
  
  // Transaction states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txMessage, setTxMessage] = useState({ type: "", text: "" });

  const fetchMarkets = async () => {
    setLoadingMarkets(true);
    const { data } = await supabase.from("markets").select("*").order("created_at", { ascending: false });
    if (data) setMarkets(data);
    setLoadingMarkets(false);
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  const { address, isConnected } = useAccount();

  // Read staking data for resolved markets to filter claimable ones
  const resolvedMarkets = markets.filter(m => m.status === "Resolved");
  
  const { data: userStakeData } = useReadContracts({
    contracts: resolvedMarkets.flatMap(m => [
      {
        address: m.market_address as `0x${string}`,
        abi: TEDONG_MARKET_ABI,
        functionName: "getUserStake",
        args: [address as `0x${string}`],
      },
      {
        address: m.market_address as `0x${string}`,
        abi: TEDONG_MARKET_ABI,
        functionName: "claimed",
        args: [address as `0x${string}`],
      }
    ]),
    query: {
      enabled: !!address && resolvedMarkets.length > 0,
    }
  });

  const claimableMarkets = resolvedMarkets.filter((m, i) => {
    if (!userStakeData) return false;
    const stakeResult = userStakeData[i * 2]?.result as [bigint, bigint] | undefined;
    const claimedResult = userStakeData[i * 2 + 1]?.result as boolean | undefined;
    
    // Has a stake (either side > 0)
    const hasStake = stakeResult ? (stakeResult[0] > 0n || stakeResult[1] > 0n) : false;
    // Has NOT claimed yet
    const hasNotClaimed = claimedResult === false;
    
    return hasStake && hasNotClaimed;
  });

  const openModal = (type: "lock" | "resolve" | "claim") => {
    setActiveModal(type);
    setSelectedMarketAddress("");
    setTxMessage({ type: "", text: "" });
  };

  const closeModal = () => {
    if (isSubmitting) return; // Prevent close while tx is pending
    setActiveModal("none");
  };

  const handleAction = async () => {
    if (!selectedMarketAddress) return;

    setIsSubmitting(true);
    setTxMessage({ type: "info", text: "Processing transaction..." });

    try {
      const endpoint = activeModal === "lock" ? "/api/action/lock" : activeModal === "resolve" ? "/api/action/resolve" : "/api/action/claim";
      const currentMarket = markets.find(m => m.market_address === selectedMarketAddress);
      
      const payload = activeModal === "resolve" 
        ? { marketAddress: selectedMarketAddress, tx_locked_hash: currentMarket?.tx_locked_hash }
        : { marketAddress: selectedMarketAddress };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setTxMessage({ type: "success", text: "Transaction confirmed successfully!" });
      await fetchMarkets(); // Refresh data
      
      // Auto close after 2s
      setTimeout(() => {
        closeModal();
      }, 2000);

    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setTxMessage({ type: "error", text: err.message || "Action failed." });
      } else {
        setTxMessage({ type: "error", text: "Action failed." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMarkets = activeModal === "claim" 
    ? claimableMarkets 
    : markets.filter(m => activeModal === "lock" ? m.status === "Open" : m.status === "Locked");

  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "6rem",
          paddingBottom: "6rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          style={{
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(79, 107, 255, 0.2)",
            borderRadius: "32px",
            padding: "1.5rem",
            width: "100%",
            maxWidth: "600px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Background Glow */}
          <div style={{
            position: "absolute",
            top: "-50px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "150px",
            height: "150px",
            background: "rgba(79, 107, 255, 0.2)",
            filter: "blur(50px)",
            borderRadius: "50%",
            pointerEvents: "none",
          }} />

          {/* WARNING BANNER - FOR HACATHON TESTING ONLY */}
          <div style={{
            background: "rgba(251, 191, 36, 0.1)",
            border: "1px solid rgba(251, 191, 36, 0.3)",
            borderRadius: "12px",
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            width: "100%",
            zIndex: 1,
            position: "relative",
          }}>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#FBBF24", textAlign: "center", fontWeight: 600 }}>
              HACATHON TESTING ONLY - This page will be removed in production
            </p>
          </div>

          {/* Icon Header */}
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(79,107,255,0.2), rgba(99,102,241,0.05))",
            border: "1px solid rgba(79,107,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "0.5rem",
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            zIndex: 1,
            position: "relative",
          }}>
            <ShieldAlert size={24} color="#818CF8" />
          </div>

          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#F8FAFC",
              fontFamily: "var(--font-heading)",
              marginBottom: "0.25rem",
              letterSpacing: "0.02em",
              zIndex: 1,
              position: "relative",
            }}
          >
            Action
          </h1>
          <p style={{
            color: "#64748B",
            fontSize: "0.85rem",
            marginBottom: "1.5rem",
            textAlign: "center",
            fontWeight: 500,
            zIndex: 1,
            position: "relative",
          }}>
            Manage active prediction markets
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", zIndex: 1, position: "relative" }}>
            
            {/* LOCK BUTTON */}
            <motion.button
              onClick={() => openModal("lock")}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(251, 191, 36, 0.1)", borderColor: "rgba(251, 191, 36, 0.6)" }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "1rem",
                borderRadius: "24px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(251, 191, 36, 0.3)",
                color: "#FBBF24",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              }}
            >
              <Lock size={24} strokeWidth={2.5} />
              <span style={{ fontSize: "0.95rem", fontWeight: 800, letterSpacing: "0.05em" }}>LOCK</span>
            </motion.button>

            {/* RESOLVE BUTTON */}
            <motion.button
              onClick={() => openModal("resolve")}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(74, 222, 128, 0.1)", borderColor: "rgba(74, 222, 128, 0.6)" }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "1rem",
                borderRadius: "24px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(74, 222, 128, 0.3)",
                color: "#4ADE80",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              }}
            >
              <CheckCircle size={26} strokeWidth={2.5} />
              <span style={{ fontSize: "0.95rem", fontWeight: 800, letterSpacing: "0.05em" }}>RESOLVE</span>
            </motion.button>

            {/* CLAIM BUTTON */}
            <motion.button
              onClick={() => openModal("claim")}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(236, 72, 153, 0.1)", borderColor: "rgba(236, 72, 153, 0.6)" }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "1rem",
                borderRadius: "24px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(236, 72, 153, 0.3)",
                color: "#EC4899",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              }}
            >
              <Coins size={26} strokeWidth={2.5} />
              <span style={{ fontSize: "0.95rem", fontWeight: 800, letterSpacing: "0.05em" }}>CLAIM</span>
            </motion.button>
          </div>
        </motion.div>

        {/* MODAL OVERLAY */}
        <AnimatePresence>
          {activeModal !== "none" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.8)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1.5rem",
                zIndex: 100,
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                style={{
                  background: "#0F172A",
                  border: `1px solid ${activeModal === 'lock' ? "rgba(251,191,36,0.3)" : activeModal === 'resolve' ? "rgba(74,222,128,0.3)" : "rgba(236,72,153,0.3)"}`,
                  borderRadius: "24px",
                  padding: "1.5rem",
                  width: "100%",
                  maxWidth: "500px",
                  maxHeight: "80vh",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  position: "relative"
                }}
              >
                <button 
                  onClick={closeModal}
                  disabled={isSubmitting}
                  style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "#64748B", cursor: isSubmitting ? "not-allowed" : "pointer" }}
                >
                  <X />
                </button>

                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#F8FAFC", display: "flex", alignItems: "center", gap: "8px" }}>
                  {activeModal === "lock" ? <Lock color="#FBBF24" size={20} /> : activeModal === "resolve" ? <CheckCircle color="#4ADE80" size={20} /> : <Coins color="#EC4899" size={20} />}
                  {activeModal === "lock" ? "Select Market to Lock" : activeModal === "resolve" ? "Select Market to Resolve" : "Select Market to Claim"}
                </h2>

                {txMessage.text && (
                  <div style={{
                    padding: "0.75rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 500,
                    background: txMessage.type === "error" ? "rgba(239,68,68,0.1)" : txMessage.type === "success" ? "rgba(74,222,128,0.1)" : "rgba(79,107,255,0.1)",
                    color: txMessage.type === "error" ? "#EF4444" : txMessage.type === "success" ? "#4ADE80" : "#818CF8",
                    border: `1px solid ${txMessage.type === "error" ? "rgba(239,68,68,0.2)" : txMessage.type === "success" ? "rgba(74,222,128,0.2)" : "rgba(79,107,255,0.2)"}`
                  }}>
                    {txMessage.text}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, minHeight: "200px" }}>
                  {!isConnected && activeModal === "claim" ? (
                    <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", color: "#64748B", fontSize: "0.9rem" }}>Please connect wallet to view claimable markets.</div>
                  ) : loadingMarkets ? (
                    <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", color: "#64748B" }}><Loader2 className="animate-spin" /></div>
                  ) : filteredMarkets.length === 0 ? (
                    <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", color: "#64748B", fontSize: "0.9rem" }}>No {activeModal} markets available.</div>
                  ) : (
                    filteredMarkets.map(m => (
                      <div 
                        key={m.market_address}
                        onClick={() => !isSubmitting && setSelectedMarketAddress(m.market_address)}
                        style={{
                          padding: "1rem",
                          borderRadius: "16px",
                          border: selectedMarketAddress === m.market_address ? `2px solid ${activeModal === 'lock' ? '#FBBF24' : activeModal === 'resolve' ? '#4ADE80' : '#EC4899'}` : "1px solid rgba(255,255,255,0.1)",
                          background: selectedMarketAddress === m.market_address ? "rgba(255,255,255,0.05)" : "transparent",
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                          opacity: isSubmitting && selectedMarketAddress !== m.market_address ? 0.5 : 1
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#F1F5F9", marginBottom: "4px" }}>{m.event_name}</div>
                        <div style={{ fontSize: "0.85rem", color: "#94A3B8" }}>{m.buffalo_a_name} vs {m.buffalo_b_name}</div>
                        
                        {/* Selected for Resolve Hint */}
                        {activeModal === "resolve" && selectedMarketAddress === m.market_address && (
                          <div style={{ marginTop: "1rem", padding: "8px", borderRadius: "8px", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)" }}>
                            <p style={{ fontSize: "0.8rem", color: "#4ADE80", textAlign: "center", margin: 0 }}>This market will be resolved automatically by the CRE Workflow.</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                  <button
                    onClick={closeModal}
                    disabled={isSubmitting}
                    style={{
                      flex: 1, padding: "1rem", borderRadius: "16px",
                      background: "rgba(255,255,255,0.05)",
                      color: "#F8FAFC", fontWeight: 800, fontSize: "0.95rem",
                      border: "1px solid rgba(255,255,255,0.1)", cursor: isSubmitting ? "not-allowed" : "pointer"
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleAction}
                    disabled={!selectedMarketAddress || isSubmitting}
                    style={{
                      flex: 1, padding: "1rem", borderRadius: "16px",
                      background: activeModal === "lock" ? "#FBBF24" : activeModal === "resolve" ? "#4ADE80" : "#EC4899",
                      color: "#000", fontWeight: 800, fontSize: "0.95rem",
                      border: "none", cursor: (!selectedMarketAddress || isSubmitting) ? "not-allowed" : "pointer",
                      opacity: (!selectedMarketAddress || isSubmitting) ? 0.5 : 1,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                    }}
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Confirm"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
