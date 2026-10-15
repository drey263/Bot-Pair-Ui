import React, { useState, useEffect } from 'react';
import botAvatar from '../assets/bot-avatar.png';

interface SplashScreenProps {
  onFinish?: () => void;
  minDisplayTimeMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDisplayTimeMs = 5000,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 650); // Matches opacity transition duration
    }, minDisplayTimeMs);

    return () => clearTimeout(timer);
  }, [minDisplayTimeMs, onFinish]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 300);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#06080e] select-none cursor-pointer transition-all duration-700 ease-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[140px] animate-pulse" />
      <div className="pointer-events-none absolute w-[380px] h-[380px] bg-blue-600/10 rounded-full blur-[110px]" />

      {/* Main Circular Loader Container (Enlarged) */}
      <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
        {/* SVG with 2 opposing circulating circular lines (1 pair) */}
        <svg
          viewBox="0 0 320 320"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <linearGradient id="cyanArc1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="skyArc2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.15" />
            </linearGradient>

            <filter id="neonGlowSplash" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Guide track circles */}
          <circle cx="160" cy="160" r="102" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
          <circle cx="160" cy="160" r="118" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />

          {/* 1. Ring 1: CLOCKWISE rotation */}
          <g className="animate-spin-cw-fast">
            <circle
              cx="160"
              cy="160"
              r="102"
              fill="none"
              stroke="url(#cyanArc1)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeDasharray="210 110 90 70"
              filter="url(#neonGlowSplash)"
            />
          </g>

          {/* 2. Ring 2: COUNTER-CLOCKWISE rotation (Opposing Ring 1) */}
          <g className="animate-spin-ccw-fast">
            <circle
              cx="160"
              cy="160"
              r="118"
              fill="none"
              stroke="url(#skyArc2)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeDasharray="250 120 70 80"
              filter="url(#neonGlowSplash)"
            />
            {/* Satellite glowing node orbiting on outer ring */}
            <circle cx="278" cy="160" r="3.5" fill="#38bdf8" filter="url(#neonGlowSplash)" />
          </g>
        </svg>

        {/* Center Bot Image (Significantly bigger and clear) */}
        <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden p-1.5 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 ring-4 ring-cyan-400/20 shadow-2xl shadow-cyan-500/40 animate-pulse-glow">
          <img
            src={botAvatar}
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

      {/* Brand Title below Loader (no milestones, no lightning icon) */}
      <div className="mt-7 flex flex-col items-center text-center space-y-2 z-10">
        <span className="text-base sm:text-lg font-extrabold tracking-[0.3em] text-white">
          VOLTRA MINI
        </span>
        <p className="text-[10px] text-slate-500">
          Click anywhere to skip
        </p>
      </div>
    </div>
  );
};
