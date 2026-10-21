import React, { useState } from 'react';
import { Vote, CheckCircle2, AlertCircle, RotateCw, Smile, Smartphone, Users, ShieldCheck } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';
import { PollVoteResponse } from '../api/types';
import { GlowingFormContainer } from './GlowingFormContainer';
import { FeatureTable, FeatureItem } from './FeatureTable';

const POLL_VOTES_FEATURES: FeatureItem[] = [
  {
    name: 'Targeted Option Selection',
    icon: Vote,
    description: 'Cast instant automated votes for specific option keys (1, 2, 3, etc.) on WhatsApp channel polls.',
    status: 'Precision Vote',
  },
  {
    name: 'Multi-Session Swarm',
    icon: Users,
    description: 'Broadcasts vote commands simultaneously across all active linked bot instances.',
    status: 'Concurrent',
  },
  {
    name: 'Live Vote Verification',
    icon: CheckCircle2,
    description: 'Real-time API response verifies socket delivery and poll vote acceptance immediately.',
    status: 'Verified',
  },
  {
    name: 'Native Protocol Payloads',
    icon: ShieldCheck,
    description: 'Constructs authentic WhatsApp Web vote stanzas to ensure permanent, non-rollback votes.',
    status: 'Undetectable',
  },
];

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
    <div className="w-full max-w-md mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* Title Header with Diode Indicator */}
      <div className="text-center space-y-1.5">
        <div className="flex items-center justify-center gap-1.5">
          <span className="skeuo-diode-cyan" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            Channel Poll Votes
          </h1>
        </div>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          Cast automated votes on WhatsApp channel polls across active sessions.
        </p>
      </div>

      {/* Styled Form with Skeuomorphic Console Deck */}
      <GlowingFormContainer>
        <div className="space-y-3.5 sm:space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Channel Poll URL Bay */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="poll-post-url" className="block text-xs font-semibold text-slate-300 tracking-wide uppercase text-[10px]">
                  Channel Poll URL
                </label>
                <span className="text-[10px] text-slate-500 font-mono">/channel/...</span>
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
                className="skeuo-inset-bay w-full px-4 py-2.5 sm:py-3 rounded-xl text-white placeholder-slate-600 text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-400/80 focus:shadow-[inset_0_3px_6px_rgba(0,0,0,0.95),0_0_14px_rgba(6,182,212,0.4)] transition-all"
              />
            </div>

            {/* Option input entered manually */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="poll-option-input" className="block text-xs font-semibold text-slate-300 tracking-wide uppercase text-[10px]">
                  Option Number / Value
                </label>
                <span className="text-[10px] text-slate-500 font-mono">e.g. 1, 2, 3</span>
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
                className="skeuo-inset-bay w-full px-4 py-2.5 sm:py-3 rounded-xl text-white placeholder-slate-600 text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-400/80 focus:shadow-[inset_0_3px_6px_rgba(0,0,0,0.95),0_0_14px_rgba(6,182,212,0.4)] transition-all"
              />
            </div>

            {/* Form Error */}
            {formError && (
              <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-b from-rose-950/40 to-rose-900/20 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{formError}</span>
              </div>
            )}

            {/* Tactile 3D Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="skeuo-btn-primary w-full py-2.5 sm:py-3 px-4 rounded-xl text-slate-950 font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

            {/* Tactile 3D Quick Redirect Rocker Buttons */}
            <div className="pt-1 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigate('/services/channel-reactions')}
                className="skeuo-btn-secondary py-2 px-3 rounded-xl text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Smile className="w-3.5 h-3.5 text-cyan-400" />
                <span>Try Reactions</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/pairing')}
                className="skeuo-btn-secondary py-2 px-3 rounded-xl text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Go to Pairing</span>
              </button>
            </div>
          </form>

          {/* Authentic LCD Console Result Feedback */}
          {result && (
            <div className="skeuo-lcd-display rounded-xl p-3 sm:p-3.5 space-y-1 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                <span className="skeuo-diode-green" />
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px] tracking-wide">Vote Casted</span>
              </div>
              <p className="text-xs text-cyan-300/90 font-mono leading-relaxed pl-5">
                {result.message}
              </p>
            </div>
          )}
        </div>
      </GlowingFormContainer>

      {/* Skeuomorphic Stamped Channel Groove with Glowing Fiber-Optic Core */}
      <div className="pt-2 pb-3 px-1 max-w-md mx-auto w-full">
        <div className="relative h-[4px] w-full rounded-full bg-[#05080e] shadow-[inset_0_2px_4px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.08)] overflow-hidden flex items-center justify-center">
          <div className="h-[1.5px] w-3/4 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
        </div>
      </div>

      {/* Feature Table with real poll votes features */}
      <FeatureTable
        title="Channel Poll Vote Capabilities"
        icon={Vote}
        features={POLL_VOTES_FEATURES}
      />
    </div>
  );
};
