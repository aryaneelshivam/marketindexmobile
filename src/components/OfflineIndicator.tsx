import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      id="pwa-offline-indicator"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-[#1c1c1e] dark:bg-[#2c2c2e] border border-amber-500/30 px-3.5 py-1.5 text-xs font-medium text-white shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <WifiOff className="w-3.5 h-3.5 text-amber-400" />
      <span>Offline Mode — Cached data active</span>
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping ml-0.5" />
    </div>
  );
};
