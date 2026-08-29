import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldCheck, AlertCircle, Star, MapPin, Briefcase, Calendar, Phone, Mail, Award, CheckCircle2, ChevronRight, UserPlus, X } from 'lucide-react';
import { LawyerProfile, User } from '../types';

interface LawyerDirectoryProps {
  currentUser: User;
  onBookConsultation: (lawyer: LawyerProfile) => void;
  onOpenVerifyModal: () => void;
}

export const LawyerDirectory: React.FC<LawyerDirectoryProps> = ({
  currentUser,
  onBookConsultation,
  onOpenVerifyModal,
}) => {
  const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [selectedCourt, setSelectedCourt] = useState<string>('All');
  const [minExp, setMinExp] = useState<string>('0');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [activeLawyerDetail, setActiveLawyerDetail] = useState<LawyerProfile | null>(null);

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
  }, [searchQuery, selectedSpecialty, verifiedOnly, selectedCourt, minExp, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-red-950/70 border border-red-800/60 text-red-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span>Bar Council of India Verified Directory</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-cinzel">
            Find a Verified Advocate
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Browse authenticated counsels across High Courts and the Supreme Court. All verified lawyers are audited for active Bar Council license and practice standing.
          </p>
        </div>

        {currentUser.role === 'lawyer' && !currentUser.isVerifiedLawyer && (
          <button
            onClick={onOpenVerifyModal}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Complete Bar Council Verification</span>
          </button>
        )}
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
              placeholder="Search by advocate name, city, or bar ID..."
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
                  {c === 'All' ? 'All Courts & Jurisdictions' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div className="md:col-span-2">
            <select
              id="filter-exp-select"
              value={minExp}
              onChange={(e) => setMinExp(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-red-600 text-slate-200 text-sm outline-none"
            >
              <option value="0">Any Experience</option>
              <option value="3">3+ Years Active</option>
              <option value="7">7+ Years Active</option>
              <option value="12">12+ Years Senior</option>
              <option value="15">15+ Years Veteran</option>
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
              <option value="rating">Sort: Highest Rated ⭐</option>
              <option value="experience">Sort: Most Experienced ⚖️</option>
              <option value="cases_won">Sort: Most Cases Resolved 🏆</option>
              <option value="fee_asc">Sort: Fee (Lowest First)</option>
              <option value="fee_desc">Sort: Fee (Highest First)</option>
            </select>
          </div>

        </div>

        {/* Secondary Row: Specialization Filter Pills & Verified Toggle */}
        <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center mr-1">
              <Filter className="w-3.5 h-3.5 mr-1 text-red-400" /> Area:
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
                <span>Verified Only</span>
              </span>
            </label>

            <span className="text-xs text-slate-500 font-mono">
              ({lawyers.length} Advocates)
            </span>
          </div>
        </div>
      </div>

      {/* Lawyers Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Querying certified judicial advocate repository...</p>
        </div>
      ) : lawyers.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Advocates Found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-4">
            Try adjusting your search query, selecting different practice areas, or toggling off the strict verification filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecialty('All');
              setVerifiedOnly(false);
              setSelectedCourt('All');
            }}
            className="px-4 py-2 bg-red-950 hover:bg-red-900 text-red-200 text-xs font-bold rounded-lg border border-red-800"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              id={`lawyer-card-${lawyer.id}`}
              className="rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-red-800/60 transition-all duration-300 p-6 flex flex-col justify-between shadow-lg group hover:shadow-2xl hover:shadow-red-950/20"
            >
              <div>
                {/* Card Top: Avatar, Name, Verification */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={lawyer.avatar}
                      alt={lawyer.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-red-900/80 shadow-md group-hover:scale-105 transition-transform"
                    />
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
                    <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 text-[11px] font-bold shadow-sm" title="Bar Council Verified">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[11px] font-semibold" title="Bar License Verification in Review">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pending</span>
                    </div>
                  )}
                </div>

                {/* Bar Council Number & Experience */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 mb-4 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Bar Enrollment:</span>
                    <span className="font-mono font-semibold text-slate-200">{lawyer.barCouncilNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Experience:</span>
                    <span className="font-semibold text-red-300">{lawyer.experienceYears} Years Active</span>
                  </div>
                </div>

                {/* Bio brief */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4">
                  {lawyer.bio}
                </p>

                {/* Specialization Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {lawyer.specialization.map((spec) => (
                    <span
                      key={spec}
                      className="px-2 py-0.5 rounded-md bg-red-950/60 text-red-300 border border-red-900/60 text-[11px] font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Practice Courts */}
                <div className="mb-4">
                  <span className="text-[11px] text-slate-400 font-semibold block mb-1">Appears before:</span>
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
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Consultation Fee</span>
                  <span className="text-base font-extrabold text-amber-400">
                    ₹{lawyer.consultationFee.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    id={`btn-view-lawyer-${lawyer.id}`}
                    onClick={() => setActiveLawyerDetail(lawyer)}
                    className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-slate-300 border border-zinc-800 text-xs font-semibold"
                    title="View Full Profile"
                  >
                    Details
                  </button>

                  <button
                    id={`btn-book-consultation-${lawyer.id}`}
                    onClick={() => onBookConsultation(lawyer)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-bold text-xs shadow-md border border-red-600/40 active:scale-95 transition-all"
                  >
                    <span>Consult</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Advocate Detail Modal */}
      {activeLawyerDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 text-slate-200 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveLawyerDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start space-x-4 mb-6">
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
                      <span>Bar Verified</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 text-xs font-bold border border-amber-700">
                      Verification In Progress
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-400 mt-1">{activeLawyerDetail.stateBarCouncil}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-slate-300">
                  <span className="font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    ID: {activeLawyerDetail.barCouncilNumber}
                  </span>
                  <span>⭐ {activeLawyerDetail.rating} ({activeLawyerDetail.reviewsCount} reviews)</span>
                  <span className="text-emerald-400">✓ {activeLawyerDetail.casesResolved}+ Resolved Matters</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <h4 className="text-xs uppercase font-bold text-red-400 tracking-wider mb-2">Practice Profile</h4>
                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">{activeLawyerDetail.bio}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-xs text-slate-400 block mb-1">Appearing Courts</span>
                  <p className="text-xs font-semibold text-slate-200">{activeLawyerDetail.courts.join(', ')}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-xs text-slate-400 block mb-1">Available Schedule</span>
                  <p className="text-xs font-semibold text-red-300">{activeLawyerDetail.availableDays.join(' • ')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-red-900/60">
                <div>
                  <span className="text-xs text-slate-400 block">Initial Legal Advisory Fee</span>
                  <span className="text-xl font-extrabold text-amber-400">₹{activeLawyerDetail.consultationFee.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={() => {
                    const l = activeLawyerDetail;
                    setActiveLawyerDetail(null);
                    onBookConsultation(l);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 text-white font-bold text-sm shadow-lg border border-red-500/40"
                >
                  Book Consultation Now
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
