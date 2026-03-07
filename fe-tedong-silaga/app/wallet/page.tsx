"use client";

import React from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { worldChain, worldChainSepolia } from "@/lib/wagmi";
import { formatUnits } from "viem";
import Navbar from "@/components/Navbar";

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function ConnectedWalletView() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address: address as `0x${string}` });
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [copied, setCopied] = useState(false);
  const isWrongChain =
    chainId !== worldChain.id && chainId !== worldChainSepolia.id;

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background:
            "linear-gradient(135deg, rgba(79,107,255,0.1) 0%, rgba(99,102,241,0.05) 100%)",
          border: "1px solid rgba(79,107,255,0.2)",
          borderRadius: "20px",
          padding: "1.75rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#64748B",
            marginBottom: "0.5rem",
          }}
        >
          Total Balance
        </div>
        <div
          style={{
            fontSize: "2.25rem",
            fontWeight: 900,
            color: "#F8FAFC",
            fontFamily: "var(--font-heading)",
            letterSpacing: "-0.02em",
          }}
        >
          {balance
            ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)}`
            : "0.0000"}
          <span
            style={{
              fontSize: "1rem",
              color: "#818CF8",
              marginLeft: "0.5rem",
              fontWeight: 700,
            }}
          >
            {balance?.symbol || "ETH"}
          </span>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.75rem",
        }}
      >
        {[
          { label: "Send", icon: ArrowUpRight, color: "#4F6BFF" },
          { label: "Receive", icon: ArrowDownLeft, color: "#22C55E" },
        ].map((item) => (
          <button
            key={item.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1.25rem",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#E2E8F0",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.border = `1px solid ${item.color}40`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.border =
                "1px solid rgba(255,255,255,0.07)")
            }
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: `${item.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <item.icon size={20} color={item.color} />
            </div>
            {item.label}
          </button>
        ))}
      </div>

      {/* Address Card */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderRadius: "14px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#475569",
              marginBottom: "2px",
            }}
          >
            Address
          </div>
          <div
            style={{
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#E2E8F0",
              fontFamily: "var(--font-mono)",
            }}
          >
            {address ? shortenAddress(address) : "—"}
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={copyAddress}
            style={{
              padding: "8px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "#64748B",
              cursor: "pointer",
              display: "flex",
            }}
          >
            {copied ? (
              <Check size={16} color="#4ADE80" />
            ) : (
              <Copy size={16} />
            )}
          </button>
          <a
            href={`https://worldchain-mainnet.explorer.alchemy.com/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "8px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "#64748B",
              cursor: "pointer",
              display: "flex",
            }}
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Network Selector */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#475569",
          }}
        >
          Network
        </div>
        {isWrongChain && (
          <button
            onClick={() => switchChain({ chainId: worldChain.id })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.25)",
              color: "#F59E0B",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              width: "100%",
              marginBottom: "0.5rem",
            }}
          >
            ⚠️ Wrong Network — Switch to World Chain
          </button>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[
            { chain: worldChain, label: "Mainnet" },
            { chain: worldChainSepolia, label: "Sepolia" },
          ].map(({ chain, label }) => (
            <button
              key={chain.id}
              onClick={() => switchChain({ chainId: chain.id })}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "10px",
                border: `1px solid ${chainId === chain.id ? "rgba(79,107,255,0.4)" : "rgba(255,255,255,0.07)"}`,
                background:
                  chainId === chain.id
                    ? "rgba(79,107,255,0.1)"
                    : "rgba(255,255,255,0.02)",
                color:
                  chainId === chain.id ? "#818CF8" : "#64748B",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: chainId === chain.id ? "#4ADE80" : "#475569",
                }}
              />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* World ID Verification Status */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderRadius: "14px",
          background: "rgba(34,197,94,0.06)",
          border: "1px solid rgba(34,197,94,0.15)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <ShieldCheck size={20} color="#22C55E" />
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#E2E8F0" }}>
            World ID Verification
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
            Sybil-resistant identity • 1 human = 1 account
          </div>
        </div>
      </div>

      {/* Disconnect */}
      <button
        onClick={() => disconnect()}
        style={{
          padding: "0.85rem",
          borderRadius: "14px",
          border: "1px solid rgba(239,68,68,0.15)",
          background: "rgba(239,68,68,0.05)",
          color: "#F87171",
          fontSize: "0.85rem",
          fontWeight: 700,
          cursor: "pointer",
          transition: "all 0.2s",
          width: "100%",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(239,68,68,0.1)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(239,68,68,0.05)")
        }
      >
        Disconnect Wallet
      </button>
    </div>
  );
}

function NotConnectedView() {
  const { connectors, connect, isPending } = useConnect();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Hero card */}
      <div
        style={{
          textAlign: "center",
          padding: "2.5rem 1.5rem",
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, rgba(79,107,255,0.08) 0%, rgba(99,102,241,0.03) 100%)",
          border: "1px solid rgba(79,107,255,0.15)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "20px",
            background: "rgba(79,107,255,0.12)",
            border: "1px solid rgba(79,107,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
          }}
        >
          <Wallet size={28} color="#818CF8" />
        </div>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "#F1F5F9",
            fontFamily: "var(--font-heading)",
            marginBottom: "0.5rem",
          }}
        >
          Connect Your Wallet
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#64748B", lineHeight: 1.5 }}>
          Connect to World Chain to view balance, manage assets, and interact
          with the prediction market.
        </p>
      </div>

      {/* Connector list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            disabled={isPending}
            onClick={() => connect({ connector })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "1rem 1.25rem",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#E2E8F0",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: isPending ? "not-allowed" : "pointer",
              opacity: isPending ? 0.5 : 1,
              transition: "all 0.2s ease",
              textAlign: "left",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              if (!isPending) {
                e.currentTarget.style.borderColor = "rgba(79,107,255,0.3)";
                e.currentTarget.style.background = "rgba(79,107,255,0.05)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              {connector.name.toLowerCase().includes("metamask")
                ? "🦊"
                : connector.name.toLowerCase().includes("walletconnect")
                  ? "🔗"
                  : connector.name.toLowerCase().includes("coinbase")
                    ? "🔵"
                    : "💼"}
            </div>
            <div>
              <div>{connector.name}</div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#475569",
                  fontWeight: 400,
                  marginTop: "2px",
                }}
              >
                {connector.name.toLowerCase().includes("walletconnect")
                  ? "Scan with any wallet"
                  : "Browser extension / Mobile"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function WalletPage() {
  const { isConnected } = useAccount();

  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100vh",
          padding: "5.5rem 1.25rem 7rem",
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "#F1F5F9",
            fontFamily: "var(--font-heading)",
            marginBottom: "1.5rem",
            letterSpacing: "-0.02em",
          }}
        >
          Wallet
        </h1>

        {isConnected ? <ConnectedWalletView /> : <NotConnectedView />}
      </main>
    </>
  );
}
