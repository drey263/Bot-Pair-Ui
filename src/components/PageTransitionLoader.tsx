import React from 'react';
import botAvatar from '../assets/bot-avatar.png';

interface PageTransitionLoaderProps {
  message?: string;
}

export const PageTransitionLoader: React.FC<PageTransitionLoaderProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="w-full flex-1 min-h-[60vh] flex flex-col items-center justify-center space-y-6 py-12 animate-in fade-in duration-300 select-none">
      {/* Background soft ambient radial light */}
      <div className="relative flex items-center justify-center">
        <div className="pointer-events-none absolute w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px] animate-pulse" />
        <div className="pointer-events-none absolute w-52 h-52 bg-blue-600/10 rounded-full blur-[70px]" />

        {/* Circular loader with 3-4 circulating lines opposing each other */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
          {/* SVG Opposing Circles */}
          <svg
            viewBox="0 0 240 240"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <defs>
              <linearGradient id="ptCyanArc1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
                <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
              </linearGradient>

              <linearGradient id="ptBlueArc2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
              </linearGradient>

              <linearGradient id="ptIndigoArc3" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
              </linearGradient>

              <filter id="ptGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Guide tracks */}
            <circle cx="120" cy="120" r="76" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
            <circle cx="120" cy="120" r="90" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
            <circle cx="120" cy="120" r="104" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />

            {/* Line 1: CLOCKWISE rotation (inner) */}
            <g className="animate-spin-cw-fast">
              <circle
                cx="120"
                cy="120"
                r="76"
                fill="none"
                stroke="url(#ptCyanArc1)"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeDasharray="160 80 50 60"
                filter="url(#ptGlow)"
              />
            </g>

            {/* Line 2: COUNTER-CLOCKWISE rotation (middle - opposing Line 1) */}
            <g className="animate-spin-ccw-fast">
              <circle
                cx="120"
                cy="120"
                r="90"
                fill="none"
                stroke="url(#ptBlueArc2)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="180 90 60 70"
                filter="url(#ptGlow)"
              />
              <circle cx="210" cy="120" r="3" fill="#38bdf8" filter="url(#ptGlow)" />
            </g>

            {/* Line 3: CLOCKWISE rotation (outer - opposing Line 2) */}
            <g className="animate-spin-cw-slow">
              <circle
                cx="120"
                cy="120"
                r="104"
                fill="none"
                stroke="url(#ptIndigoArc3)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray="130 110 70 80"
                filter="url(#ptGlow)"
              />
              <circle cx="16" cy="120" r="2.5" fill="#22d3ee" filter="url(#ptGlow)" />
            </g>
          </svg>

          {/* Center Bot Image with glowing ring */}
          <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden p-1 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-xl shadow-cyan-500/30 ring-2 ring-cyan-400/25 animate-pulse-glow">
            <img
              src={botAvatar}
              width="128"
              height="128"
              loading="eager"
              decoding="sync"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== 'https://files.solnets.indevs.in/image/VSmg8file_0000000090dc821192432be3544dfe6f.png') {
                  target.src = 'https://files.solnets.indevs.in/image/VSmg8file_0000000090dc821192432be3544dfe6f.png';
                }
              }}
              alt="Voltra Bot"
              className="w-full h-full object-cover rounded-full bg-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Message below loader */}
      <div className="flex flex-col items-center space-y-1">
        <div className="flex items-center gap-2 text-cyan-300 font-medium text-sm tracking-widest uppercase">
          <span>{message}</span>
        </div>
        <span className="text-[11px] text-slate-500 tracking-wider font-mono">
          Voltra MD Engine
        </span>
      </div>
    </div>
  );
};
