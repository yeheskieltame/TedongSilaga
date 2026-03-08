"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Trophy,
  Zap,
  Wallet,
  Store,
} from "lucide-react";
import WalletButton from "@/components/WalletButton";

// ── Menu items ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Market", href: "/markets", icon: Store },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Action", href: "/action", icon: Zap },
  { label: "Wallet", href: "/wallet", icon: Wallet },
];

// ── Desktop Floating Navbar ─────────────────────────────────────────────────
function DesktopNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 28, delay: 0.1 }}
      className="desktop-nav-only"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        margin: "0 auto",
        top: "1rem",
        zIndex: 100,
        width: "calc(100% - 2rem)",
        maxWidth: "1080px",
      }}
    >
      <nav
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "0.5rem 0.75rem 0.5rem 1rem",
          borderRadius: "9999px",
          background: isScrolled
            ? "rgba(2, 6, 23, 0.72)"
            : "rgba(2, 6, 23, 0.45)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: `1px solid ${isScrolled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"}`,
          boxShadow: isScrolled
            ? "0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Logo — left */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            flexShrink: 0,
            justifySelf: "start",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Tedong Silaga" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <span
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "#F9FAFB",
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.02em",
            }}
          >
            Tedong Silaga
          </span>
        </Link>

        {/* Nav Links — center */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "0.4rem 0.7rem",
                  borderRadius: "9999px",
                  textDecoration: "none",
                  fontSize: "0.8rem",
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? "#F9FAFB" : "#94A3B8",
                  background: isActive
                    ? "rgba(79, 107, 255, 0.15)"
                    : "transparent",
                  transition: "all 0.25s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#E2E8F0";
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#94A3B8";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "9999px",
                      border: "1px solid rgba(79,107,255,0.3)",
                      pointerEvents: "none",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Wallet Connect — right */}
        <div style={{ justifySelf: "end" }}>
          <WalletButton />
        </div>
      </nav>
    </motion.header>
  );
}

// ── Mobile Bottom Navigation ────────────────────────────────────────────────
function MobileBottomNav() {
  const pathname = usePathname();

  // reorder for bottom nav: Home, Leaderboard, Market (center), Action, Wallet
  const mobileItems = [
    NAV_ITEMS[0], // Home
    NAV_ITEMS[2], // Leaderboard
    NAV_ITEMS[1], // Market (center, prominent)
    NAV_ITEMS[3], // Action
    NAV_ITEMS[4], // Wallet
  ];

  return (
    <nav
      className="mobile-nav-only"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Glow behind the center button */}
      <div
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,107,255,0.35) 0%, transparent 70%)",
          filter: "blur(12px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          background: "rgba(2, 6, 23, 0.92)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-around",
          padding: "0.5rem 0.5rem 0.6rem",
          position: "relative",
        }}
      >
        {mobileItems.map((item, index) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const isCenter = index === 2; // Market is in the middle
          const Icon = item.icon;

          if (isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  textDecoration: "none",
                  position: "relative",
                  marginTop: "-1.75rem",
                  zIndex: 2,
                }}
              >
                {/* Prominent center button */}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: isActive
                      ? "linear-gradient(135deg, #4F6BFF, #818CF8)"
                      : "linear-gradient(135deg, #4F6BFF, #6366F1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: isActive
                      ? "0 4px 24px rgba(79,107,255,0.55), 0 0 0 4px rgba(79,107,255,0.15)"
                      : "0 4px 20px rgba(79,107,255,0.4)",
                    border: "3px solid rgba(2, 6, 23, 0.9)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Icon size={24} color="#fff" strokeWidth={2.5} />
                </motion.div>
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? "#818CF8" : "#64748B",
                    letterSpacing: "0.01em",
                    transition: "color 0.25s ease",
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
                padding: "0.4rem 0.5rem",
                minWidth: "56px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  color={isActive ? "#818CF8" : "#64748B"}
                  style={{ transition: "all 0.25s ease" }}
                />
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    style={{
                      position: "absolute",
                      top: "-6px",
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: "#818CF8",
                      boxShadow: "0 0 8px rgba(129,140,248,0.6)",
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#818CF8" : "#64748B",
                  letterSpacing: "0.01em",
                  transition: "color 0.25s ease",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ── Mobile Top Bar (logo only, no wallet — wallet is in bottom nav) ─────────
function MobileTopBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className="mobile-nav-only"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99,
        transition: "all 0.35s ease",
        background: isScrolled
          ? "rgba(2, 6, 23, 0.8)"
          : "transparent",
        backdropFilter: isScrolled ? "blur(20px) saturate(160%)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(20px) saturate(160%)" : "none",
        borderBottom: isScrolled
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
        padding: "0.6rem 1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Logo only — no wallet button on mobile top bar */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Tedong Silaga" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: 800,
              color: "#F9FAFB",
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.02em",
            }}
          >
            Tedong Silaga
          </span>
        </Link>
      </div>
    </header>
  );
}

// ── Composite Navbar ────────────────────────────────────────────────────────
export default function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileTopBar />
      <MobileBottomNav />
    </>
  );
}
