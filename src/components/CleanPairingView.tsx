import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  QrCode,
  RotateCw,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';
import { PairingMethod } from '../api/types';
import { QRCodeView } from './QRCodeView';
import botAvatar from '../assets/bot-avatar.png';

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

  const hasMatchingQr =
    pairingMethod === 'qr' && Boolean(activeBot?.qrData);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Bot Avatar & Title Header */}
      <div className="text-center space-y-3 flex flex-col items-center">
        <div className="relative group">
          {/* Circulating / orbiting blue dot around the border */}
          <div
            className="absolute -inset-1.5 rounded-full border border-cyan-400/25 animate-spin-cw-fast pointer-events-none"
            style={{ animationDuration: '3.6s' }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400 border-2 border-[#020408] absolute -top-1.5 left-1/2 -translate-x-1/2" />
          </div>

          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-400/20 transition-transform duration-300 group-hover:scale-105">
            <img
              src={botAvatar}
              width="112"
              height="112"
              loading="eager"
              decoding="sync"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== 'https://files.solnets.indevs.in/image/VSmg8file_0000000090dc821192432be3544dfe6f.png') {
                  target.src = 'https://files.solnets.indevs.in/image/VSmg8file_0000000090dc821192432be3544dfe6f.png';
                }
              }}
              alt="Voltra Bot Avatar"
              className="w-full h-full object-cover rounded-full bg-slate-900"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-xs font-semibold text-cyan-300 tracking-wider">
            <span>Voltra MD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            WhatsApp Pairing
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Select your preferred pairing mode to link your device.
          </p>
        </div>
      </div>

      {/* Seamless Form UI (No container box, no borders, no separate background) */}
      <div className="space-y-6">
        {/* Tonal Segmented Pill Selector (Switching here is instant, no transition loader) */}
        <div className="flex p-1 rounded-full bg-white/[0.04]">
          <button
            type="button"
            onClick={() => {
              setPairingMethod('code');
              setFormError(null);
            }}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              pairingMethod === 'code'
                ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20 font-bold'
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
            className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              pairingMethod === 'qr'
                ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20 font-bold'
                : 'text-slate-400 hover:text-white'
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Container ABOVE the Generate Button */}
            <div className="rounded-2xl p-4 flex flex-col items-center justify-center min-h-[260px] text-center bg-white/[0.02]">
              {activeBot?.pairingMethod === 'qr' && activeBot?.qrData ? (
                <div className="py-1 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                  <QRCodeView
                    qrData={activeBot.qrData}
                    size={210}
                    onRefresh={() =>
                      startPairingFlow({ phoneNumber: 'QR Session', pairingMethod: 'qr' })
                    }
                  />
                </div>
              ) : isProcessing || (activeBot?.pairingMethod === 'qr' && !activeBot?.qrData) ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
                  <RotateCw className="w-8 h-8 text-cyan-400 animate-spin mb-1" />
                  <span className="text-white font-medium text-sm">Waiting for QR Code from API...</span>
                  <span className="text-slate-400 text-xs">Connecting to WhatsApp session on Voltra server</span>
                  {activeBot?.botId && (
                    <span className="text-slate-600 text-[11px] font-mono mt-1">
                      Session: {activeBot.botId}
                    </span>
                  )}
                </div>
              ) : (
                <div className="py-10 flex flex-col items-center text-slate-400 text-xs max-w-xs">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center text-slate-400 mb-3">
                    <QrCode className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <span className="text-slate-300 font-medium text-xs">
                    QR Code Ready
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Click below to generate scan code from API
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {(formError || lastError) && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{formError || lastError}</span>
              </div>
            )}

            {/* 2. Generate Button (Below the QR container) */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-400/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              {isProcessing || (activeBot?.pairingMethod === 'qr' && !activeBot?.qrData) ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Requesting QR from API...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  <span>{activeBot?.qrData ? 'Regenerate QR Code' : 'Generate QR Code'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* CASE B: PAIRING CODE (Code card is displayed BELOW button)     */}
        {/* ============================================================== */}
        {pairingMethod === 'code' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Phone Number Input (No autoFocus) */}
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
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] text-white placeholder-slate-600 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all"
              />
            </div>

            {/* Error Message */}
            {(formError || lastError) && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{formError || lastError}</span>
              </div>
            )}

            {/* 2. Generate Button (Above the Code card) */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-400/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
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
              className="p-5 rounded-2xl bg-white/[0.03] space-y-2 text-center transition-all cursor-pointer hover:bg-white/[0.05]"
              title="Click to copy pairing code"
            >
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                8-Digit Pairing Code
              </span>

              {formattedCode ? (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-widest text-cyan-300 select-all py-1">
                    {formattedCode}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium flex items-center justify-center gap-1.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Copied to clipboard automatically (tap to copy)</span>
                  </div>
                </div>
              ) : (
                <div className="py-2 text-sm text-slate-500 font-mono tracking-wider">
                  Code will appear here
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
