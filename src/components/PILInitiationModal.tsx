import React, { useState } from 'react';
import { X, FileText, Upload, AlertCircle } from 'lucide-react';
import { User, CaseMatter } from '../types';

interface PILInitiationModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onPILFiled: (newPIL: CaseMatter) => void;
}

export const PILInitiationModal: React.FC<PILInitiationModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onPILFiled,
}) => {
  const [causeOfAction, setCauseOfAction] = useState<string>('');
  const [supportingEvidence, setSupportingEvidence] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!causeOfAction) return;

    setLoading(true);

    // Simulated API call for filing a PIL
    try {
      // In a real app, you'd upload the file and send the data to the backend.
      // Here, we just simulate the successful filing of a case.
      const res = await fetch('/api/cases/file-pil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petitioner: currentUser.name,
          causeOfAction,
          caseType: 'Public Interest Litigation (PIL)',
        }),
      });

      const data = await res.json();
      if (data.success && data.caseMatter) {
        onPILFiled(data.caseMatter);
        onClose();
      }
    } catch (err) {
      console.error('File PIL error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 text-slate-200">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-700 to-indigo-950 border border-indigo-600/60 flex items-center justify-center mb-4 shadow-lg">
          <FileText className="w-7 h-7 text-indigo-200" />
        </div>

        <h3 className="text-xl font-bold text-white font-cinzel mb-1">
          Initiate Public Interest Litigation (PIL)
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          File a case on behalf of public interest. Your details as petitioner will be recorded.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
            <label className="text-slate-300 font-semibold block mb-1">Cause of Action / Public Interest Justification</label>
            <textarea
              value={causeOfAction}
              onChange={(e) => setCauseOfAction(e.target.value)}
              placeholder="Explain the public interest and the cause of action..."
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-indigo-600"
              required
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Supporting Evidence</label>
            <div className="w-full flex items-center justify-center px-6 pt-5 pb-6 border-2 border-zinc-800 border-dashed rounded-xl bg-zinc-900 hover:border-indigo-600 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-8 w-8 text-slate-400" />
                <div className="flex text-sm text-slate-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-zinc-900 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setSupportingEvidence(e.target.files?.[0] || null)} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">PDF, DOCX up to 10MB</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 hover:from-indigo-600 text-white font-bold text-xs shadow-xl border border-indigo-600/40 transition-all active:scale-95"
          >
            {loading ? 'Submitting PIL...' : 'Submit PIL Petition'}
          </button>
        </form>

      </div>
    </div>
  );
};
