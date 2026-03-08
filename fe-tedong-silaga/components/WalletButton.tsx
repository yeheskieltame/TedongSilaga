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

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0F1623",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "2rem",
          width: "100%", maxWidth: "420px",
          maxHeight: "85vh",
          overflowY: "auto",
          display: "flex", flexDirection: "column", gap: "1.5rem",
          boxShadow: "0 32px 64px rgba(0,0,0,0.8)",
          position: "relative",
        }}
        className="no-scrollbar"
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: "1.1rem", color: "#F8FAFC", letterSpacing: "-0.03em" }}>
              Connect Wallet
            </h2>
            <p style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>
              Connect to Tedong Silaga Arena
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: "4px" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Chain badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "0.75rem 1rem",
          background: "rgba(79,107,255,0.08)",
          border: "1px solid rgba(79,107,255,0.2)",
          borderRadius: "10px",
        }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ADE80", flexShrink: 0 }} />
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#94A3B8" }}>
            Network: <strong style={{ color: "#F1F5F9" }}>World Chain Sepolia (Testnet)</strong>
          </span>
        </div>

        {/* Connector buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {connectors.map(connector => (
            <button
              key={connector.uid}
              disabled={isPending}
              onClick={() => connect({ connector })}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "0.9rem 1.25rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                color: "#F1F5F9", fontWeight: 700, fontSize: "14px",
                cursor: isPending ? "not-allowed" : "pointer",
                transition: "all 0.2s", textAlign: "left", width: "100%",
                opacity: isPending ? 0.6 : 1,
              }}
              onMouseEnter={e => { if (!isPending) (e.currentTarget.style.borderColor = "rgba(79,107,255,0.4)"); (e.currentTarget.style.background = "rgba(79,107,255,0.06)") }}
              onMouseLeave={e => { (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"); (e.currentTarget.style.background = "rgba(255,255,255,0.03)") }}
            >
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", flexShrink: 0,
              }}>
                {connector.name.toLowerCase().includes("metamask") ? "🦊" :
                 connector.name.toLowerCase().includes("walletconnect") ? "🔗" :
                 connector.name.toLowerCase().includes("coinbase") ? "🔵" : "💼"}
              </div>
              <div>
                <div>{connector.name}</div>
                <div style={{ fontSize: "11px", color: "#64748B", fontWeight: 400, marginTop: "1px" }}>
                  {connector.name.toLowerCase().includes("walletconnect") ? "Scan with any wallet" :
                   connector.name.toLowerCase().includes("injected") ? "Browser extension" : "Mobile & Desktop"}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "0.75rem 1rem", borderRadius: "10px",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            color: "#F87171", fontSize: "12px", fontWeight: 600,
          }}>
            <AlertTriangle size={14} />
            {error.message.slice(0, 80)}...
          </div>
        )}

        <p style={{ fontSize: "11px", color: "#334155", textAlign: "center" }}>
          By connecting you agree to our Terms of Arena.
        </p>
      </div>
    </div>
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
              cursor: "pointer", transition: "all 0.2s",
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
