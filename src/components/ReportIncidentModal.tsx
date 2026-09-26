import React, { useState } from 'react';
import { X, AlertTriangle, Upload } from 'lucide-react';
import { User, CyberComplaint } from '../types';

interface ReportIncidentModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onReportFiled: (newReport: CyberComplaint) => void;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onReportFiled,
}) => {
  const [platformName, setPlatformName] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [abuseType, setAbuseType] = useState<CyberComplaint['abuseType']>('Harassment');
  const [impactDescription, setImpactDescription] = useState<string>('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platformName || !targetUrl || !impactDescription) return;

    setLoading(true);

    try {
      // Simulated API call (In reality, handle file upload here)
      const res = await fetch('/api/cyber-complaints/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: currentUser.id,
          platformName,
          targetUrl,
          abuseType,
          impactDescription,
        }),
      });

      const data = await res.json();
      if (data.success && data.complaint) {
        onReportFiled(data.complaint);
        onClose();
      }
    } catch (err) {
      console.error('File report error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 text-slate-200">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-950 border border-amber-600/60 flex items-center justify-center mb-4 shadow-lg">
          <AlertTriangle className="w-7 h-7 text-amber-200" />
        </div>

        <h3 className="text-xl font-bold text-white font-cinzel mb-1">Report Social Media Incident</h3>
        <p className="text-xs text-slate-400 mb-6">Document abuse or harassment. Include evidence like screenshots.</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Platform Name</label>
            <input type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)} placeholder="e.g. Instagram" className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-amber-600" required />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Content URL / Link</label>
            <input type="url" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://..." className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-amber-600" required />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Abuse Type</label>
            <select value={abuseType} onChange={(e) => setAbuseType(e.target.value as any)} className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-amber-600">
              <option value="Harassment">Harassment</option>
              <option value="Hate Speech">Hate Speech</option>
              <option value="Defamation">Defamation</option>
              <option value="Impersonation">Impersonation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Impact Description</label>
            <textarea value={impactDescription} onChange={(e) => setImpactDescription(e.target.value)} placeholder="Briefly describe the incident..." rows={3} className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-amber-600" required />
          </div>
          
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Evidence (Screenshots)</label>
            <div className="w-full flex items-center justify-center px-6 pt-5 pb-6 border-2 border-zinc-800 border-dashed rounded-xl bg-zinc-900 hover:border-amber-600 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-8 w-8 text-slate-400" />
                <div className="flex text-sm text-slate-400">
                  <label htmlFor="screenshot-upload" className="relative cursor-pointer bg-zinc-900 rounded-md font-medium text-amber-400 hover:text-amber-300">
                    <span>Upload Screenshot</span>
                    <input id="screenshot-upload" name="screenshot-upload" type="file" className="sr-only" onChange={(e) => setScreenshot(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-600 text-white font-bold text-xs shadow-xl border border-amber-600/40 transition-all active:scale-95">
            {loading ? 'Submitting Report...' : 'Submit Incident Report'}
          </button>
        </form>
      </div>
    </div>
  );
};
