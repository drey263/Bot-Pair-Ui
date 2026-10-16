import React, { useState, useEffect } from 'react';
import botAvatar from '../assets/bot-avatar.png';

interface SplashScreenProps {
  onFinish?: () => void;
  minDisplayTimeMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDisplayTimeMs = 2800,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 500); // 500ms smooth fade transition
    }, minDisplayTimeMs);

    return () => clearTimeout(timer);
  }, [minDisplayTimeMs, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020408] select-none transition-opacity duration-500 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background subtle ambient radial glow */}
      <div className="pointer-events-none absolute w-96 h-96 bg-cyan-500/[0.08] rounded-full blur-[100px]" />
      <div className="pointer-events-none absolute w-64 h-64 bg-blue-600/[0.06] rounded-full blur-[80px]" />

      {/* Clean, refined circular spinner & bot avatar */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        {/* Minimalist, clean SVG rotating ring */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <linearGradient id="cleanLoaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Faint circular track */}
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1.5"
          />

          {/* Clean glowing spinning arc */}
          <g className="animate-spin-cw-fast">
            <circle
              cx="100"
              cy="100"
              r="82"
              fill="none"
              stroke="url(#cleanLoaderGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="160 360"
            />
          </g>

          {/* Secondary subtle counter-rotating ring */}
          <g className="animate-spin-ccw-slow">
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="rgba(56, 189, 248, 0.3)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="80 200"
            />
          </g>
        </svg>

        {/* Center Bot Image with clean refined border */}
        <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden p-1 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-xl shadow-cyan-500/25 ring-2 ring-cyan-400/20">
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

      {/* Sleek typography & progress indicator */}
      <div className="mt-6 flex flex-col items-center text-center space-y-3 z-10">
        <span className="text-sm sm:text-base font-bold tracking-[0.25em] text-white">
          VOLTRA MD
        </span>

        {/* Minimal clean loading bar */}
        <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full animate-[spinSpark_1.6s_ease-in-out_infinite]" />
        </div>

        <p className="text-[10px] text-cyan-400/70 font-mono tracking-widest uppercase">
          Initializing Services
        </p>
      </div>
    </div>
  );
};
