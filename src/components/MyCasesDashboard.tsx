import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, AlertTriangle, FileText, Plus, Upload, Clock, Calendar, CheckCircle2, ChevronRight, Eye, Sparkles, Scale, AlertCircle, ArrowUpRight, FileSpreadsheet, User, RefreshCw } from 'lucide-react';
import { CaseMatter, User as UserType, CaseDocument } from '../types';

interface MyCasesDashboardProps {
  currentUser: UserType;
  onOpenCaseFiles: (caseId: string) => void;
  onFileNewCase: () => void;
  onOpenVerifyModal: () => void;
  onOpenPaymentModal: () => void;
}

export const MyCasesDashboard: React.FC<MyCasesDashboardProps> = ({
  currentUser,
  onOpenCaseFiles,
  onFileNewCase,
  onOpenVerifyModal,
  onOpenPaymentModal,
}) => {
  const [cases, setCases] = useState<CaseMatter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isolationMode, setIsolationMode] = useState<string>('');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{ [caseId: string]: string }>({});
  const [analyzingCaseId, setAnalyzingCaseId] = useState<string | null>(null);
  const [activeTabSub, setActiveTabSub] = useState<'all' | 'active' | 'documents'>('all');

  const fetchMyCases = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cases');
      const data = await res.json();
      setCases(data.cases || []);
      setIsolationMode(data.isolationMode || '');
    } catch (err) {
      console.error('Failed to fetch isolated cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCases();
  }, [currentUser.id, currentUser.role, currentUser.isVerifiedLawyer]);

  const handleRunAiDelayAnalysis = async (caseId: string) => {
    try {
      setAnalyzingCaseId(caseId);
      const res = await fetch('/api/ai/delay-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId }),
      });
      const data = await res.json();
      setAiAnalysisResult((prev) => ({
        ...prev,
        [caseId]: data.analysis,
      }));
    } catch (error) {
      console.error('AI delay analysis error:', error);
    } finally {
      setAnalyzingCaseId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Client Isolation & Role Verification Security Banner */}
      <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-red-950/40 to-zinc-900 border border-zinc-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-950/70 border border-red-800/60 flex items-center justify-center flex-shrink-0 text-red-300">
              {currentUser.role === 'client' ? <Lock className="w-5 h-5 text-amber-400" /> : <ShieldCheck className="w-5 h-5 text-emerald-400" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                  {currentUser.role === 'client' ? 'Rule 2: Client Isolation Enforced' : 'Rule 1: Verified Advocate Access Control'}
                </span>
                <span className="px-2 py-0.2 rounded-full bg-zinc-950 text-[10px] text-slate-300 border border-zinc-800 font-mono">
                  Tenant: {currentUser.id}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {currentUser.role === 'client' ? (
                  <>
                    Active workspace is isolated to <strong>{currentUser.name}</strong>. Zero-knowledge tenancy guarantees no other client or unauthorized party can query your confidential litigation.
                  </>
                ) : currentUser.isVerifiedLawyer ? (
                  <>
                    Logged in as <strong>{currentUser.name}</strong> (Bar Council ID: <span className="font-mono text-emerald-400">{currentUser.barCouncilNumber}</span>). Full case files and evidence discovery unlocked.
                  </>
                ) : (
                  <>
                    ⚠️ Logged in as <strong>{currentUser.name}</strong> (Verification In Progress). <strong>Rule 1 active:</strong> Case evidence vaults are locked until Bar Council e-KYC is approved.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 flex-shrink-0">
            {currentUser.role === 'lawyer' && !currentUser.isVerifiedLawyer ? (
              <button
                id="btn-trigger-bar-verify"
                onClick={onOpenVerifyModal}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                Verify Bar License
              </button>
            ) : (
              <button
                id="btn-dashboard-file-petition"
                onClick={onFileNewCase}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-red-900 hover:bg-red-800 text-white text-xs font-bold border border-red-700 shadow-md transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>File New Petition</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel">
            {currentUser.role === 'lawyer' ? 'Assigned Case Matters & Cause List' : 'My Active Legal Matters'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            {currentUser.role === 'lawyer'
              ? 'Review pending filings, schedule hearings, and access verified evidence discovery.'
              : 'Directly track your petitions, next hearing dates, and court notices.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Total Cases:</span>
          <span className="px-2.5 py-1 rounded-lg bg-red-950 text-red-300 font-mono font-bold text-xs border border-red-800">
            {cases.length} Matters
          </span>
        </div>
      </div>

      {/* Cases List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Loading secure isolated matter repository...</p>
        </div>
      ) : cases.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Active Cases Filed Yet</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-5">
            You currently have no registered litigation matters in your isolated workspace. File a new petition or consult a verified advocate to begin.
          </p>
          <button
            onClick={onFileNewCase}
            className="px-5 py-2.5 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 text-white text-xs font-bold rounded-xl border border-red-600 shadow-lg"
          >
            File First Legal Petition
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {cases.map((caseItem) => {
            const hasAiAnalysis = !!aiAnalysisResult[caseItem.id];
            const isAnalyzing = analyzingCaseId === caseItem.id;

            return (
              <div
                key={caseItem.id}
                id={`my-case-card-${caseItem.id}`}
                className="rounded-3xl bg-zinc-900/90 border border-zinc-800 hover:border-red-900/60 transition-all p-6 sm:p-8 shadow-2xl"
              >
                {/* Case Top Bar */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-6 border-b border-zinc-800">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className="px-2.5 py-1 rounded-md bg-red-950/80 text-red-200 border border-red-800 font-mono text-xs font-bold">
                        {caseItem.caseNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-zinc-950 text-slate-300 border border-zinc-800 text-xs font-mono">
                        CNR: {caseItem.cnrNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-red-950/60 text-red-300 border border-red-800/40 text-xs font-medium">
                        {caseItem.caseType}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-xs font-semibold">
                        Stage: {caseItem.status}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-cinzel">
                      {caseItem.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {caseItem.courtName} &bull; {caseItem.bench}
                    </p>
                  </div>

                  {/* Vault Inspection Button (Security Rule 1 Trigger) */}
                  <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
                    <button
                      id={`btn-open-case-files-${caseItem.id}`}
                      onClick={() => onOpenCaseFiles(caseItem.id)}
                      className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xl transition-all active:scale-95 ${
                        currentUser.role === 'lawyer' && !currentUser.isVerifiedLawyer
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/80 hover:bg-amber-900'
                          : 'bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 hover:to-red-700 text-white border border-red-500/40'
                      }`}
                    >
                      {currentUser.role === 'lawyer' && !currentUser.isVerifiedLawyer ? (
                        <>
                          <Lock className="w-4 h-4 text-amber-400" />
                          <span>Inspect Files (Rule 1 Check)</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 text-red-200" />
                          <span>Open Case File Vault ({caseItem.documents.length})</span>
                        </>
                      )}
                    </button>

                    {/* Delay Reduction Engine Button */}
                    <button
                      id={`btn-ai-delay-${caseItem.id}`}
                      onClick={() => handleRunAiDelayAnalysis(caseItem.id)}
                      disabled={isAnalyzing}
                      className="flex items-center space-x-1.5 px-4 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-red-300 text-xs sm:text-sm font-semibold border border-zinc-800 shadow-md transition-colors"
                      title="Generate AI Strategy to Reduce Court Delays"
                    >
                      <Sparkles className={`w-4 h-4 text-red-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
                      <span>{isAnalyzing ? 'Analyzing Bottlenecks...' : 'AI Delay Analyzer'}</span>
                    </button>
                  </div>
                </div>

                {/* Litigant & Case Brief */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 text-xs">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-slate-400 block text-[11px] font-semibold mb-1">Petitioner (Your Matter):</span>
                    <p className="font-bold text-white">{caseItem.petitioner}</p>
                    <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">Client ID: {caseItem.clientId}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-slate-400 block text-[11px] font-semibold mb-1">Respondent / Opposing Party:</span>
                    <p className="font-bold text-white">{caseItem.respondent}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-slate-400 block text-[11px] font-semibold mb-1">Assigned Senior Advocate:</span>
                    <div className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <p className="font-bold text-red-300">{caseItem.assignedLawyerName || 'Direct Court Retainer'}</p>
                    </div>
                  </div>
                </div>

                {/* AI Delay Strategy Card (if triggered) */}
                {hasAiAnalysis && (
                  <div className="my-6 p-5 rounded-2xl bg-zinc-950 border border-red-900/60 shadow-xl animate-in fade-in">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs uppercase font-extrabold tracking-wider text-red-300">
                          AI Judicial Acceleration & Delay Reduction Strategy
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-red-900/60 text-[10px] text-red-200 border border-red-700">
                        Gemini Judicial Logic
                      </span>
                    </div>

                    <div className="prose prose-invert prose-sm text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                      {aiAnalysisResult[caseItem.id]}
                    </div>
                  </div>
                )}

                {/* Hearing Schedule & Next Cause List Date */}
                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-red-400" />
                      <span>Cause List Schedule & Hearing History</span>
                    </h4>
                    <span className="text-xs text-slate-400">
                      Next Appearance: <strong className="text-white">{caseItem.nextHearingDate}</strong>
                    </span>
                  </div>

                  <div className="space-y-3">
                    {caseItem.hearings.map((h) => (
                      <div
                        key={h.id}
                        className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center flex-shrink-0 text-red-400 font-mono font-bold text-xs mt-0.5">
                            {h.stage.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white">{h.stage}</span>
                              <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                                h.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
                              }`}>
                                {h.status}
                              </span>
                            </div>
                            <p className="text-slate-400 mt-0.5 text-[11px]">{h.purpose}</p>
                            {h.notes && (
                              <p className="text-slate-300 text-[11px] italic mt-1 bg-zinc-900 p-1.5 rounded border border-zinc-800">
                                Judicial Order Note: {h.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-left sm:text-right flex-shrink-0">
                          <span className="text-slate-300 font-mono font-bold block">{h.hearingDate}</span>
                          <span className="text-slate-500 text-[10px]">{h.courtRoom}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
