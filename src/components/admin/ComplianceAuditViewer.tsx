import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Clock, CheckCircle, ShieldCheck } from 'lucide-react';

export const ComplianceAuditViewer: React.FC = () => {
  const [validatedLogs, setValidatedLogs] = useState<any[]>([]);

  useEffect(() => {
    // Query validated logs (approved reviews)
    const q = query(
      collection(db, 'ai_advice_reviews'),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setValidatedLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-200 rounded-xl">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <ShieldCheck className="text-emerald-500" />
        Compliance Audit Logs
      </h2>
      <div className="space-y-4">
        {validatedLogs.length === 0 ? (
          <p className="text-slate-500 italic">No validated logs found.</p>
        ) : (
          validatedLogs.map((log) => (
            <div key={log.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-sm text-slate-400">ID: {log.id}</span>
                <span className="flex items-center gap-1 text-emerald-400 text-sm">
                  <CheckCircle size={14} /> Validated
                </span>
              </div>
              <p className="mb-2 text-sm text-slate-300"><strong>Query:</strong> {log.query}</p>
              <p className="mb-3 text-sm text-slate-300"><strong>Advice:</strong> {log.advice}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock size={12} />
                <span>{log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}</span>
                <span>·</span>
                <span>Reviewer: {log.reviewerId || 'System'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
