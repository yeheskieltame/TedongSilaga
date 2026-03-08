"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { worldChainSepolia } from "@/lib/wagmi";
import { Wallet, X, ChevronDown, ExternalLink, Copy, Check, AlertTriangle } from "lucide-react";
import { formatUnits } from "viem";
import { createPortal } from "react-dom";

// ── Helper: shorten address ──────────────────────────────────────────────────
function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

// ── Modal: wallet picker ─────────────────────────────────────────────────────
function WalletModal({ onClose }: { onClose: () => void }) {
  const { connectors, connect, isPending, error } = useConnect();

  // Fix: Lock background scroll when modal is active
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow || "unset";
    };
  }, []);

  return createPortal(
    <div
      style={{
        position: "fixed", 
        inset: 0, 
        zIndex: 9999,
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "rgba(2, 6, 23, 0.85)", 
        backdropFilter: "blur(12px)",
        padding: "1.5rem",
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0F1623",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "28px",
          padding: "2.5rem",
          width: "100%", 
          maxWidth: "440px",
          maxHeight: "90vh",
          overflowY: "auto",
          display: "flex", 
          flexDirection: "column", 
          gap: "1.75rem",
          boxShadow: "0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
          position: "relative",
          animation: "modalFadeIn 0.3s ease-out",
        }}
        className="no-scrollbar"
      >
        <style>{`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: "1.3rem", color: "#F8FAFC", letterSpacing: "-0.03em" }}>
              Connect Wallet
            </h2>
            <p style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>
              Join the Tedong Silaga Arena
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ 
              background: "rgba(255,255,255,0.05)", 
              border: "none", 
              color: "#64748B", 
              cursor: "pointer", 
              padding: "8px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#F8FAFC")}
            onMouseLeave={e => (e.currentTarget.style.color = "#64748B")}
          >
            <X size={20} />
          </button>
        </div>

        {/* Chain badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "1rem",
          background: "rgba(79,107,255,0.05)",
          border: "1px solid rgba(79,107,255,0.15)",
          borderRadius: "16px",
        }}>
          <div style={{ 
            width: "32px", height: "32px", borderRadius: "10px", 
            background: "rgba(79,107,255,0.2)", 
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#818CF8"
          }}>
            <AlertTriangle size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#4F6BFF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Network</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0" }}>World Chain Sepolia</div>
          </div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 10px rgba(74, 222, 128, 0.5)" }} />
        </div>

        {/* Connector buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {connectors.map(connector => (
            <button
              key={connector.uid}
              disabled={isPending}
              onClick={() => connect({ connector })}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "1rem 1.25rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                color: "#F1F5F9", fontWeight: 700, fontSize: "15px",
                cursor: isPending ? "not-allowed" : "pointer",
                transition: "all 0.2s", textAlign: "left", width: "100%",
                opacity: isPending ? 0.6 : 1,
              }}
              onMouseEnter={e => { if (!isPending) { e.currentTarget.style.borderColor = "rgba(79,107,255,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            >
              <div style={{
                width: "40px", height: "40px", borderRadius: "12px",
                background: "rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", flexShrink: 0,
              }}>
                {connector.name.toLowerCase().includes("metamask") ? "🦊" :
                 connector.name.toLowerCase().includes("walletconnect") ? "🔗" :
                 connector.name.toLowerCase().includes("coinbase") ? "🔵" : "💼"}
              </div>
              <div>
                <div>{connector.name}</div>
                <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 400, marginTop: "2px" }}>
                  {connector.name.toLowerCase().includes("walletconnect") ? "Scan with any wallet" : "Browser extension"}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "1rem", borderRadius: "16px",
            background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)",
            color: "#F87171", fontSize: "13px", fontWeight: 500,
          }}>
            <AlertTriangle size={16} />
            {error.message.length > 60 ? error.message.slice(0, 60) + "..." : error.message}
          </div>
        )}

        <p style={{ fontSize: "11px", color: "#475569", textAlign: "center", lineHeight: 1.5 }}>
          By connecting, you agree to the Arena's <br />
          <span style={{ textDecoration: "underline" }}>Terms of Service</span> and <span style={{ textDecoration: "underline" }}>Privacy Policy</span>
        </p>
      </div>
    </div>,
    document.body
  );
}

// ── Connected Dropdown ────────────────────────────────────────────────────────
function ConnectedDropdown({ address, onDisconnect }: { address: string; onDisconnect: () => void }) {
  const [copied, setCopied] = useState(false);
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({ address: address as `0x${string}` });
  const isWrongChain = chainId !== worldChainSepolia.id;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: "absolute", top: "calc(100% + 10px)", right: 0,
      background: "#0F1623",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "16px",
      padding: "1.25rem",
      minWidth: "280px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
      display: "flex", flexDirection: "column", gap: "1rem",
      zIndex: 200,
    }}>
      {/* Address */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569", marginBottom: "3px" }}>Wallet</div>
          <div style={{ fontWeight: 800, fontSize: "14px", color: "#F1F5F9" }}>{shortenAddress(address)}</div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={copyAddress}
            title="Copy address"
            style={{ padding: "6px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#64748B", cursor: "pointer" }}
          >
            {copied ? <Check size={14} color="#4ADE80" /> : <Copy size={14} />}
          </button>
          <a
            href={`https://worldchain-mainnet.explorer.alchemy.com/address/${address}`}
            target="_blank" rel="noopener noreferrer"
            style={{ padding: "6px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Balance */}
      {balance && (
        <div style={{
          padding: "0.75rem 1rem", borderRadius: "10px",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569", marginBottom: "3px" }}>Balance</div>
          <div style={{ fontWeight: 800, fontSize: "1rem", color: "#F8FAFC" }}>
            {parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} {balance.symbol}
          </div>
        </div>
      )}

      {/* Wrong Network Warning */}
      {isWrongChain && (
        <button
          onClick={() => switchChain({ chainId: worldChainSepolia.id })}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "0.75rem 1rem", borderRadius: "10px",
            background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)",
            color: "#F59E0B", fontSize: "12px", fontWeight: 700, cursor: "pointer", width: "100%",
          }}
        >
          <AlertTriangle size={14} /> Switch to World Chain Sepolia
        </button>
      )}

      {/* Network selector */}
      {!isWrongChain && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6px", borderRadius: "8px", background: "rgba(79,107,255,0.1)", border: "1px solid rgba(79,107,255,0.4)", color: "#818CF8", fontSize: "12px", fontWeight: 700 }}>
          <Check size={14} style={{ marginRight: "6px" }} /> Connected to testnet
        </div>
      )}

      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

      {/* Disconnect */}
      <button
        onClick={onDisconnect}
        style={{
          padding: "0.7rem 1rem", borderRadius: "10px",
          border: "1px solid rgba(239,68,68,0.2)",
          background: "rgba(239,68,68,0.05)",
          color: "#F87171", fontSize: "13px", fontWeight: 700, cursor: "pointer",
          transition: "all 0.2s", width: "100%",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.05)")}
      >
        Disconnect Wallet
      </button>
    </div>
  );
}

// ── Main WalletButton ────────────────────────────────────────────────────────
export default function WalletButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (isConnected && address) {
    return (
      <>
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowDropdown(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 14px",
              background: "rgba(79,107,255,0.1)",
              border: "1px solid rgba(79,107,255,0.3)",
              borderRadius: "9999px",
              color: "#818CF8", fontWeight: 700, fontSize: "13px",
              cursor: "pointer", transition: "all 0.2s"
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(79,107,255,0.18)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(79,107,255,0.1)")}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ADE80", flexShrink: 0, boxShadow: "0 0 8px #4ADE80" }} />
            <span style={{ color: "#4ADE80" }}>Connected</span>
            <span style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: "6px", fontFamily: "var(--font-mono)", fontSize: "11px", marginLeft: "2px" }}>
              {shortenAddress(address)}
            </span>
            <ChevronDown size={14} style={{ opacity: 0.6 }} />
          </button>

          {showDropdown && (
            <ConnectedDropdown
              address={address}
              onDisconnect={() => { disconnect(); setShowDropdown(false); }}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 18px",
          background: "linear-gradient(135deg, #4F6BFF, #6366F1)",
          color: "#fff", border: "none",
          borderRadius: "9999px",
          fontWeight: 700, fontSize: "14px",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(79,107,255,0.3)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={e => { (e.currentTarget.style.transform = "translateY(-1px)"); (e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,107,255,0.4)") }}
        onMouseLeave={e => { (e.currentTarget.style.transform = "translateY(0)"); (e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,107,255,0.3)") }}
      >
        <Wallet size={15} />
        <span>Connect Wallet</span>
      </button>

      {showModal && <WalletModal onClose={() => setShowModal(false)} />}
    </>
  );
}
