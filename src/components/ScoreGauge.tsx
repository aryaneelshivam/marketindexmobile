import React from 'react';

export function ScoreGauge({ score, className = '' }: { score: number, className?: string }) {
  // Normalize score between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score));
  const radius = 8;
  const circumference = Math.PI * radius; // Half circle
  const dashoffset = circumference - (normalizedScore / 100) * circumference;

  let color = 'text-zinc-400 dark:text-zinc-500';
  if (score >= 75) color = 'text-emerald-500';
  else if (score >= 50) color = 'text-blue-500';
  else if (score >= 25) color = 'text-amber-500';
  else color = 'text-rose-500';

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: '20px', height: '12px' }}>
      <svg className="w-full h-full" viewBox="0 0 20 12">
        <path
          d="M 2 10 A 8 8 0 0 1 18 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-zinc-200 dark:text-zinc-700"
          strokeLinecap="round"
        />
        <path
          d="M 2 10 A 8 8 0 0 1 18 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
    </div>
  );
}
