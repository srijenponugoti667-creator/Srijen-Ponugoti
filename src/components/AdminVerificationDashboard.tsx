import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ShieldCheck, X, CheckCircle2, Clock } from 'lucide-react';
import { User } from '../types';
import { assertValidFirestoreId } from '../utils/FirestoreValidation';

export const AdminVerificationDashboard: React.FC<{currentUser: User}> = ({ currentUser }) => {
  const [pendingLawyers, setPendingLawyers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  if (currentUser.role !== 'admin') {
    return <div className="p-6 text-center text-rose-500 font-bold">Access Denied: Admin Privileges Required</div>;
  }

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'lawyer'), where('verificationStatus', '==', 'pending'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lawyers: User[] = [];
      snapshot.forEach((doc) => {
        lawyers.push({ id: doc.id, ...doc.data() } as User);
      });
      setPendingLawyers(lawyers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAction = async (lawyerId: string, action: 'verified' | 'rejected', notes: string) => {
    assertValidFirestoreId(lawyerId, 'users');
    try {
      // Update user status
      await updateDoc(doc(db, 'users', lawyerId), {
        verificationStatus: action,
        isVerifiedLawyer: action === 'verified',
        verificationNotes: notes
      });

      // Add log
      await addDoc(collection(db, 'verificationLogs'), {
        userId: lawyerId,
        adminId: 'admin_user', // This should be dynamic based on current auth
        action: action === 'verified' ? 'approve' : 'reject',
        notes,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Error processing verification:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Advocate Verification Dashboard</h1>
      {pendingLawyers.map((lawyer) => (
        <div key={lawyer.id} className="p-4 border border-zinc-800 rounded-lg mb-4 flex justify-between items-center">
          <div>
            <p className="font-bold">{lawyer.name}</p>
            <p className="text-xs text-slate-400">{lawyer.email} | Bar: {lawyer.barCouncilNumber}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleAction(lawyer.id, 'verified', 'Approved')} className="p-2 bg-emerald-900 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-400" /></button>
            <button onClick={() => handleAction(lawyer.id, 'rejected', 'Rejected')} className="p-2 bg-rose-900 rounded-lg"><X className="w-5 h-5 text-rose-400" /></button>
          </div>
        </div>
      ))}
    </div>
  );
};
