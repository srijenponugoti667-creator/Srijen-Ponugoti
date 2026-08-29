import React, { useState } from 'react';
import { X, User, ShieldCheck, Briefcase, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { User as UserType } from '../types';

interface LawyerProfileEditorModalProps {
  currentUser: UserType;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (updatedUser: UserType) => void;
}

export const LawyerProfileEditorModal: React.FC<LawyerProfileEditorModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '+91 ');
  const [barCouncilNumber, setBarCouncilNumber] = useState(currentUser.barCouncilNumber || '');
  const [stateBarCouncil, setStateBarCouncil] = useState(currentUser.stateBarCouncil || 'Bar Council of Delhi');
  const [practiceLocation, setPracticeLocation] = useState(currentUser.practiceLocation || 'Supreme Court & High Court');
  const [yearsExperience, setYearsExperience] = useState(String(currentUser.yearsExperience || 5));
  const [consultationFee, setConsultationFee] = useState(String(currentUser.consultationFee || 2500));
  const [bio, setBio] = useState(currentUser.bio || '');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          barCouncilNumber: barCouncilNumber.trim(),
          stateBarCouncil,
          practiceLocation: practiceLocation.trim(),
          yearsExperience: Number(yearsExperience),
          consultationFee: Number(consultationFee),
          bio: bio.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        onProfileUpdated(data.user);
        onClose();
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden text-slate-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-gradient-to-r from-red-950/70 via-zinc-900 to-red-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-800 flex items-center justify-center text-red-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-cinzel">
                Edit Advocate Practice Profile
              </h3>
              <p className="text-xs text-red-300">
                Directory Standing & Practice Information
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-red-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Consultation Fee (₹)</label>
              <input
                type="number"
                step="500"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Bar Council Number</label>
              <input
                type="text"
                value={barCouncilNumber}
                onChange={(e) => setBarCouncilNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Experience (Years)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">State Bar Council</label>
            <select
              value={stateBarCouncil}
              onChange={(e) => setStateBarCouncil(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-red-600"
            >
              <option value="Bar Council of Delhi">Bar Council of Delhi</option>
              <option value="Bar Council of Maharashtra & Goa">Bar Council of Maharashtra & Goa</option>
              <option value="Bar Council of Karnataka">Bar Council of Karnataka</option>
              <option value="Bar Council of Tamil Nadu">Bar Council of Tamil Nadu</option>
              <option value="Bar Council of West Bengal">Bar Council of West Bengal</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Practice Location / Courts</label>
            <input
              type="text"
              value={practiceLocation}
              onChange={(e) => setPracticeLocation(e.target.value)}
              placeholder="Delhi High Court & Supreme Court of India"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Professional Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-red-600 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 text-white font-bold text-xs shadow-xl flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            {loading ? <span>Saving Changes...</span> : <span>Save Profile Updates</span>}
          </button>
        </form>

      </div>
    </div>
  );
};
