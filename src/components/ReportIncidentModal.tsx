import React, { useState } from 'react';
import { X, AlertTriangle, Upload, ShieldCheck } from 'lucide-react';
import { User, CyberComplaint } from '../types';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  computeFileBytesSha256,
  validateEvidenceFile,
  ALLOWED_INCIDENT_EVIDENCE_MIMES,
  MAX_INCIDENT_EVIDENCE_BYTES,
} from '../services/evidenceHasher';
import { logSecurityActivity } from '../services/securityLogger';

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
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidenceSha256, setEvidenceSha256] = useState<string>('');
  const [evidenceSizeFormatted, setEvidenceSizeFormatted] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleEvidenceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError('');
    setEvidenceSha256('');
    setEvidenceSizeFormatted('');

    if (!file) {
      setEvidenceFile(null);
      return;
    }

    const validation = validateEvidenceFile(file, {
      maxBytes: MAX_INCIDENT_EVIDENCE_BYTES,
      allowedMimes: ALLOWED_INCIDENT_EVIDENCE_MIMES,
    });

    if (!validation.valid) {
      setEvidenceFile(null);
      setFileError(validation.error || 'Invalid evidence file.');
      return;
    }

    setEvidenceFile(file);
    setEvidenceSizeFormatted(validation.formattedSize);
    try {
      const digest = await computeFileBytesSha256(file);
      setEvidenceSha256(digest);
    } catch (err) {
      console.error('Failed to hash evidence file:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platformName || !targetUrl || !impactDescription) return;

    setLoading(true);

    try {
      let evidenceUrl = '';
      let computedDigest = evidenceSha256;
      if (evidenceFile) {
        if (!computedDigest) {
          computedDigest = await computeFileBytesSha256(evidenceFile);
        }
        const storageRef = ref(storage, `evidence/${currentUser.id}/${Date.now()}_${evidenceFile.name}`);
        const snapshot = await uploadBytes(storageRef, evidenceFile);
        evidenceUrl = await getDownloadURL(snapshot.ref);
      }

      const createdAt = new Date().toISOString();
      const docRef = await addDoc(collection(db, 'cyberComplaints'), {
        clientId: currentUser.id,
        platformName,
        targetUrl,
        abuseType,
        impactDescription,
        evidenceUrl,
        evidenceSha256: computedDigest || null,
        evidenceByteSize: evidenceFile ? evidenceFile.size : null,
        status: 'Pending',
        createdAt,
      });

      if (computedDigest) {
        await logSecurityActivity(
          'EVIDENCE_UPLOAD',
          `Cybercrime report ${docRef.id} evidence hashed (raw bytes): ${computedDigest}`
        );
      }

      onReportFiled({
        id: docRef.id,
        clientId: currentUser.id,
        platformName,
        targetUrl,
        abuseType,
        impactDescription,
        evidenceUrl,
        evidenceSha256: computedDigest || undefined,
        evidenceByteSize: evidenceFile ? evidenceFile.size : undefined,
        status: 'Pending',
        createdAt,
      });
      onClose();
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
        <p className="text-xs text-slate-400 mb-6">Document abuse or harassment. Include evidence like screenshots or videos.</p>

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
            <label className="text-slate-300 font-semibold block mb-1">Evidence (Screenshots, PDFs, or Videos • Max 25 MB)</label>
            <div className="w-full flex items-center justify-center px-6 pt-5 pb-6 border-2 border-zinc-800 border-dashed rounded-xl bg-zinc-900 hover:border-amber-600 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-8 w-8 text-slate-400" />
                <div className="flex justify-center text-sm text-slate-400">
                  <label htmlFor="evidence-upload" className="relative cursor-pointer bg-zinc-900 rounded-md font-medium text-amber-400 hover:text-amber-300">
                    <span>{evidenceFile ? `${evidenceFile.name} (${evidenceSizeFormatted})` : 'Upload File'}</span>
                    <input id="evidence-upload" name="evidence-upload" type="file" accept="image/*,video/*,application/pdf" className="sr-only" onChange={handleEvidenceChange} />
                  </label>
                </div>
              </div>
            </div>
            {evidenceSha256 && (
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-2 text-[10px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-emerald-300 font-semibold block">Raw File Bytes SHA-256 Computed (Sec 63 BSA / 65B IEA)</span>
                  <span className="font-mono text-slate-300 break-all">{evidenceSha256}</span>
                </div>
              </div>
            )}
            {fileError && (
              <p className="mt-1.5 text-[11px] text-red-400 font-medium">{fileError}</p>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-600 text-white font-bold text-xs shadow-xl border border-amber-600/40 transition-all active:scale-95">
            {loading ? 'Submitting Report...' : 'Submit Incident Report'}
          </button>
        </form>
      </div>
    </div>
  );
};
