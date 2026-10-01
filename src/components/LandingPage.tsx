import React from 'react';
import { ArrowRight, ShieldCheck, Scale, Lock, Clock, FileText, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onInstallClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onInstallClick }) => {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 font-cinzel mb-6">
          JusticeBridge: Your Digital Legal Assistant
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Securely track your court cases, organize legal documents, and stay informed—all in one encrypted vault.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={onLoginClick} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition">
            Get Started
          </button>
          <button onClick={onInstallClick} className="px-8 py-4 bg-white border border-slate-300 rounded-2xl font-bold hover:bg-slate-100 transition">
            Install App
          </button>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: 'Verified Advocates', desc: 'Connect with BCI-verified legal counsel.' },
            { icon: Lock, title: 'Encrypted Vault', desc: 'Tenant-isolated security for your case files.' },
            { icon: Clock, title: 'Real-time Tracking', desc: 'Instant updates on court case status.' },
          ].map((item, i) => (
            <div key={i} className="p-8 border border-slate-200 rounded-3xl">
              <item.icon className="w-10 h-10 text-red-700 mb-4" />
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-6 font-cinzel">Ready to modernize your legal journey?</h2>
        <button onClick={onLoginClick} className="px-8 py-4 bg-red-700 text-white rounded-2xl font-bold hover:bg-red-800 transition flex items-center gap-2 mx-auto">
          Create Account <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
};
