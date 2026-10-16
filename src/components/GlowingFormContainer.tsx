import React from 'react';

interface GlowingFormContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * GlowingFormContainer
 * Compact, styled container with a thin glowing spark circulating around the border.
 * Sized down for sleek, clean, modern form proportions.
 */
export const GlowingFormContainer: React.FC<GlowingFormContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`relative rounded-2xl sm:rounded-3xl p-[1.5px] overflow-hidden group shadow-[0_0_24px_rgba(3,105,161,0.12)] ${className}`}>
      {/* 1. Base subtle styled thin border */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl border border-cyan-500/20 z-10" />

      {/* 2. Circulating Glowing Spark that travels continuously around the form perimeter */}
      <div
        className="pointer-events-none absolute -inset-[200%] animate-spin-spark z-0 opacity-100"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, transparent 330deg, rgba(59,130,246,0.15) 340deg, rgba(6,182,212,0.6) 350deg, #38bdf8 355deg, #ffffff 358.5deg, #67e8f9 359.5deg, transparent 360deg)',
          filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 1)) drop-shadow(0 0 4px #ffffff)',
        }}
      />

      {/* 3. Inner Form Card (Compact padding and radius) */}
      <div className="relative z-20 w-full rounded-[14.5px] sm:rounded-[22.5px] bg-[#03060c] p-4 sm:p-5 shadow-xl shadow-cyan-950/20">
        {children}
      </div>
    </div>
  );
};
