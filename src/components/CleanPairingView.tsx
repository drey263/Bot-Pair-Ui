import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  QrCode,
  RotateCw,
  AlertCircle,
  Check,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Download,
  Eye,
  Users,
  Sparkles,
} from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';
import { PairingMethod } from '../api/types';
import { GlowingFormContainer } from './GlowingFormContainer';
import { FeatureTable, FeatureItem } from './FeatureTable';

const BOT_AVATAR_PATH = '/bot-avatar.png';

const PAIRING_FEATURES = [
  {
    name: 'Fast & Low Latency',
    icon: Zap,
    description: 'Sub-second Baileys socket execution with asynchronous non-blocking command pipelines.',
    status: 'Ultra Fast',
  },
  {
    name: 'Reliable Multi-Session',
    icon: ShieldCheck,
    description: 'Isolated session memory with automated reconnect heartbeats and zero credential leakage.',
    status: 'Persistent',
  },
  {
    name: 'Easy 8-Digit Pairing',
    icon: Smartphone,
    description: 'Instant pairing code generation directly to WhatsApp linked devices without scanning QR.',
    status: 'Instant OTP',
  },
  {
    name: 'HD Media Downloader',
    icon: Download,
    description: 'Automated high-speed downloader for TikTok (no watermark), YouTube HD audio/video, and Reels.',
    status: 'Multi-Source',
  },
  {
    name: 'ViewOnce Revealer',
    icon: Eye,
    description: 'Automatically captures, unwraps, and archives ephemeral WhatsApp ViewOnce photos and audio.',
    status: 'Anti-Delete',
  },
  {
    name: 'Group Suite & Tools',
    icon: Users,
    description: 'Complete admin toolset including anti-link filters, tagall broadcast, sticker creator, and kick/promote.',
    status: 'Automated',
  },
];

