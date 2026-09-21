import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, X, Smartphone, CheckCircle2 } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'menu-item' | 'pill';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  // If already running as standalone PWA, do not show install button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (isInstallable) {
      setInstalling(true);
      try {
        await install();
      } finally {
        setInstalling(false);
      }
    } else {
      // If browser doesn't support or hasn't fired beforeinstallprompt yet
      setShowIOSGuide(true);
    }
  };

  // Render modal for iOS or manual install guidance
  const renderGuideModal = () => {
    if (!showIOSGuide) return null;

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        onClick={() => setShowIOSGuide(false)}
      >
        <div 
          className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#1c1c1e] p-6 shadow-2xl border border-black/[0.08] dark:border-white/[0.12] text-[#1d1d1f] dark:text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0066cc]/10 dark:bg-[#2997ff]/20 flex items-center justify-center text-[#0066cc] dark:text-[#2997ff]">
                <Smartphone className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold font-display">Install Market Index</h3>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white bg-black/[0.04] dark:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-3.5 text-xs text-[#555558] dark:text-[#a1a1a6]">
            {isIOS ? (
              <>
                <p className="font-medium text-[#1d1d1f] dark:text-zinc-200">
                  Install directly onto your iPhone or iPad home screen for standalone full-screen experience:
                </p>
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0066cc] text-white text-[10px] font-bold shrink-0 mt-0.5">1</span>
                    <span>Tap the <strong className="text-[#1d1d1f] dark:text-white inline-flex items-center gap-1"><Share2 className="w-3 h-3 text-[#0066cc] inline" /> Share</strong> icon in Safari&apos;s bottom toolbar.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0066cc] text-white text-[10px] font-bold shrink-0 mt-0.5">2</span>
                    <span>Scroll down and tap <strong className="text-[#1d1d1f] dark:text-white">Add to Home Screen</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0066cc] text-white text-[10px] font-bold shrink-0 mt-0.5">3</span>
                    <span>Tap <strong className="text-[#0066cc] dark:text-[#2997ff]">Add</strong> in the top right corner to confirm.</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="font-medium text-[#1d1d1f] dark:text-zinc-200">
                  Install Market Index as an app on your computer or Android device:
                </p>
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0066cc] text-white text-[10px] font-bold shrink-0 mt-0.5">1</span>
                    <span>Look for the <strong className="text-[#1d1d1f] dark:text-white">Install</strong> icon in your browser address bar (top right).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0066cc] text-white text-[10px] font-bold shrink-0 mt-0.5">2</span>
                    <span>Click <strong className="text-[#0066cc] dark:text-[#2997ff]">Install</strong> to launch Market Index in dedicated standalone mode.</span>
                  </div>
                </div>
              </>
            )}

            <div className="pt-2">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Enables offline access, instant launch, and full-screen market views.</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowIOSGuide(false)}
            className="mt-5 w-full h-9 rounded-xl bg-[#0066cc] hover:bg-[#0055b3] text-white text-xs font-semibold transition-all active:scale-[0.98]"
          >
            Got It
          </button>
        </div>
      </div>
    );
  };

  if (variant === 'menu-item') {
    return (
      <>
        <button
          id="pwa-menu-install-btn"
          onClick={handleInstallClick}
          disabled={installing}
          className={`w-full flex items-center justify-between text-xs font-medium px-3 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-[#0066cc]/10 text-[#1d1d1f] dark:text-zinc-200 transition-colors ${className}`}
        >
          <div className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
            <span>Install Market Index App</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#0066cc] dark:text-[#2997ff] bg-[#0066cc]/10 dark:bg-[#2997ff]/20 px-2 py-0.5 rounded-full">
            {isIOS ? 'iOS PWA' : 'Install'}
          </span>
        </button>
        {renderGuideModal()}
      </>
    );
  }

  return (
    <>
      <button
        id="pwa-nav-install-btn"
        onClick={handleInstallClick}
        disabled={installing}
        title="Install Market Index App"
        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 h-7 rounded-full bg-[#0066cc]/10 dark:bg-[#2997ff]/15 text-[#0066cc] dark:text-[#2997ff] hover:bg-[#0066cc]/20 dark:hover:bg-[#2997ff]/25 border border-[#0066cc]/20 dark:border-[#2997ff]/30 transition-all active:scale-95 shrink-0 ${className}`}
      >
        <Download className="w-3 h-3" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>
      {renderGuideModal()}
    </>
  );
};
