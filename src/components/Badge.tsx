import type { ReactNode } from 'react';
import { cn } from '../utils';

interface BadgeProps {
  variant: string;
  children: ReactNode;
  className?: string;
}

const variantMap: Record<string, string> = {
  'score-elite': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  'score-bullish': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  'score-neutral': 'bg-black/[0.04] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] border-black/[0.04] dark:border-white/[0.08]',
  'score-bearish': 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
  'score-strong-sell': 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
  
  'grade-elite': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  'grade-bullish': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  'grade-neutral': 'bg-black/[0.04] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] border-black/[0.04] dark:border-white/[0.08]',
  'grade-bearish': 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
  'grade-strong-sell': 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',

  // generic variants just in case
  'bull': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  'bear': 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
  'neutral': 'bg-black/[0.04] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] border-black/[0.04] dark:border-white/[0.08]',
};

export function Badge({ variant, children, className }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border whitespace-nowrap transition-colors';
  const variantStyles = variantMap[variant] || variantMap['score-neutral'];

  return (
    <span className={cn(baseStyles, variantStyles, className)}>
      {children}
    </span>
  );
}
