import React, { useState } from 'react';
import { Scale, ShieldCheck, Lock, FileText, HelpCircle, Mail, MapPin, X, ExternalLink } from 'lucide-react';
import { getTranslation } from '../languages';

interface FooterProps {
  currentLanguage?: string;
}

export const Footer: React.FC<FooterProps> = ({ currentLanguage = 'en' }) => {
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | 'refund' | 'contact' | null>(null);
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLanguage, key);

  return (
    <>
      <footer className="mt-20 border-t border-zinc-800 bg-zinc-950/90 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400">
                  <Scale className="w-4 h-4" />
                </div>
                <span className="text-base font-bold text-white tracking-wider font-cinzel">
                  JUSTICE<span className="text-red-500">BRIDGE</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                {t('heroSubtitle')}
              </p>
              <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-bit Encrypted</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tenant Isolated</span>
                </span>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
                {t('platformServices')}
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li><span>{t('verifiedAdvocatesDir')}</span></li>
                <li><span>{t('nationalCaseRegistry')}</span></li>
                <li><span>{t('multiTenantVault')}</span></li>
                <li><span>{t('automatedNoticeGen')}</span></li>
                <li><span>{t('aiStatutoryCounsel')}</span></li>
              </ul>
            </div>

            {/* Compliance & Legal */}
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
                {t('legalCompliance')}
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveModal('terms')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {t('terms')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('privacy')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {t('privacy')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('refund')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {t('refunds')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('contact')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {t('grievanceContact')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
                {t('merchantSupport')}
              </h4>
              <div className="space-y-2.5 text-slate-400">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <a href="mailto:srijenponugoti667@gmail.com" className="text-white hover:text-red-300 select-all transition-colors">
                    srijenponugoti667@gmail.com
                  </a>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>JusticeBridge Legal Technologies, India</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              {t('copyright')}
            </p>
            <p className="text-center sm:text-right max-w-md text-[10px] text-slate-600">
              Bar Council of India compliance: This platform does not advertise or solicit briefs. All advocate profiles and legal services adhere strictly to the Advocates Act 1961 and Rule 36 of BCI Rules.
            </p>
          </div>
        </div>
      </footer>

      {/* MODAL POPUPS FOR COMPLIANCE POLICIES */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 text-slate-300 shadow-2xl">
            
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-slate-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Terms Modal */}
            {activeModal === 'terms' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-1 font-cinzel">Terms & Conditions</h3>
                <p className="text-xs text-slate-500 mb-4">Last Updated: August 2026</p>
                <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                  <p>
                    <strong>1. Platform Nature:</strong> JusticeBridge is a cloud-based legal technology and case tracking SaaS application designed to facilitate secure workflow collaboration between independent advocates and litigants.
                  </p>
                  <p>
                    <strong>2. Bar Council of India Compliance:</strong> In strict compliance with the Advocates Act, 1961 and Bar Council of India (BCI) rules, JusticeBridge does not engage in touting, lawyer advertising, or soliciting legal work. Listing is restricted to advocates with authenticated enrollment numbers.
                  </p>
                  <p>
                    <strong>3. User Accounts & Subscriptions:</strong> Annual client memberships (₹2,999/yr) and advocate practice plans (₹3,999/mo) unlock digital discovery, case CNR alerts, and vault access. All prices include applicable 18% Goods and Services Tax (GST).
                  </p>
                  <p>
                    <strong>4. Limitation of Liability:</strong> Legal advice rendered during advocate consultations is solely the responsibility of the verified practitioner. JusticeBridge does not guarantee specific court outcomes.
                  </p>
                </div>
              </div>
            )}

            {/* Privacy Modal */}
            {activeModal === 'privacy' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-1 font-cinzel">Privacy Policy & Data Security</h3>
                <p className="text-xs text-slate-500 mb-4">Compliant with Digital Personal Data Protection (DPDP) Act 2023</p>
                <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                  <p>
                    <strong>1. Multi-Tenant Zero-Knowledge Isolation:</strong> All client records, case briefs, and uploaded discovery files are isolated by cryptographic tenant boundaries. No third party or other client can query your matters.
                  </p>
                  <p>
                    <strong>2. Data Encryption:</strong> All files and database transmissions utilize TLS 1.3 in transit and AES-256 at rest.
                  </p>
                  <p>
                    <strong>3. Advocate Vault Access Gate:</strong> In accordance with client confidentiality rules, confidential evidence files can only be accessed by authenticated Bar Council verified advocates assigned to the specific case matter.
                  </p>
                  <p>
                    <strong>4. Payment Data:</strong> JusticeBridge does not store credit/debit card numbers or UPI PINs. All payment transactions are securely processed via Razorpay’s PCI-DSS Level 1 compliant gateway.
                  </p>
                </div>
              </div>
            )}

            {/* Refund Modal */}
            {activeModal === 'refund' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-1 font-cinzel">Cancellation & Refund Policy</h3>
                <p className="text-xs text-slate-500 mb-4">Clear & Transparent Refund Guarantees</p>
                <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                  <p>
                    <strong>1. Membership Subscriptions:</strong> If you purchase an Annual Client Justice Pass (₹2,999) or Advocate Practice Plan (₹3,999) and have not utilized any legal consultations or filed active matters, you are eligible for a <strong>100% full refund within 7 days</strong> of purchase.
                  </p>
                  <p>
                    <strong>2. Advocate Consultations:</strong> If an advocate cancels or misses a scheduled consultation booking, the full consultation fee is automatically refunded to the client’s source payment method.
                  </p>
                  <p>
                    <strong>3. Refund Processing Timeline:</strong> Approved refunds are initiated immediately via Razorpay and credited to your original bank account/UPI within <strong>5 to 7 business days</strong>.
                  </p>
                  <p>
                    <strong>4. Refund Requests:</strong> To request a cancellation, email <strong>srijenponugoti667@gmail.com</strong> with your Invoice Number or Transaction ID.
                  </p>
                </div>
              </div>
            )}

            {/* Contact Modal */}
            {activeModal === 'contact' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-1 font-cinzel">Contact Us & Grievance Redressal</h3>
                <p className="text-xs text-slate-500 mb-4">Official Merchant & Support Details</p>
                <div className="space-y-4 text-xs leading-relaxed text-slate-300 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Merchant / Legal Entity Name:</span>
                    <strong className="text-white text-sm">JusticeBridge Legal Technologies</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Grievance Officer:</span>
                    <strong className="text-white">Srijen Ponugoti</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Primary Contact Email / Grievance Desk:</span>
                    <a href="mailto:srijenponugoti667@gmail.com" className="text-red-400 font-semibold underline text-sm">
                      srijenponugoti667@gmail.com
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Operational Hours & Turnaround Time:</span>
                    <p className="text-slate-300 mt-0.5">Mon – Sat, 9:00 AM – 6:00 PM IST. All customer inquiries and refund tickets are acknowledged and resolved within 24–48 business hours.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-zinc-800 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
