import React, { useState, useEffect } from 'react';
import { X, Crown, CheckCircle2, ShieldCheck, ArrowRight, CreditCard, QrCode, Building, Clock, Receipt, Download, Sparkles, AlertCircle, Zap, RefreshCw } from 'lucide-react';
import { User, PaymentInvoice } from '../types';
import { getTranslation } from '../languages';

interface MembershipPaymentModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (updatedUser: User, invoice: PaymentInvoice) => void;
  currentLanguage?: string;
}

export const MembershipPaymentModal: React.FC<MembershipPaymentModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onPaymentSuccess,
  currentLanguage = 'en',
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLanguage, key);
  const isLawyer = currentUser?.role === 'lawyer';
  const planFee = isLawyer ? 5999 : 2999;
  const planTitle = isLawyer ? 'Advocate Practice Subscription' : 'Annual Client Justice Pass';

  const basePrice = Math.round((planFee / 1.18) * 100) / 100;
  const gstTax = Math.round((planFee - basePrice) * 100) / 100;

  // Tabs: 'mandate' (Option A: 21-Day Trial AutoPay) | 'immediate' (Pay now) | 'invoices'
  const [activeTab, setActiveTab] = useState<'mandate' | 'immediate' | 'invoices'>('mandate');
  
  // Mandate setup form
  const [mandateType, setMandateType] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiVpa, setUpiVpa] = useState<string>((currentUser?.email || 'user@justicebridge.in').split('@')[0] + '@okhdfcbank');
  const [cardHolder, setCardHolder] = useState<string>(currentUser?.name || 'Advocate / Litigant');
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Invoices list
  const [invoicesList, setInvoicesList] = useState<PaymentInvoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchInvoices();
    }
  }, [isOpen]);

  const fetchInvoices = async () => {
    try {
      setLoadingInvoices(true);
      const res = await fetch('/api/membership/status');
      const data = await res.json();
      if (data.invoices) {
        setInvoicesList(data.invoices);
      }
    } catch (err) {
      console.warn('Failed to load invoices:', err);
    } finally {
      setLoadingInvoices(false);
    }
  };

  if (!isOpen || !currentUser) return null;

  const trialDaysRemaining = currentUser.trialDaysRemaining ?? 21;
  const isTrialActive = currentUser.isTrialActive ?? (trialDaysRemaining > 0);
  const mandateActive = currentUser.autoPaymentMandateActive ?? true;

  // Handle Option A Mandate Registration
  const handleSaveMandate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const mandateDetailText = 
      mandateType === 'upi' ? `UPI AutoPay (${upiVpa})` :
      mandateType === 'card' ? `Card e-Mandate (${cardHolder} - ending 8821)` :
      `e-NACH Mandate (${selectedBank})`;

    try {
      const res = await fetch('/api/membership/setup-mandate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mandateMethod: mandateType === 'upi' ? 'upi_autopay' : mandateType === 'card' ? 'card_mandate' : 'netbanking_emandate',
          mandateDetails: mandateDetailText
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        setFeedback({
          type: 'success',
          message: data.message || 'Auto-Payment Mandate successfully registered!'
        });
        onPaymentSuccess(data.user, null as any);
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to setup mandate.'
        });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error while registering mandate.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle Cancel Mandate
  const handleCancelMandate = async () => {
    if (!confirm('Are you sure you want to cancel your auto-payment mandate? On Day 22 your account will pause unless renewed.')) {
      return;
    }
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/membership/cancel-mandate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success && data.user) {
        setFeedback({ type: 'success', message: data.message });
        onPaymentSuccess(data.user, null as any);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to cancel mandate.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle Day 22 Auto-debit Simulation
  const handleSimulateDay22Debit = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/membership/trigger-day22-autopay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success && data.user && data.invoice) {
        setFeedback({
          type: 'success',
          message: `Day 22 Auto-Payment executed! Invoice ${data.invoice.invoiceNumber} created.`
        });
        setInvoicesList(prev => [data.invoice, ...prev]);
        onPaymentSuccess(data.user, data.invoice);
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to execute auto-payment simulation.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error executing test auto-payment.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle Immediate Upfront Payment
  const handlePayImmediate = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/membership/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: `ORD_MANUAL_${Date.now()}`,
          paymentMethod: 'Instant UPI / Card Payment',
          transactionId: `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: 'success',
          message: `${planTitle} activated immediately! Tax invoice issued.`
        });
        setInvoicesList(prev => [data.invoice, ...prev]);
        onPaymentSuccess(data.user, data.invoice);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Payment processing error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-slate-900 max-h-[92vh] flex flex-col">
        
        {/* Header - Executive Navy Style */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-cinzel">
                JusticeBridge Membership & Mandate Portal
              </h3>
              <p className="text-xs text-amber-300">
                21-Day All-Access Free Trial • Option A: Automated Day 22 Mandate
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('mandate')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'mandate'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ✨ 21-Day Trial & AutoPay Mandate
          </button>

          <button
            onClick={() => setActiveTab('immediate')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'immediate'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            💳 Pay Annual Pass Now
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'invoices'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🧾 Invoices ({invoicesList.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-5">
          
          {feedback && (
            <div className={`p-3.5 rounded-xl text-xs font-medium flex items-center space-x-2 ${
              feedback.type === 'success' 
                ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border border-rose-300 text-rose-900'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* TAB 1: 21-DAY TRIAL & MANDATE SETTINGS */}
          {activeTab === 'mandate' && (
            <div className="space-y-5">
              
              {/* Timeline Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/80 via-white to-sky-50/60 border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>21-Day Free Trial Breakdown</span>
                  </div>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 rounded-md">
                    {trialDaysRemaining} Days Remaining
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-2.5">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${Math.max(5, ((21 - trialDaysRemaining) / 21) * 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                    <div className="text-slate-500 font-medium">Days 1 - 21 (Current)</div>
                    <div className="text-base font-extrabold text-emerald-700 font-mono mt-0.5">₹0 Charged</div>
                    <div className="text-[11px] text-slate-600 mt-1">Full access to verified legal directory, case files, and court tools.</div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                    <div className="text-slate-500 font-medium">Day 22 (Auto-Debit)</div>
                    <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">₹{planFee.toLocaleString('en-IN')} / year</div>
                    <div className="text-[11px] text-slate-600 mt-1">Inclusive of 18% GST. Automatically debited via verified mandate.</div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-600 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Zero Risk Policy:</strong> Cancel your mandate anytime before Day 22 with 1-click and you will never be charged.</span>
                </div>
              </div>

              {/* Current Mandate Status Panel */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Active Auto-Payment Mandate Status
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {mandateActive ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 inline" /> {currentUser.mandateDetails || 'UPI AutoPay Verified'}
                        </span>
                      ) : (
                        <span className="text-rose-600 font-semibold">No active mandate (Registration pending)</span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {mandateActive && (
                      <button
                        type="button"
                        onClick={handleCancelMandate}
                        disabled={loading}
                        className="px-2.5 py-1 text-xs text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-rose-200 rounded-lg cursor-pointer"
                      >
                        Cancel AutoPay
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={handleSimulateDay22Debit}
                      disabled={loading}
                      title="Tester shortcut to execute Day 22 auto-debit now"
                      className="flex items-center space-x-1 px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow-xs cursor-pointer"
                    >
                      <Zap className="w-3 h-3" />
                      <span>{loading ? 'Processing...' : 'Test Day 22 Debit'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mandate Registration Form */}
              <form onSubmit={handleSaveMandate} className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Update / Register Auto-Payment Method
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMandateType('upi')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      mandateType === 'upi'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-bold block">UPI AutoPay</span>
                    <span className="text-[10px] opacity-80">GPay, PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMandateType('card')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      mandateType === 'card'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-bold block">Card e-Mandate</span>
                    <span className="text-[10px] opacity-80">RuPay, Visa, MC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMandateType('netbanking')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      mandateType === 'netbanking'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-bold block">e-NACH</span>
                    <span className="text-[10px] opacity-80">Net Banking</span>
                  </button>
                </div>

                {/* Sub-inputs according to mandateType */}
                {mandateType === 'upi' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      UPI VPA / ID for AutoPay Authorization
                    </label>
                    <input
                      type="text"
                      value={upiVpa}
                      onChange={(e) => setUpiVpa(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                      required
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      A ₹0 / ₹1 authorization mandate request will be confirmed on your UPI app.
                    </p>
                  </div>
                )}

                {mandateType === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Valid Thru</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {mandateType === 'netbanking' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Select Bank for e-NACH Mandate</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
                >
                  {loading ? 'Registering Mandate...' : 'Authorize Auto-Payment Mandate (₹0 Today)'}
                </button>
              </form>

            </div>
          )}

          {/* TAB 2: IMMEDIATE UPFRONT PAYMENT */}
          {activeTab === 'immediate' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900">{planTitle}</h4>
                <div className="text-2xl font-black text-slate-900 font-mono my-2">
                  ₹{planFee.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">/ year</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Base Annual Subscription:</span>
                    <span className="font-mono">₹{basePrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span className="font-mono">₹{gstTax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1 mt-1">
                    <span>Total Amount Payable:</span>
                    <span className="font-mono">₹{planFee.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePayImmediate}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
              >
                {loading ? 'Processing Payment...' : `Pay ₹${planFee.toLocaleString('en-IN')} Right Now`}
              </button>
            </div>
          )}

          {/* TAB 3: INVOICES LIST */}
          {activeTab === 'invoices' && (
            <div className="space-y-3">
              {loadingInvoices ? (
                <div className="py-8 text-center text-xs text-slate-500">Loading invoices...</div>
              ) : invoicesList.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                  <Receipt className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No invoices generated yet.</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Your first invoice will be generated when Day 22 auto-payment completes, or when paid upfront.
                  </p>
                </div>
              ) : (
                invoicesList.map((inv) => (
                  <div key={inv.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-900">{inv.invoiceNumber}</span>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-md border border-emerald-300">
                        {inv.status}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-600">{inv.planName}</span>
                      <span className="font-bold text-slate-900 font-mono text-sm">₹{inv.totalAmount.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      <span>Method: {inv.paymentMethod}</span>
                      <span>{new Date(inv.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span>256-Bit Bank Grade Encryption • Razorpay & NPCI Certified</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
