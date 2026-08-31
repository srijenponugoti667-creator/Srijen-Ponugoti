import React, { useState } from 'react';
import { Scale, ShieldCheck, AlertTriangle, UserCheck, RefreshCw, Crown, Search, Briefcase, FileText, BarChart3, ChevronDown, CheckCircle2, Calendar, UserPlus, Edit3, Globe, Mic, Sparkles, Award } from 'lucide-react';
import { User } from '../types';
import { INDIAN_LANGUAGES, LanguageOption, getTranslation } from '../languages';

interface NavbarProps {
  currentUser: User;
  availablePersonas: User[];
  onSwitchPersona: (userId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPaymentModal: () => void;
  onOpenVerifyModal: () => void;
  onOpenAuthModal: () => void;
  onOpenConsultationsModal: () => void;
  onOpenProfileEditorModal: () => void;
  onOpenVoiceCaseFilerModal?: () => void;
  currentLanguage?: string;
  onLanguageChange?: (langCode: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  availablePersonas,
  onSwitchPersona,
  activeTab,
  setActiveTab,
  onOpenPaymentModal,
  onOpenVerifyModal,
  onOpenAuthModal,
  onOpenConsultationsModal,
  onOpenProfileEditorModal,
  onOpenVoiceCaseFilerModal,
  currentLanguage = 'te',
  onLanguageChange
}) => {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const activeLang = INDIAN_LANGUAGES.find(l => l.code === currentLanguage) || INDIAN_LANGUAGES[2];

  const t = (key: any) => getTranslation(currentLanguage, key);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div 
            id="brand-logo"
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-red-800 to-zinc-950 flex items-center justify-center shadow-lg shadow-red-950/50 border border-red-500/40 group-hover:border-red-400 transition-all duration-300">
              <Scale className="w-6 h-6 text-slate-100 group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold tracking-tight text-white font-cinzel">
                  Justice<span className="text-red-500">Bridge</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-red-950/70 text-red-300 border border-red-800/50 rounded">
                  Legal Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide font-medium">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            <button
              id="nav-btn-home"
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-zinc-900 text-red-200 border border-red-800/60 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              {t('overview')}
            </button>

            <button
              id="nav-btn-lawyers"
              onClick={() => setActiveTab('lawyers')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'lawyers'
                  ? 'bg-zinc-900 text-red-200 border border-red-800/60 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-red-400" />
              <span>{t('findLawyer')}</span>
            </button>

            <button
              id="nav-btn-grading"
              onClick={() => setActiveTab('grading')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'grading'
                  ? 'bg-zinc-900 text-amber-300 border border-amber-600/60 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('grading')}</span>
            </button>

            <button
              id="nav-btn-find-case"
              onClick={() => setActiveTab('find_case')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'find_case'
                  ? 'bg-zinc-900 text-red-200 border border-red-800/60 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-red-400" />
              <span>{t('findCase')}</span>
            </button>

            <button
              id="nav-btn-my-cases"
              onClick={() => setActiveTab('my_cases')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'my_cases'
                  ? 'bg-zinc-900 text-red-200 border border-red-800/60 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-red-400" />
              <span>{currentUser.role === 'lawyer' ? 'Assigned Cases' : t('myCases')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            </button>

            <button
              id="nav-btn-delay-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-zinc-900 text-red-200 border border-red-800/60 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-red-400" />
              <span>{t('delayAnalytics')}</span>
            </button>

            <button
              id="nav-btn-legal-docs"
              onClick={() => setActiveTab('legal_docs')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'legal_docs'
                  ? 'bg-zinc-900 text-red-200 border border-red-800/60 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('legalDocs')}</span>
            </button>

            <button
              id="nav-btn-ai-assistant"
              onClick={() => setActiveTab('ai_assistant')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ai_assistant'
                  ? 'bg-zinc-900 text-red-200 border border-red-800/60 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('aiCounsel')}</span>
            </button>

            <button
              id="nav-btn-consultations"
              onClick={onOpenConsultationsModal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-zinc-900/60 transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-red-400" />
              <span>{t('consultations')}</span>
            </button>

            <button
              id="nav-btn-membership"
              onClick={() => setActiveTab('membership')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'membership'
                  ? 'bg-zinc-900 text-red-200 border border-red-800/60 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('membership')}</span>
            </button>
          </nav>

          {/* Right Controls: Language Selector, Voice Filer Button, Persona Switcher */}
          <div className="flex items-center space-x-2.5">
            
            {/* 1. Voice Case Filing Action Button */}
            {onOpenVoiceCaseFilerModal && (
              <button
                id="btn-nav-voice-file-case"
                onClick={onOpenVoiceCaseFilerModal}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 text-white text-xs font-bold shadow-lg shadow-red-950/40 border border-red-500/40 cursor-pointer active:scale-95 transition-all"
                title="Voice E-Filing for All Citizens (Illiterate / Non-Tech-Savvy)"
              >
                <Mic className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="hidden sm:inline">Voice Case Filing (కేసు నమోదు)</span>
                <span className="sm:hidden">Voice E-File</span>
              </button>
            )}

            {/* 2. Indian Languages Switcher Menu */}
            <div className="relative">
              <button
                id="btn-lang-selector"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-xs font-semibold text-slate-200 transition-colors"
                title="Select from 24 Indian Languages"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="max-w-[70px] sm:max-w-none truncate">{activeLang.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl z-50 p-2 text-slate-200 animate-in fade-in zoom-in-95 scrollbar-thin">
                  <div className="px-3 py-1.5 border-b border-zinc-800 mb-1 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                      Indian Languages (24)
                    </span>
                    <span className="text-[10px] text-slate-500">భాషను ఎంచుకోండి</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    {INDIAN_LANGUAGES.map((lang) => {
                      const isSelected = lang.code === currentLanguage;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            if (onLanguageChange) onLanguageChange(lang.code);
                            setShowLangMenu(false);
                          }}
                          className={`p-2 rounded-xl text-left text-xs transition-all ${
                            isSelected
                              ? 'bg-red-950 border border-red-700 text-white font-bold'
                              : 'hover:bg-zinc-800/80 text-slate-300'
                          }`}
                        >
                          <div className="truncate font-medium">{lang.nativeName}</div>
                          <div className="text-[10px] text-slate-400 truncate">{lang.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Persona Switcher Menu */}
            <div className="relative">
              <button
                id="persona-switcher-btn"
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center space-x-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-750 text-left transition-colors"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-red-800/60"
                />
                <div className="hidden md:block text-left">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-slate-100 max-w-[100px] truncate">{currentUser.name}</span>
                    {currentUser.role === 'lawyer' && currentUser.isVerifiedLawyer && (
                      <ShieldCheck className="w-3 h-3 text-emerald-400" title="Verified Advocate" />
                    )}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Persona Switcher Dropdown */}
              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl z-50 p-2 text-slate-200 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold tracking-wider text-red-400">
                        Live Role & Tenant Testing
                      </span>
                      <RefreshCw className="w-3 h-3 text-slate-400" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Switch roles to verify client isolation & advocate verification gates:
                    </p>
                  </div>

                  <div className="py-1 space-y-1">
                    {availablePersonas.map((persona) => {
                      const isSelected = persona.id === currentUser.id;
                      return (
                        <button
                          key={persona.id}
                          id={`select-persona-${persona.id}`}
                          onClick={() => {
                            onSwitchPersona(persona.id);
                            setShowPersonaMenu(false);
                          }}
                          className={`w-full flex items-start space-x-2.5 p-2 rounded-xl text-left transition-all ${
                            isSelected
                              ? 'bg-red-950/70 border border-red-800 text-white'
                              : 'hover:bg-zinc-800/80 text-slate-300'
                          }`}
                        >
                          <img
                            src={persona.avatar}
                            alt={persona.name}
                            className="w-9 h-9 rounded-lg object-cover border border-zinc-700 flex-shrink-0 mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold truncate">{persona.name}</p>
                              {isSelected && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                            </div>
                            <div className="flex items-center space-x-1.5 mt-0.5">
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 font-medium text-slate-300">
                                {persona.role === 'lawyer' 
                                  ? (persona.isVerifiedLawyer ? 'Verified Lawyer' : 'Unverified Lawyer') 
                                  : 'Client'}
                              </span>
                              {persona.membershipActive ? (
                                <span className="text-[10px] text-emerald-400 font-semibold">Active Member</span>
                              ) : (
                                <span className="text-[10px] text-amber-400 font-medium">Unpaid</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {persona.role === 'lawyer'
                                ? (persona.isVerifiedLawyer ? 'Rule 1: Full Case Access' : 'Rule 1: Files Blocked')
                                : (persona.id === 'client_rohan' ? 'Rule 2: Isolated Tenant #1' : 'Rule 2: Isolated Tenant #2')}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {currentUser.role === 'lawyer' && (
                    <div className="mt-2 pt-2 border-t border-zinc-800 space-y-1.5">
                      <button
                        id="btn-edit-lawyer-profile"
                        onClick={() => {
                          setShowPersonaMenu(false);
                          onOpenProfileEditorModal();
                        }}
                        className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-red-400" />
                        <span>Edit Practice Profile & Fees</span>
                      </button>
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-zinc-800">
                    <button
                      id="btn-dropdown-create-account"
                      onClick={() => {
                        setShowPersonaMenu(false);
                        onOpenAuthModal();
                      }}
                      className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-800/80 text-red-200 text-xs font-bold transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register Custom Litigant/Lawyer</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex xl:hidden overflow-x-auto py-2 space-x-2 border-t border-zinc-800/60 scrollbar-none">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'home' ? 'bg-red-950 text-red-200 border border-red-800' : 'text-slate-400'
            }`}
          >
            {t('overview')}
          </button>
          <button
            onClick={() => setActiveTab('lawyers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'lawyers' ? 'bg-red-950 text-red-200 border border-red-800' : 'text-slate-400'
            }`}
          >
            {t('findLawyer')}
          </button>
          <button
            onClick={() => setActiveTab('grading')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'grading' ? 'bg-amber-950 text-amber-200 border border-amber-700' : 'text-slate-400'
            }`}
          >
            {t('grading')}
          </button>
          <button
            onClick={() => setActiveTab('find_case')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'find_case' ? 'bg-red-950 text-red-200 border border-red-800' : 'text-slate-400'
            }`}
          >
            {t('findCase')}
          </button>
          <button
            onClick={() => setActiveTab('my_cases')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'my_cases' ? 'bg-red-950 text-red-200 border border-red-800' : 'text-slate-400'
            }`}
          >
            {currentUser.role === 'lawyer' ? 'Assigned Cases' : t('myCases')}
          </button>
          <button
            onClick={() => setActiveTab('ai_assistant')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'ai_assistant' ? 'bg-red-950 text-red-200 border border-red-800' : 'text-slate-400'
            }`}
          >
            {t('aiCounsel')}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'analytics' ? 'bg-red-950 text-red-200 border border-red-800' : 'text-slate-400'
            }`}
          >
            {t('delayAnalytics')}
          </button>
          <button
            onClick={() => setActiveTab('membership')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'membership' ? 'bg-red-950 text-red-200 border border-red-800' : 'text-slate-400'
            }`}
          >
            {t('membership')}
          </button>
        </div>
      </div>
    </header>
  );
};