export const CleanPairingView: React.FC = () => {
  const {
    activeBot,
    isProcessing,
    lastError,
    startPairingFlow,
    addToast,
  } = useWorkflow();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [pairingMethod, setPairingMethod] = useState<PairingMethod>('code');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    let cleanPhone = phoneNumber.replace(/[\s+-]/g, '');

    if (pairingMethod === 'code') {
      if (!cleanPhone) {
        setFormError('Please enter your WhatsApp phone number with country code.');
        return;
      }
      if (!/^\d{7,16}$/.test(cleanPhone)) {
        setFormError('Phone number should be 7 to 16 digits (e.g. 263771234567).');
        return;
      }
    } else {
      if (!cleanPhone) {
        cleanPhone = '263786624966';
      }
    }

    await startPairingFlow({
      phoneNumber: cleanPhone,
      pairingMethod,
    });
  };

  // Format 8-digit code (e.g. "VOLT-RAMD" -> "VOLT - RAMD")
  const formattedCode = activeBot?.pairingCode
    ? activeBot.pairingCode.length === 8
      ? `${activeBot.pairingCode.slice(0, 4)} - ${activeBot.pairingCode.slice(4)}`
      : activeBot.pairingCode
    : null;

  // Safe auto-copy to clipboard as soon as code appears without throwing unhandled rejection
  useEffect(() => {
    if (activeBot?.pairingCode) {
      const rawCode = activeBot.pairingCode.replace(/[\s-]/g, '');
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(rawCode)
          .then(() => {
            addToast('success', 'Pairing code automatically copied to clipboard!');
          })
          .catch(() => {
            // Silently ignore if blocked in sandboxed iframe without user interaction
          });
      }
    }
  }, [activeBot?.pairingCode, addToast]);

  const handleManualCopy = () => {
    if (activeBot?.pairingCode) {
      const rawCode = activeBot.pairingCode.replace(/[\s-]/g, '');
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(rawCode)
          .then(() => {
            addToast('success', 'Copied to clipboard!');
          })
          .catch(() => {
            // Fallback hidden textarea
            try {
              const ta = document.createElement('textarea');
              ta.value = rawCode;
              document.body.appendChild(ta);
              ta.select();
              document.execCommand('copy');
              document.body.removeChild(ta);
              addToast('success', 'Copied to clipboard!');
            } catch {
              // ignore
            }
          });
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* Skeuomorphic Hardware Console Bot Banner Monitor */}
      <div className="flex flex-col items-center text-center space-y-2.5">
        <div className="relative rounded-2xl p-[2px] overflow-hidden group shadow-[0_16px_36px_rgba(0,0,0,0.85),0_4px_8px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.2)] mx-auto w-full max-w-[340px] sm:max-w-[380px] bg-gradient-to-b from-[#1b2330] via-[#121721] to-[#090c12]">
          {/* Corner Screws */}
          <div className="pointer-events-none absolute top-2 left-2 z-30 hidden sm:block">
            <span className="skeuo-screw" />
          </div>
          <div className="pointer-events-none absolute top-2 right-2 z-30 hidden sm:block">
            <span className="skeuo-screw" />
          </div>
          <div className="pointer-events-none absolute bottom-2 left-2 z-30 hidden sm:block">
            <span className="skeuo-screw" />
          </div>
          <div className="pointer-events-none absolute bottom-2 right-2 z-30 hidden sm:block">
            <span className="skeuo-screw" />
          </div>

          {/* Machined subtle bezel border */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-cyan-500/30 z-10" />

          {/* Circulating Glowing Spark that travels continuously around the perimeter */}
          <div
            className="pointer-events-none absolute -inset-[200%] animate-spin-spark z-0 opacity-100"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, transparent 330deg, rgba(59,130,246,0.15) 340deg, rgba(6,182,212,0.6) 350deg, #38bdf8 355deg, #ffffff 358.5deg, #67e8f9 359.5deg, transparent 360deg)',
              filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 1)) drop-shadow(0 0 4px #ffffff)',
            }}
          />

          {/* Inner Display Bay with 1024x500 banner and glass glare overlay */}
          <div className="relative z-20 w-full rounded-[14px] bg-[#03060c] overflow-hidden flex items-center justify-center aspect-[1024/500] shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)]">
            <img
              src="/pairing-bot-banner.png"
              loading="eager"
              decoding="sync"
              alt="Voltra Bot Banner"
              className="w-full h-full object-cover rounded-[14px]"
            />
            {/* Glass Glare Highlight */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/25" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <span className="skeuo-diode-cyan" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              WhatsApp Pairing
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Select your preferred pairing mode to link your device.
          </p>
        </div>
      </div>

      {/* Seamless Skeuomorphic Form UI */}
      <div className="space-y-3.5 sm:space-y-4 max-w-md mx-auto w-full">
        {/* Physical 2-Position Rocker Switch Track */}
        <div className="skeuo-inset-bay p-1 rounded-2xl flex items-center gap-1.5 shadow-[inset_0_3px_6px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.08)]">
          <button
            type="button"
            onClick={() => {
              setPairingMethod('code');
              setFormError(null);
            }}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              pairingMethod === 'code'
                ? 'skeuo-btn-primary font-bold text-slate-950'
                : 'skeuo-btn-secondary text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Pairing Code</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPairingMethod('qr');
              setFormError(null);
            }}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              pairingMethod === 'qr'
                ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold border-t border-white/40 shadow-[0_3px_0_#b45309,0_6px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.5)]'
                : 'skeuo-btn-secondary text-amber-400/80 hover:text-amber-300'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* CASE A: QR CODE (QR container is displayed ABOVE button) */}
        {/* ======================================================== */}
        {pairingMethod === 'qr' && (
          <GlowingFormContainer>
            <div className="space-y-3.5">
              {/* 1. Recessed Container ABOVE the Generate Button */}
              <div className="skeuo-inset-bay rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center min-h-[160px] text-center space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-amber-500/20 to-amber-950/40 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_2px_6px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <AlertTriangle className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-semibold text-amber-200">
                    QR Code Generation Not Working
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    QR linking is currently disabled. Please switch to the 8-Digit Pairing Code to link your WhatsApp bot in seconds.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPairingMethod('code');
                    setFormError(null);
                  }}
                  className="skeuo-btn-primary mt-1 py-1.5 px-4 rounded-xl text-slate-950 text-xs font-bold transition-all cursor-pointer"
                >
                  Use Pairing Code Instead
                </button>
              </div>

              {/* 2. Tactile 3D Generate QR Code Button (Disabled & Amber) */}
              <button
                type="button"
                disabled={true}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-b from-amber-500/20 to-amber-950/30 border-t border-amber-400/30 border-b border-black text-amber-300 font-bold text-xs sm:text-sm tracking-wide shadow-[0_3px_0_#451a03,0_4px_8px_rgba(0,0,0,0.6)] flex items-center justify-center gap-2 cursor-not-allowed select-none opacity-90"
                title="Generate QR code button is disabled"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Generate QR Code</span>
              </button>
            </div>
          </GlowingFormContainer>
        )}

        {/* ============================================================== */}
        {/* CASE B: PAIRING CODE (Code card is displayed BELOW button)     */}
        {/* ============================================================== */}
        {pairingMethod === 'code' && (
          <GlowingFormContainer>
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* 1. Phone Number Input Bay */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="phone-input" className="block text-xs font-semibold text-slate-300 tracking-wide uppercase text-[10px]">
                    Phone Number
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Include country code</span>
                </div>
                <input
                  id="phone-input"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="263771234567 or 14155552671"
                  disabled={isProcessing}
                  className="skeuo-inset-bay w-full px-4 py-2.5 sm:py-3 rounded-xl text-white placeholder-slate-600 text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-400/80 focus:shadow-[inset_0_3px_6px_rgba(0,0,0,0.95),0_0_14px_rgba(6,182,212,0.4)] transition-all"
                />
              </div>

              {/* Error Message */}
              {(formError || lastError) && (
                <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-b from-rose-950/40 to-rose-900/20 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{formError || lastError}</span>
                </div>
              )}

              {/* 2. Tactile 3D Generate Button (Above Code card) */}
              <button
                type="submit"
                disabled={isProcessing}
                className="skeuo-btn-primary w-full py-2.5 sm:py-3 px-4 rounded-xl text-slate-950 font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Requesting Code...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" />
                    <span>{formattedCode ? 'Request New Code' : 'Generate Pairing Code'}</span>
                  </>
                )}
              </button>

              {/* 3. Authentic Backlit LCD Screen BELOW Generate Button */}
              <div
                onClick={handleManualCopy}
                className="skeuo-lcd-display rounded-xl p-3.5 sm:p-4 space-y-1.5 text-center transition-all cursor-pointer group"
                title="Click to copy pairing code"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className="skeuo-diode-cyan" />
                  <span className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-widest block font-mono">
                    8-Digit Pairing Code Screen
                  </span>
                </div>

                {formattedCode ? (
                  <div className="space-y-1 animate-in fade-in duration-200">
                    <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-cyan-300 select-all py-1 drop-shadow-[0_0_14px_rgba(34,211,238,0.75)]">
                      {formattedCode}
                    </div>
                    <div className="text-xs text-emerald-400 font-medium flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span className="text-[11px] font-mono">Copied automatically (tap to copy)</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-2 text-xs sm:text-sm text-cyan-400/40 font-mono tracking-widest">
                    [-- CODE WILL EMIT HERE --]
                  </div>
                )}
              </div>
            </form>
          </GlowingFormContainer>
        )}
      </div>

      {/* Skeuomorphic Stamped Channel Groove with Glowing Fiber-Optic Core */}
      <div className="pt-2 pb-3 px-1 max-w-md mx-auto w-full">
        <div className="relative h-[4px] w-full rounded-full bg-[#05080e] shadow-[inset_0_2px_4px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.08)] overflow-hidden flex items-center justify-center">
          <div className="h-[1.5px] w-3/4 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
        </div>
      </div>

      {/* Skeuomorphic Specification Feature Plate */}
      <FeatureTable
        title="Bot Features & Platform Capabilities"
        icon={Sparkles}
        features={PAIRING_FEATURES as FeatureItem[]}
      />
    </div>
  );
};
