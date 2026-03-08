"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, ArrowRight, Lock, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";

interface MatchCardProps {
  id: string;
  buffaloA: { name: string; photo: string };
  buffaloB: { name: string; photo: string };
  time: string;
  pool: string;
  players: number;
  status: "Open" | "Locked" | "Resolved";
  variant?: "compact" | "default";
}

const MatchCard: React.FC<MatchCardProps> = ({
  buffaloA,
  buffaloB,
  time,
  pool,
  players,
  status,
  variant = "default",
}) => {
  const statusColors = {
    Open: "bg-green-500/10 text-green-500 border-green-500/20",
    Locked: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Resolved: "bg-text-tertiary/10 text-text-tertiary border-text-tertiary/20",
  };

  const statusIcons = {
    Open: <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />,
    Locked: <Lock size={12} />,
    Resolved: <CheckCircle size={12} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileHover={{ y: -4, borderColor: "var(--color-border-hover)" }}
      className={`bg-bg-surface border border-border-default rounded-lg p-5 transition-colors group ${
        variant === "compact" ? "min-w-[280px]" : "w-full"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold border ${statusColors[status]}`}>
          {statusIcons[status]}
          {status}
        </span>
        <span className="text-text-tertiary text-xs">{time}</span>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex flex-col items-center gap-2 group/buffalo cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-bg-surface-raised border border-border-default flex items-center justify-center text-3xl transition-transform group-hover/buffalo:scale-110">
            🐃
          </div>
          <span className="text-sm font-bold truncate max-w-[80px] text-text-primary">{buffaloA.name}</span>
        </div>
        
        <div className="flex flex-col items-center text-text-tertiary font-bold italic text-sm">
          VS
        </div>

        <div className="flex flex-col items-center gap-2 group/buffalo cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-bg-surface-raised border border-border-default flex items-center justify-center text-3xl transition-transform group-hover/buffalo:scale-110">
            🐃
          </div>
          <span className="text-sm font-bold truncate max-w-[80px] text-text-primary">{buffaloB.name}</span>
        </div>
      </div>

      <div className="flex items-center justify-between py-3 border-t border-b border-border-default/50 mb-6">
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-[10px] uppercase tracking-widest text-text-tertiary font-bold">Prize Pool</span>
          <span className="font-heading font-bold text-text-primary">{pool}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] uppercase tracking-widest text-text-tertiary font-bold flex items-center gap-1">
            <Users size={10} /> Players
          </span>
          <span className="font-heading font-bold text-text-primary">{players}</span>
        </div>
      </div>

      <Button
        variant={status === "Open" ? "primary" : "secondary"}
        size="md"
        className="w-full gap-1.5"
      >
        {status === "Open" ? "Predict Now" : status === "Locked" ? "View Details" : "View Results"}
        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </Button>
    </motion.div>
  );
};

export default MatchCard;
