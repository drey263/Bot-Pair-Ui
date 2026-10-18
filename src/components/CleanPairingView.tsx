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
      {/* Rectangular Bot Banner (wider so bot name is visible) with Circulating Glowing Spark Border */}
      <div className="flex flex-col items-center text-center space-y-2.5">
        <div className="relative rounded-2xl p-[1.5px] overflow-hidden group shadow-[0_0_28px_rgba(3,105,161,0.3)] mx-auto w-full max-w-[340px] sm:max-w-[380px]">
          {/* Base subtle thin border */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-cyan-500/30 z-10" />

          {/* Circulating Glowing Spark that travels continuously around the rectangular perimeter */}
          <div
            className="pointer-events-none absolute -inset-[200%] animate-spin-spark z-0 opacity-100"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, transparent 330deg, rgba(59,130,246,0.15) 340deg, rgba(6,182,212,0.6) 350deg, #38bdf8 355deg, #ffffff 358.5deg, #67e8f9 359.5deg, transparent 360deg)',
              filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 1)) drop-shadow(0 0 4px #ffffff)',
            }}
          />

          {/* Inner card with rectangular image loaded fast from local /pairing-bot-banner.png */}
          <div className="relative z-20 w-full rounded-[14.5px] bg-[#03060c] overflow-hidden flex items-center justify-center aspect-[1024/500]">
            <img
              src="/pairing-bot-banner.png"
              loading="eager"
              decoding="sync"
              alt="Voltra Bot Banner"
              className="w-full h-full object-cover rounded-[14.5px]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            WhatsApp Pairing
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Select your preferred pairing mode to link your device.
          </p>
        </div>
      </div>

      {/* Seamless Form UI */}
      <div className="space-y-3.5 sm:space-y-4 max-w-md mx-auto w-full">
        {/* Tonal Segmented Pill Selector */}
        <div className="flex p-1 rounded-full bg-white/[0.04]">
          <button
            type="button"
            onClick={() => {
              setPairingMethod('code');
              setFormError(null);
            }}
            className={`flex-1 py-1.5 sm:py-2 px-3 sm:px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              pairingMethod === 'code'
                ? 'bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-400/20 font-bold'
                : 'text-slate-400 hover:text-white'
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
            className={`flex-1 py-1.5 sm:py-2 px-3 sm:px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              pairingMethod === 'qr'
                ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/25 font-bold'
                : 'text-amber-400/80 hover:text-amber-300'
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
              {/* 1. Container ABOVE the Generate Button */}
              <div className="rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center min-h-[160px] text-center bg-white/[0.02] border border-amber-500/25 space-y-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/10">
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
                  className="mt-1 py-1.5 px-3.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-400/20 cursor-pointer"
                >
                  Use Pairing Code Instead
                </button>
              </div>

              {/* 2. Generate QR Code Button (Disabled & Amber) */}
              <button
                type="button"
                disabled={true}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-amber-500/20 border-2 border-amber-500/50 text-amber-300 font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-not-allowed select-none opacity-90 transition-all"
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
              {/* 1. Phone Number Input */}
              <div className="space-y-1.5">
                <label htmlFor="phone-input" className="block text-xs font-medium text-slate-300">
                  Phone Number
                </label>
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
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white/[0.04] text-white placeholder-slate-600 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all"
                />
              </div>

              {/* Error Message */}
              {(formError || lastError) && (
                <div className="p-2.5 sm:p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{formError || lastError}</span>
                </div>
              )}

              {/* 2. Generate Button (Above Code card) */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-cyan-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
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

              {/* 3. Card BELOW the Generate Button (Displays 8-digit code or placeholder) */}
              <div
                onClick={handleManualCopy}
                className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] space-y-1.5 text-center transition-all cursor-pointer hover:bg-white/[0.05]"
                title="Click to copy pairing code"
              >
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  8-Digit Pairing Code
                </span>

                {formattedCode ? (
                  <div className="space-y-1 animate-in fade-in duration-200">
                    <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-cyan-300 select-all py-1">
                      {formattedCode}
                    </div>
                    <div className="text-xs text-emerald-400 font-medium flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Copied automatically (tap to copy)</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-1 text-xs sm:text-sm text-slate-500 font-mono tracking-wider">
                    Code will appear here
                  </div>
                )}
              </div>
            </form>
          </GlowingFormContainer>
        )}
      </div>

      {/* Clean Underline a few px below the form */}
      <div className="pt-2 pb-3 px-1 max-w-md mx-auto w-full">
        <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
      </div>

      {/* Clean & Perfect Feature Table (Fast, reliable, easy to pair, downloader, viewonce reveal, etc.) */}
      <FeatureTable
        title="Bot Features & Platform Capabilities"
        icon={Sparkles}
        features={PAIRING_FEATURES as FeatureItem[]}
      />
    </div>
  );
};
