import React from 'react';

const BOT_AVATAR_PATH = '/bot-avatar.png';

interface PageTransitionLoaderProps {
  message?: string;
}

export const PageTransitionLoader: React.FC<PageTransitionLoaderProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020408] select-none">
      {/* Background soft ambient radial light */}
      <div className="pointer-events-none absolute w-80 h-80 bg-cyan-500/[0.08] rounded-full blur-[90px]" />
      <div className="pointer-events-none absolute w-52 h-52 bg-blue-600/[0.06] rounded-full blur-[70px]" />

      {/* Clean circular spinner with bot avatar */}
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <linearGradient id="ptCleanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
              <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Faint track */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1.5"
          />

          {/* Clockwise spinning arc */}
          <g className="animate-spin-cw-fast">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#ptCleanGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="150 360"
            />
          </g>

          {/* Counter-clockwise outer ring */}
          <g className="animate-spin-ccw-slow">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(56, 189, 248, 0.25)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="70 220"
            />
          </g>
        </svg>

        {/* Center Bot Image with physical machined bezel and glass lens */}
        <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1.5 bg-gradient-to-b from-[#2a3444] via-[#151c27] to-[#0a0d14] shadow-[0_12px_28px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-cyan-400/30">
          <img
            src="/bot-avatar.png"
            width="112"
            height="112"
            loading="eager"
            decoding="sync"
            alt="Voltra Bot"
            className="w-full h-full object-cover rounded-full bg-slate-900 border border-black"
          />
          {/* Glass Lens Glare */}
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/25 via-transparent to-transparent" />
        </div>
      </div>

      {/* Sleek message and skeuomorphic loading bar */}
      <div className="mt-5 flex flex-col items-center space-y-2.5 z-10">
        <div className="flex items-center gap-1.5">
          <span className="skeuo-diode-cyan" />
          <span className="text-xs sm:text-sm font-bold tracking-widest text-cyan-300 uppercase font-mono drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            {message}
          </span>
        </div>

        {/* Skeuomorphic Stamped Inset Loading Bar */}
        <div className="w-32 h-2 skeuo-inset-bay rounded-full overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]">
          <div className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full shadow-[0_0_8px_#22d3ee] animate-[spinSpark_1.6s_ease-in-out_infinite]" />
        </div>

        <span className="text-[10px] text-slate-500 tracking-widest font-mono uppercase">
          VOLTRA MD ENGINE
        </span>
      </div>
    </div>
  );
};
