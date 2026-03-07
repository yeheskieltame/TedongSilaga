"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Plus, LayoutGrid, Calendar, ImageIcon, Facebook, Trash2, ArrowRight, CheckCircle, Clock, Lock } from "lucide-react";
import Button from "@/components/ui/Button";

const ADMIN_MARKETS = [
  { id: "1", name: "Match #12: The Grand Arena", status: "Open", players: 34, created: "2d ago" },
  { id: "11", name: "Rambu vs Tanduk", status: "Locked", players: 28, created: "4d ago" },
  { id: "10", name: "Silaga Toraja", status: "Resolved", players: 45, created: "6d ago" },
];

const AdminDashboard = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-bg-base">
      <Header />
      
      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        {/* Cultural Accent */}
        <div className="absolute top-0 bottom-0 left-0 w-1 toraja-pattern opacity-10" />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-toraja-gold font-bold tracking-[0.2em] uppercase text-xs font-heading">Control Panel</div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold">Admin Dashboard</h1>
                <p className="text-text-secondary">Create, manage, and settle Tedong Silaga prediction markets.</p>
             </div>
             
             <Button variant="primary" size="lg" className="h-14 gap-2 px-8" onClick={() => setIsCreating(!isCreating)}>
                <Plus size={20} /> Create New Market
             </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Content Area (span 8) */}
            <div className="lg:col-span-8 flex flex-col gap-10">
               {isCreating ? (
                 <div className="bg-bg-surface-raised border border-border-default rounded-2xl p-10 flex flex-col gap-10 shadow-2xl relative overflow-hidden group">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-accent-primary/5 blur-[60px] pointer-events-none" />
                    
                    <div className="flex items-center justify-between border-b border-border-default pb-6">
                        <h2 className="text-2xl font-bold font-heading">New Prediction Market</h2>
                        <button onClick={() => setIsCreating(false)} className="text-text-tertiary hover:text-text-primary transition-colors text-sm font-bold uppercase tracking-widest">Cancel</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="flex flex-col gap-3">
                          <label className="text-xs uppercase font-bold tracking-widest text-text-tertiary flex items-center gap-2 font-heading"><LayoutGrid size={14} /> Event Name</label>
                          <input type="text" placeholder="e.g. Match #15: Festival Toraja" className="bg-bg-base border border-border-default rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-accent-primary transition-all" />
                       </div>
                       <div className="flex flex-col gap-3">
                          <label className="text-xs uppercase font-bold tracking-widest text-text-tertiary flex items-center gap-2 font-heading"><Calendar size={14} /> Match Date</label>
                          <input type="datetime-local" className="bg-bg-base border border-border-default rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-accent-primary transition-all text-text-secondary" />
                       </div>

                       {/* Buffalo A */}
                       <div className="flex flex-col gap-6 p-6 bg-bg-surface border border-border-default rounded-xl">
                          <span className="text-xs font-heading font-black italic tracking-widest text-text-tertiary">BUFFALO A</span>
                          <div className="flex flex-col gap-3">
                             <input type="text" placeholder="Buffalo Name" className="bg-bg-base border border-border-default rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-accent-primary transition-all" />
                             <input type="text" placeholder="Owner Name" className="bg-bg-base border border-border-default rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-accent-primary transition-all" />
                             <div className="w-full aspect-video bg-bg-base border border-dashed border-border-default rounded-lg flex flex-col items-center justify-center gap-2 text-text-tertiary hover:text-accent-primary hover:border-accent-primary transition-all cursor-pointer">
                                <ImageIcon size={24} />
                                <span className="text-[10px] uppercase font-bold tracking-widest">Upload Image</span>
                             </div>
                          </div>
                       </div>

                       {/* Buffalo B */}
                       <div className="flex flex-col gap-6 p-6 bg-bg-surface border border-border-default rounded-xl">
                          <span className="text-xs font-heading font-black italic tracking-widest text-text-tertiary">BUFFALO B</span>
                          <div className="flex flex-col gap-3">
                             <input type="text" placeholder="Buffalo Name" className="bg-bg-base border border-border-default rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-accent-primary transition-all" />
                             <input type="text" placeholder="Owner Name" className="bg-bg-base border border-border-default rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-accent-primary transition-all" />
                             <div className="w-full aspect-video bg-bg-base border border-dashed border-border-default rounded-lg flex flex-col items-center justify-center gap-2 text-text-tertiary hover:text-accent-primary hover:border-accent-primary transition-all cursor-pointer">
                                <ImageIcon size={24} />
                                <span className="text-[10px] uppercase font-bold tracking-widest">Upload Image</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="md:col-span-2 flex flex-col gap-3">
                          <label className="text-xs uppercase font-bold tracking-widest text-text-tertiary flex items-center gap-2 font-heading"><Facebook size={14} /> Facebook Post URL</label>
                          <input type="text" placeholder="https://facebook.com/..." className="bg-bg-base border border-border-default rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-accent-primary transition-all" />
                       </div>
                    </div>

                    <div className="pt-6 border-t border-border-default flex gap-4">
                        <Button variant="primary" size="lg" className="flex-1 h-14" onClick={() => setIsCreating(false)}>
                            Publish Market to Chain
                        </Button>
                        <Button variant="secondary" size="lg" className="px-8 h-14">
                            Preview
                        </Button>
                    </div>
                 </div>
               ) : (
                 <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                       <h2 className="text-2xl font-bold font-heading">Active Markets</h2>
                       <button className="text-text-tertiary hover:text-text-primary transition-colors text-xs font-bold uppercase tracking-widest">Manage All</button>
                    </div>

                    <div className="flex flex-col gap-4">
                       {ADMIN_MARKETS.map((m) => (
                         <div key={m.id} className="p-6 bg-bg-surface border border-border-default rounded-xl hover:border-border-hover transition-all flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-6">
                               <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-xl ${
                                 m.status === 'Open' ? 'bg-green-500/10 text-green-500' : 
                                 m.status === 'Locked' ? 'bg-amber-500/10 text-amber-500' : 
                                 'bg-text-tertiary/10 text-text-tertiary'
                               }`}>
                                 {m.status === 'Open' ? <Clock size={24} /> : m.status === 'Locked' ? <Lock size={24} /> : <CheckCircle size={24} />}
                               </div>
                               <div className="flex flex-col gap-1">
                                  <span className="font-bold text-text-primary group-hover:text-accent-primary transition-colors">{m.name}</span>
                                  <div className="flex items-center gap-2 text-xs text-text-tertiary uppercase font-bold font-heading">
                                     <span className={m.status === 'Open' ? 'text-green-500' : ''}>{m.status}</span>
                                     <span className="opacity-30">•</span>
                                     <span>{m.players} Players</span>
                                     <span className="opacity-30">•</span>
                                     <span>Created {m.created}</span>
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <button className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                               <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100 transition-all">
                                  Settle
                               </Button>
                               <div className="bg-bg-base border border-border-default rounded-lg p-2 group-hover:translate-x-1 transition-all">
                                 <ArrowRight size={16} className="text-text-tertiary group-hover:text-accent-primary" />
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}
            </div>

            {/* Sidebar (span 4) */}
            <div className="lg:col-span-4 flex flex-col gap-8">
                <div className="bg-bg-surface-raised border border-border-default rounded-2xl p-8 flex flex-col gap-6 shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-toraja-gold/5 blur-[40px] pointer-events-none" />
                   <h3 className="text-xl font-bold font-heading">Admin Statistics</h3>
                   <div className="flex flex-col gap-6 font-heading">
                      <div className="flex flex-col gap-1">
                         <span className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary">Protocol Volume</span>
                         <span className="text-3xl font-bold text-accent-primary">1.2M WLD</span>
                      </div>
                      <div className="h-px bg-border-default" />
                      <div className="flex flex-col gap-1">
                         <span className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary">Active Markets</span>
                         <span className="text-3xl font-bold text-text-primary">12</span>
                      </div>
                      <div className="h-px bg-border-default" />
                      <div className="flex flex-col gap-1">
                         <span className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary">Participants</span>
                         <span className="text-3xl font-bold text-text-primary">2.4k</span>
                      </div>
                   </div>
                </div>

                <div className="bg-bg-surface border border-border-default rounded-xl p-6 flex flex-col gap-4">
                   <h3 className="font-bold text-sm uppercase tracking-widest text-text-tertiary font-heading">Quick Actions</h3>
                   <div className="flex flex-col gap-2">
                      <button className="flex items-center justify-between p-3 bg-bg-base border border-border-default rounded-lg hover:bg-bg-surface-raised transition-all group">
                         <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary">System Health</span>
                         <div className="w-2 h-2 rounded-full bg-green-500" />
                      </button>
                      <button className="flex items-center justify-between p-3 bg-bg-base border border-border-default rounded-lg hover:bg-bg-surface-raised transition-all group">
                         <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary">Withdraw Fees</span>
                         <ArrowRight size={14} className="text-text-tertiary group-hover:text-accent-primary" />
                      </button>
                      <button className="flex items-center justify-between p-3 bg-bg-base border border-border-default rounded-lg hover:bg-bg-surface-raised transition-all group">
                         <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary">Manage Whitelist</span>
                         <ArrowRight size={14} className="text-text-tertiary group-hover:text-accent-primary" />
                      </button>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
