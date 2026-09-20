import React, { useState, useEffect } from 'react';
import { Clock, TrendingDown, ShieldCheck, Zap, BarChart3, ArrowDownRight, Scale, CheckCircle2, AlertTriangle, Sparkles, FileSpreadsheet } from 'lucide-react';
import { DelayMetric } from '../types';
import { getTranslation } from '../languages';

interface DelayReductionAnalyticsProps {
  currentLanguage?: string;
}

export const DelayReductionAnalytics: React.FC<DelayReductionAnalyticsProps> = ({ currentLanguage = 'en' }) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLanguage, key);
  const [metrics, setMetrics] = useState<DelayMetric[]>([]);
  const [stats, setStats] = useState({
    totalCasesRegistered: 0,
    verifiedAdvocatesCount: 0,
    averageDelayReductionDays: 0,
    disposalRateImprovementPercent: 0,
    activeHearingsTracked: 0
  });

  // Delay simulation calculator
  const [caseType, setCaseType] = useState<string>('Commercial Dispute');
  const [courtType, setCourtType] = useState<string>('High Court (Commercial Division)');
  const [estimatedMonths, setEstimatedMonths] = useState<number>(18);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.metrics) setMetrics(data.metrics);
        if (data.averageDelayReductionDays) setStats(data);
      })
      .catch((err) => console.error('Analytics load error:', err));
  }, []);

  const calculateSavings = () => {
    let factor = 0.65;
    if (caseType === 'Civil & Property') factor = 0.72;
    if (caseType === 'Constitutional Writ') factor = 0.66;
    if (caseType === 'Cyber Crime') factor = 0.70;

    const savedMonths = Math.round(estimatedMonths * factor);
    const expeditedMonths = estimatedMonths - savedMonths;
    return { savedMonths, expeditedMonths, percent: Math.round(factor * 100) };
  };

  const savings = calculateSavings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Title */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-red-950/70 border border-red-800/60 text-red-300 text-xs font-semibold mb-3">
          <Clock className="w-3.5 h-3.5 text-red-400" />
          <span>{t('delayAnalyticsBadge')}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-cinzel">
          {t('delayAnalyticsTitle')}
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2">
          {t('delayAnalyticsSubtitle')}
        </p>
        <p className="text-[11px] text-slate-500 mt-1 italic">
          {t('delayDisclaimer')}
        </p>
      </div>

      {/* Top Stat Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
          <span className="text-xs text-slate-400 font-semibold block mb-1">{t('targetDelayReduction')}</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-red-400 font-cinzel">~65%</span>
            <span className="text-xs text-red-300 font-bold">Timeline Compression</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Via e-Discovery & Notice sync</span>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
          <span className="text-xs text-slate-400 font-semibold block mb-1">{t('hearingTrackingSpeed')}</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-cinzel">Real-Time</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Live cause-list docket polling</span>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
          <span className="text-xs text-slate-400 font-semibold block mb-1">{t('verifiedAdvocatesStat')}</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-cinzel">{stats.verifiedAdvocatesCount}</span>
            <span className="text-xs text-amber-300 font-bold">Onboarded</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">BCI authenticated counsels</span>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
          <span className="text-xs text-slate-400 font-semibold block mb-1">{t('litigationMattersActive')}</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-cinzel">{stats.totalCasesRegistered}</span>
            <span className="text-xs text-slate-300 font-bold">Matters</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Real active docket tracking</span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        
        {/* Category Timelines */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl">
          <h3 className="text-xl font-bold text-white font-cinzel mb-2">
            {t('disposalTimelinesTitle')}
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            {t('disposalTimelinesDesc')}
          </p>

          <div className="space-y-6">
            {(metrics.length > 0 ? metrics : [
              { category: 'Commercial Suits', avgStandardDays: 480, justiceBridgeAvgDays: 165, reductionPercentage: 65 },
              { category: 'Constitutional Writs', avgStandardDays: 320, justiceBridgeAvgDays: 110, reductionPercentage: 66 },
              { category: 'Civil & Property', avgStandardDays: 850, justiceBridgeAvgDays: 240, reductionPercentage: 72 },
              { category: 'Cyber & IP Disputes', avgStandardDays: 290, justiceBridgeAvgDays: 88, reductionPercentage: 70 }
            ]).map((m) => (
              <div key={m.category} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{m.category}</span>
                  <span className="text-emerald-400 font-bold">-{m.reductionPercentage}% Delay Cut</span>
                </div>

                <div className="space-y-1.5">
                  {/* Traditional */}
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="w-24 text-slate-500 text-[11px]">{t('traditional')}:</span>
                    <div className="flex-1 bg-zinc-950 rounded-full h-3 overflow-hidden border border-zinc-800">
                      <div className="bg-zinc-600 h-full rounded-full w-[90%]"></div>
                    </div>
                    <span className="font-mono text-slate-400 text-[11px] w-16 text-right">{m.avgStandardDays} Days</span>
                  </div>

                  {/* JusticeBridge */}
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="w-24 text-red-300 font-semibold text-[11px]">JusticeBridge:</span>
                    <div className="flex-1 bg-zinc-950 rounded-full h-3 overflow-hidden border border-zinc-800">
                      <div
                        className="bg-gradient-to-r from-red-600 to-emerald-500 h-full rounded-full"
                        style={{ width: `${(m.justiceBridgeAvgDays / m.avgStandardDays) * 90}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold text-[11px] w-16 text-right">{m.justiceBridgeAvgDays} Days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Delay Savings Calculator */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs uppercase font-extrabold tracking-wider text-red-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>{t('interactiveCalculatorTitle')}</span>
            </div>
            <h3 className="text-xl font-bold text-white font-cinzel mb-1">
              {t('interactiveCalculatorTitle')}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {t('interactiveCalculatorDesc')}
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">{t('litigationType')}</label>
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-red-600"
                >
                  <option value="Commercial Dispute">Commercial Dispute</option>
                  <option value="Civil & Property">Civil & Property Dispute</option>
                  <option value="Constitutional Writ">Constitutional Writ</option>
                  <option value="Cyber Crime">Cyber Crime / IP</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">{t('traditionalDisposalTime')}</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="6"
                    max="48"
                    step="2"
                    value={estimatedMonths}
                    onChange={(e) => setEstimatedMonths(Number(e.target.value))}
                    className="flex-1 accent-red-600 cursor-pointer"
                  />
                  <span className="font-mono text-white font-bold w-16 text-right">{estimatedMonths} Months</span>
                </div>
              </div>
            </div>

            {/* Savings Result Card */}
            <div className="mt-6 p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{t('timelineReduction')}</span>
                <span className="text-base font-extrabold text-emerald-400 font-cinzel">~{savings.percent}% Faster</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{t('estimatedDisposal')}</span>
                <span className="text-sm font-bold text-white font-mono">{savings.expeditedMonths} Months (vs {estimatedMonths} Mo)</span>
              </div>
              <div className="pt-2 border-t border-zinc-800 text-[11px] text-slate-400 leading-relaxed">
                🚀 {t('estimatedTimeSaved')} <strong className="text-red-300">{savings.savedMonths} Months ({savings.savedMonths * 30} Days)</strong> of avoided courtroom delays and adjournments.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 4 Core Delay Elimination Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
          <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 flex items-center justify-center font-bold mb-2">01</div>
          <h4 className="font-bold text-white mb-1">Digital Summons Delivery</h4>
          <p className="text-slate-400 leading-relaxed">Eliminates 40–60 days of postal notice delivery delays via e-Court verified transmission.</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
          <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 flex items-center justify-center font-bold mb-2">02</div>
          <h4 className="font-bold text-white mb-1">Electronic Evidence Vault</h4>
          <p className="text-slate-400 leading-relaxed">Sec 65B hash-verified discovery prevents filing defects and evidence rejection.</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
          <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 flex items-center justify-center font-bold mb-2">03</div>
          <h4 className="font-bold text-white mb-1">Adjournment Throttling</h4>
          <p className="text-slate-400 leading-relaxed">AI briefs and pre-trial framing bound counsel to strict argument windows.</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
          <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 flex items-center justify-center font-bold mb-2">04</div>
          <h4 className="font-bold text-white mb-1">Live Cause-List Alerts</h4>
          <p className="text-slate-400 leading-relaxed">Instant docket sync alerts advocates when matter is called, preventing default dismissal.</p>
        </div>
      </div>

    </div>
  );
};
