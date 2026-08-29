import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, AlertTriangle, FileText, Download, Upload, CheckCircle2, FileCheck, ShieldAlert, Sparkles, Hash, Eye } from 'lucide-react';
import { CaseDocument, User } from '../types';

interface CaseFileViewerModalProps {
  caseId: string | null;
  currentUser: User;
  onClose: () => void;
  onOpenVerifyModal: () => void;
}

export const CaseFileViewerModal: React.FC<CaseFileViewerModalProps> = ({
  caseId,
  currentUser,
  onClose,
  onOpenVerifyModal,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string>('');
  const [securityCode, setSecurityCode] = useState<string>('');
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [caseNumber, setCaseNumber] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<CaseDocument | null>(null);

  // New file upload state
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadCategory, setUploadCategory] = useState<'Petition' | 'Affidavit' | 'Evidence' | 'Court Order' | 'Vakalatnama'>('Evidence');
  const [uploadSummary, setUploadSummary] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (!caseId) return;

    const fetchFiles = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/cases/${caseId}/files`);
        const data = await res.json();

        if (res.status === 403) {
          setAuthorized(false);
          setAccessDeniedMessage(data.message || data.error || 'Access Denied.');
          setSecurityCode(data.securityCode || 'SEC_FORBIDDEN');
          setDocuments([]);
        } else if (res.ok) {
          setAuthorized(true);
          setDocuments(data.documents || []);
          setCaseNumber(data.caseNumber || '');
          if (data.documents && data.documents.length > 0) {
            setSelectedDoc(data.documents[0]);
          }
        }
      } catch (err) {
        console.error('File fetch error:', err);
        setAuthorized(false);
        setAccessDeniedMessage('Network error fetching case file vault.');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [caseId, currentUser.id, currentUser.isVerifiedLawyer]);

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle) return;

    try {
      setUploading(true);
      const res = await fetch(`/api/cases/${caseId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle,
          fileCategory: uploadCategory,
          summary: uploadSummary || 'Authenticated digital evidence upload.',
          fileName: `${uploadTitle.replace(/\s+/g, '_')}.pdf`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDocuments((prev) => [...prev, data.document]);
        setSelectedDoc(data.document);
        setShowUploadForm(false);
        setUploadTitle('');
        setUploadSummary('');
      }
    } catch (err) {
      console.error('Upload document error:', err);
    } finally {
      setUploading(false);
    }
  };

  if (!caseId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-gradient-to-r from-red-950/70 via-zinc-900 to-zinc-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/70 border border-red-800/60 flex items-center justify-center text-red-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white font-cinzel">
                  Confidential Case File Vault
                </h3>
                {caseNumber && (
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-xs font-mono">
                    {caseNumber}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Rule 1 Enforcement: Verified Advocates & Authenticated Litigants Access Only
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-300 text-sm">Authenticating Bar Council credentials & verifying access rules...</p>
            </div>
          ) : !authorized ? (
            
            /* ACCESS DENIED SCREEN (STRICT RULE 1 DEMONSTRATION) */
            <div className="max-w-xl mx-auto text-center py-12 px-6 rounded-3xl bg-red-950/20 border border-red-900/80 shadow-2xl">
              <div className="w-20 h-20 rounded-3xl bg-red-950/80 border-2 border-red-700 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-950/80">
                <ShieldAlert className="w-10 h-10 text-red-400 animate-pulse" />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-red-900/70 border border-red-600 text-red-200 text-xs font-bold uppercase tracking-wider mb-3">
                Security Policy Rule 1 Enforced
              </div>

              <h4 className="text-2xl font-bold text-white mb-2 font-cinzel">
                Access Denied: Bar Council Verification Required
              </h4>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {accessDeniedMessage}
              </p>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-left text-xs space-y-2 mb-8">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Current User Role:</span>
                  <span className="font-bold text-white capitalize">{currentUser.role}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Bar Council Standing:</span>
                  <span className="font-bold text-amber-400">Pending Verification</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Enforcement Rule:</span>
                  <span className="font-mono text-red-400">RULE_1_ONLY_VERIFIED_LAWYERS_VIEW_CASE_FILES</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onOpenVerifyModal();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-900/40"
                >
                  Verify Bar Council License (Simulate e-KYC)
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-300 font-semibold text-sm border border-zinc-800"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>

          ) : (

            /* AUTHORIZED FILE VAULT VIEW */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Documents List */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                    Case Documents ({documents.length})
                  </span>
                  
                  <button
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="flex items-center space-x-1 text-xs text-red-300 hover:text-white font-semibold"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{showUploadForm ? 'Cancel' : 'Add Filing'}</span>
                  </button>
                </div>

                {/* Upload Document Form */}
                {showUploadForm && (
                  <form onSubmit={handleUploadDocument} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">Upload New Verified Document</h5>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Document Title</label>
                      <input
                        type="text"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        placeholder="e.g. Additional Rejoinder Affidavit"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs outline-none focus:border-red-600"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Category</label>
                        <select
                          value={uploadCategory}
                          onChange={(e: any) => setUploadCategory(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs outline-none"
                        >
                          <option value="Evidence">Evidence</option>
                          <option value="Petition">Petition</option>
                          <option value="Affidavit">Affidavit</option>
                          <option value="Court Order">Court Order</option>
                          <option value="Vakalatnama">Vakalatnama</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Uploaded By</label>
                        <input
                          type="text"
                          value={currentUser.name}
                          disabled
                          className="w-full px-2.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-slate-400 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Brief Description</label>
                      <textarea
                        value={uploadSummary}
                        onChange={(e) => setUploadSummary(e.target.value)}
                        placeholder="Key legal points or evidentiary relevance..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs outline-none focus:border-red-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full py-2 bg-red-800 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-md transition-colors"
                    >
                      {uploading ? 'Encrypting & Storing...' : 'Submit to Judicial Vault'}
                    </button>
                  </form>
                )}

                {/* Documents List */}
                <div className="space-y-2.5">
                  {documents.map((doc) => {
                    const isSelected = selectedDoc?.id === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-red-950/70 border-red-700 shadow-md text-white'
                            : 'bg-zinc-900 border-zinc-800 text-slate-300 hover:border-red-900/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start space-x-2.5 min-w-0">
                            <FileText className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected ? 'text-red-400' : 'text-slate-500'}`} />
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate">{doc.title}</p>
                              <span className="text-[10px] text-slate-400 block font-mono mt-0.5 truncate">{doc.fileName}</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-zinc-950 text-[10px] font-semibold text-red-300 border border-red-900/60 flex-shrink-0">
                            {doc.fileCategory}
                          </span>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{doc.fileSize} &bull; {doc.pageCount} Pages</span>
                          <span>Uploaded {doc.uploadedAt}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Active Document Viewer & Cryptographic Verification */}
              <div className="lg:col-span-7">
                {selectedDoc ? (
                  <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between h-full space-y-6">
                    <div>
                      {/* Document Meta Header */}
                      <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-800">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-red-950 text-red-300 border border-red-800 text-xs font-bold">
                              {selectedDoc.fileCategory}
                            </span>
                            <span className="text-xs text-slate-400">
                              Uploaded by: <strong className="text-slate-200">{selectedDoc.uploadedBy}</strong>
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-white font-cinzel">
                            {selectedDoc.title}
                          </h4>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedDoc.fileName}</p>
                        </div>

                        <button
                          onClick={() => alert(`Simulated secure download of ${selectedDoc.fileName}. Document integrity verified via SHA-256.`)}
                          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-red-300 border border-zinc-800 text-xs font-bold shadow-md transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export PDF</span>
                        </button>
                      </div>

                      {/* Summary Section */}
                      <div className="my-5 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                        <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block mb-1.5">
                          Judicial File Summary & Evidentiary Brief
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {selectedDoc.summary || 'Verified judicial filing document preserved in encrypted cold storage.'}
                        </p>
                      </div>

                      {/* Document Content Simulation Mock Box */}
                      <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 font-serif text-slate-300 text-xs leading-relaxed space-y-3 select-none">
                        <div className="text-center pb-2 border-b border-zinc-800">
                          <p className="text-[11px] font-mono tracking-widest text-slate-500 uppercase">IN THE HIGH COURT OF DELHI AT NEW DELHI</p>
                          <p className="text-xs font-bold text-white mt-0.5">COMMERCIAL APPELLATE JURISDICTION</p>
                        </div>
                        <p className="text-slate-300">
                          <strong>MEMORANDUM OF EVIDENCE & AFFIDAVIT:</strong> This document constitutes a formal submission on behalf of the claimant under the Indian Evidence Act and Commercial Courts Act, 2015.
                        </p>
                        <p className="text-slate-400 italic">
                          "I, the authorized representative, do hereby solemnly affirm that the foregoing telemetry logs and electronic service statements are true to the best of my knowledge and extracted from certified logs."
                        </p>
                      </div>
                    </div>

                    {/* Cryptographic SHA-256 Hash Badge */}
                    <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="text-emerald-300 font-bold block">Verified Document Integrity</span>
                          <span className="text-[10px] text-slate-400 font-mono break-all">{selectedDoc.documentHash}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-700">
                        Sec 65B Compliant
                      </span>
                    </div>

                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center text-slate-400">
                    <p className="text-sm">Select a document on the left to inspect file details and electronic evidence.</p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5 text-red-400" />
            <span>End-to-End Encrypted File Vault (AES-256 GCM)</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-200 text-xs font-semibold border border-zinc-800"
          >
            Close Vault
          </button>
        </div>

      </div>
    </div>
  );
};
