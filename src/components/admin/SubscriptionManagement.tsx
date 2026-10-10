import React, { useEffect, useState } from 'react';
import { User } from '../../types';

interface Subscription {
  id: string;
  planId: string;
  userId: string;
  amount: number;
}

export const SubscriptionManagement: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    if (currentUser.role !== 'admin') return;
    fetchSubscriptions();
  }, [currentUser]);

  const fetchSubscriptions = async () => {
    const res = await fetch('/api/subscriptions');
    const data = await res.json();
    setSubscriptions(data);
  };

  const deleteSubscription = async (id: string) => {
    await fetch(`/api/subscriptions/${id}`, { method: 'DELETE' });
    fetchSubscriptions();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Subscription Management</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th>ID</th>
            <th>Plan ID</th>
            <th>User ID</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map(sub => (
            <tr key={sub.id}>
              <td>{sub.id}</td>
              <td>{sub.planId}</td>
              <td>{sub.userId}</td>
              <td>{sub.amount}</td>
              <td>
                <button onClick={() => deleteSubscription(sub.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
