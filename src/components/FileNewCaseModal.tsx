import React, { useState } from 'react';
import { X, FileText, Scale, ShieldCheck, CheckCircle2, Upload, AlertCircle } from 'lucide-react';
import { User, CaseMatter } from '../types';

interface FileNewCaseModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onCaseFiled: (newCase: CaseMatter) => void;
}

export const FileNewCaseModal: React.FC<FileNewCaseModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onCaseFiled,
}) => {
  const [title, setTitle] = useState<string>('');
  const [caseType, setCaseType] = useState<string>('Commercial Dispute');
  const [courtName, setCourtName] = useState<string>('High Court of Delhi (Commercial Division)');
  const [respondent, setRespondent] = useState<string>('');
  const [summaryBrief, setSummaryBrief] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const courts = [
    'High Court of Delhi (Commercial Division)',
    'High Court of Judicature at Bombay',
    'High Court of Karnataka (Principal Bench)',
    'Supreme Court of India',
    'Madras High Court (Commercial Division)',
    'National Company Law Appellate Tribunal (NCLAT)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !respondent) return;

    setLoading(true);

    try {
      const res = await fetch('/api/cases/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          caseType,
          courtName,
          respondent,
          summaryBrief,
        }),
      });

      const data = await res.json();
      if (data.success && data.caseMatter) {
        onCaseFiled(data.caseMatter);
        onClose();
      }
    } catch (err) {
      console.error('File case error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 text-slate-200">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-700 to-red-950 border border-red-600/60 flex items-center justify-center mb-4 shadow-lg">
          <FileText className="w-7 h-7 text-red-200" />
        </div>

        <h3 className="text-xl font-bold text-white font-cinzel mb-1">
          E-File New Judicial Case Petition
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Submit electronic pleadings directly to the JusticeBridge judicial registry with automatic CNR provisioning.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Case Matter Title / Subject</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Apex Global Logistics vs. CyberNet Infrastructure Ltd."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-red-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Case Category</label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-red-600"
              >
                <option value="Commercial Dispute">Commercial Dispute</option>
                <option value="Constitutional Writ">Constitutional Writ</option>
                <option value="Civil & Property">Civil & Property</option>
                <option value="Cyber Crime">Cyber Crime & IT</option>
                <option value="Corporate Arbitration">Corporate Arbitration</option>
                <option value="Criminal Defense">Criminal Defense</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Jurisdiction / Court</label>
              <select
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-red-600"
              >
                {courts.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Petitioner (Your Name)</label>
              <input
                type="text"
                value={currentUser.name}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-slate-400 font-medium"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Respondent / Opposing Party</label>
              <input
                type="text"
                value={respondent}
                onChange={(e) => setRespondent(e.target.value)}
                placeholder="e.g. Zenith Tech Solutions Ltd. & Anr."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-red-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Statement of Facts / Relief Sought</label>
            <textarea
              value={summaryBrief}
              onChange={(e) => setSummaryBrief(e.target.value)}
              placeholder="Brief summary of legal prayer, cause of action, and urgent relief required..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-red-600"
            />
          </div>

          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Client Isolation Policy:</span>
            <span className="text-amber-400 font-mono">Bound to Tenant {currentUser.id}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 text-white font-bold text-xs shadow-xl border border-red-600/40 transition-all active:scale-95"
          >
            {loading ? 'Filing Petition & Issuing Digital Scrutiny Receipt...' : 'Submit & Register Legal Case'}
          </button>
        </form>

      </div>
    </div>
  );
};
