import React, { useState } from 'react';
import { Vote, CheckCircle2, AlertCircle, RotateCw, Smile, Smartphone } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';
import { PollVoteResponse } from '../api/types';
import { GlowingFormContainer } from './GlowingFormContainer';

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
    <div className="w-full max-w-[340px] sm:max-w-sm mx-auto px-2 sm:px-3 py-2 sm:py-4 space-y-2.5 sm:space-y-3 animate-in fade-in duration-200">
      {/* Title Header (Compact for mobile) */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-[9px] sm:text-[10px] font-semibold text-cyan-300 tracking-wider">
          <Vote className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
          <span>Voltra Service</span>
        </div>
        <h1 className="text-base sm:text-xl font-bold tracking-tight text-white">
          Channel Poll Votes
        </h1>
        <p className="text-[10px] sm:text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          Cast automated votes on WhatsApp channel polls across active sessions.
        </p>
      </div>

      {/* Styled Form with Circulating Glowing Spark Border */}
      <GlowingFormContainer>
        <div className="space-y-2.5">
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Channel Poll URL */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="poll-post-url" className="block text-[10px] sm:text-[11px] font-medium text-slate-300">
                  Channel Poll URL
                </label>
                <span className="text-[9px] text-slate-500">/channel/...</span>
              </div>
              <input
                id="poll-post-url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="https://whatsapp.com/channel/..."
                disabled={isProcessing}
                className="w-full px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/[0.04] text-white placeholder-slate-600 text-[11px] sm:text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all"
              />
            </div>

            {/* Option input entered manually */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="poll-option-input" className="block text-[10px] sm:text-[11px] font-medium text-slate-300">
                  Option Number / Value
                </label>
                <span className="text-[9px] text-slate-500">e.g. 1, 2, 3</span>
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
                className="w-full px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/[0.04] text-white placeholder-slate-600 text-[11px] sm:text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all"
              />
            </div>

            {/* Form Error */}
            {formError && (
              <div className="p-2 rounded-lg sm:rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] sm:text-[11px] text-rose-300 flex items-start gap-1.5">
                <AlertCircle className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{formError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2 sm:py-2.5 px-3 rounded-lg sm:rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-[11px] sm:text-xs tracking-wide shadow-md shadow-cyan-400/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              {isProcessing ? (
                <>
                  <RotateCw className="w-3 h-3 animate-spin" />
                  <span>Casting Vote...</span>
                </>
              ) : (
                <>
                  <Vote className="w-3 h-3" />
                  <span>Cast Vote for Option {option || '1'}</span>
                </>
              )}
            </button>

            {/* Quick Redirect Buttons */}
            <div className="pt-0.5 grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => navigate('/services/channel-reactions')}
                className="py-1.5 sm:py-2 px-2 rounded-lg sm:rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-[10px] sm:text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
              >
                <Smile className="w-3 h-3 text-cyan-400" />
                <span>Try Reactions</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/pairing')}
                className="py-1.5 sm:py-2 px-2 rounded-lg sm:rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-[10px] sm:text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
              >
                <Smartphone className="w-3 h-3 text-cyan-400" />
                <span>Go to Pairing</span>
              </button>
            </div>
          </form>

          {/* Result Feedback */}
          {result && (
            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/[0.03] space-y-0.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px] sm:text-xs">
                <CheckCircle2 className="w-3 h-3" />
                <span>Vote Casted</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-300 font-mono leading-relaxed">
                {result.message}
              </p>
            </div>
          )}
        </div>
      </GlowingFormContainer>
    </div>
  );
};
