import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface AIAdviceReview {
  id: string;
  userId: string;
  query: string;
  advice: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const AdvocateReviewDashboard: React.FC = () => {
  const [reviews, setReviews] = useState<AIAdviceReview[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'ai_advice_reviews'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AIAdviceReview));
      setReviews(data);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    await updateDoc(doc(db, 'ai_advice_reviews', id), { status });
  };

  return (
    <div className="p-6 bg-zinc-900 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">AI Legal Advice Review</h2>
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="p-4 border border-zinc-700 rounded-xl bg-zinc-800">
            <p className="text-sm font-semibold text-zinc-400">Query: {review.query}</p>
            <p className="text-sm text-white mt-2 mb-4">{review.advice}</p>
            <div className="flex space-x-2">
              <button onClick={() => handleStatusChange(review.id, 'approved')} className="flex items-center text-green-400 hover:text-green-300">
                <CheckCircle2 className="w-5 h-5 mr-1" /> Approve
              </button>
              <button onClick={() => handleStatusChange(review.id, 'rejected')} className="flex items-center text-red-400 hover:text-red-300">
                <XCircle className="w-5 h-5 mr-1" /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
