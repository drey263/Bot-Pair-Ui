import React, { useState } from 'react';
import { Vote, CheckCircle2, AlertCircle, RotateCw, Smile, Smartphone } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';
import { PollVoteResponse } from '../api/types';

export const PollVotesPage: React.FC = () => {
  const { sendPollVote, isProcessing, navigate } = useWorkflow();

  const [url, setUrl] = useState('');
  const [option, setOption] = useState<string>('1');
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<PollVoteResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setResult(null);

    const cleanUrl = url.trim();
    if (!cleanUrl) {
      setFormError('Please enter the WhatsApp channel poll post URL.');
      return;
    }
    if (!cleanUrl.includes('whatsapp.com/channel/')) {
      setFormError('Enter a valid WhatsApp channel URL (e.g. https://whatsapp.com/channel/0029Vb8VyAoADTOGFnpU2d2a/130).');
      return;
    }

    const optVal = option.trim();
    if (!optVal) {
      setFormError('Please enter an option number or value.');
      return;
    }

    try {
      const res = await sendPollVote({
        url: cleanUrl,
        option: Number(optVal) || optVal,
      });
      setResult(res);
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Failed to send poll vote.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 sm:py-12 space-y-6 animate-in fade-in duration-200">
      {/* Title Header (No Bot Image) */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-xs font-semibold text-cyan-300 tracking-wider">
          <Vote className="w-3.5 h-3.5 text-cyan-400" />
          <span>Voltra Service</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Channel Poll Votes
        </h1>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          Cast automated votes on WhatsApp channel polls across active sessions.
        </p>
      </div>

      {/* Seamless Form UI (No container box, no borders, no separate background) */}
      <div className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Channel Poll URL (No autoFocus) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="poll-post-url" className="block text-xs font-medium text-slate-300">
                Channel Poll URL
              </label>
              <span className="text-[11px] text-slate-500">e.g. /channel/0029Vb.../130</span>
            </div>
            <input
              id="poll-post-url"
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="https://whatsapp.com/channel/0029Vb8VyAoADTOGFnpU2d2a/130"
              disabled={isProcessing}
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] text-white placeholder-slate-600 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all"
            />
          </div>

          {/* Option input entered manually (No option buttons, No autoFocus) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="poll-option-input" className="block text-xs font-medium text-slate-300">
                Option Number / Value
              </label>
              <span className="text-[11px] text-slate-500">Enter option number (e.g. 1, 2, 3)</span>
            </div>
            <input
              id="poll-option-input"
              type="text"
              value={option}
              onChange={(e) => {
                setOption(e.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="e.g. 1"
              disabled={isProcessing}
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] text-white placeholder-slate-600 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all"
            />
          </div>

          {/* Form Error */}
          {formError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{formError}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 px-6 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-400/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            {isProcessing ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Casting Vote...</span>
              </>
            ) : (
              <>
                <Vote className="w-4 h-4" />
                <span>Cast Vote for Option {option || '1'}</span>
              </>
            )}
          </button>

          {/* Quick Redirect Buttons */}
          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => navigate('/services/channel-reactions')}
              className="py-2.5 px-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Smile className="w-3.5 h-3.5 text-cyan-400" />
              <span>Try Reactions</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/pairing')}
              className="py-2.5 px-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Go to Pairing</span>
            </button>
          </div>
        </form>

        {/* Result Feedback */}
        {result && (
          <div className="p-4 rounded-2xl bg-white/[0.03] space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Vote Casted</span>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              {result.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
