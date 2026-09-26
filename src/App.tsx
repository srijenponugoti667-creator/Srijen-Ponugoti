import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MembershipNotificationBanner } from './components/MembershipNotificationBanner';
import { HeroSection } from './components/HeroSection';
import { LawyerDirectory } from './components/LawyerDirectory';
import { CaseTracker } from './components/CaseTracker';
import { MyCasesDashboard } from './components/MyCasesDashboard';
import { DelayReductionAnalytics } from './components/DelayReductionAnalytics';
import { CaseFileViewerModal } from './components/CaseFileViewerModal';
import { MembershipPaymentModal } from './components/MembershipPaymentModal';
import { BarVerificationModal } from './components/BarVerificationModal';
import { BookConsultationModal } from './components/BookConsultationModal';
import { FileNewCaseModal } from './components/FileNewCaseModal';
import { AuthModal } from './components/AuthModal';
import { ConsultationsManagerModal } from './components/ConsultationsManagerModal';
import { LawyerProfileEditorModal } from './components/LawyerProfileEditorModal';
import { LegalDocumentGenerator } from './components/LegalDocumentGenerator';
import { AILegalAssistant } from './components/AILegalAssistant';
import { AdvocateGrading } from './components/AdvocateGrading';
import { VoiceCaseFilerModal } from './components/VoiceCaseFilerModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { InstallAppBanner } from './components/InstallAppBanner';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { CaseUpdateNotifier } from './components/CaseUpdateNotifier';
import { User, LawyerProfile, CaseMatter, PaymentInvoice } from './types';
import { Scale, ShieldCheck, Lock, Clock, Crown, ArrowRight, Heart, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { getTranslation } from './languages';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'guest_user',
    name: 'Litigant / Guest',
    email: '',
    role: 'client',
    membershipActive: false,
    membershipPlan: 'client_annual',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  });

  const [availablePersonas, setAvailablePersonas] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  // Modals state
  const [selectedCaseForFiles, setSelectedCaseForFiles] = useState<string | null>(null);
  const [selectedGradingLawyerId, setSelectedGradingLawyerId] = useState<string | undefined>(undefined);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [selectedLawyerForBooking, setSelectedLawyerForBooking] = useState<LawyerProfile | null>(null);
  const [isFileCaseModalOpen, setIsFileCaseModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isConsultationsModalOpen, setIsConsultationsModalOpen] = useState<boolean>(false);
  const [isProfileEditorModalOpen, setIsProfileEditorModalOpen] = useState<boolean>(false);
  const [isVoiceFilerModalOpen, setIsVoiceFilerModalOpen] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    return localStorage.getItem('preferred_lang') || 'en';
  });

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLanguage, key);

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferred_lang', lang);
    showToast(`Language switched to ${lang.toUpperCase()}`);
  };

  // Toast / Status notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch initial auth user
  const fetchCurrentUser = async () => {
    try {
      setLoadingUser(true);
      const res = await fetch('/api/auth/current-user');
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
      }
      if (data.availablePersonas) {
        setAvailablePersonas(data.availablePersonas);
      }
    } catch (err) {
      console.error('Failed to fetch auth profile:', err);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Handle switching personas for live testing
  const handleSwitchPersona = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/switch-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        showToast(`Switched active persona to ${data.user.name} (${data.user?.role === 'lawyer' ? (data.user?.isVerifiedLawyer ? 'Verified Advocate' : 'Unverified Lawyer') : 'Client'})`);
      }
    } catch (err) {
      console.error('Failed to switch persona:', err);
    }
  };

  const handlePaymentSuccess = (updatedUser: User, invoice?: PaymentInvoice | null) => {
    setCurrentUser(updatedUser);
    if (invoice) {
      showToast(`Payment of ₹${invoice.totalAmount} confirmed! Membership activated.`);
    } else {
      showToast(`Auto-Payment mandate updated successfully!`);
    }
  };

  const handleVerificationSuccess = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    showToast(`Bar Council credentials verified for ${updatedUser.name}! Rule 1 case vault access unlocked.`);
  };

  const handleCaseFiled = (newCase: CaseMatter) => {
    showToast(`Case petition registered with CNR: ${newCase.cnrNumber}`);
    setActiveTab('my_cases');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white pb-24 xl:pb-0">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        availablePersonas={availablePersonas}
        onSwitchPersona={handleSwitchPersona}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
        onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenConsultationsModal={() => setIsConsultationsModalOpen(true)}
        onOpenProfileEditorModal={() => setIsProfileEditorModalOpen(true)}
        onOpenVoiceCaseFilerModal={() => setIsVoiceFilerModalOpen(true)}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />

      {/* 2. Membership Notification Banner (Rules: Client ₹2,999/yr, Advocate ₹5,999/yr with 21-Day Free Trial) */}
      <MembershipNotificationBanner
        currentUser={currentUser}
        onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
        onAutoPayTriggered={(updatedUser, inv) => {
          setCurrentUser(updatedUser);
          showToast(`Day 22 Auto-Payment executed! Invoice ${inv.invoiceNumber} generated.`);
        }}
        currentLanguage={currentLanguage}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-xs flex items-center space-x-3 text-white animate-in slide-in-from-bottom-5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main App Content Views */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <HeroSection
              currentUser={currentUser}
              onFindLawyerClick={() => setActiveTab('lawyers')}
              onFindCaseClick={() => setActiveTab('find_case')}
              onMyCasesClick={() => setActiveTab('my_cases')}
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
              onOpenVoiceCaseFilerClick={() => setIsVoiceFilerModalOpen(true)}
              onLegalDocsClick={() => setActiveTab('legal_docs')}
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />

            {/* Quick Preview Sections on Home */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              
              {/* Featured Section: Find a Lawyer, Legal Docs & Case Tracker Preview Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                
                {/* Lawyer Finder Teaser Card */}
                <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between group hover:border-slate-300 hover:shadow-md transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-700 mb-4 group-hover:scale-105 transition-transform">
                      <Scale className="w-6 h-6" />
                    </div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-red-700 block mb-1">
                      {t('advocateDirectory')}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 font-cinzel mb-2">
                      {t('connectVerifiedCounsels')}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {t('filterAdvocatesDesc')}
                    </p>
                  </div>

                  <button
                    id="btn-home-preview-find-lawyer"
                    onClick={() => setActiveTab('lawyers')}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <span>{t('browseAdvocatesBtn')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Legal Documents Generator Teaser Card */}
                <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between group hover:border-slate-300 hover:shadow-md transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4 group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700">
                        {t('legalDocs')}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Free PDF
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 font-cinzel mb-2">
                      Automated Legal Documents
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      Generate court-standard legal notices, mutual non-disclosure agreements (NDAs), affidavits, and rental agreements in seconds.
                    </p>
                  </div>

                  <button
                    id="btn-home-preview-legal-docs"
                    onClick={() => setActiveTab('legal_docs')}
                    className="flex items-center justify-between p-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <span>Draft & Download Legal Docs</span>
                    <ArrowRight className="w-4 h-4 text-emerald-100" />
                  </button>
                </div>

                {/* Case Lookup Teaser Card */}
                <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between group hover:border-slate-300 hover:shadow-md transition-all md:col-span-2 lg:col-span-1">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-4 group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-slate-600 block mb-1">
                      {t('caseTrackingDelayMonitor')}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 font-cinzel mb-2">
                      {t('trackLitigationsTitle')}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {t('trackLitigationsDesc')}
                    </p>
                  </div>

                  <button
                    id="btn-home-preview-find-case"
                    onClick={() => setActiveTab('find_case')}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <span>{t('searchCaseByCnrBtn')}</span>
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

              </div>

              {/* Data Security Rules Highlights */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs mb-12">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs font-semibold mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
                    <span>{t('judicialDataSecurity')}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 font-cinzel">
                    {t('engineeredForConfidentiality')}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Security Rule 1 */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-800 font-bold font-mono">
                      01
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">
                        {t('securityRule1Title')}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {t('securityRule1Desc')}
                      </p>
                    </div>
                  </div>

                  {/* Security Rule 2 */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-900 font-bold font-mono">
                      02
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">
                        {t('securityRule2Title')}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {t('securityRule2Desc')}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'lawyers' && (
          <LawyerDirectory
            currentUser={currentUser}
            onBookConsultation={(lawyer) => setSelectedLawyerForBooking(lawyer)}
            onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
            currentLanguage={currentLanguage}
            onNavigateToGrading={(lawyerId) => {
              setSelectedGradingLawyerId(lawyerId);
              setActiveTab('grading');
            }}
          />
        )}

        {activeTab === 'grading' && (
          <AdvocateGrading
            currentUser={currentUser}
            onBookConsultation={(lawyer) => setSelectedLawyerForBooking(lawyer)}
            currentLanguage={currentLanguage}
            initialSelectedLawyerId={selectedGradingLawyerId}
          />
        )}

        {activeTab === 'find_case' && (
          <CaseTracker
            currentUser={currentUser}
            onSelectCase={(caseId) => setSelectedCaseForFiles(caseId)}
            onFileNewCaseClick={() => setIsFileCaseModalOpen(true)}
            currentLanguage={currentLanguage}
          />
        )}

        {activeTab === 'my_cases' && (
          <MyCasesDashboard
            currentUser={currentUser}
            onOpenCaseFiles={(caseId) => setSelectedCaseForFiles(caseId)}
            onFileNewCase={() => setIsFileCaseModalOpen(true)}
            onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            onOpenVoiceCaseFiler={() => setIsVoiceFilerModalOpen(true)}
            currentLanguage={currentLanguage}
          />
        )}

        {activeTab === 'analytics' && <DelayReductionAnalytics currentLanguage={currentLanguage} />}

        {activeTab === 'legal_docs' && <LegalDocumentGenerator currentLanguage={currentLanguage} />}

        {activeTab === 'ai_assistant' && (
          <AILegalAssistant
            onOpenFileCaseModal={() => setIsFileCaseModalOpen(true)}
            onOpenVoiceCaseFilerModal={() => setIsVoiceFilerModalOpen(true)}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
        )}

        {activeTab === 'membership' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* Membership Header */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>{t('transparentMembership')}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-cinzel">
                {t('membershipTitle')}
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                {t('membershipSubtitle')}
              </p>
              <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <span>✨ 21-Day Free Trial on Registration • Auto-Debit Mandate on Day 22</span>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              
              {/* Client Annual Plan */}
              <div className={`p-8 rounded-3xl border flex flex-col justify-between shadow-xs transition-all ${
                currentUser?.role === 'client'
                  ? 'bg-white border-amber-400 ring-2 ring-amber-400/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold uppercase tracking-wider">
                      {t('clientJusticePass')}
                    </span>
                    {currentUser?.role === 'client' && (
                      <span className="text-xs text-amber-700 font-bold">{t('yourAccountTier')}</span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 font-cinzel mb-2">
                    {t('annualClientMembership')}
                  </h3>

                  <div className="flex items-baseline space-x-1.5 my-4">
                    <span className="text-4xl font-extrabold text-slate-900 font-mono">₹2,999</span>
                    <span className="text-xs text-slate-500 font-semibold">{t('perYearGst')}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {t('clientMembershipMsg')}
                  </p>

                  <div className="space-y-3 text-xs text-slate-700 mb-6">
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{t('pillar2Title')}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{t('nationalCaseRegistry')}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{t('bookConsultation')}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{t('aiDelayAnalysis')}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>21-Day Full Access Free Trial Included</span>
                    </div>
                  </div>
                </div>

                <button
                  id="btn-client-plan-pay"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
                >
                  {currentUser?.role === 'client' && currentUser?.membershipActive ? `${t('activeMembership')} (₹2,999/yr)` : t('subscribeClientBtn')}
                </button>
              </div>

              {/* Advocate Monthly/Annual Plan */}
              <div className={`p-8 rounded-3xl border flex flex-col justify-between shadow-xs transition-all ${
                currentUser?.role === 'lawyer'
                  ? 'bg-white border-red-400 ring-2 ring-red-400/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-red-50 text-red-800 border border-red-200 text-xs font-bold uppercase tracking-wider">
                      {t('advocatePracticePass')}
                    </span>
                    {currentUser?.role === 'lawyer' && (
                      <span className="text-xs text-red-700 font-bold">{t('yourAccountTier')}</span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 font-cinzel mb-2">
                    {t('monthlyAdvocateMembership')}
                  </h3>

                  <div className="flex items-baseline space-x-1.5 my-4">
                    <span className="text-4xl font-extrabold text-slate-900 font-mono">₹5,999</span>
                    <span className="text-xs text-slate-500 font-semibold">{t('perYearGst')}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {t('advocateMembershipMsg')}
                  </p>

                  <div className="space-y-3 text-xs text-slate-700 mb-6">
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{t('securityRule1Title')}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{t('bciVerifiedDirectoryBadge')}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{t('judicialLookupDesc')}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{t('aiStatutoryCounsel')}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>21-Day Full Access Free Trial Included</span>
                    </div>
                  </div>
                </div>

                <button
                  id="btn-lawyer-plan-pay"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
                >
                  {currentUser?.role === 'lawyer' && currentUser?.membershipActive ? `${t('activeMembership')} (₹5,999/yr)` : t('subscribeAdvocateBtn')}
                </button>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Global Interactive Modals */}
      
      {/* 1. Case File Vault Modal (Rule 1 & Rule 2 Enforcement) */}
      <CaseFileViewerModal
        caseId={selectedCaseForFiles}
        currentUser={currentUser}
        onClose={() => setSelectedCaseForFiles(null)}
        onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
        currentLanguage={currentLanguage}
      />

      {/* 2. Membership Payment Workflow Modal (₹2,999/yr & ₹3,999/mo) */}
      <MembershipPaymentModal
        currentUser={currentUser}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        currentLanguage={currentLanguage}
      />

      {/* 3. Bar Council Verification Modal (Simulate e-KYC) */}
      <BarVerificationModal
        currentUser={currentUser}
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onVerificationSuccess={handleVerificationSuccess}
        currentLanguage={currentLanguage}
      />

      {/* 4. Book Consultation Modal */}
      <BookConsultationModal
        lawyer={selectedLawyerForBooking}
        currentUser={currentUser}
        onClose={() => setSelectedLawyerForBooking(null)}
        onSuccess={() => {
          showToast(`Consultation successfully requested with ${selectedLawyerForBooking?.name}!`);
        }}
        currentLanguage={currentLanguage}
      />

      {/* 5. File New Case Modal */}
      <FileNewCaseModal
        currentUser={currentUser}
        isOpen={isFileCaseModalOpen}
        onClose={() => setIsFileCaseModalOpen(false)}
        onCaseFiled={handleCaseFiled}
        currentLanguage={currentLanguage}
      />

      {/* 5b. Voice Case Filer Modal (For Illiterate & Multilingual Citizens) */}
      <VoiceCaseFilerModal
        currentUser={currentUser}
        isOpen={isVoiceFilerModalOpen}
        onClose={() => setIsVoiceFilerModalOpen(false)}
        onCaseFiled={handleCaseFiled}
        initialLanguage={currentLanguage}
      />

      {/* 6. Account Registration & Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        availablePersonas={availablePersonas}
        onSwitchPersona={handleSwitchPersona}
        onAuthSuccess={(newUser) => {
          setCurrentUser(newUser);
          fetchCurrentUser();
          showToast(`Welcome to JusticeBridge, ${newUser.name}!`);
        }}
        currentLanguage={currentLanguage}
      />

      {/* 7. Consultations Manager Modal */}
      <ConsultationsManagerModal
        currentUser={currentUser}
        isOpen={isConsultationsModalOpen}
        onClose={() => setIsConsultationsModalOpen(false)}
        currentLanguage={currentLanguage}
      />

      {/* 8. Lawyer Profile Editor Modal */}
      <LawyerProfileEditorModal
        currentUser={currentUser}
        isOpen={isProfileEditorModalOpen}
        onClose={() => setIsProfileEditorModalOpen(false)}
        onProfileUpdated={(updated) => {
          setCurrentUser(updated);
          fetchCurrentUser();
          showToast('Practice profile updated successfully.');
        }}
        currentLanguage={currentLanguage}
      />

      {/* Offline Connectivity Toast */}
      <OfflineIndicator />

      {/* Case Update Notifier */}
      {currentUser.id !== 'guest_user' && <CaseUpdateNotifier userId={currentUser.id} />}

      {/* Floating Install App Banner */}
      <InstallAppBanner />

      {/* Mobile Fixed Bottom Navigation Dock (Phones & Tablets) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLanguage={currentLanguage}
        isLawyer={currentUser.role === 'lawyer'}
      />

      {/* Footer with Terms, Privacy, Refund, and Contact Modals */}
      <Footer currentLanguage={currentLanguage} />

    </div>
  );
}
