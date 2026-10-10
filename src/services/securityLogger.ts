import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import CryptoJS from 'crypto-js';

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

export const logAuditActivity = async (action: string, resourcePath: string, payload: any) => {
  if (!auth.currentUser) return;
  
  const payloadString = JSON.stringify(payload);
  const payloadHash = CryptoJS.SHA256(payloadString).toString();
  
  try {
    await addDoc(collection(db, 'audit_logs'), {
      userId: auth.currentUser.uid,
      action,
      resourcePath,
      payloadHash,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to log audit activity:", error);
  }
};
