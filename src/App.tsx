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
import { Footer } from './components/Footer';
import { User, LawyerProfile, CaseMatter, PaymentInvoice } from './types';
import { Scale, ShieldCheck, Lock, Clock, Crown, ArrowRight, Heart, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { getTranslation } from './languages';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'client_rohan',
    name: 'Rohan Verma',
    email: 'rohan.verma@techscale.io',
    role: 'client',
    membershipActive: false,
    membershipPlan: 'client_annual',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
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
    return localStorage.getItem('preferred_lang') || 'te';
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
        showToast(`Switched active persona to ${data.user.name} (${data.user.role === 'lawyer' ? (data.user.isVerifiedLawyer ? 'Verified Advocate' : 'Unverified Lawyer') : 'Client'})`);
      }
    } catch (err) {
      console.error('Failed to switch persona:', err);
    }
  };

  const handlePaymentSuccess = (updatedUser: User, invoice: PaymentInvoice) => {
    setCurrentUser(updatedUser);
    showToast(`Payment of ₹${invoice.totalAmount} confirmed! Membership activated.`);
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
    <div className="min-h-screen bg-zinc-950 text-slate-200 flex flex-col font-sans selection:bg-red-900 selection:text-white">
      
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

      {/* 2. Membership Notification Banner (Rules: Client ₹2,999/yr, Advocate ₹3,999/mo) */}
      <MembershipNotificationBanner
        currentUser={currentUser}
        onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
        currentLanguage={currentLanguage}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-zinc-900 border border-red-700 shadow-2xl text-xs flex items-center space-x-3 text-white animate-in slide-in-from-bottom-5">
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
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />

            {/* Quick Preview Sections on Home */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              
              {/* Featured Section: Find a Lawyer & Find a Case Preview Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                
                {/* Lawyer Finder Teaser Card */}
                <div className="p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl flex flex-col justify-between group hover:border-red-800/60 transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-300 mb-4 group-hover:scale-105 transition-transform">
                      <Scale className="w-6 h-6" />
                    </div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-red-400 block mb-1">
                      {t('advocateDirectory')}
                    </span>
                    <h3 className="text-2xl font-bold text-white font-cinzel mb-2">
                      {t('connectVerifiedCounsels')}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                      {t('filterAdvocatesDesc')}
                    </p>
                  </div>

                  <button
                    id="btn-home-preview-find-lawyer"
                    onClick={() => setActiveTab('lawyers')}
                    className="flex items-center justify-between p-4 rounded-2xl bg-red-950/70 hover:bg-red-900/90 text-red-200 border border-red-800 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                  >
                    <span>{t('browseAdvocatesBtn')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Case Lookup Teaser Card */}
                <div className="p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl flex flex-col justify-between group hover:border-red-800/60 transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-300 mb-4 group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-red-400 block mb-1">
                      {t('caseTrackingDelayMonitor')}
                    </span>
                    <h3 className="text-2xl font-bold text-white font-cinzel mb-2">
                      {t('trackLitigationsTitle')}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                      {t('trackLitigationsDesc')}
                    </p>
                  </div>

                  <button
                    id="btn-home-preview-find-case"
                    onClick={() => setActiveTab('find_case')}
                    className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-850 text-slate-200 border border-zinc-750 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                  >
                    <span>{t('searchCaseByCnrBtn')}</span>
                    <ArrowRight className="w-4 h-4 text-red-400" />
                  </button>
                </div>

              </div>

              {/* Data Security Rules Highlights */}
              <div className="p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl mb-12">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-red-950/70 border border-red-800/60 text-red-300 text-xs font-semibold mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                    <span>{t('judicialDataSecurity')}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-cinzel">
                    {t('engineeredForConfidentiality')}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Security Rule 1 */}
                  <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-700/80 flex items-center justify-center flex-shrink-0 text-red-300 font-bold font-mono">
                      01
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">
                        {t('securityRule1Title')}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {t('securityRule1Desc')}
                      </p>
                    </div>
                  </div>

                  {/* Security Rule 2 */}
                  <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-700/80 flex items-center justify-center flex-shrink-0 text-amber-400 font-bold font-mono">
                      02
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">
                        {t('securityRule2Title')}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
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
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
                <Crown className="w-3.5 h-3.5" />
                <span>Transparent Judicial Membership</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-cinzel">
                JusticeBridge Membership Tiers
              </h2>
              <p className="text-slate-300 text-sm mt-2">
                Designed to maintain high-integrity advocate verification and secure isolated infrastructure for litigants.
              </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              
              {/* Client Annual Plan */}
              <div className={`p-8 rounded-3xl border flex flex-col justify-between shadow-2xl transition-all ${
                currentUser.role === 'client'
                  ? 'bg-zinc-900 border-red-700 shadow-red-950/30'
                  : 'bg-zinc-900/60 border-zinc-800'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-red-950/80 text-red-300 border border-red-800 text-xs font-bold uppercase tracking-wider">
                      Client Justice Pass
                    </span>
                    {currentUser.role === 'client' && (
                      <span className="text-xs text-amber-400 font-bold">Your Account Tier</span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white font-cinzel mb-2">
                    Annual Client Membership
                  </h3>

                  <div className="flex items-baseline space-x-1.5 my-4">
                    <span className="text-4xl font-extrabold text-amber-400 font-mono">₹2,999</span>
                    <span className="text-xs text-slate-400 font-semibold">/ year (18% GST incl.)</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    Mandatory annual subscription for clients to register petitions, track isolated matters, and consult verified counsels.
                  </p>

                  <div className="space-y-3 text-xs text-slate-200 mb-6">
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Strict Client Isolation Vault</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Unlimited Case CNR Lookups</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Direct Advocate Advisory Booking</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>AI Delay Risk & Hearing Analytics</span>
                    </div>
                  </div>
                </div>

                <button
                  id="btn-client-plan-pay"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-900/40"
                >
                  {currentUser.role === 'client' && currentUser.membershipActive ? 'Renew Pass (₹2,999/yr)' : 'Subscribe ₹2,999 / Year'}
                </button>
              </div>

              {/* Advocate Monthly Plan */}
              <div className={`p-8 rounded-3xl border flex flex-col justify-between shadow-2xl transition-all ${
                currentUser.role === 'lawyer'
                  ? 'bg-zinc-900 border-red-700 shadow-red-950/30'
                  : 'bg-zinc-900/60 border-zinc-800'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-red-950/80 text-red-300 border border-red-800 text-xs font-bold uppercase tracking-wider">
                      Advocate Pro Tier
                    </span>
                    {currentUser.role === 'lawyer' && (
                      <span className="text-xs text-amber-400 font-bold">Your Account Tier</span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white font-cinzel mb-2">
                    Advocate Practice Subscription
                  </h3>

                  <div className="flex items-baseline space-x-1.5 my-4">
                    <span className="text-4xl font-extrabold text-amber-400 font-mono">₹3,999</span>
                    <span className="text-xs text-slate-400 font-semibold">/ month (18% GST incl.)</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    Monthly practice subscription for lawyers to access confidential case discovery, full evidence vaults, and cause-list sync.
                  </p>

                  <div className="space-y-3 text-xs text-slate-200 mb-6">
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Rule 1: Full Case Files Discovery</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Verified Bar Council Badge in Directory</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Supreme Court & High Court Cause-List Sync</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>AI Case Management & Brief Summaries</span>
                    </div>
                  </div>
                </div>

                <button
                  id="btn-lawyer-plan-pay"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 text-white font-bold text-xs shadow-xl border border-red-500/40"
                >
                  {currentUser.role === 'lawyer' && currentUser.membershipActive ? 'Renew Subscription (₹3,999/mo)' : 'Subscribe ₹3,999 / Month'}
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
      />

      {/* 2. Membership Payment Workflow Modal (₹2,999/yr & ₹3,999/mo) */}
      <MembershipPaymentModal
        currentUser={currentUser}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* 3. Bar Council Verification Modal (Simulate e-KYC) */}
      <BarVerificationModal
        currentUser={currentUser}
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onVerificationSuccess={handleVerificationSuccess}
      />

      {/* 4. Book Consultation Modal */}
      <BookConsultationModal
        lawyer={selectedLawyerForBooking}
        currentUser={currentUser}
        onClose={() => setSelectedLawyerForBooking(null)}
        onSuccess={() => {
          showToast(`Consultation successfully requested with ${selectedLawyerForBooking?.name}!`);
        }}
      />

      {/* 5. File New Case Modal */}
      <FileNewCaseModal
        currentUser={currentUser}
        isOpen={isFileCaseModalOpen}
        onClose={() => setIsFileCaseModalOpen(false)}
        onCaseFiled={handleCaseFiled}
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
      />

      {/* 7. Consultations Manager Modal */}
      <ConsultationsManagerModal
        currentUser={currentUser}
        isOpen={isConsultationsModalOpen}
        onClose={() => setIsConsultationsModalOpen(false)}
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
      />

      {/* Footer with Terms, Privacy, Refund, and Contact Modals */}
      <Footer currentLanguage={currentLanguage} />

    </div>
  );
}
