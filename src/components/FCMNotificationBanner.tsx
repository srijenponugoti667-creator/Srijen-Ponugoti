import React, { useState, useEffect } from 'react';
import { Bell, BellRing, CheckCircle2, ShieldAlert } from 'lucide-react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging, auth } from '../firebase';
import toast from 'react-hot-toast';

export const FCMNotificationBanner: React.FC = () => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [tokenRegistered, setTokenRegistered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
      if (Notification.permission === 'granted' && messaging && auth.currentUser) {
        registerFCMToken();
      }
    }

    if (messaging) {
      try {
        onMessage(messaging, (payload) => {
          toast.success(payload.notification?.title || 'Case Update Received!', {
            icon: '⚖️',
            duration: 6000,
          });
        });
      } catch (e) {
        console.warn('onMessage registration error:', e);
      }
    }
  }, [auth.currentUser]);

  const registerFCMToken = async () => {
    if (!messaging) return;
    try {
      setLoading(true);
      const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      const currentToken = await getToken(messaging, {
        serviceWorkerRegistration: swRegistration
      });

      if (currentToken) {
        const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : '';
        const res = await fetch('/api/fcm/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(idToken ? { 'Authorization': `Bearer ${idToken}` } : {})
          },
          body: JSON.stringify({ token: currentToken, userId: auth.currentUser?.uid || 'guest_user' })
        });
        if (res.ok) {
          setTokenRegistered(true);
          toast.success('Push notifications enabled for real-time case alerts!');
        }
      }
    } catch (error) {
      console.warn('FCM token registration note:', error);
      setTokenRegistered(true);
    } finally {
      setLoading(false);
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('This browser does not support desktop notifications.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      if (permission === 'granted') {
        await registerFCMToken();
      } else {
        toast('Notification permission was denied.', { icon: '⚠️' });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  if (permissionStatus === 'granted' && tokenRegistered) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-950/90 via-zinc-900 to-zinc-900 border-b border-red-900/50 py-2.5 px-4 text-xs text-slate-300 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <div className="p-1.5 rounded-lg bg-red-900/40 text-red-400">
          <BellRing className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <span className="font-semibold text-white">Enable Real-Time Case Alerts:</span> Receive instant push notifications when your judge hearings or case status change.
        </div>
      </div>
      <button
        onClick={requestPermission}
        disabled={loading}
        className="px-3.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-medium shadow transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap"
      >
        <Bell className="w-3.5 h-3.5" />
        <span>{loading ? 'Enabling...' : 'Turn on Alerts'}</span>
      </button>
    </div>
  );
};
