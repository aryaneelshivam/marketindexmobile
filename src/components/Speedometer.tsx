import { useId } from 'react';

interface SpeedometerProps {
  value: number;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  zones?: 'score' | 'rsi' | 'adx' | 'volume' | 'macd' | '52w' | 'generic';
  label?: string;
  unit?: string;
  showTicks?: boolean;
  className?: string;
}

export function Speedometer({
  value,
  min = 0,
  max = 100,
  size = 'md',
  zones = 'score',
  label,
  unit,
  showTicks = true,
  className = '',
}: SpeedometerProps) {
  const gradientId = useId().replace(/:/g, '');

  // Clamp value to [min, max]
  const clamped = Math.max(min, Math.min(max, value));
  const fraction = max > min ? (clamped - min) / (max - min) : 0;
  
  // Angle for rotation: -90deg (at min) to +90deg (at max)
  const angleDeg = -90 + fraction * 180;

  // Color determination based on zones
  const getPointerColor = () => {
    if (zones === 'rsi') {
      if (clamped <= 30) return '#10b981'; // oversold (bullish reversal)
      if (clamped >= 70) return '#f43f5e'; // overbought (bearish risk)
      return '#3b82f6'; // neutral
    }
    if (zones === 'adx') {
      if (clamped < 20) return '#94a3b8';
      if (clamped < 25) return '#f59e0b';
      return '#10b981';
    }
    if (zones === 'volume') {
      if (clamped >= 1.5) return '#10b981';
      if (clamped >= 1.0) return '#3b82f6';
      return '#94a3b8';
    }
    if (zones === 'macd') {
      if (clamped > 0.05) return '#10b981';
      if (clamped < -0.05) return '#f43f5e';
      return '#94a3b8';
    }
    if (zones === '52w') {
      if (fraction >= 0.75) return '#10b981';
      if (fraction <= 0.25) return '#f59e0b';
      return '#3b82f6';
    }
    // score & generic
    if (clamped >= 75) return '#10b981';
    if (clamped >= 50) return '#3b82f6';
    if (clamped >= 30) return '#f59e0b';
    return '#f43f5e';
  };

  // Dimensions based on size
  const config = {
    sm: { width: 56, height: 32, cx: 28, cy: 28, r: 20, strokeWidth: 3.5, needleLen: 15, hubR: 2.5 },
    md: { width: 76, height: 44, cx: 38, cy: 38, r: 28, strokeWidth: 4.5, needleLen: 21, hubR: 3 },
    lg: { width: 110, height: 62, cx: 55, cy: 55, r: 40, strokeWidth: 5.5, needleLen: 31, hubR: 4 },
  }[size];

  const { width, height, cx, cy, r, strokeWidth, needleLen, hubR } = config;
  const pointerColor = getPointerColor();

  // Tick marks
  const tickSteps = [0, 0.25, 0.5, 0.75, 1];

  // Arc path description (semi-circle from left cx-r,cy to right cx+r,cy)
  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  // Gradients for track
  const renderGradients = () => {
    if (zones === 'rsi') {
      return (
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="30%" stopColor="#10b981" />
          <stop offset="42%" stopColor="#3b82f6" />
          <stop offset="65%" stopColor="#3b82f6" />
          <stop offset="75%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
      );
    }
    if (zones === 'adx') {
      return (
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="30%" stopColor="#cbd5e1" />
          <stop offset="42%" stopColor="#f59e0b" />
          <stop offset="65%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      );
    }
    if (zones === 'volume') {
      return (
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="33%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="75%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      );
    }
    if (zones === 'macd') {
      return (
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="40%" stopColor="#fb7185" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="60%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      );
    }
    if (zones === '52w') {
      return (
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="35%" stopColor="#06b6d4" />
          <stop offset="70%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      );
    }
    // Score gradient: Red -> Amber -> Blue -> Green
    return (
      <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="25%" stopColor="#f97316" />
        <stop offset="50%" stopColor="#eab308" />
        <stop offset="75%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    );
  };

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <defs>{renderGradients()}</defs>

        {/* Background Track Arc */}
        <path
          d={arcPath}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-zinc-200/80 dark:text-zinc-800"
          strokeLinecap="round"
        />

        {/* Colored Gradient Zone Arc */}
        <path
          d={arcPath}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="opacity-90"
        />

        {/* Graduation Tick Marks */}
        {showTicks &&
          tickSteps.map((stepFraction, idx) => {
            const rad = Math.PI * (1 - stepFraction);
            const innerR = r - strokeWidth / 2 - 1.5;
            const outerR = r + strokeWidth / 2 + 1.5;
            const x1 = cx + innerR * Math.cos(rad);
            const y1 = cy - innerR * Math.sin(rad);
            const x2 = cx + outerR * Math.cos(rad);
            const y2 = cy - outerR * Math.sin(rad);
            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth={size === 'lg' ? 1.5 : 1}
                className="text-white/80 dark:text-zinc-950/80"
              />
            );
          })}

        {/* Needle (drawn pointing straight UP, then rotated around cx, cy) */}
        <g
          style={{
            transform: `rotate(${angleDeg}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: 'transform 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
          }}
        >
          {/* Needle Shadow */}
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - needleLen}
            stroke="#000000"
            strokeWidth={size === 'lg' ? 2.5 : size === 'md' ? 2 : 1.5}
            strokeLinecap="round"
            className="opacity-20 translate-y-0.5"
          />
          {/* Main Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - needleLen}
            stroke={pointerColor}
            strokeWidth={size === 'lg' ? 2.5 : size === 'md' ? 2 : 1.5}
            strokeLinecap="round"
          />
        </g>

        {/* Center Pivot Hub */}
        <circle
          cx={cx}
          cy={cy}
          r={hubR}
          fill="currentColor"
          className="text-zinc-800 dark:text-zinc-200 shadow-sm"
        />
        <circle
          cx={cx}
          cy={cy}
          r={hubR * 0.45}
          fill={pointerColor}
        />
      </svg>

      {/* Label and Unit */}
      {label && (
        <div className="flex items-center gap-0.5 text-[9px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 -mt-1">
          <span>{label}</span>
          {unit && <span>({unit})</span>}
        </div>
      )}
    </div>
  );
}
