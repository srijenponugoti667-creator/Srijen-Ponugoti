import React from 'react';
import { Crown, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { User } from '../types';
import { getTranslation } from '../languages';

interface MembershipNotificationBannerProps {
  currentUser: User;
  onOpenPaymentModal: () => void;
  currentLanguage?: string;
}

export const MembershipNotificationBanner: React.FC<MembershipNotificationBannerProps> = ({
  currentUser,
  onOpenPaymentModal,
  currentLanguage = 'en',
}) => {
  const isLawyer = currentUser.role === 'lawyer';
  const isActive = currentUser.membershipActive;
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLanguage, key);

  if (isActive) {
    return (
      <div className="bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-emerald-950/80 border-b border-emerald-800/40 py-2.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>{t('activeMembership')}:</strong>{' '}
              <span className="font-semibold text-white">
                {isLawyer ? 'Advocate Practice Subscription (₹3,999/month)' : 'Annual Client Justice Pass (₹2,999/year)'}
              </span>
            </span>
          </div>
          <div className="flex items-center space-x-2 text-emerald-300/80 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Expires: {currentUser.membershipExpiresAt ? new Date(currentUser.membershipExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Active'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Active notification for unpaid members per exact rules
  return (
    <aside 
      id="membership-notification-banner"
      aria-label="Membership Notification"
      className="bg-gradient-to-r from-zinc-950 via-red-950 to-zinc-950 border-b border-red-900/60 py-3 px-4 shadow-xl transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left Side: Exact Prompt Notification Message */}
        <div className="flex items-start sm:items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 shadow-inner">
            <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-red-950 text-red-200 rounded-md border border-red-800">
                {t('membershipNotification')}
              </span>
              <span className="text-xs font-semibold text-red-200 hidden sm:inline">
                {isLawyer ? t('advocateAccount') : t('clientAccount')}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-100 mt-1 leading-relaxed">
              {isLawyer ? t('advocateMembershipMsg') : t('clientMembershipMsg')}
            </p>
          </div>
        </div>

        {/* Right Side: CTA Button */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <button
            id="btn-banner-pay-now"
            onClick={onOpenPaymentModal}
            className="w-full md:w-auto flex items-center justify-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-900/40 hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>{isLawyer ? t('payAdvocateFeeBtn') : t('payClientFeeBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
};

