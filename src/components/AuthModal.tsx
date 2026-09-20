import React, { useState } from 'react';
import { X, Scale, User as UserIcon, Briefcase, Mail, Phone, Lock, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { User, UserRole } from '../types';
import { getTranslation } from '../languages';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  availablePersonas: User[];
  onSwitchPersona: (userId: string) => void;
  currentLanguage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  availablePersonas,
  onSwitchPersona,
  currentLanguage = 'en',
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLanguage, key);
  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [role, setRole] = useState<UserRole>('client');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [barCouncilNumber, setBarCouncilNumber] = useState('');
  const [stateBarCouncil, setStateBarCouncil] = useState('Bar Council of Delhi');
  const [practiceLocation, setPracticeLocation] = useState('Delhi High Court & Supreme Court');
  const [yearsExperience, setYearsExperience] = useState('5');
  const [consultationFee, setConsultationFee] = useState('2500');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError('Please provide your name and email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role,
          barCouncilNumber: role === 'lawyer' ? barCouncilNumber.trim() : undefined,
          stateBarCouncil: role === 'lawyer' ? stateBarCouncil : undefined,
          practiceLocation: role === 'lawyer' ? practiceLocation : undefined,
          yearsExperience: role === 'lawyer' ? Number(yearsExperience) : undefined,
          consultationFee: role === 'lawyer' ? Number(consultationFee) : undefined,
          bio: role === 'lawyer' ? bio.trim() : undefined,
          specialization: role === 'lawyer' ? ['Commercial Dispute', 'Constitutional Writ'] : undefined
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        onAuthSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Failed to register. Please retry.');
      }
    } catch (err) {
      setError('Network error while registering account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-slate-900 max-h-[92vh] flex flex-col">
        
        {/* Header - Executive Light Theme */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-cinzel">
                JusticeBridge Account Portal
              </h3>
              <p className="text-xs text-amber-300">
                Judicial Authentication & 21-Day All-Access Registration
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

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2">
          <button
            onClick={() => setTab('register')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              tab === 'register'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Register New Account
          </button>
          <button
            onClick={() => setTab('login')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              tab === 'login'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Quick Persona Switch
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          {tab === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Option A: 21-Day Free Trial Highlight */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 via-white to-sky-50 border border-amber-200 text-xs">
                <div className="flex items-center space-x-2 text-amber-900 font-extrabold mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>21-Day All-Access Free Trial Included</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Start with <strong>21 days free access</strong> (₹0 today). Your auto-payment mandate is scheduled on <strong>Day 22</strong> ({role === 'lawyer' ? '₹5,999/yr' : '₹2,999/yr'}). Cancel anytime with 1-click before Day 22.
                </p>
              </div>

              {/* Role Selection */}
              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-1.5">
                  Select Your Account Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      role === 'client'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <UserIcon className={`w-4 h-4 ${role === 'client' ? 'text-amber-400' : 'text-slate-600'}`} />
                      <span className="text-xs font-bold">Client / Litigant</span>
                    </div>
                    <p className={`text-[11px] ${role === 'client' ? 'text-slate-300' : 'text-slate-500'}`}>
                      File petitions, monitor isolated cases, track delays.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('lawyer')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      role === 'lawyer'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Briefcase className={`w-4 h-4 ${role === 'lawyer' ? 'text-amber-400' : 'text-slate-600'}`} />
                      <span className="text-xs font-bold">Advocate / Lawyer</span>
                    </div>
                    <p className={`text-[11px] ${role === 'lawyer' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Bar Council practice, case vault & client discovery.
                    </p>
                  </button>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 font-semibold block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'lawyer' ? 'Adv. Vikram Seth' : 'Aarav Mehta'}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-700 font-semibold block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              {/* Lawyer Specific Fields */}
              {role === 'lawyer' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Bar Council Credentials (e-KYC)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold block mb-1">Bar Council Enrolment No.</label>
                      <input
                        type="text"
                        value={barCouncilNumber}
                        onChange={(e) => setBarCouncilNumber(e.target.value)}
                        placeholder="e.g. D/1842/2016"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold block mb-1">State Bar Council</label>
                      <input
                        type="text"
                        value={stateBarCouncil}
                        onChange={(e) => setStateBarCouncil(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold block mb-1">Experience (Years)</label>
                      <input
                        type="number"
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold block mb-1">Consultation Fee (₹)</label>
                      <input
                        type="number"
                        value={consultationFee}
                        onChange={(e) => setConsultationFee(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-2 active:scale-95 transition-all cursor-pointer"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Start 21-Day Free Trial</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Switch instantly between pre-configured testing personas to verify access controls, trial status, and case isolation.
              </p>

              <div className="space-y-2.5">
                {availablePersonas.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSwitchPersona(p.id);
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900">{p.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p?.role === 'lawyer'
                              ? p?.isVerifiedLawyer
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}>
                            {p?.role === 'lawyer' ? (p?.isVerifiedLawyer ? 'Verified Advocate' : 'Unverified Lawyer') : 'Client'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{p.email}</p>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
