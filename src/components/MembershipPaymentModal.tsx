import React, { useState } from 'react';
import { X, Crown, CheckCircle2, ShieldCheck, ArrowRight, CreditCard, QrCode, Building, Clock, Receipt, Download, Sparkles, AlertCircle } from 'lucide-react';
import { User, PaymentInvoice } from '../types';

interface MembershipPaymentModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (updatedUser: User, invoice: PaymentInvoice) => void;
}

export const MembershipPaymentModal: React.FC<MembershipPaymentModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const isLawyer = currentUser.role === 'lawyer';
  const planFee = isLawyer ? 3999 : 2999;
  const planPeriod = isLawyer ? 'month' : 'year';
  const planTitle = isLawyer ? 'Advocate Practice Subscription' : 'Annual Client Justice Pass';

  const basePrice = Math.round((planFee / 1.18) * 100) / 100;
  const gstTax = Math.round((planFee - basePrice) * 100) / 100;

  const [step, setStep] = useState<'review' | 'payment_method' | 'processing' | 'success'>('review');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState<string>(currentUser.email.split('@')[0] + '@okhdfcbank');
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvv, setCardCvv] = useState<string>('742');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [completedInvoice, setCompletedInvoice] = useState<PaymentInvoice | null>(null);

  if (!isOpen) return null;

  const handleStartPayment = () => {
    setStep('payment_method');
  };

  const handleConfirmAndPay = async () => {
    setStep('processing');

    try {
      const paymentMethodName = 
        selectedMethod === 'upi' ? `UPI (${upiId})` :
        selectedMethod === 'card' ? 'Credit/Debit Card (Visa ending in 8821)' :
        `Net Banking (${selectedBank})`;

      const res = await fetch('/api/membership/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: `ORD_${Date.now()}`,
          paymentMethod: paymentMethodName,
          transactionId: `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
        }),
      });

      const data = await res.json();

      setTimeout(() => {
        if (data.success) {
          setCompletedInvoice(data.invoice);
          setStep('success');
          onPaymentSuccess(data.user, data.invoice);
        } else {
          alert('Payment verification failed. Please retry.');
          setStep('payment_method');
        }
      }, 1500);
    } catch (err) {
      console.error('Payment failure:', err);
      setStep('payment_method');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden text-slate-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-gradient-to-r from-red-950/70 via-zinc-900 to-red-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-cinzel">
                JusticeBridge Membership Portal
              </h3>
              <p className="text-xs text-red-300">
                {isLawyer ? 'Advocate Practice Subscription (₹3,999/month)' : 'Client Justice Pass (₹2,999/year)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {/* STEP 1: REVIEW PLAN */}
          {step === 'review' && (
            <div className="space-y-6">
              
              {/* Membership Card Visual */}
              <div className="p-6 rounded-2xl bg-zinc-900 border border-red-900/60 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Crown className="w-16 h-16 text-amber-400/10 pointer-events-none" />
                </div>

                <div className="flex items-center space-x-2 text-xs uppercase font-extrabold tracking-wider text-amber-400 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isLawyer ? 'Advocate Tier' : 'Client Tier'}</span>
                </div>

                <h4 className="text-2xl font-black text-white font-cinzel mb-1">
                  {planTitle}
                </h4>

                <div className="flex items-baseline space-x-2 my-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">
                    ₹{planFee.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-semibold text-slate-300">
                    / {planPeriod} (Inclusive of 18% GST)
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-lg mb-4">
                  {isLawyer
                    ? 'Advocates/Lawyers pay ₹3,999 per month to access verified case discovery, unlimited case files, and court cause-list sync.'
                    : 'Clients pay ₹2,999 per year for complete isolated case tracking, encrypted document vault, and priority advocate consultations.'}
                </p>

                {/* Features Checklist */}
                <div className="pt-4 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                  {isLawyer ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Rule 1: Full Case Vault Access</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Cause-List Schedule Sync</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>AI Delay Mitigation Engine</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Verified Practice Standing Badge</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Rule 2: Isolated Case Workspace</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Direct Advocate Consultations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Encrypted Evidence Storage</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Delay Reduction Telemetry</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Base Subscription Fee:</span>
                  <span className="font-mono text-slate-200">₹{basePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Goods & Services Tax (18% IGST):</span>
                  <span className="font-mono text-slate-200">₹{gstTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between font-bold text-sm">
                  <span className="text-white">Total Payable Amount:</span>
                  <span className="font-mono text-amber-400">₹{planFee.toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              <button
                id="btn-proceed-to-pay"
                onClick={handleStartPayment}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-900/40 flex items-center justify-center space-x-2 active:scale-95 transition-all"
              >
                <span>Proceed to Payment (₹{planFee.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

          {/* STEP 2: PAYMENT METHOD SELECTION */}
          {step === 'payment_method' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white font-cinzel mb-1">
                  Select Payment Method
                </h4>
                <p className="text-xs text-slate-400">
                  Instant activation via NPCI Unified Payments Interface, Cards, or Net Banking.
                </p>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    selectedMethod === 'upi'
                      ? 'bg-red-950/80 border-red-600 text-white shadow-md'
                      : 'bg-zinc-900 border-zinc-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1 text-red-400" />
                  <span className="text-xs font-bold block">UPI / QR</span>
                </button>

                <button
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    selectedMethod === 'card'
                      ? 'bg-red-950/80 border-red-600 text-white shadow-md'
                      : 'bg-zinc-900 border-zinc-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-red-400" />
                  <span className="text-xs font-bold block">Card</span>
                </button>

                <button
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    selectedMethod === 'netbanking'
                      ? 'bg-red-950/80 border-red-600 text-white shadow-md'
                      : 'bg-zinc-900 border-zinc-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building className="w-5 h-5 mx-auto mb-1 text-red-400" />
                  <span className="text-xs font-bold block">Net Banking</span>
                </button>
              </div>

              {/* UPI Form */}
              {selectedMethod === 'upi' && (
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-red-400">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Instant UPI VPA / QR</span>
                      <span className="text-[11px] text-slate-400">Google Pay, PhonePe, Paytm, BHIM UPI</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Enter Virtual Payment Address (VPA)</label>
                    <input
                      type="text"
                      id="upi-vpa-input"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-mono outline-none focus:border-red-600"
                    />
                  </div>
                </div>
              )}

              {/* Card Form */}
              {selectedMethod === 'card' && (
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-mono outline-none focus:border-red-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-mono outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-mono outline-none focus:border-red-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Netbanking Form */}
              {selectedMethod === 'netbanking' && (
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <label className="text-xs text-slate-400 block mb-1">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs outline-none focus:border-red-600"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setStep('review')}
                  className="w-1/3 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-300 font-semibold text-xs border border-zinc-800"
                >
                  Back
                </button>
                <button
                  id="btn-confirm-pay"
                  onClick={handleConfirmAndPay}
                  className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-900/40 active:scale-95 transition-all"
                >
                  Pay ₹{planFee.toLocaleString('en-IN')} Now
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: PROCESSING LOADER */}
          {step === 'processing' && (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h4 className="text-lg font-bold text-white font-cinzel">
                Authenticating Payment with NPCI Gateway...
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Verifying bank settlement, issuing GST tax invoice, and updating tenant access permissions.
              </p>
            </div>
          )}

          {/* STEP 4: PAYMENT SUCCESS & INVOICE RECEIPT */}
          {step === 'success' && completedInvoice && (
            <div className="space-y-6">
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-950/60">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-2xl font-bold text-white font-cinzel">
                  Payment Successful & Membership Activated!
                </h4>
                <p className="text-xs text-emerald-300 mt-1 font-medium">
                  {isLawyer
                    ? 'Advocate Practice Subscription (₹3,999/mo) is now active.'
                    : 'Annual Client Justice Pass (₹2,999/yr) is now active.'}
                </p>
              </div>

              {/* Tax Invoice Box */}
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div>
                    <span className="font-bold text-white uppercase text-xs block">Official Tax Invoice</span>
                    <span className="text-[11px] text-red-400">{completedInvoice.invoiceNumber}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold">
                    PAID
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Billed To:</span>
                    <span className="font-bold text-slate-200">{completedInvoice.userName}</span>
                    <span className="text-slate-400 block text-[10px]">{currentUser.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Transaction ID:</span>
                    <span className="text-slate-300 truncate block">{completedInvoice.transactionId}</span>
                  </div>
                </div>

                <div className="py-2 border-y border-zinc-800 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>{completedInvoice.planName} ({completedInvoice.planDuration})</span>
                    <span>₹{completedInvoice.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>GST (18% IGST)</span>
                    <span>₹{completedInvoice.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-white font-bold pt-1 border-t border-zinc-800">
                    <span>Total Amount Paid:</span>
                    <span className="text-amber-400">₹{completedInvoice.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Issued by JusticeBridge Judicial Services Ltd.</span>
                  <span>GSTIN: 07AAACJ8821M1ZB</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => alert(`Downloaded Official Tax Invoice: ${completedInvoice.invoiceNumber}.pdf`)}
                  className="flex items-center justify-center space-x-2 w-1/2 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-300 font-semibold text-xs border border-zinc-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Invoice</span>
                </button>
                <button
                  id="btn-membership-done"
                  onClick={onClose}
                  className="flex items-center justify-center space-x-2 w-1/2 py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 text-white font-bold text-xs shadow-lg"
                >
                  <span>Done & Return</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
