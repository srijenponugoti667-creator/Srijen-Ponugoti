import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertCircle, 
  Star, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Phone, 
  Mail, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  UserPlus, 
  X,
  TrendingUp,
  Clock,
  Scale,
  MessageSquare,
  Sparkles,
  UserCheck,
  Send,
  BarChart3
} from 'lucide-react';
import { LawyerProfile, User } from '../types';
import { getTranslation } from '../languages';

interface LawyerDirectoryProps {
  currentUser: User;
  onBookConsultation: (lawyer: LawyerProfile) => void;
  onOpenVerifyModal: () => void;
  currentLanguage?: string;
  onNavigateToGrading?: (lawyerId?: string) => void;
}

export const LawyerDirectory: React.FC<LawyerDirectoryProps> = ({
  currentUser,
  onBookConsultation,
  onOpenVerifyModal,
  currentLanguage = 'en',
  onNavigateToGrading
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLanguage, key);
  const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [selectedCourt, setSelectedCourt] = useState<string>('All');
  const [minExp, setMinExp] = useState<string>('0');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [gradeFilter, setGradeFilter] = useState<string>('All');
  const [activeLawyerDetail, setActiveLawyerDetail] = useState<LawyerProfile | null>(null);
  const [modalTab, setModalTab] = useState<'profile' | 'grading'>('profile');

  // Review form state inside modal
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewCaseType, setReviewCaseType] = useState<string>('Commercial Dispute');
  const [reviewOutcome, setReviewOutcome] = useState<'Won' | 'Compromised' | 'Ongoing' | 'Lost'>('Won');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewCourt, setReviewCourt] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);

  const specialties = [
    'All',
    'Commercial Dispute',
    'Constitutional Writ',
    'Cyber Crime',
    'Civil & Property',
    'Corporate Arbitration',
    'Criminal Defense',
    'Intellectual Property',
    'Family Law'
  ];

  const courtsList = [
    'All',
    'Supreme Court of India',
    'Delhi High Court',
    'Bombay High Court',
    'Madras High Court',
    'Karnataka High Court',
    'Calcutta High Court'
  ];

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (selectedSpecialty !== 'All') params.append('specialization', selectedSpecialty);
      if (verifiedOnly) params.append('verifiedOnly', 'true');
      if (selectedCourt !== 'All') params.append('court', selectedCourt);
      if (minExp !== '0') params.append('minExp', minExp);
      if (gradeFilter !== 'All') params.append('grade', gradeFilter);
      if (sortBy) params.append('sortBy', sortBy);

      const res = await fetch(`/api/lawyers?${params.toString()}`);
      const data = await res.json();
      setLawyers(data.lawyers || []);
    } catch (error) {
      console.error('Failed to fetch lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, [searchQuery, selectedSpecialty, verifiedOnly, selectedCourt, minExp, gradeFilter, sortBy]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLawyerDetail || !reviewComment.trim()) return;

    try {
      setSubmittingReview(true);
      const res = await fetch(`/api/lawyers/${activeLawyerDetail.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewRating,
          caseType: reviewCaseType,
          caseOutcome: reviewOutcome,
          comment: reviewComment.trim(),
          courtName: reviewCourt || activeLawyerDetail.courts[0] || 'High Court'
        })
      });

      const data = await res.json();
      if (data.success && data.updatedLawyer) {
        setActiveLawyerDetail(data.updatedLawyer);
        setLawyers(prev => prev.map(l => l.id === data.updatedLawyer.id ? data.updatedLawyer : l));
        setReviewSuccessMsg(data.message || 'Review submitted successfully!');
        setReviewComment('');
        setTimeout(() => {
          setShowReviewForm(false);
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
        return 'from-amber-400 to-amber-600 text-zinc-950 border-amber-300';
      case 'A':
        return 'from-emerald-400 to-emerald-600 text-zinc-950 border-emerald-300';
      case 'B+':
        return 'from-blue-400 to-blue-600 text-zinc-950 border-blue-300';
      default:
        return 'from-purple-400 to-purple-600 text-zinc-950 border-purple-300';
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'Won':
        return { label: t('casesWon'), bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80' };
      case 'Compromised':
        return { label: t('casesCompromised'), bg: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/80' };
      case 'Ongoing':
        return { label: t('casesOngoing'), bg: 'bg-amber-950/80 text-amber-300 border-amber-700/80' };
      default:
        return { label: t('casesLost'), bg: 'bg-rose-950/80 text-rose-300 border-rose-700/80' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-red-950/70 border border-red-800/60 text-red-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span>{t('bciVerifiedDirectoryBadge')}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-cinzel">
            {t('findLawyer')}
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            {t('filterAdvocatesDesc')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToGrading && (
            <button
              onClick={() => onNavigateToGrading()}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-700 font-bold text-xs shadow-lg transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>{t('viewGradingSlide')}</span>
            </button>
          )}

          {currentUser.role === 'lawyer' && !currentUser.isVerifiedLawyer && (
            <button
              onClick={onOpenVerifyModal}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('completeBarVerificationBtn')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Main Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="search-lawyer-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-white placeholder-zinc-500 text-sm outline-none transition-colors"
            />
          </div>

          {/* Court Filter Dropdown */}
          <div className="md:col-span-3">
            <select
              id="filter-court-select"
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-red-600 text-slate-200 text-sm outline-none"
            >
              {courtsList.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? t('allCourtsJurisdictions') : c}
                </option>
              ))}
            </select>
          </div>

          {/* Grade Tier Filter */}
          <div className="md:col-span-2">
            <select
              id="filter-grade-select"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-slate-200 text-sm outline-none"
            >
              <option value="All">{t('allGrades')}</option>
              <option value="A+">Grade A+</option>
              <option value="A">Grade A</option>
              <option value="B+">Grade B+</option>
              <option value="B">Grade B</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="md:col-span-3">
            <select
              id="filter-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-red-600 text-slate-200 text-sm outline-none"
            >
              <option value="rating">{t('sortHighestRated')}</option>
              <option value="grade">{t('sortByGrade')}</option>
              <option value="win_rate">{t('sortByWinRate')}</option>
              <option value="cases_compromised">{t('sortByCompromised')}</option>
              <option value="experience">{t('sortExperience')}</option>
              <option value="cases_won">{t('sortCasesWon')}</option>
              <option value="fee_asc">{t('sortConsultFee')}</option>
              <option value="fee_desc">{t('sortFeeDesc')}</option>
            </select>
          </div>

        </div>

        {/* Secondary Row: Specialization Filter Pills & Verified Toggle */}
        <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center mr-1">
              <Filter className="w-3.5 h-3.5 mr-1 text-red-400" /> {t('practiceAreaFilter')}
            </span>
            {specialties.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSpecialty(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedSpecialty === s
                    ? 'bg-red-900 text-white border border-red-600 shadow-sm'
                    : 'bg-zinc-950 text-slate-400 hover:text-slate-200 hover:bg-zinc-800 border border-zinc-800/80'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                id="checkbox-verified-only"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-zinc-950 border-zinc-700"
              />
              <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('verifiedOnly')}</span>
              </span>
            </label>

            <span className="text-xs text-slate-500 font-mono">
              ({lawyers.length} {t('advocatesCount')})
            </span>
          </div>
        </div>
      </div>

      {/* Lawyers Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">{t('queryingAdvocates')}</p>
        </div>
      ) : lawyers.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">{t('noAdvocatesFound')}</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-4">
            {t('noAdvocatesDesc')}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecialty('All');
              setVerifiedOnly(false);
              setSelectedCourt('All');
              setGradeFilter('All');
            }}
            className="px-4 py-2 bg-red-950 hover:bg-red-900 text-red-200 text-xs font-bold rounded-lg border border-red-800"
          >
            {t('resetFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.map((lawyer) => {
            const gradeClass = getGradeColor(lawyer.grade);

            return (
              <div
                key={lawyer.id}
                id={`lawyer-card-${lawyer.id}`}
                className="rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-red-800/60 transition-all duration-300 p-6 flex flex-col justify-between shadow-lg group hover:shadow-2xl hover:shadow-red-950/20"
              >
                <div>
                  {/* Card Top: Avatar, Name, Grade & Verification */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center space-x-3.5">
                      <div className="relative">
                        <img
                          src={lawyer.avatar}
                          alt={lawyer.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-red-900/80 shadow-md group-hover:scale-105 transition-transform"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r ${gradeClass} text-[10px] font-black shadow-md border`}
                          title={`Grading Tier: Grade ${lawyer.grade}`}
                        >
                          {lawyer.grade}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-red-300 transition-colors">
                          {lawyer.name}
                        </h3>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-400">{lawyer.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Verified Badge */}
                    {lawyer.isVerified ? (
                      <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 text-[11px] font-bold shadow-sm" title={t('barVerified')}>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t('verifiedBadge')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[11px] font-semibold" title={t('verificationInProgress')}>
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('pendingBadge')}</span>
                      </div>
                    )}
                  </div>

                  {/* Litigation Track Record Pill Box */}
                  <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 mb-3 grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div>
                      <span className="text-slate-500 text-[10px] block">{t('casesTakenTotal')}</span>
                      <span className="font-bold text-white font-mono">{lawyer.casesTotal || lawyer.casesResolved}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">{t('winRate')}</span>
                      <span className="font-bold text-emerald-400 font-mono">🏆 {lawyer.winRate}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">{t('casesCompromised')}</span>
                      <span className="font-bold text-cyan-400 font-mono">🤝 {lawyer.casesCompromised}</span>
                    </div>
                  </div>

                  {/* Bar Council Number & Experience */}
                  <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 mb-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t('barEnrollment')}</span>
                      <span className="font-mono font-semibold text-slate-200">{lawyer.barCouncilNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t('experienceLabel')}</span>
                      <span className="font-semibold text-red-300">{lawyer.experienceYears} {t('yearsActive')}</span>
                    </div>
                  </div>

                  {/* Specialization Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {lawyer.specialization.slice(0, 3).map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 rounded-md bg-red-950/60 text-red-300 border border-red-900/60 text-[11px] font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Badges preview */}
                  {lawyer.badges && lawyer.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {lawyer.badges.slice(0, 2).map((b) => (
                        <span key={b} className="text-[10px] text-amber-300 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                          🏅 {b}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Practice Courts */}
                  <div className="mb-3">
                    <span className="text-[11px] text-slate-400 font-semibold block mb-1">{t('appearsBefore')}</span>
                    <div className="flex flex-wrap gap-1">
                      {lawyer.courts.map((court) => (
                        <span key={court} className="text-[11px] text-slate-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                          {court}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer: Fee & Action Buttons */}
                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t('consultFee')}</span>
                    <span className="text-base font-extrabold text-amber-400">
                      ₹{lawyer.consultationFee.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      id={`btn-grading-slide-${lawyer.id}`}
                      onClick={() => {
                        setActiveLawyerDetail(lawyer);
                        setModalTab('grading');
                      }}
                      className="p-2 rounded-lg bg-amber-950/40 hover:bg-amber-900 text-amber-300 border border-amber-700/60 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      title={t('grading')}
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lawyer.grade}</span>
                    </button>

                    <button
                      id={`btn-view-lawyer-${lawyer.id}`}
                      onClick={() => {
                        setActiveLawyerDetail(lawyer);
                        setModalTab('profile');
                      }}
                      className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-slate-300 border border-zinc-800 text-xs font-semibold"
                      title={t('viewProfile')}
                    >
                      {t('detailsBtn')}
                    </button>

                    <button
                      id={`btn-book-consultation-${lawyer.id}`}
                      onClick={() => onBookConsultation(lawyer)}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-bold text-xs shadow-md border border-red-600/40 active:scale-95 transition-all cursor-pointer"
                    >
                      <span>{t('consultBtn')}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Advocate Detail & Grading Slide Modal */}
      {activeLawyerDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 text-slate-200 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveLawyerDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
              <div className="flex items-start space-x-4">
                <img
                  src={activeLawyerDetail.avatar}
                  alt={activeLawyerDetail.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-red-700 shadow-lg"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-white font-cinzel">{activeLawyerDetail.name}</h3>
                    {activeLawyerDetail.isVerified ? (
                      <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t('barVerified')}</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 text-xs font-bold border border-amber-700">
                        {t('verificationInProgress')}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-400 mt-1">{activeLawyerDetail.stateBarCouncil}</p>
                  <div className="flex items-center space-x-3 mt-2 text-xs text-slate-300">
                    <span className="font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      ID: {activeLawyerDetail.barCouncilNumber}
                    </span>
                    <span className="text-amber-400 font-semibold">⭐ {activeLawyerDetail.rating} ({activeLawyerDetail.reviewsCount || 0} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Grading Badge in Header */}
              <div className="flex items-center space-x-2 bg-zinc-900 px-3.5 py-2 rounded-2xl border border-zinc-800">
                <span className={`px-3 py-1 rounded-xl bg-gradient-to-r ${getGradeColor(activeLawyerDetail.grade)} text-xs font-black shadow-md border`}>
                  Grade {activeLawyerDetail.grade}
                </span>
                <span className="text-xs text-amber-300 font-semibold">
                  {activeLawyerDetail.tierTitle || 'Senior Litigator'}
                </span>
              </div>
            </div>

            {/* Slide Navigation Tabs */}
            <div className="flex items-center space-x-2 mb-6 border-b border-zinc-800 pb-2">
              <button
                onClick={() => setModalTab('profile')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modalTab === 'profile'
                    ? 'bg-red-950 text-red-200 border border-red-700 shadow-md'
                    : 'bg-zinc-900 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                {t('practiceProfile')}
              </button>

              <button
                onClick={() => setModalTab('grading')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modalTab === 'grading'
                    ? 'bg-amber-950 text-amber-200 border border-amber-700 shadow-md'
                    : 'bg-zinc-900 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('grading')} & Case Status</span>
              </button>
            </div>

            {/* Slide 1: Practice Profile */}
            {modalTab === 'profile' && (
              <div className="space-y-4 text-sm animate-in fade-in">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <h4 className="text-xs uppercase font-bold text-red-400 tracking-wider mb-2">{t('practiceProfile')}</h4>
                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">{activeLawyerDetail.bio}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <span className="text-xs text-slate-400 block mb-1">{t('appearingCourts')}</span>
                    <p className="text-xs font-semibold text-slate-200">{activeLawyerDetail.courts.join(', ')}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <span className="text-xs text-slate-400 block mb-1">{t('availableSchedule')}</span>
                    <p className="text-xs font-semibold text-red-300">{activeLawyerDetail.availableDays.join(' • ')}</p>
                  </div>
                </div>

                {/* Badges preview */}
                {activeLawyerDetail.badges && activeLawyerDetail.badges.length > 0 && (
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">{t('badgesTitle')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeLawyerDetail.badges.map((b) => (
                        <span key={b} className="text-xs text-amber-300 bg-amber-950/40 border border-amber-800/60 px-3 py-1 rounded-xl flex items-center gap-1.5 font-medium">
                          🏅 {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Slide 2: Grading, 5-Metric Status & Client Reviews */}
            {modalTab === 'grading' && (
              <div className="space-y-5 text-sm animate-in fade-in">
                
                {/* 5-Status Grid: Cases Taken, Won, Lost, Compromised, Ongoing */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4" />
                      {t('performanceStats')}
                    </h4>
                    <span className="text-xs text-slate-400">
                      {t('casesTakenTotal')}: <strong className="text-white font-mono text-sm">{activeLawyerDetail.casesTotal}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Won */}
                    <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/60">
                      <span className="text-[11px] text-emerald-400 font-bold block mb-1">
                        {t('casesWon')}
                      </span>
                      <span className="text-2xl font-black text-white font-mono">
                        {activeLawyerDetail.casesWon}
                      </span>
                      <span className="text-[10px] text-emerald-300/80 block mt-0.5">🏆 {activeLawyerDetail.winRate}% Win Rate</span>
                    </div>

                    {/* Compromised */}
                    <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/60">
                      <span className="text-[11px] text-cyan-400 font-bold block mb-1">
                        {t('casesCompromised')}
                      </span>
                      <span className="text-2xl font-black text-white font-mono">
                        {activeLawyerDetail.casesCompromised}
                      </span>
                      <span className="text-[10px] text-cyan-300/80 block mt-0.5">🤝 {activeLawyerDetail.compromiseRate || 12}% Settled</span>
                    </div>

                    {/* Ongoing */}
                    <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/60">
                      <span className="text-[11px] text-amber-400 font-bold block mb-1 flex items-center justify-between">
                        {t('casesOngoing')}
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                      </span>
                      <span className="text-2xl font-black text-white font-mono">
                        {activeLawyerDetail.casesOngoing}
                      </span>
                      <span className="text-[10px] text-amber-300/80 block mt-0.5">In Trial / Hearings</span>
                    </div>

                    {/* Lost */}
                    <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-800/60">
                      <span className="text-[11px] text-rose-400 font-bold block mb-1 flex items-center justify-between">
                        {t('casesLost')}
                        <Scale className="w-3.5 h-3.5 text-rose-400" />
                      </span>
                      <span className="text-2xl font-black text-white font-mono">
                        {activeLawyerDetail.casesLost}
                      </span>
                      <span className="text-[10px] text-rose-300/80 block mt-0.5">Dismissed / Appeals</span>
                    </div>
                  </div>

                  {/* Distribution Progress Bar */}
                  <div className="mt-3 bg-zinc-900 rounded-full h-3 flex overflow-hidden p-0.5 border border-zinc-800">
                    <div
                      style={{ width: `${(activeLawyerDetail.casesWon / activeLawyerDetail.casesTotal) * 100}%` }}
                      className="bg-emerald-500 h-full rounded-l-full"
                      title={`Won: ${activeLawyerDetail.casesWon}`}
                    />
                    <div
                      style={{ width: `${(activeLawyerDetail.casesCompromised / activeLawyerDetail.casesTotal) * 100}%` }}
                      className="bg-cyan-500 h-full"
                      title={`Compromised: ${activeLawyerDetail.casesCompromised}`}
                    />
                    <div
                      style={{ width: `${(activeLawyerDetail.casesOngoing / activeLawyerDetail.casesTotal) * 100}%` }}
                      className="bg-amber-500 h-full"
                      title={`Ongoing: ${activeLawyerDetail.casesOngoing}`}
                    />
                    <div
                      style={{ width: `${(activeLawyerDetail.casesLost / activeLawyerDetail.casesTotal) * 100}%` }}
                      className="bg-rose-500 h-full rounded-r-full"
                      title={`Lost: ${activeLawyerDetail.casesLost}`}
                    />
                  </div>
                </div>

                {/* Client Reviews & Rating Section */}
                <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-red-400" />
                      {t('clientReviews')} ({activeLawyerDetail.reviews?.length || 0})
                    </h4>

                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {showReviewForm ? 'Close Form' : `+ ${t('writeReviewBtn')}`}
                    </button>
                  </div>

                  {/* Review submission inline form */}
                  {showReviewForm && (
                    <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
                      {reviewSuccessMsg && (
                        <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-300 font-semibold text-center border border-emerald-700">
                          ✓ {reviewSuccessMsg}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">{t('yourRating')}</label>
                          <div className="flex items-center space-x-1 text-amber-400 text-base">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="cursor-pointer"
                              >
                                {star <= reviewRating ? '★' : '☆'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-400 font-bold mb-1">{t('caseOutcomeLabel')}</label>
                          <select
                            value={reviewOutcome}
                            onChange={(e) => setReviewOutcome(e.target.value as any)}
                            className="w-full bg-zinc-900 text-slate-200 border border-zinc-700 rounded-lg p-2 text-xs"
                          >
                            <option value="Won">{t('outcomeWon')}</option>
                            <option value="Compromised">{t('outcomeCompromised')}</option>
                            <option value="Ongoing">{t('outcomeOngoing')}</option>
                            <option value="Lost">{t('outcomeLost')}</option>
                          </select>
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder={t('reviewPlaceholder')}
                        required
                        className="w-full bg-zinc-900 text-slate-200 border border-zinc-700 rounded-lg p-2.5 text-xs"
                      />

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                      >
                        {submittingReview ? 'Submitting...' : t('submitReview')}
                      </button>
                    </form>
                  )}

                  {/* Reviews items */}
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {activeLawyerDetail.reviews && activeLawyerDetail.reviews.length > 0 ? (
                      activeLawyerDetail.reviews.map((rev) => {
                        const out = getOutcomeBadge(rev.caseOutcome);
                        return (
                          <div key={rev.id} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-white">{rev.clientName}</span>
                                {rev.verifiedLitigant && (
                                  <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                                    <UserCheck className="w-3 h-3" />
                                    <span>Verified</span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${out.bg}`}>
                                  {out.label}
                                </span>
                                <span className="text-amber-400 font-mono">{'★'.repeat(rev.rating)}</span>
                              </div>
                            </div>
                            <p className="text-slate-300 text-xs">"{rev.comment}"</p>
                            <span className="text-[10px] text-slate-500 block">{rev.createdAt} • {rev.caseType} • {rev.courtName || 'High Court'}</span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-3">No client reviews yet.</p>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* Modal Bottom Footer: Fee & Consultation Action */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-red-900/60 mt-6">
              <div>
                <span className="text-xs text-slate-400 block">{t('initialLegalAdvisoryFee')}</span>
                <span className="text-xl font-extrabold text-amber-400">₹{activeLawyerDetail.consultationFee.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={() => {
                  const l = activeLawyerDetail;
                  setActiveLawyerDetail(null);
                  onBookConsultation(l);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 text-white font-bold text-sm shadow-lg border border-red-500/40 cursor-pointer"
              >
                {t('bookConsultationNow')}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

