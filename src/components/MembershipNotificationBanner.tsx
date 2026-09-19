import React, { useState } from 'react';
import { Crown, ArrowRight, CheckCircle2, Clock, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { User, PaymentInvoice } from '../types';
import { getTranslation } from '../languages';

interface MembershipNotificationBannerProps {
  currentUser: User;
  onOpenPaymentModal: () => void;
  onAutoPayTriggered?: (user: User, invoice: PaymentInvoice) => void;
  currentLanguage?: string;
}

export const MembershipNotificationBanner: React.FC<MembershipNotificationBannerProps> = ({
  currentUser,
  onOpenPaymentModal,
  onAutoPayTriggered,
  currentLanguage = 'en',
}) => {
  const [testingAutopay, setTestingAutopay] = useState(false);
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null);

  if (!currentUser) return null;
  const isLawyer = currentUser?.role === 'lawyer';
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLanguage, key);

  const trialDaysRemaining = currentUser.trialDaysRemaining ?? 21;
  const isTrialActive = currentUser.isTrialActive ?? (trialDaysRemaining > 0);
  const mandateActive = currentUser.autoPaymentMandateActive ?? true;
  const planFee = isLawyer ? 5999 : 2999;
  const planTitle = isLawyer ? 'Advocate Practice Subscription' : 'Annual Client Justice Pass';

  const handleSimulateDay22 = async () => {
    try {
      setTestingAutopay(true);
      const res = await fetch('/api/membership/trigger-day22-autopay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setTestSuccessMessage(`Success! Day 22 auto-debit executed. Invoice ${data.invoice.invoiceNumber} issued.`);
        if (onAutoPayTriggered) {
          onAutoPayTriggered(data.user, data.invoice);
        }
        setTimeout(() => setTestSuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error('Failed to trigger day 22 autopay:', err);
    } finally {
      setTestingAutopay(false);
    }
  };

  // If already transitioned to full paid subscription (non-trial)
  if (currentUser.membershipActive && !isTrialActive) {
    return (
      <div 
        id="membership-active-banner"
        className="bg-gradient-to-r from-emerald-50 via-white to-slate-50 border-b border-emerald-200/80 py-2.5 px-4 text-xs shadow-xs"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-emerald-900 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>{t('activeMembership')}:</strong>{' '}
              <span className="font-bold text-slate-900">{planTitle} (₹{planFee.toLocaleString('en-IN')}/year)</span>
            </span>
            <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
              Auto-Pay Mandate Active
            </span>
          </div>

          <div className="flex items-center space-x-3 text-slate-600 font-medium">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>
                Next Auto-Renewal: {currentUser.membershipExpiresAt ? new Date(currentUser.membershipExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '1 Year Active'}
              </span>
            </div>
            <button
              onClick={onOpenPaymentModal}
              className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline underline-offset-2 ml-2 cursor-pointer"
            >
              Subscription Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 21-Day Free Trial & Auto-Payment Banner (Executive Prestige Light)
  return (
    <aside 
      id="membership-notification-banner"
      aria-label="21-Day Trial & Auto-Payment Status"
      className="bg-gradient-to-r from-amber-50/95 via-white to-sky-50/70 border-b border-amber-200/90 py-3 px-4 shadow-xs transition-all text-slate-900"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        
        {/* Left Side: 21-Day Free Trial Countdown & Mandate Details */}
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center flex-shrink-0 shadow-xs">
            <Crown className="w-5 h-5 text-amber-700" />
          </div>
          
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider bg-amber-500 text-white rounded-md shadow-xs">
                <span>✨ 21-Day Free Trial</span>
              </span>

              <span className="px-2 py-0.5 text-[11px] font-bold bg-slate-900 text-white rounded-md">
                Day {Math.min(21, Math.max(1, 21 - trialDaysRemaining + 1))} of 21 ({trialDaysRemaining} Days Left)
              </span>

              {mandateActive ? (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Auto-Pay Mandate Verified (₹0 Charged Today)</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 rounded-md">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Mandate Setup Required</span>
                </span>
              )}

              <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
                {isLawyer ? 'Advocate Account' : 'Client Litigant Account'}
              </span>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-700 mt-1 leading-relaxed font-normal">
              {isLawyer ? (
                <span>
                  <strong>Advocate Practice All-Access Trial:</strong> Full case files, verified client intake, and cause-list sync unlocked. Auto-payment of <strong>₹5,999/year</strong> initiates on <strong>Day 22</strong> via your registered mandate.
                </span>
              ) : (
                <span>
                  <strong>Client Litigant All-Access Trial:</strong> Complete case tracker, encrypted vault, and advocate consultations unlocked. Auto-payment of <strong>₹2,999/year</strong> initiates on <strong>Day 22</strong> via your registered mandate.
                </span>
              )}
            </p>

            {testSuccessMessage && (
              <p className="text-xs font-bold text-emerald-700 mt-1 animate-in fade-in">
                {testSuccessMessage}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end flex-shrink-0 pt-2 lg:pt-0">
          
          {/* Quick tester shortcut button to test Day 22 auto-payment right away */}
          <button
            id="btn-test-day22-autopay"
            onClick={handleSimulateDay22}
            disabled={testingAutopay}
            title="Tester shortcut: Immediately simulates Day 22 auto-debit and generates verified invoice"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>{testingAutopay ? 'Processing...' : 'Simulate Day 22 Auto-Debit'}</span>
          </button>

          {/* Primary Action Button */}
          <button
            id="btn-banner-pay-now"
            onClick={onOpenPaymentModal}
            className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>{mandateActive ? 'Manage Mandate & Plan' : 'Setup Auto-Payment Mandate'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
};
