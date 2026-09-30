import { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

interface SecurityLog {
  id: string;
  actionType: string;
  details: string;
  timestamp: string;
}

export const SecurityLogsView = () => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'securityLogs'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SecurityLog[];
      setLogs(logsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading activity logs...</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Security Activity Log</h3>
      {logs.length === 0 ? (
        <p>No activity recorded yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {logs.map((log) => (
            <li key={log.id} className="py-3">
              <div className="flex justify-between">
                <span className="font-medium text-blue-600">{log.actionType}</span>
                <span className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-700">{log.details}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
