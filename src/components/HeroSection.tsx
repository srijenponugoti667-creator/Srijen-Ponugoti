import React from 'react';
import { Search, Briefcase, ShieldCheck, Lock, Scale, Clock, ArrowUpRight, Globe, Check, FileText } from 'lucide-react';
import { User } from '../types';
import { INDIAN_LANGUAGES, getTranslation } from '../languages';
import { PWAInstallButton } from './PWAInstallButton';

interface HeroSectionProps {
  currentUser: User;
  onFindLawyerClick: () => void;
  onFindCaseClick: () => void;
  onMyCasesClick: () => void;
  onOpenPaymentModal: () => void;
  onOpenVoiceCaseFilerClick?: () => void;
  onLegalDocsClick?: () => void;
  currentLanguage?: string;
  onLanguageChange?: (langCode: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentUser,
  onFindLawyerClick,
  onFindCaseClick,
  onMyCasesClick,
  onOpenVoiceCaseFilerClick,
  onLegalDocsClick,
  currentLanguage = 'en',
  onLanguageChange,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLanguage, key);

  return (
    <section className="relative overflow-hidden pt-8 pb-20 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100/70 text-slate-900">
      
      {/* Background Soft Executive Aesthetics */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-amber-100/35 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-10 w-80 h-80 bg-sky-100/30 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 0. PROMINENT TOP LANGUAGE SELECTION RIBBON */}
        <div className="mb-8 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5 flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  {t('chooseLanguage')}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
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
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
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
                className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
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
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold shadow-2xs">
            <Scale className="w-3.5 h-3.5 text-red-700" />
            <span>Digital Courtroom & Legal Acceleration Network</span>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Multi-Tenant Isolated Judicial Vault</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 
            id="main-headline"
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight font-cinzel uppercase"
          >
            {t('heroHeadline1')} <span className="text-red-700">{t('heroHeadline2')}</span> {t('heroHeadline3')}
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            {t('heroSubtitle')}
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 flex-wrap">
            
            {/* Button: Voice Case Filing (Litigants only) */}
            {onOpenVoiceCaseFilerClick && currentUser?.role !== 'lawyer' && (
              <button
                id="btn-hero-voice-case-filer"
                onClick={onOpenVoiceCaseFilerClick}
                className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-xs transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Scale className="w-4 h-4 text-amber-200" />
                <span>{t('btnSpeakToFileCase')}</span>
              </button>
            )}

            {/* Button: Find a lawyer (Litigants only) */}
            {currentUser?.role !== 'lawyer' && (
              <button
                id="btn-hero-find-lawyer"
                onClick={onFindLawyerClick}
                className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-slate-300" />
                <span>{t('btnFindLawyer')}</span>
              </button>
            )}

            {/* Button: Find a case */}
            <button
              id="btn-hero-find-case"
              onClick={onFindCaseClick}
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border border-slate-300 shadow-xs transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-600" />
              <span>{t('btnFindCase')}</span>
            </button>

            {/* Button: Legal Document Generator */}
            {onLegalDocsClick && (
              <button
                id="btn-hero-legal-docs"
                onClick={onLegalDocsClick}
                className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-sm border border-emerald-300 shadow-xs transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>{t('legalDocs')}</span>
              </button>
            )}

            {/* PWA Mobile Install Button */}
            <PWAInstallButton variant="hero" />

            {/* Secondary Action: My Cases */}
            <button
              id="btn-hero-my-cases"
              onClick={onMyCasesClick}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 transition-all cursor-pointer"
            >
              <span>{currentUser?.role === 'lawyer' ? t('openAdvocateVault') : t('viewMyIsolatedCases')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

          </div>

          {/* Quick Search Bar Snippet */}
          <div className="mt-8 max-w-xl mx-auto">
            <div 
              onClick={onFindCaseClick}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 cursor-pointer transition-colors shadow-xs group"
            >
              <div className="flex items-center space-x-3 text-slate-500 text-sm">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span className="truncate">{t('heroQuickSearchPlaceholder')}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-300 font-semibold flex-shrink-0">
                {t('quickLookup')}
              </span>
            </div>
          </div>

        </div>

        {/* 3 Value Pillars */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Bridging Lawyers */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs group">
            <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-red-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 font-cinzel">
              {t('pillar1Title')}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('pillar1Desc')}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-red-700 font-bold">
              <span>{t('strictRule1')}</span>
            </div>
          </div>

          {/* Pillar 2: Empowering Clients */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs group">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Lock className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 font-cinzel">
              {t('pillar2Title')}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('pillar2Desc')}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-amber-800 font-bold">
              <span>{t('strictRule2')}</span>
            </div>
          </div>

          {/* Pillar 3: Reducing Delays */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs group">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 font-cinzel">
              {t('pillar3Title')}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('pillar3Desc')}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-emerald-700 font-bold">
              <span>{t('daysSaved')}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
