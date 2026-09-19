import React, { useState } from 'react';
import { Smartphone, Download, CheckCircle2, Globe, Shield, Sparkles, X, Apple, ArrowRight, Share2, Layers, ExternalLink, Scale } from 'lucide-react';
import appLogo from '../assets/images/justicebridge_app_logo_1788288183801.jpg';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'instant' | 'android' | 'ios' | 'apk'>('instant');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const appUrl = window.location.origin || 'https://ais-pre-2ygeqzn4xbgemovtatd7wg-621467385062.asia-southeast1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleOneTapInstall = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-red-600/20 to-transparent blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3.5 mb-5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-red-500/50 shadow-xl shadow-red-950/60 flex-shrink-0 bg-zinc-950 relative flex items-center justify-center">
            <img 
              src={appLogo} 
              alt="JusticeBridge App Logo" 
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
              <Scale className="w-7 h-7 text-amber-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-black text-white font-cinzel tracking-tight">
                Install Mobile App
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full">
                Android & iOS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Run JusticeBridge natively on your phone with full home-screen icon and offline mode
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-zinc-950 rounded-2xl border border-zinc-800 mb-6">
          <button
            onClick={() => setActiveTab('instant')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'instant'
                ? 'bg-red-950 text-amber-300 border border-red-700/60 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Instant Install
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'android'
                ? 'bg-red-950 text-amber-300 border border-red-700/60 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🤖 Android / Chrome
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'ios'
                ? 'bg-red-950 text-amber-300 border border-red-700/60 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🍎 iPhone / iPad
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'apk'
                ? 'bg-red-950 text-amber-300 border border-red-700/60 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📦 Free APK / AAB
          </button>
        </div>

        {/* Tab 1: Instant Install Flow */}
        {activeTab === 'instant' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-red-500/40 shadow-md flex items-center justify-center flex-shrink-0 bg-zinc-950 relative">
                  <img 
                    src={appLogo} 
                    alt="App Icon" 
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
                  <h3 className="text-sm font-bold text-white">Direct One-Tap PWA Installation</h3>
                  <p className="text-xs text-slate-400">
                    Installs an app icon on your home screen. Full-screen, offline-ready, no ads.
                  </p>
                </div>
              </div>

              {isInstalled ? (
                <div className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold whitespace-nowrap">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Already Installed!</span>
                </div>
              ) : isInstallable ? (
                <button
                  onClick={handleOneTapInstall}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-red-950/50 border border-red-500 cursor-pointer active:scale-95 transition-all whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span>Install App Now</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab(isIOS ? 'ios' : 'android')}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-slate-200 text-xs font-bold border border-zinc-700 cursor-pointer active:scale-95 transition-all whitespace-nowrap"
                >
                  <span>View Step-by-Step Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold mb-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>100% Free & Safe</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  No Play Store download charges, no registration fees, direct secure sandboxed sandbox.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center space-x-2 text-red-400 text-xs font-bold mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Ultra Lightweight</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Takes less than 1 MB of phone storage vs 80 MB traditional apps.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold mb-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>24 Indian Languages</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Instant offline access to all 24 regional language dictionaries and case tools.
                </p>
              </div>
            </div>

            {/* Direct Share Link Bar */}
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-2">
              <div className="text-xs text-slate-300 truncate max-w-sm sm:max-w-md font-mono">
                {appUrl}
              </div>
              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-slate-200 border border-zinc-700 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Android / Chrome Step by Step */}
        {activeTab === 'android' && (
          <div className="space-y-4 animate-in fade-in duration-150 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <h4 className="text-sm font-bold text-amber-300 flex items-center space-x-2">
                <Smartphone className="w-4 h-4" />
                <span>How to Install on Any Android Phone (Samsung, Xiaomi, Vivo, Realme, OnePlus, Google Pixel)</span>
              </h4>

              <ol className="space-y-2.5 text-slate-300 list-decimal list-inside leading-relaxed">
                <li className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <strong className="text-white">Step 1:</strong> Open this app link in <strong>Google Chrome</strong> or <strong>Samsung Internet</strong> on your phone.
                </li>
                <li className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <strong className="text-white">Step 2:</strong> Tap the <strong>three dots menu (⋮)</strong> at the top-right corner of the browser.
                </li>
                <li className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <strong className="text-white">Step 3:</strong> Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.
                </li>
                <li className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <strong className="text-white">Step 4:</strong> Tap <strong>Install</strong>. The JusticeBridge icon will appear on your phone drawer immediately!
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 3: iPhone / iPad Guide */}
        {activeTab === 'ios' && (
          <div className="space-y-4 animate-in fade-in duration-150 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <h4 className="text-sm font-bold text-amber-300 flex items-center space-x-2">
                <Apple className="w-4 h-4" />
                <span>How to Install on iPhone / iPad (iOS Safari)</span>
              </h4>

              <ol className="space-y-2.5 text-slate-300 list-decimal list-inside leading-relaxed">
                <li className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <strong className="text-white">Step 1:</strong> Open this link in <strong>Safari</strong> on your iPhone or iPad.
                </li>
                <li className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <strong className="text-white">Step 2:</strong> Tap the <strong>Share</strong> button (square with arrow pointing up <span className="text-amber-400">⎋</span>) at the bottom toolbar.
                </li>
                <li className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <strong className="text-white">Step 3:</strong> Scroll down the options and tap <strong>"Add to Home Screen"</strong> (➕).
                </li>
                <li className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <strong className="text-white">Step 4:</strong> Tap <strong>Add</strong> in the top right corner. The app will launch in standalone full screen!
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 4: Free APK / AAB Generation */}
        {activeTab === 'apk' && (
          <div className="space-y-4 animate-in fade-in duration-150 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <h4 className="text-sm font-bold text-amber-300 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Standalone Android APK / Google Play .AAB (100% Free Tools)</span>
              </h4>

              <p className="text-slate-300 leading-relaxed">
                If you or your clients want a downloadable <strong>.APK</strong> file to distribute via WhatsApp / Telegram or an <strong>.AAB (Android App Bundle)</strong>:
              </p>

              <div className="space-y-2 text-slate-300">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <strong className="text-white">PWABuilder (Microsoft's Free Tool)</strong>
                    <p className="text-[11px] text-slate-400">Enter your live app URL and download signed APK & Google Play package with 1 click.</p>
                  </div>
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-red-900 hover:bg-red-800 text-white font-bold text-xs"
                  >
                    <span>PWABuilder</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <strong className="text-white">Free App Stores with No $25 Registration Fee:</strong>
                  <ul className="mt-1.5 space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                    <li><span className="text-slate-200 font-semibold">Samsung Galaxy Store</span>: Free developer account and free submissions.</li>
                    <li><span className="text-slate-200 font-semibold">Amazon Appstore</span>: 100% free developer account for global distribution.</li>
                    <li><span className="text-slate-200 font-semibold">Direct Website / Cloud Drive APK</span>: Share the `.apk` file directly for ₹0.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>PWA Spec • Manifest v2 • DPDP Compliant</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
