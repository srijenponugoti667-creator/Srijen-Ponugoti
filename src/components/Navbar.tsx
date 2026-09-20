import React, { useState } from 'react';
import { Scale, ShieldCheck, AlertTriangle, UserCheck, RefreshCw, Crown, Search, Briefcase, FileText, BarChart3, ChevronDown, CheckCircle2, Calendar, UserPlus, Edit3, Globe, Mic, Sparkles, Award } from 'lucide-react';
import appLogo from '../assets/images/justicebridge_app_logo_1788288183801.jpg';
import { User } from '../types';
import { INDIAN_LANGUAGES, LanguageOption, getTranslation } from '../languages';
import { PWAInstallButton } from './PWAInstallButton';

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

  const trialDaysRemaining = currentUser?.trialDaysRemaining ?? 21;
  const isTrialActive = currentUser?.isTrialActive ?? (trialDaysRemaining > 0);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div 
            id="brand-logo"
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-11 h-11 rounded-xl overflow-hidden shadow-sm border border-slate-200 group-hover:border-slate-400 transition-all duration-300 flex-shrink-0 bg-white flex items-center justify-center relative">
              <img 
                src={appLogo} 
                alt="JusticeBridge Logo" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallbackTried) {
                    target.dataset.fallbackTried = 'true';
                    target.src = '/app-logo.jpg';
                  } else {
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }
                }}
              />
              <div style={{ display: 'none' }} className="w-full h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                <Scale className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-cinzel">
                  Justice<span className="text-red-700">Bridge</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-extrabold tracking-wider bg-slate-100 text-slate-700 border border-slate-300 rounded">
                  Legal Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block tracking-wide font-medium">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Navigation Links - Executive Prestige Light */}
          <nav className="hidden xl:flex items-center space-x-1">
            <button
              id="nav-btn-home"
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t('overview')}
            </button>

            <button
              id="nav-btn-lawyers"
              onClick={() => setActiveTab('lawyers')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'lawyers'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('findLawyer')}</span>
            </button>

            <button
              id="nav-btn-grading"
              onClick={() => setActiveTab('grading')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'grading'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('grading')}</span>
            </button>

            <button
              id="nav-btn-find-case"
              onClick={() => setActiveTab('find_case')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'find_case'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('findCase')}</span>
            </button>

            <button
              id="nav-btn-my-cases"
              onClick={() => setActiveTab('my_cases')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'my_cases'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentUser?.role === 'lawyer' ? 'Assigned Cases' : t('myCases')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
            </button>

            <button
              id="nav-btn-delay-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('delayAnalytics')}</span>
            </button>

            <button
              id="nav-btn-legal-docs"
              onClick={() => setActiveTab('legal_docs')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'legal_docs'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('legalDocs')}</span>
            </button>

            <button
              id="nav-btn-ai-assistant"
              onClick={() => setActiveTab('ai_assistant')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'ai_assistant'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('aiCounsel')}</span>
            </button>

            <button
              id="nav-btn-consultations"
              onClick={onOpenConsultationsModal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('consultations')}</span>
            </button>

            <button
              id="nav-btn-membership"
              onClick={() => setActiveTab('membership')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'membership'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('membership')}</span>
            </button>
          </nav>

          {/* Right Controls: Trial Badge, Language, Voice Filer, Persona */}
          <div className="flex items-center space-x-2.5">
            
            {/* 21-Day Trial Quick Badge in Navbar */}
            {isTrialActive && (
              <button
                onClick={onOpenPaymentModal}
                className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold shadow-xs cursor-pointer transition-all"
                title="Click to view 21-Day Trial & Mandate Details"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>21-Day Trial ({trialDaysRemaining}d left)</span>
              </button>
            )}

            {/* PWA Install Button */}
            <PWAInstallButton variant="navbar" />

            {/* Voice Case Filing Button */}
            {onOpenVoiceCaseFilerModal && (
              <button
                id="btn-nav-voice-file-case"
                onClick={onOpenVoiceCaseFilerModal}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs border border-slate-700 cursor-pointer active:scale-95 transition-all"
                title="Voice E-Filing for All Citizens"
              >
                <Mic className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline">Voice E-File</span>
              </button>
            )}

            {/* Indian Languages Switcher Menu */}
            <div className="relative">
              <button
                id="btn-lang-selector"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                title="Select from 24 Indian Languages"
              >
                <Globe className="w-3.5 h-3.5 text-slate-600" />
                <span className="max-w-[70px] sm:max-w-none truncate">{activeLang.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 p-2 text-slate-800 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 border-b border-slate-200 mb-1 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-900">
                      Indian Languages (24)
                    </span>
                    <span className="text-[10px] text-slate-500">Select Language</span>
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
                          className={`p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white font-bold'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="truncate font-medium">{lang.nativeName}</div>
                          <div className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{lang.name}</div>
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
                className="flex items-center space-x-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-left transition-colors cursor-pointer"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser?.name || 'User'}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-300"
                />
                <div className="hidden md:block text-left">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-slate-900 max-w-[100px] truncate">{currentUser?.name || 'User'}</span>
                    {currentUser?.role === 'lawyer' && currentUser?.isVerifiedLawyer && (
                      <ShieldCheck className="w-3 h-3 text-emerald-600" title="Verified Advocate" />
                    )}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {/* User Account / Profile Dropdown */}
              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 p-3 text-slate-800 animate-in fade-in zoom-in-95">
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={currentUser?.name || 'User'}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 truncate">{currentUser?.name || 'JusticeBridge User'}</p>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold uppercase">
                          {currentUser?.role === 'lawyer' ? 'Advocate / Lawyer' : 'Litigant / Citizen'}
                        </span>
                        {currentUser?.role === 'lawyer' && currentUser?.isVerifiedLawyer && (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center">
                            <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-600" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    {currentUser?.role === 'lawyer' ? (
                      <button
                        id="btn-edit-lawyer-profile"
                        onClick={() => {
                          setShowPersonaMenu(false);
                          onOpenProfileEditorModal();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4 text-slate-600" />
                        <span>Edit Practice Profile & Fees</span>
                      </button>
                    ) : (
                      <button
                        id="btn-nav-view-consults"
                        onClick={() => {
                          setShowPersonaMenu(false);
                          onOpenConsultationsModal();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-slate-600" />
                        <span>My Consultations & Bookings</span>
                      </button>
                    )}

                    <button
                      id="btn-menu-membership"
                      onClick={() => {
                        setShowPersonaMenu(false);
                        onOpenPaymentModal();
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Crown className="w-4 h-4 text-amber-600" />
                      <span>{isTrialActive ? 'Manage 21-Day Trial & Mandate' : 'Membership Details'}</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <button
                      id="btn-dropdown-create-account"
                      onClick={() => {
                        setShowPersonaMenu(false);
                        onOpenAuthModal();
                      }}
                      className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Switch / Register New Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex xl:hidden overflow-x-auto py-2 space-x-2 border-t border-slate-200 scrollbar-none items-center">
          <button
            id="mobile-nav-btn-home"
            onClick={() => setActiveTab('home')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'home' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{t('overview')}</span>
          </button>
          <button
            id="mobile-nav-btn-lawyers"
            onClick={() => setActiveTab('lawyers')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'lawyers' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{t('findLawyer')}</span>
          </button>
          <button
            id="mobile-nav-btn-legal-docs"
            onClick={() => setActiveTab('legal_docs')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'legal_docs' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('legalDocs')}</span>
          </button>
          <button
            id="mobile-nav-btn-grading"
            onClick={() => setActiveTab('grading')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'grading' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('grading')}</span>
          </button>
          <button
            id="mobile-nav-btn-find-case"
            onClick={() => setActiveTab('find_case')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'find_case' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t('findCase')}</span>
          </button>
          <button
            id="mobile-nav-btn-my-cases"
            onClick={() => setActiveTab('my_cases')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'my_cases' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{currentUser?.role === 'lawyer' ? 'Assigned Cases' : t('myCases')}</span>
          </button>
          <button
            id="mobile-nav-btn-ai-assistant"
            onClick={() => setActiveTab('ai_assistant')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'ai_assistant' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{t('aiCounsel')}</span>
          </button>
          <button
            id="mobile-nav-btn-consultations"
            onClick={onOpenConsultationsModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t('consultations')}</span>
          </button>
          <button
            id="mobile-nav-btn-analytics"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'analytics' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t('delayAnalytics')}</span>
          </button>
          <button
            id="mobile-nav-btn-membership"
            onClick={() => setActiveTab('membership')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'membership' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('membership')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
