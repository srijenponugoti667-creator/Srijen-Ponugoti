import React from 'react';
import { Search, Briefcase, ShieldCheck, Zap, Lock, Scale, Clock, Award, ArrowUpRight } from 'lucide-react';
import { User } from '../types';

interface HeroSectionProps {
  currentUser: User;
  onFindLawyerClick: () => void;
  onFindCaseClick: () => void;
  onMyCasesClick: () => void;
  onOpenPaymentModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentUser,
  onFindLawyerClick,
  onFindCaseClick,
  onMyCasesClick,
  onOpenPaymentModal,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-zinc-800/80">
      
      {/* Background Dark Red Aesthetics & Subtle Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-red-950/20 to-zinc-950 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-red-900/15 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -top-10 right-10 w-96 h-96 bg-red-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-950/70 border border-red-800/60 text-red-300 text-xs font-semibold shadow-inner">
            <Scale className="w-3.5 h-3.5 text-red-400" />
            <span>Digital Courtroom & Legal Acceleration Network</span>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-slate-300 text-xs font-medium">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Isolated Multi-Tenant Security</span>
          </div>
        </div>

        {/* Main Headline exact match */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 
            id="main-headline"
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-cinzel drop-shadow-sm"
          >
            Bridging lawyers. Empowering clients. Reducing delays.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            JusticeBridge is the premier legal platform connecting clients with verified Bar Council advocates, safeguarding confidential litigation files through strict tenant isolation, and actively cutting court hearing delays.
          </p>

          {/* Primary Action Buttons: "Find a lawyer" and "Find a case" */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* Button: Find a lawyer */}
            <button
              id="btn-hero-find-lawyer"
              onClick={onFindLawyerClick}
              className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 hover:to-red-700 text-white font-bold text-base shadow-xl shadow-red-950/70 border border-red-500/40 hover:border-red-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Briefcase className="w-5 h-5 text-red-200" />
              <span>Find a lawyer</span>
            </button>

            {/* Button: Find a case */}
            <button
              id="btn-hero-find-case"
              onClick={onFindCaseClick}
              className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-slate-100 font-bold text-base border border-zinc-750 hover:border-red-700/80 shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Search className="w-5 h-5 text-red-400" />
              <span>Find a case</span>
            </button>

            {/* Secondary Action: My Cases */}
            <button
              id="btn-hero-my-cases"
              onClick={onMyCasesClick}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-zinc-950/90 hover:bg-zinc-900 text-slate-300 font-semibold text-sm border border-zinc-800 hover:text-white transition-all"
            >
              <span>{currentUser.role === 'lawyer' ? 'Open Advocate Vault' : 'View My Isolated Cases'}</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>

          </div>

          {/* Quick Search Bar Snippet */}
          <div className="mt-8 max-w-xl mx-auto">
            <div 
              onClick={onFindCaseClick}
              className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-red-700/60 cursor-pointer transition-colors shadow-lg group"
            >
              <div className="flex items-center space-x-3 text-slate-400 text-sm">
                <Search className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                <span>Search by Case CNR (e.g. DLHC01-004192-2026), Title, or Court...</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-red-950/80 text-red-300 border border-red-800/60 font-semibold">
                Quick Lookup
              </span>
            </div>
          </div>

        </div>

        {/* 3 Value Pillars */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Bridging Lawyers */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 hover:border-red-800/60 transition-all shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-red-950/70 border border-red-800/60 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-cinzel">
              Verified Bar Advocates
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every advocate profile is verified against State Bar Councils. Only verified advocates receive credentials to inspect confidential case filings.
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center text-xs text-red-400 font-semibold">
              <span>Strict Rule 1 Access Control</span>
            </div>
          </div>

          {/* Pillar 2: Empowering Clients */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 hover:border-red-800/60 transition-all shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-red-950/70 border border-red-800/60 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-cinzel">
              Complete Client Isolation
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bank-grade multi-tenant architecture ensures strict isolation. No client can ever view, query, or leak another client’s legal matters or confidential filings.
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center text-xs text-amber-400 font-semibold">
              <span>Strict Rule 2 Tenant Boundary</span>
            </div>
          </div>

          {/* Pillar 3: Reducing Delays */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 hover:border-red-800/60 transition-all shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-red-950/70 border border-red-800/60 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-cinzel">
              Active Delay Reduction
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time bottleneck telemetry, electronic discovery tracking, and AI hearing acceleration strategies cut avoidable adjournments by up to 68%.
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center text-xs text-emerald-400 font-semibold">
              <span>Avg. 84 Days Saved Per Matter</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
