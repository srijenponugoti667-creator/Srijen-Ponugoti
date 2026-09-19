import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share2, PlusSquare, Scale } from 'lucide-react';
import appLogo from '../assets/images/justicebridge_app_logo_1788288183801.jpg';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [showInstructionsModal, setShowInstructionsModal] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    // Check iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstructionsModal(true);
    }
  };

  if (isInstalled || !showBanner) return null;

  return (
    <>
      {/* Floating Bottom / Top Install Banner for Mobile */}
      <div 
        id="pwa-install-banner"
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 bg-zinc-900/95 border border-red-800/60 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl shadow-red-950/50 flex items-center justify-between gap-3 text-slate-100 animate-fade-in"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-red-500/50 shadow-md shadow-red-950/60 flex-shrink-0 bg-zinc-950 relative flex items-center justify-center">
            <img 
              src={appLogo} 
              alt="JusticeBridge Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.fallbackTried) {
                  target.dataset.fallbackTried = 'true';
                  target.src = '/app-logo.jpg';
                } else {
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }
              }}
            />
            <div style={{ display: 'none' }} className="w-full h-full items-center justify-center bg-gradient-to-br from-red-800 to-amber-700">
              <Scale className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Install JusticeBridge</h4>
            <p className="text-xs text-zinc-300 truncate">Run as native Android & iOS app</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            id="pwa-install-action-btn"
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            id="pwa-install-dismiss-btn"
            onClick={() => setShowBanner(false)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Manual Step-by-Step Modal if browser needs manual tap */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-red-800/60 rounded-2xl max-w-sm w-full p-6 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setShowInstructionsModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-red-500/50 shadow-lg shadow-red-950/60 flex-shrink-0 bg-zinc-950 relative flex items-center justify-center">
                <img 
                  src={appLogo} 
                  alt="JusticeBridge Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallbackTried) {
                      target.dataset.fallbackTried = 'true';
                      target.src = '/app-logo.jpg';
                    } else {
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }
                  }}
                />
                <div style={{ display: 'none' }} className="w-full h-full items-center justify-center bg-gradient-to-br from-red-800 to-amber-700">
                  <Scale className="w-6 h-6 text-amber-300" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">How to Install</h3>
                <p className="text-xs text-zinc-400">JusticeBridge Web & Mobile</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex items-start gap-2.5 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <Share2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>1. Tap the <strong>Share</strong> button at the bottom of Safari.</span>
                </div>
                <div className="flex items-start gap-2.5 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <PlusSquare className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>2. Scroll down and tap <strong>"Add to Home Screen"</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>3. Tap <strong>Add</strong> in the top right corner.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex items-start gap-2.5 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <span className="font-bold text-amber-400">1.</span>
                  <span>Tap the <strong>3 vertical dots (⋮)</strong> menu in the top-right corner of Chrome.</span>
                </div>
                <div className="flex items-start gap-2.5 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <span className="font-bold text-amber-400">2.</span>
                  <span>Look for <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <span className="font-bold text-emerald-400">3.</span>
                  <span>Tap <strong>Install</strong> to add the icon to your phone screen!</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowInstructionsModal(false)}
              className="mt-5 w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs rounded-xl border border-zinc-700 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
