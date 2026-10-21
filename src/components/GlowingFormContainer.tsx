import React from 'react';

interface GlowingFormContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * GlowingFormContainer - Skeuomorphic Heavy-Duty Console Chassis
 * Real-object physical console faceplate with machined bevels, corner fastener screws,
 * circulating spark orbit, and a recessed instrument deck.
 */
export const GlowingFormContainer: React.FC<GlowingFormContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`relative rounded-2xl sm:rounded-3xl p-[2px] overflow-hidden group shadow-[0_16px_36px_rgba(0,0,0,0.85),0_4px_8px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.2)] bg-gradient-to-b from-[#1b2330] via-[#121721] to-[#090c12] ${className}`}
    >
      {/* 1. Base subtle machined metal edge border */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl border border-cyan-500/25 z-10" />

      {/* 2. Circulating Glowing Spark that travels continuously around the physical chassis perimeter */}
      <div
        className="pointer-events-none absolute -inset-[200%] animate-spin-spark z-0 opacity-100"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, transparent 330deg, rgba(59,130,246,0.15) 340deg, rgba(6,182,212,0.6) 350deg, #38bdf8 355deg, #ffffff 358.5deg, #67e8f9 359.5deg, transparent 360deg)',
          filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 1)) drop-shadow(0 0 4px #ffffff)',
        }}
      />

      {/* 3. Inner Machined Instrument Deck with Corner Screws and Recessed Groove */}
      <div className="relative z-20 w-full rounded-[14px] sm:rounded-[22px] bg-gradient-to-b from-[#0c1017] via-[#080b11] to-[#04060a] p-4 sm:p-5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.06)] border border-white/[0.04]">
        {/* Subtle physical corner screws */}
        <div className="pointer-events-none absolute top-2.5 left-2.5 z-20 hidden sm:block">
          <span className="skeuo-screw" />
        </div>
        <div className="pointer-events-none absolute top-2.5 right-2.5 z-20 hidden sm:block">
          <span className="skeuo-screw" />
        </div>
        <div className="pointer-events-none absolute bottom-2.5 left-2.5 z-20 hidden sm:block">
          <span className="skeuo-screw" />
        </div>
        <div className="pointer-events-none absolute bottom-2.5 right-2.5 z-20 hidden sm:block">
          <span className="skeuo-screw" />
        </div>

        {children}
      </div>
    </div>
  );
};
