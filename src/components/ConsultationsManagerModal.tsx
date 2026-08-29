import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Video, CheckCircle2, AlertCircle, Phone, User, ExternalLink, ShieldCheck } from 'lucide-react';
import { User as UserType, ConsultationBooking } from '../types';

interface ConsultationsManagerModalProps {
  currentUser: UserType;
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationsManagerModal: React.FC<ConsultationsManagerModalProps> = ({
  currentUser,
  isOpen,
  onClose,
}) => {
  const [consultations, setConsultations] = useState<ConsultationBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/consultations');
      const data = await res.json();
      setConsultations(data.consultations || []);
    } catch (err) {
      console.error('Failed to load consultations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchConsultations();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden text-slate-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-gradient-to-r from-red-950/70 via-zinc-900 to-red-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-800 flex items-center justify-center text-red-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-cinzel">
                {currentUser.role === 'lawyer' ? 'Chamber Consultation Schedule' : 'My Legal Advisory Appointments'}
              </h3>
              <p className="text-xs text-red-300">
                Direct Advocate Advisory & Secure Video Sessions
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-400">Loading consultation schedule...</p>
            </div>
          ) : consultations.length === 0 ? (
            <div className="py-16 text-center">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white mb-1">No Consultations Scheduled</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {currentUser.role === 'lawyer'
                  ? 'You currently have no incoming consultation requests from litigants.'
                  : 'You have not booked any advocate advisory consultations yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {consultations.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800 text-[11px] font-bold">
                          {item.consultationType}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-semibold">
                          {item.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-cinzel">
                        {item.matterSubject}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Fee Paid</span>
                      <span className="text-xs font-bold text-amber-400 font-mono">₹{item.fee.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[11px] text-slate-400 block mb-0.5">
                        {currentUser.role === 'lawyer' ? 'Litigant / Client:' : 'Advocate:'}
                      </span>
                      <p className="font-semibold text-slate-200">
                        {currentUser.role === 'lawyer' ? item.clientName : item.lawyerName}
                      </p>
                      <p className="text-[11px] text-slate-500">{currentUser.role === 'lawyer' ? item.clientEmail : ''}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[11px] text-slate-400 block mb-0.5">Scheduled Time:</span>
                      <div className="flex items-center space-x-1.5 font-semibold text-red-300">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.bookingDate}</span>
                        <span>&bull;</span>
                        <span>{item.timeSlot}</span>
                      </div>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-850 text-xs text-slate-400">
                      <strong className="text-slate-300">Notes:</strong> {item.notes}
                    </div>
                  )}

                  {item.meetingLink && (
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Secure 256-bit Encrypted Chamber Room</span>
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 text-xs font-bold transition-all"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Chamber Room</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
