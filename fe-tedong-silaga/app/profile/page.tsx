"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UserCheck, ShieldCheck, Flame, Trophy, TrendingUp, History, ExternalLink, ChevronRight, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

const PROFILE_DATA = {
  address: "0x1234...5678",
  isVerified: true,
  streak: 4,
  winRate: "81.3%",
  balance: "520 WLD",
  totalPredictions: 48,
  wins: 39,
  losses: 9,
  totalEarned: "+2,180 WLD",
  avatar: "👤",
};

const PREDICTION_HISTORY = [
  { id: "1", match: "Match #12: The Grand Arena", pick: "Buffalo A", stake: "50 WLD", result: "Win", date: "2h ago", reward: "+85 WLD" },
  { id: "2", match: "Match #11: Rambu vs Tanduk", pick: "Buffalo B", stake: "30 WLD", result: "Loss", date: "1d ago", reward: "-" },
  { id: "3", match: "Match #10: Silaga Toraja", pick: "Buffalo A", stake: "100 WLD", result: "Win", date: "3d ago", reward: "+170 WLD" },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"Stats" | "History">("Stats");

  return (
    <div className="flex flex-col min-h-screen bg-bg-base">
      <Header />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: User Card & Navigation (span 4) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-bg-surface-raised border border-border-default rounded-2xl p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 blur-[40px] pointer-events-none" />
                    
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-bg-base border border-border-default flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-lg">
                           {PROFILE_DATA.avatar}
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold font-heading mb-1">{PROFILE_DATA.address}</h2>
                            {PROFILE_DATA.isVerified && (
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest mx-auto max-w-fit">
                                 <ShieldCheck size={12} />
                                 World ID Verified
                              </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-bg-surface border border-border-default rounded-xl flex flex-col gap-1 items-center justify-center">
                           <span className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary">Win Rate</span>
                           <span className="text-xl font-bold font-heading text-text-primary">{PROFILE_DATA.winRate}</span>
                        </div>
                        <div className="p-4 bg-bg-surface border border-border-default rounded-xl flex flex-col gap-1 items-center justify-center relative overflow-hidden">
                           <div className="absolute inset-0 shimmer-gold opacity-20 pointer-events-none" />
                           <span className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary">Current Streak</span>
                           <span className="text-xl font-bold font-heading text-toraja-gold flex items-center gap-1">
                              <Flame size={18} fill="currentColor" /> {PROFILE_DATA.streak}
                           </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between text-sm py-3 border-b border-border-default">
                           <span className="text-text-secondary">Balance</span>
                           <span className="text-text-primary font-bold">{PROFILE_DATA.balance}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm py-3 border-b border-border-default">
                           <span className="text-text-secondary">Total Predictions</span>
                           <span className="text-text-primary font-bold">{PROFILE_DATA.totalPredictions}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm py-3 border-b border-border-default">
                           <span className="text-text-secondary">Global Rank</span>
                           <span className="text-toraja-gold font-bold">#14,210</span>
                        </div>
                    </div>

                    <Button variant="primary" size="lg" className="w-full">
                       Claim All Rewards (+2,180 WLD)
                    </Button>
                </div>

                <div className="bg-bg-surface border border-border-default rounded-xl p-6 flex flex-col gap-4">
                   <h3 className="font-bold text-sm uppercase tracking-widest text-text-tertiary font-heading">Achievements</h3>
                   <div className="flex flex-wrap gap-3">
                      <div className="w-12 h-12 rounded-lg bg-bg-base border border-border-default flex items-center justify-center text-xl grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="First win">🏆</div>
                      <div className="w-12 h-12 rounded-lg bg-bg-base border border-border-default flex items-center justify-center text-xl hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="Streak of 3">🥉</div>
                      <div className="w-12 h-12 rounded-lg bg-bg-base border border-border-default flex items-center justify-center text-xl grayscale opacity-40 cursor-help" title="Win 100 matches">💯</div>
                      <div className="w-12 h-12 rounded-lg bg-bg-base border border-border-default flex items-center justify-center text-xl grayscale opacity-40 cursor-help" title="World ID holder">🌍</div>
                   </div>
                </div>
            </div>

            {/* Right Column: Dynamic Tabs & Content (span 8) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
               <div className="flex items-center gap-8 border-b border-border-default pb-0">
                  <button 
                    onClick={() => setActiveTab("Stats")}
                    className={`pb-4 px-2 text-sm font-bold transition-all relative ${
                        activeTab === "Stats" ? 'text-accent-primary' : 'text-text-tertiary hover:text-text-secondary'
                    }`}>
                      Statistics Dashboard
                      {activeTab === "Stats" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary" />}
                  </button>
                  <button 
                    onClick={() => setActiveTab("History")}
                    className={`pb-4 px-2 text-sm font-bold transition-all relative ${
                        activeTab === "History" ? 'text-accent-primary' : 'text-text-tertiary hover:text-text-secondary'
                    }`}>
                      Prediction History
                      {activeTab === "History" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary" />}
                  </button>
               </div>

               {activeTab === "Stats" ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { label: "Total Performance", value: "+2,180 WLD", sub: "Earned across 48 matches", icon: <TrendingUp size={24} />, color: "text-green-500" },
                      { label: "Win / Loss Record", value: "39W - 9L", sub: "Calculated across all years", icon: <History size={24} />, color: "text-accent-primary" },
                    ].map((card, i) => (
                       <div key={i} className="p-8 bg-bg-surface-raised border border-border-default rounded-2xl flex flex-col gap-6 shadow-xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:scale-[2] transition-transform">
                             {card.icon}
                          </div>
                          <div className="p-4 bg-bg-base border border-border-default rounded-xl w-fit group-hover:scale-110 transition-transform">
                             {card.icon}
                          </div>
                          <div>
                             <span className="text-xs font-bold text-text-tertiary uppercase tracking-widest">{card.label}</span>
                             <h4 className={`text-4xl font-heading font-bold mb-2 ${card.color}`}>{card.value}</h4>
                             <p className="text-text-secondary text-sm">{card.sub}</p>
                          </div>
                       </div>
                    ))}
                    
                    <div className="col-span-1 md:col-span-2 p-8 bg-bg-surface border border-border-default rounded-2xl flex flex-col gap-8 shadow-xl relative overflow-hidden group">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold font-heading">Next Tier Progress</h3>
                            <span className="text-xs text-text-tertiary uppercase font-bold tracking-widest flex items-center gap-2">
                               <Trophy size={14} /> Level 12 Gladiator
                            </span>
                        </div>
                        <div className="flex flex-col gap-4">
                           <div className="flex items-center justify-between text-sm">
                              <span className="text-text-secondary">Progress to Gold rank</span>
                              <span className="text-text-primary font-bold">85%</span>
                           </div>
                           <div className="h-3 w-full bg-bg-base border border-border-default rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "85%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-accent-primary shadow-glow" 
                              />
                           </div>
                           <p className="text-xs text-text-tertiary leading-relaxed italic">You need 2 more consecutive wins to unlock the 5-win streak bonus multiplier.</p>
                        </div>
                    </div>
                 </div>
               ) : (
                 <div className="flex flex-col gap-4">
                    {PREDICTION_HISTORY.map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-bg-surface border border-border-default rounded-xl hover:border-border-hover transition-all cursor-pointer group">
                         <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-xl ${
                                h.result === "Win" ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                            }`}>
                               {h.result === "Win" ? <CheckCircle size={24} /> : <TrendingUp size={24} className="rotate-180" />}
                            </div>
                            <div className="flex flex-col gap-1">
                               <span className="font-bold text-text-primary group-hover:text-accent-primary transition-colors">{h.match}</span>
                               <div className="flex items-center gap-2 text-xs text-text-tertiary">
                                  <span className="font-bold text-text-secondary">Picked {h.pick}</span>
                                  <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                                  <span>{h.date}</span>
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                           <span className={`text-lg font-bold font-heading ${h.result === "Win" ? 'text-green-500' : 'text-text-tertiary'}`}>
                              {h.reward}
                           </span>
                           <span className="block text-[10px] text-text-tertiary uppercase font-bold tracking-widest">{h.stake} staked</span>
                         </div>
                      </div>
                    ))}
                    
                    <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
                       <History size={40} className="text-text-tertiary opacity-30" />
                       <p className="text-text-tertiary">Load 20 more historical predictions...</p>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
