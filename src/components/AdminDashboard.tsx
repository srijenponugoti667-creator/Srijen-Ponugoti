import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from '../types';
import { ShieldCheck, UserPlus, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { assertValidFirestoreId } from '../utils/FirestoreValidation';

export const AdminDashboard: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [promotionEmail, setPromotionEmail] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'verificationRequests'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, 'users'));
      const snapshot = await getDocs(q);
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
    };
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (requestId: string, newStatus: 'approved' | 'rejected', currentStatus: string) => {
    assertValidFirestoreId(requestId, 'verificationRequests');
    if (currentUser.role === 'team_member' && currentStatus === 'approved') {
      alert("Team members cannot undo an approved request.");
      return;
    }
    await updateDoc(doc(db, 'verificationRequests', requestId), { status: newStatus });
  };

  const handlePromote = async () => {
    if (currentUser.role !== 'admin') return;
    const userSnapshot = await getDocs(query(collection(db, 'users'), where('email', '==', promotionEmail)));
    if (!userSnapshot.empty) {
      await updateDoc(doc(db, 'users', userSnapshot.docs[0].id), { role: 'team_member' });
      alert("User promoted to team_member");
    } else {
      alert("User not found");
    }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-200">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {currentUser.role === 'admin' && (
        <div className="bg-slate-800 p-6 rounded-xl mb-6">
          <h2 className="text-lg font-bold mb-4">Promote Team Member</h2>
          <div className="flex gap-2">
            <input 
              value={promotionEmail} 
              onChange={(e) => setPromotionEmail(e.target.value)} 
              placeholder="Enter email"
              className="px-3 py-2 rounded-lg bg-slate-700 outline-none"
            />
            <button onClick={handlePromote} className="px-4 py-2 bg-red-700 rounded-lg text-white font-bold">Promote</button>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Verification Requests</h2>
      <div className="space-y-4">
        {requests.map(req => (
          <div key={req.id} className="bg-slate-800 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p>Advocate: {req.advocateId}</p>
              <p>Status: <span className="font-bold">{req.status}</span></p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleUpdateStatus(req.id, 'approved', req.status)} className="p-2 bg-emerald-800 rounded-lg text-emerald-300">
                <CheckCircle2 size={20} />
              </button>
              <button onClick={() => handleUpdateStatus(req.id, 'rejected', req.status)} className="p-2 bg-red-800 rounded-lg text-red-300">
                <XCircle size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
