import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, FileCheck, Building, Sparkles, Lock } from 'lucide-react';
import { User } from '../types';

interface BarVerificationModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess: (updatedUser: User) => void;
}

export const BarVerificationModal: React.FC<BarVerificationModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onVerificationSuccess,
}) => {
  const [barNumber, setBarNumber] = useState<string>(
    currentUser.barCouncilNumber?.replace(' (Verification In Progress)', '') || 'MH/9921/2023'
  );
  const [stateBar, setStateBar] = useState<string>(
    currentUser.stateBarCouncil || 'Bar Council of Maharashtra & Goa'
  );
  const [yearOfEnrollment, setYearOfEnrollment] = useState<string>('2023');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const stateBars = [
    'Bar Council of Delhi',
    'Bar Council of Maharashtra & Goa',
    'Karnataka State Bar Council',
    'Bar Council of Tamil Nadu & Puducherry',
    'Bar Council of West Bengal',
    'Bar Council of Uttar Pradesh',
    'Bar Council of Punjab & Haryana'
  ];

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/lawyers/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lawyerId: currentUser.id,
          barCouncilNumber: barNumber,
          stateBarCouncil: stateBar,
        }),
      });

      const data = await res.json();
      setTimeout(() => {
        setLoading(false);
        if (data.success) {
          setSuccess(true);
          onVerificationSuccess(data.user);
        }
      }, 1000);
    } catch (err) {
      console.error('Verification failed:', err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 text-slate-200">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!success ? (
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-700 to-red-950 border border-red-600/60 flex items-center justify-center mb-4 shadow-lg">
              <ShieldCheck className="w-7 h-7 text-red-200" />
            </div>

            <h3 className="text-xl font-bold text-white font-cinzel mb-1">
              Bar Council of India Verification
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Complete instant digital e-KYC to authenticate your practice credentials and unlock confidential case discovery vaults (Security Rule 1).
            </p>

            <form onSubmit={handleVerify} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">State Bar Council</label>
                <select
                  value={stateBar}
                  onChange={(e) => setStateBar(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-red-600"
                >
                  {stateBars.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Bar Council Enrollment Number</label>
                <input
                  type="text"
                  value={barNumber}
                  onChange={(e) => setBarNumber(e.target.value)}
                  placeholder="e.g. D/1482/2011 or MH/9921/2023"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono outline-none focus:border-red-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Year of Enrollment</label>
                  <input
                    type="text"
                    value={yearOfEnrollment}
                    onChange={(e) => setYearOfEnrollment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Aadhaar e-Sign Hash</label>
                  <input
                    type="text"
                    value="UIDAI-7821-OK"
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-slate-500 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-[11px] text-red-300 leading-snug">
                <strong>Security Enforcement Rule 1:</strong> Verification grants immediate privileges to inspect confidential litigation pleadings, Section 65B forensic exhibits, and trial affidavits.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 text-white font-bold text-xs shadow-xl border border-red-600/40 transition-all"
              >
                {loading ? 'Authenticating with Bar Council e-Registry...' : 'Submit & Verify Credentials'}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/60">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <h4 className="text-2xl font-bold text-white font-cinzel">
              Advocate Verification Approved!
            </h4>

            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Your credentials (<span className="font-mono text-emerald-400">{barNumber}</span>) have been verified against the {stateBar}. Rule 1 full case files access is now active.
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-red-900 hover:bg-red-800 text-white font-bold text-xs border border-red-700 shadow-md"
            >
              Access Verified Case Files Now
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
