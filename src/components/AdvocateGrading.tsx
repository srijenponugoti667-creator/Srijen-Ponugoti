import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  Scale, 
  MessageSquare, 
  Send, 
  ThumbsUp, 
  Filter, 
  ChevronRight,
  Sparkles,
  HelpCircle,
  BarChart3,
  UserCheck
} from 'lucide-react';
import { LawyerProfile, LawyerReview, User } from '../types';
import { getTranslation } from '../languages';

interface AdvocateGradingProps {
  currentUser: User;
  onBookConsultation: (lawyer: LawyerProfile) => void;
  currentLanguage?: string;
  initialSelectedLawyerId?: string;
}

export const AdvocateGrading: React.FC<AdvocateGradingProps> = ({
  currentUser,
  onBookConsultation,
  currentLanguage = 'en',
  initialSelectedLawyerId
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLanguage, key);

  const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [gradeFilter, setGradeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('grade');
  
  // Review form states
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewCaseType, setReviewCaseType] = useState<string>('Commercial Dispute');
  const [reviewOutcome, setReviewOutcome] = useState<'Won' | 'Compromised' | 'Ongoing' | 'Lost'>('Won');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewCourt, setReviewCourt] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (gradeFilter !== 'All') params.append('grade', gradeFilter);
      if (sortBy) params.append('sortBy', sortBy);

      const res = await fetch(`/api/lawyers?${params.toString()}`);
      const data = await res.json();
      const list: LawyerProfile[] = data.lawyers || [];
      setLawyers(list);

      if (initialSelectedLawyerId) {
        const found = list.find(l => l.id === initialSelectedLawyerId);
        if (found) setSelectedLawyer(found);
        else if (list.length > 0 && !selectedLawyer) setSelectedLawyer(list[0]);
      } else if (list.length > 0 && !selectedLawyer) {
        setSelectedLawyer(list[0]);
      }
    } catch (error) {
      console.error('Failed to fetch grading records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, [gradeFilter, sortBy]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLawyer || !reviewComment.trim()) return;

    try {
      setSubmittingReview(true);
      const res = await fetch(`/api/lawyers/${selectedLawyer.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewRating,
          caseType: reviewCaseType,
          caseOutcome: reviewOutcome,
          comment: reviewComment.trim(),
          courtName: reviewCourt || selectedLawyer.courts[0] || 'High Court'
        })
      });

      const data = await res.json();
      if (data.success && data.updatedLawyer) {
        setSelectedLawyer(data.updatedLawyer);
        setLawyers(prev => prev.map(l => l.id === data.updatedLawyer.id ? data.updatedLawyer : l));
        setReviewSuccessMsg(data.message || 'Review submitted successfully!');
        setReviewComment('');
        setTimeout(() => {
          setShowReviewModal(false);
          setReviewSuccessMsg(null);
        }, 1500);
      }
    } catch (err) {
      console.error('Review submit failed:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'from-amber-400 to-amber-600 text-zinc-950 border-amber-300 shadow-amber-500/20';
      case 'A':
        return 'from-emerald-400 to-emerald-600 text-zinc-950 border-emerald-300 shadow-emerald-500/20';
      case 'B+':
        return 'from-blue-400 to-blue-600 text-zinc-950 border-blue-300 shadow-blue-500/20';
      default:
        return 'from-purple-400 to-purple-600 text-zinc-950 border-purple-300 shadow-purple-500/20';
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'Won':
        return {
          label: t('casesWon'),
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80',
          dot: 'bg-emerald-400'
        };
      case 'Compromised':
        return {
          label: t('casesCompromised'),
          bg: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/80',
          dot: 'bg-cyan-400'
        };
      case 'Ongoing':
        return {
          label: t('casesOngoing'),
          bg: 'bg-amber-950/80 text-amber-300 border-amber-700/80',
          dot: 'bg-amber-400'
        };
      default:
        return {
          label: t('casesLost'),
          bg: 'bg-rose-950/80 text-rose-300 border-rose-700/80',
          dot: 'bg-rose-400'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-amber-950/70 border border-amber-800/60 text-amber-300 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('gradingStarsBadges')}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-cinzel">
            {t('lawyerGradingTitle')}
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            {t('lawyerGradingSubtitle')}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="bg-zinc-900 text-xs text-slate-200 border border-zinc-700 rounded-xl px-3 py-2 focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="All">{t('allGrades')}</option>
            <option value="A+">Grade A+ (Senior Master Litigator)</option>
            <option value="A">Grade A (High Efficiency)</option>
            <option value="B+">Grade B+ (Fast-Track Counsel)</option>
            <option value="B">Grade B (Active Practitioner)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-900 text-xs text-slate-200 border border-zinc-700 rounded-xl px-3 py-2 focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="grade">{t('sortByGrade')}</option>
            <option value="win_rate">{t('sortByWinRate')}</option>
            <option value="cases_compromised">{t('sortByCompromised')}</option>
            <option value="rating">{t('sortHighestRated')}</option>
            <option value="experience">{t('sortExperience')}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-medium">{t('queryingAdvocates')}</p>
        </div>
      ) : lawyers.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">{t('noAdvocatesFound')}</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">{t('noAdvocatesDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Lawyer Selector List */}
          <div className="lg:col-span-5 space-y-3 max-h-[780px] overflow-y-auto pr-1">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-2">
              {t('originalAdvocatesTitle')} ({lawyers.length})
            </span>

            {lawyers.map((lawyer) => {
              const isSelected = selectedLawyer?.id === lawyer.id;
              const gradeClass = getGradeColor(lawyer.grade);

              return (
                <div
                  key={lawyer.id}
                  id={`grading-card-${lawyer.id}`}
                  onClick={() => setSelectedLawyer(lawyer)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 border-amber-500/80 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/50'
                      : 'bg-zinc-950 hover:bg-zinc-900/60 border-zinc-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={lawyer.avatar}
                          alt={lawyer.name}
                          className="w-12 h-12 rounded-xl object-cover border border-zinc-700"
                        />
                        <span
                          className={`absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-md bg-gradient-to-r ${gradeClass} text-[10px] font-black shadow-md border`}
                        >
                          {lawyer.grade}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          {lawyer.name}
                          {lawyer.isVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="BCI Verified" />
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{lawyer.stateBarCouncil}</p>
                        
                        <div className="flex items-center space-x-3 mt-1 text-[11px]">
                          <span className="flex items-center text-amber-400 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400 mr-1" />
                            {lawyer.rating} ({lawyer.reviewsCount || 0})
                          </span>
                          <span className="text-emerald-400 font-medium">
                            {lawyer.winRate}% {t('winRate')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        isSelected ? 'text-amber-400 translate-x-1' : ''
                      }`}
                    />
                  </div>

                  {/* Badges mini pills */}
                  {lawyer.badges && lawyer.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3 pt-2.5 border-t border-zinc-800/60">
                      {lawyer.badges.slice(0, 3).map((badge) => (
                        <span
                          key={badge}
                          className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 border border-zinc-800 text-slate-300 font-medium"
                        >
                          🏅 {badge}
                        </span>
                      ))}
                      {lawyer.badges.length > 3 && (
                        <span className="text-[10px] text-slate-500 font-medium self-center">
                          +{lawyer.badges.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Grading Slide & Performance Dossier */}
          {selectedLawyer && (
            <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in">
              
              {/* Header with Large Grade Shield */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedLawyer.avatar}
                    alt={selectedLawyer.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-600/80 shadow-lg"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-white font-cinzel">{selectedLawyer.name}</h3>
                      {selectedLawyer.isVerified && (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[11px] font-bold border border-emerald-700">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{t('verifiedBadge')}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedLawyer.stateBarCouncil} • {selectedLawyer.barCouncilNumber}</p>
                    <p className="text-xs text-slate-300 mt-1">{selectedLawyer.experienceYears} {t('yearsExperience')} • {selectedLawyer.courts.join(', ')}</p>
                  </div>
                </div>

                {/* Grade Badge Standout */}
                <div className="flex items-center sm:flex-col items-end sm:items-end justify-between bg-zinc-900 p-3.5 sm:p-4 rounded-2xl border border-zinc-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1 block">
                    {t('gradeTier')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3.5 py-1 rounded-xl bg-gradient-to-r ${getGradeColor(selectedLawyer.grade)} text-sm font-black shadow-lg border`}>
                      Grade {selectedLawyer.grade}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-semibold mt-1 hidden sm:block">
                    {selectedLawyer.tierTitle || 'Certified Trial Counsel'}
                  </span>
                </div>
              </div>

              {/* 5-Metric Performance Matrix (Cases Taken, Won, Lost, Compromised, Ongoing) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4" />
                    {t('performanceStats')}
                  </h4>
                  <span className="text-xs text-slate-400 font-semibold">
                    {t('casesTakenTotal')}: <strong className="text-white font-mono text-sm">{selectedLawyer.casesTotal}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  
                  {/* Won */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-800/50">
                    <span className="text-[11px] text-emerald-400 font-bold block mb-1 flex items-center justify-between">
                      {t('casesWon')}
                      <span className="text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-700">🏆 {selectedLawyer.winRate}%</span>
                    </span>
                    <span className="text-2xl font-black text-white font-mono">
                      {selectedLawyer.casesWon}
                    </span>
                    <span className="text-[10px] text-emerald-300/80 block mt-1">Favorable Judgments</span>
                  </div>

                  {/* Compromised / Settled */}
                  <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-800/50">
                    <span className="text-[11px] text-cyan-400 font-bold block mb-1 flex items-center justify-between">
                      {t('casesCompromised')}
                      <span className="text-[10px] bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-700">🤝 {selectedLawyer.compromiseRate || 12}%</span>
                    </span>
                    <span className="text-2xl font-black text-white font-mono">
                      {selectedLawyer.casesCompromised}
                    </span>
                    <span className="text-[10px] text-cyan-300/80 block mt-1">Mediation / Lok Adalat</span>
                  </div>

                  {/* Still Going On */}
                  <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/50">
                    <span className="text-[11px] text-amber-400 font-bold block mb-1 flex items-center justify-between">
                      {t('casesOngoing')}
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                    </span>
                    <span className="text-2xl font-black text-white font-mono">
                      {selectedLawyer.casesOngoing}
                    </span>
                    <span className="text-[10px] text-amber-300/80 block mt-1">In Active Hearings</span>
                  </div>

                  {/* Lost */}
                  <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-800/50">
                    <span className="text-[11px] text-rose-400 font-bold block mb-1 flex items-center justify-between">
                      {t('casesLost')}
                      <Scale className="w-3.5 h-3.5 text-rose-400" />
                    </span>
                    <span className="text-2xl font-black text-white font-mono">
                      {selectedLawyer.casesLost}
                    </span>
                    <span className="text-[10px] text-rose-300/80 block mt-1">Dismissed / Appeal</span>
                  </div>

                </div>

                {/* Progress Visual Bar */}
                <div className="mt-3 bg-zinc-900 rounded-full h-3 flex overflow-hidden p-0.5 border border-zinc-800">
                  <div
                    style={{ width: `${(selectedLawyer.casesWon / selectedLawyer.casesTotal) * 100}%` }}
                    className="bg-emerald-500 h-full rounded-l-full"
                    title={`Won: ${selectedLawyer.casesWon}`}
                  />
                  <div
                    style={{ width: `${(selectedLawyer.casesCompromised / selectedLawyer.casesTotal) * 100}%` }}
                    className="bg-cyan-500 h-full"
                    title={`Compromised: ${selectedLawyer.casesCompromised}`}
                  />
                  <div
                    style={{ width: `${(selectedLawyer.casesOngoing / selectedLawyer.casesTotal) * 100}%` }}
                    className="bg-amber-500 h-full"
                    title={`Ongoing: ${selectedLawyer.casesOngoing}`}
                  />
                  <div
                    style={{ width: `${(selectedLawyer.casesLost / selectedLawyer.casesTotal) * 100}%` }}
                    className="bg-rose-500 h-full rounded-r-full"
                    title={`Lost: ${selectedLawyer.casesLost}`}
                  />
                </div>
              </div>

              {/* Earned Badges Section */}
              {selectedLawyer.badges && selectedLawyer.badges.length > 0 && (
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {t('badgesTitle')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLawyer.badges.map((b) => (
                      <span
                        key={b}
                        className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-700/60 text-xs font-semibold shadow-sm"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>{b}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Reviews Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-red-400" />
                      {t('clientReviews')} ({selectedLawyer.reviews?.length || 0})
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Average Rating: <strong className="text-amber-400">★ {selectedLawyer.rating} / 5.0</strong> based on verified client courtroom matters.
                    </p>
                  </div>

                  <button
                    id="btn-open-review-modal"
                    onClick={() => setShowReviewModal(true)}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-600/40 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{t('writeReviewBtn')}</span>
                  </button>
                </div>

                {/* Reviews List */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {selectedLawyer.reviews && selectedLawyer.reviews.length > 0 ? (
                    selectedLawyer.reviews.map((rev) => {
                      const outcomeInfo = getOutcomeBadge(rev.caseOutcome);

                      return (
                        <div
                          key={rev.id}
                          className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center space-x-2.5">
                              {rev.clientAvatar ? (
                                <img
                                  src={rev.clientAvatar}
                                  alt={rev.clientName}
                                  className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-red-950 border border-red-800 text-red-300 flex items-center justify-center font-bold text-xs">
                                  {rev.clientName.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-bold text-white">{rev.clientName}</span>
                                  {rev.verifiedLitigant && (
                                    <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-semibold">
                                      <UserCheck className="w-3 h-3" />
                                      <span>{t('verifiedLitigantBadge')}</span>
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-500">{rev.createdAt} • {rev.courtName || 'High Court'}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${outcomeInfo.bg}`}>
                                {outcomeInfo.label}
                              </span>
                              <div className="flex text-amber-400 text-xs">
                                {'★'.repeat(rev.rating)}
                                {'☆'.repeat(5 - rev.rating)}
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed pl-1">
                            "{rev.comment}"
                          </p>

                          <div className="flex items-center space-x-2 text-[10px] text-slate-400 pt-1 border-t border-zinc-800/40">
                            <span className="font-semibold text-slate-300">Matter Type:</span>
                            <span className="bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">{rev.caseType}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-xs text-slate-400">
                      No client reviews yet. Be the first to share your litigation experience with this advocate!
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer: Book Consultation */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold block">{t('initialLegalAdvisoryFee')}</span>
                  <span className="text-xl font-extrabold text-amber-400">
                    ₹{selectedLawyer.consultationFee.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  id={`btn-book-consult-${selectedLawyer.id}`}
                  onClick={() => onBookConsultation(selectedLawyer)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-bold text-sm shadow-xl border border-red-500/40 active:scale-95 transition-all cursor-pointer"
                >
                  <span>{t('bookConsultationNow')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Review Submission Modal */}
      {showReviewModal && selectedLawyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 text-slate-200">
            
            <h3 className="text-lg font-bold text-white font-cinzel mb-1 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              {t('shareFeedback')}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Adv. {selectedLawyer.name} • {selectedLawyer.barCouncilNumber}
            </p>

            {reviewSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-sm font-semibold text-center">
                ✓ {reviewSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                
                {/* Rating selection */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">{t('yourRating')}</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1.5 rounded-lg hover:bg-zinc-900 transition-colors"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-amber-400 ml-2">{reviewRating}.0 / 5.0</span>
                  </div>
                </div>

                {/* Case Outcome */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{t('caseOutcomeLabel')}</label>
                  <select
                    value={reviewOutcome}
                    onChange={(e) => setReviewOutcome(e.target.value as any)}
                    className="w-full bg-zinc-900 text-slate-200 border border-zinc-700 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Won">{t('outcomeWon')}</option>
                    <option value="Compromised">{t('outcomeCompromised')}</option>
                    <option value="Ongoing">{t('outcomeOngoing')}</option>
                    <option value="Lost">{t('outcomeLost')}</option>
                  </select>
                </div>

                {/* Case Type & Court */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">{t('caseTypeLabel')}</label>
                    <input
                      type="text"
                      value={reviewCaseType}
                      onChange={(e) => setReviewCaseType(e.target.value)}
                      placeholder="e.g. Commercial Dispute"
                      className="w-full bg-zinc-900 text-slate-200 border border-zinc-700 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">{t('courtTribunalLabel')}</label>
                    <input
                      type="text"
                      value={reviewCourt}
                      onChange={(e) => setReviewCourt(e.target.value)}
                      placeholder="e.g. Delhi High Court"
                      className="w-full bg-zinc-900 text-slate-200 border border-zinc-700 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{t('clientReviews')}</label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={t('reviewPlaceholder')}
                    required
                    className="w-full bg-zinc-900 text-slate-200 border border-zinc-700 rounded-xl p-3 text-xs leading-relaxed focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-400 text-xs font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Submitting...' : t('submitReview')}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
