import React, { useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

interface CaseUpdateNotifierProps {
  userId: string;
}

export const CaseUpdateNotifier: React.FC<CaseUpdateNotifierProps> = ({ userId }) => {
  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, 'cases'), where('clientId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          const caseData = change.doc.data();
          toast.success(`Case update: "${caseData.title}" status changed to ${caseData.status}`, {
            duration: 5000,
            position: 'top-right',
          });
        }
      });
    });

    return () => unsubscribe();
  }, [userId]);

  return null;
};
