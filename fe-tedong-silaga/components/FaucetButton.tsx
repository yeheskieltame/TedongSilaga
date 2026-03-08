"use client";

import React, { useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Droplet } from "lucide-react";
import { MOCK_USDC_ADDRESS, MOCK_USDC_ABI } from "@/constants/contracts";

export default function FaucetButton() {
  const { isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      console.log("Successfully claimed testnet USDC!");
    }
    if (error) {
      console.error("Failed to claim USDC", error);
    }
  }, [isSuccess, error]);

  if (!isConnected) return null;

  const handleFaucet = async () => {
    writeContract({
      address: MOCK_USDC_ADDRESS as `0x${string}`,
      abi: MOCK_USDC_ABI,
      functionName: "faucet",
    });
  };

  const isLoading = isPending || isConfirming;

  return (
    <button
      onClick={handleFaucet}
      disabled={isLoading}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 14px",
        background: isSuccess ? "rgba(74, 222, 128, 0.1)" : "rgba(79, 107, 255, 0.1)",
        border: `1px solid ${isSuccess ? "rgba(74, 222, 128, 0.3)" : "rgba(79, 107, 255, 0.3)"}`,
        borderRadius: "9999px",
        color: isSuccess ? "#4ADE80" : "#818CF8",
        fontWeight: 700,
        fontSize: "13px",
        cursor: isLoading ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        opacity: isLoading ? 0.7 : 1,
        boxShadow: isLoading ? "none" : "0 2px 10px rgba(79, 107, 255, 0.15)",
      }}
      onMouseEnter={(e) => {
        if (!isLoading) {
          e.currentTarget.style.background = isSuccess ? "rgba(74, 222, 128, 0.15)" : "rgba(79, 107, 255, 0.18)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isLoading) {
          e.currentTarget.style.background = isSuccess ? "rgba(74, 222, 128, 0.1)" : "rgba(79, 107, 255, 0.1)";
        }
      }}
      title="Claim Testnet USDC for trying out the marketplace"
    >
      <Droplet size={14} />
      <span>{isPending ? "Signing..." : isConfirming ? "Minting..." : "Faucet USDC"}</span>
    </button>
  );
}
