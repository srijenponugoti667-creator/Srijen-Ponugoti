import React from 'react';
import { Search, Briefcase, ShieldCheck, Lock, Scale, Clock, ArrowUpRight, Globe, Check } from 'lucide-react';
import { User } from '../types';
import { INDIAN_LANGUAGES, getTranslation } from '../languages';

interface HeroSectionProps {
  currentUser: User;
  onFindLawyerClick: () => void;
  onFindCaseClick: () => void;
  onMyCasesClick: () => void;
  onOpenPaymentModal: () => void;
  onOpenVoiceCaseFilerClick?: () => void;
  currentLanguage?: string;
  onLanguageChange?: (langCode: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentUser,
  onFindLawyerClick,
  onFindCaseClick,
  onMyCasesClick,
  onOpenVoiceCaseFilerClick,
  currentLanguage = 'en',
  onLanguageChange,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLanguage, key);

  return (
    <section className="relative overflow-hidden pt-6 pb-20 border-b border-zinc-800/80">
      
      {/* Background Dark Red Aesthetics & Subtle Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-red-950/20 to-zinc-950 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-red-900/15 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -top-10 right-10 w-96 h-96 bg-red-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 0. PROMINENT TOP LANGUAGE SELECTION RIBBON */}
        <div className="mb-8 p-3 sm:p-4 rounded-3xl bg-zinc-900/90 border border-amber-500/40 shadow-2xl shadow-black/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5 flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-600/60 flex items-center justify-center text-amber-400">
                <Globe className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  {t('chooseLanguage')}
                </span>
                <span className="text-[10px] text-amber-300">
                  {t('availableIn24')}
                </span>
              </div>
            </div>

            {/* Quick Language Pill Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {INDIAN_LANGUAGES.slice(0, 8).map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => onLanguageChange && onLanguageChange(lang.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-700 to-red-900 text-white border border-red-500 shadow-md scale-105'
                        : 'bg-zinc-950/90 hover:bg-zinc-800 text-slate-300 border border-zinc-800'
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                  </button>
                );
              })}

              {/* All 24 Languages Dropdown */}
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-zinc-950 text-slate-200 border border-zinc-850 text-xs font-semibold outline-none focus:border-red-600 cursor-pointer"
              >
                <option value="" disabled>All 24 Languages...</option>
                {INDIAN_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

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
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-cinzel drop-shadow-sm uppercase"
          >
            {t('heroHeadline1')} {t('heroHeadline2')} {t('heroHeadline3')}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            {t('heroSubtitle')}
          </p>

          {/* Primary Action Buttons: "Find a lawyer" and "Find a case" and "Voice Case Filing" */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            
            {/* Button: Voice Case Filing for All Citizens */}
            {onOpenVoiceCaseFilerClick && (
              <button
                id="btn-hero-voice-case-filer"
                onClick={onOpenVoiceCaseFilerClick}
                className="w-full sm:w-auto flex items-center justify-center space-x-3 px-7 py-4 rounded-xl bg-gradient-to-r from-amber-600 via-red-700 to-red-900 hover:from-amber-500 hover:to-red-800 text-white font-bold text-base shadow-2xl shadow-red-950/80 border border-amber-500/50 hover:border-amber-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Scale className="w-5 h-5 text-amber-300 animate-pulse" />
                <span>{t('btnSpeakToFileCase')}</span>
              </button>
            )}

            {/* Button: Find a lawyer */}
            <button
              id="btn-hero-find-lawyer"
              onClick={onFindLawyerClick}
              className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 hover:to-red-700 text-white font-bold text-base shadow-xl shadow-red-950/70 border border-red-500/40 hover:border-red-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Briefcase className="w-5 h-5 text-red-200" />
              <span>{t('btnFindLawyer')}</span>
            </button>

            {/* Button: Find a case */}
            <button
              id="btn-hero-find-case"
              onClick={onFindCaseClick}
              className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-slate-100 font-bold text-base border border-zinc-750 hover:border-red-700/80 shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Search className="w-5 h-5 text-red-400" />
              <span>{t('btnFindCase')}</span>
            </button>

            {/* Secondary Action: My Cases */}
            <button
              id="btn-hero-my-cases"
              onClick={onMyCasesClick}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-zinc-950/90 hover:bg-zinc-900 text-slate-300 font-semibold text-sm border border-zinc-800 hover:text-white transition-all cursor-pointer"
            >
              <span>{currentUser.role === 'lawyer' ? t('openAdvocateVault') : t('viewMyIsolatedCases')}</span>
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
                <span className="truncate">{t('heroQuickSearchPlaceholder')}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-red-950/80 text-red-300 border border-red-800/60 font-semibold flex-shrink-0">
                {t('quickLookup')}
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
              {t('pillar1Title')}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('pillar1Desc')}
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center text-xs text-red-400 font-semibold">
              <span>{t('strictRule1')}</span>
            </div>
          </div>

          {/* Pillar 2: Empowering Clients */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 hover:border-red-800/60 transition-all shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-red-950/70 border border-red-800/60 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-cinzel">
              {t('pillar2Title')}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('pillar2Desc')}
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center text-xs text-amber-400 font-semibold">
              <span>{t('strictRule2')}</span>
            </div>
          </div>

          {/* Pillar 3: Reducing Delays */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 hover:border-red-800/60 transition-all shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-red-950/70 border border-red-800/60 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-cinzel">
              {t('pillar3Title')}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('pillar3Desc')}
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center text-xs text-emerald-400 font-semibold">
              <span>{t('daysSaved')}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
