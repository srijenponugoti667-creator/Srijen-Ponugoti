import React, { useState } from 'react';
import { Smartphone, Download, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'hero' | 'floating';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '',
  variant = 'navbar'
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  const handleClick = async () => {
    if (isInstallable) {
      try {
        const installed = await install();
        if (!installed) {
          setShowModal(true);
        }
      } catch {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {variant === 'navbar' && (
        <button
          id="btn-pwa-install-nav"
          onClick={handleClick}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950 to-zinc-900 hover:from-emerald-900 border border-emerald-600/50 text-emerald-300 hover:text-emerald-200 text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-all ${className}`}
          title="Install JusticeBridge Mobile App"
        >
          {isInstalled ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">App Installed</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Install App</span>
            </>
          )}
        </button>
      )}

      {variant === 'hero' && (
        <button
          id="btn-pwa-install-hero"
          onClick={handleClick}
          className={`flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold shadow-xl shadow-emerald-950/20 active:scale-95 transition-all cursor-pointer ${className}`}
        >
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Install Mobile App</span>
        </button>
      )}

      {/* Interactive Helper Modal */}
      <PWAInstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};
