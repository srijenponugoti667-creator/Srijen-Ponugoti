import React from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { CaseMatter } from '../types';

interface CaseCalendarComponentProps {
  cases: CaseMatter[];
}

export const CaseCalendarComponent: React.FC<CaseCalendarComponentProps> = ({ cases }) => {
  // Extract all hearings and flatten them
  const allHearings = cases
    .flatMap((caseItem) =>
      caseItem.hearings.map((hearing) => ({
        ...hearing,
        caseTitle: caseItem.title,
        caseId: caseItem.id,
      }))
    )
    .filter((hearing) => new Date(hearing.hearingDate) >= new Date()) // Only upcoming
    .sort((a, b) => new Date(a.hearingDate).getTime() - new Date(b.hearingDate).getTime());

  if (allHearings.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
        <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-white">No Upcoming Hearings</h4>
        <p className="text-xs text-slate-400 mt-1">No scheduled hearing dates found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-red-500" />
        Upcoming Court Deadlines
      </h3>
      <div className="space-y-4">
        {allHearings.slice(0, 4).map((hearing) => (
          <div
            key={hearing.id}
            className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-700">
                <span className="text-xs font-bold text-red-400">
                  {new Date(hearing.hearingDate).toLocaleString('default', { month: 'short' })}
                </span>
                <span className="text-sm font-bold text-white">
                  {new Date(hearing.hearingDate).getDate()}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-white truncate max-w-[150px]">{hearing.caseTitle}</p>
                <p className="text-[10px] text-slate-400">{hearing.purpose}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>
        ))}
      </div>
    </div>
  );
};
