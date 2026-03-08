"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAccount, useWriteContract, usePublicClient } from "wagmi";
import { decodeEventLog } from "viem";
import { MARKET_FACTORY_ADDRESS, MARKET_FACTORY_ABI } from "@/constants/contracts";
import { ArrowLeft, UploadCloud, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateMarketPage() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const router = useRouter();
  
  // Keamanan sederhana: Hanya render jika wallet admin terdeteksi
  const isAdmin = address?.toLowerCase() === "0x7c1f9bcdea7c160e4763d6da06399a7d363a9e22";

  // State untuk form
  const [formData, setFormData] = useState({
    event_name: "",
    arena_name: "",
    embed_poster: "",
    buffalo_a_name: "",
    url_embed_buffalo_a: "",
    buffalo_b_name: "",
    url_embed_buffalo_b: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg({ type: "loading", text: "Initiating Transaction..." });

    try {
      setStatusMsg({ type: "loading", text: "Confirming transaction in wallet..." });

      // 1. Eksekusi Kontrak di Blockchain
      // Membuka MetaMask / dompet admin untuk meminta Tanda Tangan (Sign Tx)
      const txHash = await writeContractAsync({
        address: MARKET_FACTORY_ADDRESS as `0x${string}`,
        abi: MARKET_FACTORY_ABI,
        functionName: "createMarket",
        args: [
          formData.event_name,
          formData.buffalo_a_name,
          formData.buffalo_b_name,
          formData.embed_poster || "https://tedongsilaga.com", // Menggunakan poster sebagai sumber data
        ],
      });

      setStatusMsg({ type: "loading", text: `Transaction sent! Waiting for block confirmation...` });

      // 2. Tunggu Transaksi Selesai di-mining oleh Jaringan (World Chain)
      const receipt = await publicClient!.waitForTransactionReceipt({ hash: txHash });

      // 3. Dekode Event Log dari transaksi tersebut untuk mencari tahu Address contract yang baru di-deploy!
      let newMarketAddress = "";
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: MARKET_FACTORY_ABI,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === "MarketCreated") {
            newMarketAddress = (decoded.args as { market: string }).market;
            break;
          }
        } catch {
          // Abaikan log event lain yang tidak relevan
        }
      }

      if (!newMarketAddress) {
        throw new Error("Transaction succeeded, but could not find MarketCreated event in logs.");
      }

      // =========================================================
      // 4. SETELAH SUKSES DI BLOCKCHAIN, SIMPAN METADATA KE SUPABASE
      // =========================================================
      setStatusMsg({ type: "loading", text: `Market Smart Contract Deployed at ${newMarketAddress}! Saving metadata...` });
      
      const payload = {
        market_address: newMarketAddress,
        ...formData,
      };

      const res = await fetch("/api/market/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save to database");
      }

      setStatusMsg({ type: "success", text: "Market Created Successfully! Redirecting..." });
      
      // Setelah sukses, arahkan kembali ke daftar market
      setTimeout(() => {
        router.push("/markets");
      }, 2000);

    } catch (err) {
      console.error(err);
      setStatusMsg({ type: "error", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ minHeight: "100vh", background: "#0B0F1A", color: "#E2E8F0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Access Denied 🛑</h2>
        <p style={{ color: "#94A3B8", marginBottom: "2rem" }}>You must be connected with the strictly authorized Admin wallet to view this page.</p>
        <Link href="/markets" style={{ color: "#4F6BFF", textDecoration: "none", fontWeight: 700 }}>Return to Markets</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0B0F1A", color: "#E2E8F0" }}>
      <Navbar />

      <main style={{ paddingTop: "100px", paddingBottom: "6rem", maxWidth: "900px", margin: "0 auto", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <Link href="/markets" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#94A3B8", textDecoration: "none", fontSize: "0.9rem", marginBottom: "2rem" }}>
          <ArrowLeft size={16} /> Back to Markets
        </Link>

        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#F8FAFC", marginBottom: "0.5rem", letterSpacing: "-0.03em" }}>
          Create New Market
        </h1>
        <p style={{ color: "#64748B", marginBottom: "3rem" }}>Deploy a new Tedong Silaga instance on-chain and save off-chain metadata to Supabase.</p>

        {statusMsg.text && (
          <div style={{ 
            padding: "1rem", borderRadius: "12px", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "10px",
            background: statusMsg.type === "error" ? "rgba(239,68,68,0.1)" : statusMsg.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(79,107,255,0.1)",
            border: `1px solid ${statusMsg.type === "error" ? "rgba(239,68,68,0.3)" : statusMsg.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(79,107,255,0.3)"}`,
            color: statusMsg.type === "error" ? "#F87171" : statusMsg.type === "success" ? "#4ADE80" : "#818CF8"
          }}>
            <Info size={18} />
            <span style={{ fontWeight: 600 }}>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          
          {/* Section 1: Event Details */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", borderRadius: "20px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#F1F5F9", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(79,107,255,0.2)", color: "#818CF8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>1</span>
              General Event Details
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <InputGroup label="Event Name (e.g., Final Toraja 2026)" name="event_name" value={formData.event_name} onChange={handleChange} required />
              <InputGroup label="Arena Name (e.g., Bori Arena)" name="arena_name" value={formData.arena_name} onChange={handleChange} required />
              <div style={{ gridColumn: "1 / -1" }}>
                <InputGroup label="Event Poster Embed URL / Image URL" name="embed_poster" value={formData.embed_poster} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Section 2: Buffalo Details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            
            {/* Buffalo A */}
            <div style={{ background: "rgba(34,197,94,0.03)", border: "1px solid rgba(34,197,94,0.1)", padding: "2rem", borderRadius: "20px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#4ADE80", marginBottom: "1.5rem" }}>Buffalo A (Choice 1)</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <InputGroup label="Buffalo A Name" name="buffalo_a_name" value={formData.buffalo_a_name} onChange={handleChange} required />
                <InputGroup label="URL Embed Kertas Kuning / Stats" name="url_embed_buffalo_a" value={formData.url_embed_buffalo_a} onChange={handleChange} />
              </div>
            </div>

            {/* Buffalo B */}
            <div style={{ background: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.1)", padding: "2rem", borderRadius: "20px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#F87171", marginBottom: "1.5rem" }}>Buffalo B (Choice 2)</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <InputGroup label="Buffalo B Name" name="buffalo_b_name" value={formData.buffalo_b_name} onChange={handleChange} required />
                <InputGroup label="URL Embed Kertas Kuning / Stats" name="url_embed_buffalo_b" value={formData.url_embed_buffalo_b} onChange={handleChange} />
              </div>
            </div>

          </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              padding: "1.25rem", borderRadius: "16px", background: isLoading ? "#334155" : "linear-gradient(135deg, #4F6BFF, #6366F1)",
              color: "#FFF", fontSize: "1.1rem", fontWeight: 800, border: "none", cursor: isLoading ? "not-allowed" : "pointer",
              boxShadow: isLoading ? "none" : "0 8px 24px rgba(79,107,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              transition: "all 0.2s"
            }}
          >
            {isLoading ? "Processing Transaction..." : <><UploadCloud size={20} /> Deploy & Save Market</>}
          </button>

        </form>
      </main>
    </div>
  );
}

// Helper Component for Form Inputs
interface InputGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

function InputGroup({ label, name, value, onChange, required = false }: InputGroupProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#94A3B8" }}>
        {label} {required && <span style={{ color: "#F87171" }}>*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          padding: "0.85rem 1rem",
          background: "rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px",
          color: "#F8FAFC",
          fontSize: "0.95rem",
          outline: "none",
        }}
        onFocus={(e) => e.target.style.borderColor = "rgba(79,107,255,0.5)"}
        onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
      />
    </div>
  );
}
