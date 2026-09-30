import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export const logSecurityActivity = async (actionType: string, details: string) => {
  if (!auth.currentUser) return;
  
  try {
    await addDoc(collection(db, 'securityLogs'), {
      userId: auth.currentUser.uid,
      actionType,
      details,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Failed to log security activity:", error);
  }
};
