import React, { useState } from 'react';
import { X, Scale, User as UserIcon, Briefcase, Mail, Phone, Lock, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  availablePersonas: User[];
  onSwitchPersona: (userId: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  availablePersonas,
  onSwitchPersona,
}) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden text-slate-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-gradient-to-r from-red-950/70 via-zinc-900 to-red-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-800 flex items-center justify-center text-red-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-cinzel">
                JusticeBridge Account Portal
              </h3>
              <p className="text-xs text-red-300">
                Judicial Multi-Tenancy & Access Authentication
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

        {/* Tab switcher */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/50">
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-xs font-bold transition-all ${
              tab === 'register'
                ? 'text-white border-b-2 border-red-600 bg-zinc-900/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register New Account
          </button>
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-xs font-bold transition-all ${
              tab === 'login'
                ? 'text-white border-b-2 border-red-600 bg-zinc-900/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Quick Persona Switch
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center space-x-2">
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {tab === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Role Selection */}
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5">
                  Select Your Account Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      role === 'client'
                        ? 'bg-red-950/80 border-red-600 text-white shadow-md'
                        : 'bg-zinc-900 border-zinc-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <UserIcon className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white">Client / Litigant</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      File petitions, monitor isolated cases, track hearing delays.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('lawyer')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      role === 'lawyer'
                        ? 'bg-red-950/80 border-red-600 text-white shadow-md'
                        : 'bg-zinc-900 border-zinc-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Briefcase className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-bold text-white">Advocate / Lawyer</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Bar Council verified practice, case vault access & directory listing.
                    </p>
                  </button>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'lawyer' ? 'Adv. Vikram Seth' : 'Aarav Mehta'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98000 12345"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-red-600"
                />
              </div>

              {/* Advocate Specific Fields */}
              {role === 'lawyer' && (
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 animate-in fade-in">
                  <div className="flex items-center space-x-2 text-xs font-bold text-red-300 border-b border-zinc-800 pb-2">
                    <ShieldCheck className="w-4 h-4 text-red-400" />
                    <span>Bar Council & Practice Information</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Bar Council Enrollment ID</label>
                      <input
                        type="text"
                        value={barCouncilNumber}
                        onChange={(e) => setBarCouncilNumber(e.target.value)}
                        placeholder="D/3820/2018"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-mono outline-none focus:border-red-600"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">State Bar Council</label>
                      <select
                        value={stateBarCouncil}
                        onChange={(e) => setStateBarCouncil(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs outline-none focus:border-red-600"
                      >
                        <option value="Bar Council of Delhi">Bar Council of Delhi</option>
                        <option value="Bar Council of Maharashtra & Goa">Bar Council of Maharashtra & Goa</option>
                        <option value="Bar Council of Karnataka">Bar Council of Karnataka</option>
                        <option value="Bar Council of Tamil Nadu">Bar Council of Tamil Nadu</option>
                        <option value="Bar Council of West Bengal">Bar Council of West Bengal</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Years of Experience</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs outline-none focus:border-red-600"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Advisory Fee (₹ INR)</label>
                      <input
                        type="number"
                        step="500"
                        value={consultationFee}
                        onChange={(e) => setConsultationFee(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Practice Bio</label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Senior advocate practicing in constitutional writs, commercial arbitration..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs outline-none focus:border-red-600 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Membership notice reminder */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-slate-400">
                <span className="text-amber-400 font-semibold block mb-0.5">Membership Plan Notice:</span>
                {role === 'client'
                  ? 'Client accounts require an annual pass of ₹2,999/year to file petitions and track isolated cases.'
                  : 'Advocate accounts require a practice subscription of ₹3,999/month for verified case vault discovery.'}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 text-white font-bold text-xs shadow-xl flex items-center justify-center space-x-2 active:scale-95 transition-all"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Select any pre-configured testing persona to test Rule 1 (Verified Lawyers vs Unverified), Rule 2 (Client Isolation), and membership payment notifications.
              </p>

              <div className="space-y-2.5">
                {availablePersonas.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSwitchPersona(p.id);
                      onClose();
                    }}
                    className="w-full p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-red-800 flex items-center justify-between text-left transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover border border-zinc-700"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">{p.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.role === 'lawyer'
                              ? p.isVerifiedLawyer
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-red-950 text-red-300 border border-red-800'
                          }`}>
                            {p.role === 'lawyer' ? (p.isVerifiedLawyer ? 'Verified Advocate' : 'Unverified Lawyer') : 'Client'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{p.email}</p>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-500" />
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
