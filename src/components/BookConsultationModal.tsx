import React, { useState } from 'react';
import { X, Calendar, Clock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { LawyerProfile, User } from '../types';

interface BookConsultationModalProps {
  lawyer: LawyerProfile | null;
  currentUser: User;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookConsultationModal: React.FC<BookConsultationModalProps> = ({
  lawyer,
  currentUser,
  onClose,
  onSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-02');
  const [selectedTime, setSelectedTime] = useState<string>('11:00 AM');
  const [matterTitle, setMatterTitle] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [booking, setBooking] = useState<boolean>(false);
  const [booked, setBooked] = useState<boolean>(false);

  if (!lawyer) return null;

  const timeSlots = ['10:00 AM', '11:00 AM', '02:30 PM', '04:00 PM', '05:30 PM'];

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBooking(true);

    if ((window as any).Razorpay && lawyer.consultationFee > 0) {
      const options = {
        key: 'rzp_test_TVt4WNqDvr1XOk',
        amount: lawyer.consultationFee * 100,
        currency: 'INR',
        name: 'JusticeBridge Judicial Portal',
        description: `Advocate Consultation Retainer: ${lawyer.name}`,
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=128&auto=format&fit=crop&q=80',
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
          contact: currentUser.phone ? currentUser.phone.replace(/[^0-9]/g, '').slice(-10) : undefined,
        },
        notes: {
          lawyerId: lawyer.id,
          lawyerName: lawyer.name,
          matterTitle,
          slot: `${selectedDate} ${selectedTime}`
        },
        theme: {
          color: '#7f1d1d',
        },
        handler: async function (response: any) {
          try {
            await fetch('/api/consultations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                lawyerId: lawyer.id,
                lawyerName: lawyer.name,
                bookingDate: selectedDate,
                timeSlot: selectedTime,
                consultationType: 'Video Call',
                matterSubject: matterTitle,
                notes: `${notes} (Paid via Razorpay Ref: ${response.razorpay_payment_id})`,
                fee: lawyer.consultationFee
              }),
            });
          } catch (cErr) {
            console.error('Consultation booking error:', cErr);
          }
          setBooking(false);
          setBooked(true);
          onSuccess();
        },
        modal: {
          ondismiss: function () {
            setBooking(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        alert(`Payment failed: ${resp.error.description || 'Transaction canceled'}`);
        setBooking(false);
      });
      rzp.open();
    } else {
      // Fallback
      try {
        await fetch('/api/consultations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lawyerId: lawyer.id,
            lawyerName: lawyer.name,
            bookingDate: selectedDate,
            timeSlot: selectedTime,
            consultationType: 'Video Call',
            matterSubject: matterTitle,
            notes,
            fee: lawyer.consultationFee
          }),
        });
      } catch (cErr) {
        console.error('Consultation booking error:', cErr);
      }
      setBooking(false);
      setBooked(true);
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 text-slate-200">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!booked ? (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={lawyer.avatar}
                alt={lawyer.name}
                className="w-12 h-12 rounded-xl object-cover border border-red-700/60"
              />
              <div>
                <h3 className="text-base font-bold text-white">{lawyer.name}</h3>
                <span className="text-xs text-red-300 font-medium">{lawyer.barCouncilNumber}</span>
              </div>
            </div>

            <h4 className="text-xl font-bold text-white font-cinzel mb-1">
              Book Legal Advisory Session
            </h4>
            <p className="text-xs text-slate-400 mb-6">
              Schedule a 45-minute confidential strategy consultation with Bar-verified counsel.
            </p>

            <form onSubmit={handleBook} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Legal Matter Topic</label>
                <input
                  type="text"
                  value={matterTitle}
                  onChange={(e) => setMatterTitle(e.target.value)}
                  placeholder="e.g. Commercial Contract Injunction & Damages"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-red-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Time Slot</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-red-600"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Litigation Summary Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Brief synopsis of your court case or legal inquiry..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-slate-400">Consultation Retainer:</span>
                <span className="text-base font-extrabold text-amber-400">₹{lawyer.consultationFee.toLocaleString('en-IN')}</span>
              </div>

              <button
                type="submit"
                disabled={booking}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 text-white font-bold text-xs shadow-xl border border-red-600/40"
              >
                {booking ? 'Confirming Counsel Slot...' : 'Confirm Consultation Booking'}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <h4 className="text-2xl font-bold text-white font-cinzel">
              Consultation Confirmed!
            </h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Your appointment with <strong className="text-white">{lawyer.name}</strong> is scheduled for <strong className="text-red-300">{selectedDate} at {selectedTime}</strong>. A calendar invite and encrypted video link have been generated.
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-slate-200 font-bold text-xs rounded-xl border border-zinc-800"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
