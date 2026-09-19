import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center space-x-2.5 rounded-2xl bg-amber-600/90 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-white shadow-2xl border border-amber-400/50 animate-bounce">
      <WifiOff className="w-4 h-4 text-amber-200" />
      <span>Offline Mode • Cached legal tools and vault accessible</span>
    </div>
  );
};
