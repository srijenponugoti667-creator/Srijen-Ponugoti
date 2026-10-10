import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, getDocs, orderBy, where, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

import { User } from '../../types';

interface Subscription {
  id: string;
  amount: number;
  createdAt: string;
  userId: string;
}

interface FinancialDashboardProps {
  isAdmin?: boolean;
  userId?: string;
  currentUser?: User;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ isAdmin, userId, currentUser }) => {
  const effectiveIsAdmin = isAdmin ?? (currentUser?.role === 'admin' || currentUser?.role === 'team_member');
  const effectiveUserId = userId ?? currentUser?.id ?? '';
  const [data, setData] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAmount, setNewAmount] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      let q = query(collection(db, 'subscriptions'), orderBy('createdAt', 'asc'));
      if (!effectiveIsAdmin) {
        q = query(q, where('userId', '==', effectiveUserId));
      }
      const snapshot = await getDocs(q);
      setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscription)));
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [effectiveIsAdmin, effectiveUserId]);

  const addSubscription = async () => {
    if (!newAmount) return;
    await addDoc(collection(db, 'subscriptions'), {
      amount: Number(newAmount),
      createdAt: new Date().toISOString(),
      userId: effectiveUserId
    });
    setNewAmount('');
    fetchData();
  };

  const deleteSubscription = async (id: string) => {
    await deleteDoc(doc(db, 'subscriptions', id));
    fetchData();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>;
  }

  const mrrData = data.reduce((acc: any[], sub) => {
    const date = new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.mrr += sub.amount;
    } else {
      acc.push({ date, mrr: sub.amount });
    }
    return acc;
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Financial Dashboard</h1>
      <div className="flex gap-2">
        <Input type="number" placeholder="Amount" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
        <Button onClick={addSubscription}><Plus className="mr-2 h-4 w-4" /> Add</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>MRR Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mrrData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="mrr" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Subscription Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mrrData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="mrr" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Subscriptions</CardTitle></CardHeader>
        <CardContent>
          {data.map(sub => (
            <div key={sub.id} className="flex justify-between p-2 border-b">
              <span>{new Date(sub.createdAt).toLocaleDateString()} - ${sub.amount}</span>
              <Button variant="ghost" onClick={() => deleteSubscription(sub.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
