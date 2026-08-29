import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Calendar, AlertTriangle, CheckCircle2, ChevronRight, FileText, Scale, Eye, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { CaseMatter, User } from '../types';

interface CaseTrackerProps {
  currentUser: User;
  onSelectCase: (caseId: string) => void;
  onFileNewCaseClick: () => void;
}

export const CaseTracker: React.FC<CaseTrackerProps> = ({
  currentUser,
  onSelectCase,
  onFileNewCaseClick,
}) => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCourt, setSelectedCourt] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('delay_desc');

  const caseTypes = [
    'All',
    'Commercial Dispute',
    'Constitutional Writ',
    'Cyber Crime',
    'Civil & Property',
    'Criminal Defense'
  ];

  const courtsList = [
    'All',
    'Supreme Court of India',
    'Delhi High Court',
    'Bombay High Court',
    'Karnataka High Court'
  ];

  const caseStages = ['Filing', 'Scrutiny', 'Notice', 'Evidence', 'Arguments', 'Judgment'];

  const fetchCases = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (selectedType !== 'All') params.append('caseType', selectedType);
      if (selectedStatus !== 'All') params.append('status', selectedStatus);
      if (selectedCourt !== 'All') params.append('court', selectedCourt);
      if (selectedRisk !== 'All') params.append('delayRiskScore', selectedRisk);
      if (sortBy) params.append('sortBy', sortBy);

      const res = await fetch(`/api/cases/search?${params.toString()}`);
      const data = await res.json();
      setCases(data.cases || []);
    } catch (err) {
      console.error('Failed to search cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [searchQuery, selectedType, selectedStatus, selectedCourt, selectedRisk, sortBy]);

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'Filing': return 0;
      case 'Scrutiny': return 1;
      case 'Notice': return 2;
      case 'Evidence': return 3;
      case 'Arguments': return 4;
      case 'Reserved':
      case 'Disposed': return 5;
      default: return 0;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-red-950/70 border border-red-800/60 text-red-300 text-xs font-semibold mb-2">
            <Scale className="w-3.5 h-3.5 text-red-400" />
            <span>National Judicial Case Registry & Delay Tracker</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-cinzel">
            Find a Case Matter
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Lookup any High Court, Supreme Court, or District Tribunal proceeding by CNR number, filing party, or case ID. Track hearing timelines and delay risk scores.
          </p>
        </div>

        <button
          id="btn-findcase-file-new"
          onClick={onFileNewCaseClick}
          className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs sm:text-sm shadow-xl border border-red-500/40 transition-all active:scale-95"
        >
          <FileText className="w-4 h-4 text-red-200" />
          <span>File New Case Petition</span>
        </button>
      </div>

      {/* Search Bar & Filters */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Main Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="search-case-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by CNR, Case ID, Petitioner..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-white placeholder-zinc-500 text-sm outline-none transition-colors font-mono"
            />
          </div>

          {/* Case Type Dropdown */}
          <div className="md:col-span-3">
            <select
              id="filter-casetype-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-red-600 text-slate-200 text-sm outline-none"
            >
              {caseTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Case Categories' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Court Filter */}
          <div className="md:col-span-3">
            <select
              id="filter-casecourt-select"
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-red-600 text-slate-200 text-sm outline-none"
            >
              {courtsList.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Courts' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Delay Risk Score Filter */}
          <div className="md:col-span-2">
            <select
              id="filter-caserisk-select"
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-red-600 text-slate-200 text-sm outline-none"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical Delay ⚠️</option>
              <option value="Moderate">Moderate Delay</option>
              <option value="Low">Low / On Track ✓</option>
            </select>
          </div>

        </div>

        {/* Secondary Row: Sorting & Preset Quick Searches */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium">Quick CNR Lookups:</span>
            <button
              onClick={() => setSearchQuery('DLHC01-004192-2026')}
              className="px-2.5 py-1 rounded bg-zinc-950 text-red-300 hover:bg-red-950 border border-red-900/60 font-mono text-[11px]"
            >
              DLHC01-004192-2026 (Commercial)
            </button>
            <button
              onClick={() => setSearchQuery('KABC02-001184-2025')}
              className="px-2.5 py-1 rounded bg-zinc-950 text-red-300 hover:bg-red-950 border border-red-900/60 font-mono text-[11px]"
            >
              KABC02-001184-2025 (Property)
            </button>
            <button
              onClick={() => setSearchQuery('SCIN01-000992-2026')}
              className="px-2.5 py-1 rounded bg-zinc-950 text-red-300 hover:bg-red-950 border border-red-900/60 font-mono text-[11px]"
            >
              SCIN01-000992-2026 (Supreme Court)
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Sort by:</span>
            <select
              id="filter-casesort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-slate-300 text-xs outline-none"
            >
              <option value="delay_desc">Highest Delay Days</option>
              <option value="filing_recent">Most Recent Filing</option>
              <option value="next_hearing">Upcoming Hearing Date</option>
            </select>
            <span className="text-slate-500 font-mono">({cases.length} Matters)</span>
          </div>
        </div>
      </div>

      {/* Case List Results */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Searching judicial cause lists and e-filing repositories...</p>
        </div>
      ) : cases.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <Scale className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Case Records Found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-4">
            No matching case was located with the provided CNR or search keywords.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('All');
            }}
            className="px-4 py-2 bg-red-950 hover:bg-red-900 text-red-200 text-xs font-bold rounded-lg border border-red-800"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cases.map((c) => {
            const currentStageIdx = getStageIndex(c.status);
            return (
              <div
                key={c.id}
                id={`case-card-${c.id}`}
                className="rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-red-800/60 transition-all p-6 shadow-xl group"
              >
                {/* Header info */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-md bg-red-950/80 text-red-300 border border-red-800 font-mono text-xs font-bold">
                        CNR: {c.cnrNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-950 text-slate-300 border border-zinc-800 text-xs font-mono">
                        {c.caseNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-slate-300 text-xs">
                        {c.caseType}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-red-300 transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {c.courtName} &bull; Filed on {c.filingDate}
                    </p>
                  </div>

                  {/* Delay Risk Badge */}
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Delay Telemetry</span>
                      <div className="flex items-center space-x-1.5 justify-end">
                        <Clock className={`w-3.5 h-3.5 ${c.delayDays > 20 ? 'text-red-400' : 'text-emerald-400'}`} />
                        <span className={`text-xs font-bold ${c.delayDays > 20 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {c.delayDays === 0 ? 'On Track (0 Days Delay)' : `+${c.delayDays} Days Delay`}
                        </span>
                      </div>
                    </div>

                    <button
                      id={`btn-inspect-case-${c.id}`}
                      onClick={() => onSelectCase(c.id)}
                      className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 hover:text-white font-bold text-xs border border-red-800 shadow-md transition-all active:scale-95"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Inspect Matter</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Litigants & Judge info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-slate-400 block text-[11px] mb-0.5">Petitioner:</span>
                    <p className="font-semibold text-slate-200 truncate">{c.petitioner}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-slate-400 block text-[11px] mb-0.5">Respondent:</span>
                    <p className="font-semibold text-slate-200 truncate">{c.respondent}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-slate-400 block text-[11px] mb-0.5">Assigned Counsel:</span>
                    <p className="font-semibold text-red-300 truncate">{c.assignedLawyerName || 'Registry Assigned Counsel'}</p>
                  </div>
                </div>

                {/* Stage Progress Bar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400 font-semibold">
                      Current Stage: <strong className="text-red-300">{c.status}</strong> - {c.stageDescription}
                    </span>
                    <span className="text-slate-400">
                      Next Hearing: <strong className="text-white">{c.nextHearingDate || 'Cause List Pending'}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-2">
                    {caseStages.map((stage, idx) => {
                      const isDone = idx < currentStageIdx;
                      const isCurrent = idx === currentStageIdx;
                      return (
                        <div key={stage} className="text-center">
                          <div
                            className={`h-2 rounded-full mb-1 transition-all ${
                              isCurrent
                                ? 'bg-red-500 shadow-md shadow-red-500/50 animate-pulse'
                                : isDone
                                ? 'bg-red-800'
                                : 'bg-zinc-800'
                            }`}
                          />
                          <span
                            className={`text-[10px] block font-medium ${
                              isCurrent
                                ? 'text-red-300 font-bold'
                                : isDone
                                ? 'text-slate-300'
                                : 'text-slate-600'
                            }`}
                          >
                            {stage}
                          </span>
                        </div>
                      );
                    })}
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
