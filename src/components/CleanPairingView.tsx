import React, { useState } from 'react';
import {
  Smartphone,
  QrCode,
  Copy,
  Check,
  RefreshCw,
  RotateCw,
  Zap,
  CheckCircle2,
  AlertCircle,
  Radio,
} from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';
import { PairingMethod } from '../api/types';
import { QRCodeView } from './QRCodeView';

export const CleanPairingView: React.FC = () => {
  const {
    activeBot,
    isProcessing,
    isPolling,
    lastError,
    startPairingFlow,
    pollBotStatusOnce,
    resetBotSession,
    addToast,
  } = useWorkflow();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [pairingMethod, setPairingMethod] = useState<PairingMethod>('code');
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

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
      // QR Code does not require user phone number
      if (!cleanPhone) {
        cleanPhone = '263786624966'; // Valid international placeholder for backend validator
      }
    }

    await startPairingFlow({
      phoneNumber: cleanPhone,
      name: 'Voltra Bot',
      pairingMethod,
    });
  };

  const handleCopyCode = () => {
    if (!activeBot?.pairingCode) return;
    navigator.clipboard.writeText(activeBot.pairingCode);
    setCopiedCode(true);
    addToast('success', 'Pairing code copied to clipboard');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const isConnected = (activeBot?.status || '').toLowerCase() === 'connected';

  // Format 8-digit code (e.g. "VOLT-RAMD" -> "VOLT - RAMD")
  const formattedCode = activeBot?.pairingCode
    ? activeBot.pairingCode.length === 8
      ? `${activeBot.pairingCode.slice(0, 4)} - ${activeBot.pairingCode.slice(4)}`
      : activeBot.pairingCode
    : null;

  const hasMatchingCode =
    pairingMethod === 'code' && Boolean(activeBot?.pairingCode);
  const hasMatchingQr =
    pairingMethod === 'qr' && Boolean(activeBot?.qrData);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 sm:py-14 space-y-6">
      {/* Google Stitch Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-xs font-medium text-cyan-300">
          <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
          <span>Voltra Stitch</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          WhatsApp Pairing
        </h1>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          Select your preferred pairing mode to link your device.
        </p>
      </div>

      {/* Main Google Stitch Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#11151f]/90 border border-white/10 shadow-2xl shadow-black/80 backdrop-blur-xl space-y-6">
        {/* Google Stitch Tonal Segmented Pill Selector */}
        <div className="flex p-1 rounded-full bg-[#090c12] border border-white/5">
          <button
            type="button"
            onClick={() => {
              setPairingMethod('code');
              setFormError(null);
            }}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              pairingMethod === 'code'
                ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20'
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
                ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20'
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
            <div className="rounded-2xl bg-[#090c12] border border-white/5 p-5 flex flex-col items-center justify-center min-h-[250px] text-center">
              {isProcessing ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs">
                  <RotateCw className="w-7 h-7 text-cyan-400 animate-spin mb-3" />
                  <span className="text-white font-medium">Generating QR Code...</span>
                </div>
              ) : hasMatchingQr && activeBot?.qrData ? (
                <div className="py-1 flex flex-col items-center">
                  <QRCodeView qrData={activeBot.qrData} size={210} />
                </div>
              ) : (
                <div className="py-10 flex flex-col items-center text-slate-400 text-xs max-w-xs">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 mb-3">
                    <QrCode className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <span className="text-slate-300 font-medium text-xs">
                    QR Code Ready
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Click below to display code
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
              {isProcessing ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Generating QR...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  <span>{hasMatchingQr ? 'Regenerate QR Code' : 'Generate QR Code'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* CASE B: PAIRING CODE (Code block is displayed BELOW button)    */}
        {/* ============================================================== */}
        {pairingMethod === 'code' && (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                autoFocus
                className="w-full px-4 py-3 rounded-2xl bg-[#090c12] border border-white/10 text-white placeholder-slate-600 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition-all"
              />
            </div>

            {/* Error Message */}
            {(formError || lastError) && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{formError || lastError}</span>
              </div>
            )}

            {/* 2. Generate Button (Above the Code block) */}
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
                  <span>{hasMatchingCode ? 'Request New Code' : 'Generate Pairing Code'}</span>
                </>
              )}
            </button>

            {/* 3. Block BELOW the Generate Button (Displays Pairing Code) */}
            {hasMatchingCode && (
              <div className="rounded-2xl bg-[#090c12] border border-cyan-400/40 p-4 space-y-3 shadow-lg shadow-cyan-950/20 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-cyan-400 uppercase tracking-wider text-[10px]">
                    Pairing Code
                  </span>
                  <span className="text-slate-500">2 min</span>
                </div>

                <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#06080e] border border-cyan-900/50">
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-cyan-300 select-all flex-1 text-center">
                    {formattedCode}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3.5 py-2 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* Live Status Indicator & Polling Strip */}
        {activeBot && (
          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Connected</span>
                </span>
              ) : isPolling ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[11px] font-mono">
                  <Radio className="w-3 h-3 animate-pulse text-cyan-400" />
                  <span>Awaiting Link...</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 text-xs">
                  <span>{activeBot.status}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => pollBotStatusOnce()}
                title="Check Status"
                className="p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={resetBotSession}
                className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer text-xs"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
