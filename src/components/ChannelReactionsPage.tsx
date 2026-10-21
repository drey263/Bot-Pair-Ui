import React, { useState } from 'react';
import { Smile, Send, CheckCircle2, AlertCircle, RotateCw, Vote, Smartphone, X, Zap, ShieldCheck } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';
import { ChannelReactionResponse } from '../api/types';
import { GlowingFormContainer } from './GlowingFormContainer';
import { FeatureTable, FeatureItem } from './FeatureTable';

// 12 user-selected emojis organized symmetrically in 3 columns (4 rows of 3, no 4th column)
const POPULAR_EMOJIS = ['💯', '😂', '❤️', '👍', '🙏', '🌈', '🎉', '📌', '🚩', '🎯', '👀', '🤩'];

const CHANNEL_REACTIONS_FEATURES: FeatureItem[] = [
  {
    name: 'Instant Broadcast',
    icon: Zap,
    description: 'Delivers selected reactions directly to WhatsApp channel announcements in under 2 seconds.',
    status: 'Real-Time',
  },
  {
    name: 'Multi-Emoji Combos',
    icon: Smile,
    description: 'Select single or up to 5 concurrent emojis from official WhatsApp reactions plus custom emojis.',
    status: 'Up to 5 Emojis',
  },
  {
    name: 'Anti-Rate-Limit Guard',
    icon: ShieldCheck,
    description: 'Automated socket pacing and jitter protection preserves session longevity and avoids spam limits.',
    status: 'Safe Delivery',
  },
  {
    name: 'Universal Channel Links',
    icon: Send,
    description: 'Resolves all official WhatsApp channel permalinks (whatsapp.com/channel/...) with zero manual token setup.',
    status: 'Full Support',
  },
];

export const ChannelReactionsPage: React.FC = () => {
  const { sendChannelReaction, isProcessing, navigate } = useWorkflow();

  const [url, setUrl] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>(['💯']);
  const [customEmoji, setCustomEmoji] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<ChannelReactionResponse | null>(null);

  const toggleEmoji = (em: string) => {
    if (selectedEmojis.includes(em)) {
      if (selectedEmojis.length === 1) return;
      setSelectedEmojis(selectedEmojis.filter((e) => e !== em));
    } else {
      if (selectedEmojis.length >= 5) {
        setFormError('You can select up to 5 emojis maximum.');
        return;
      }
      setFormError(null);
      setSelectedEmojis([...selectedEmojis, em]);
    }
  };

  const handleAddCustomEmoji = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = customEmoji.trim();
      if (!trimmed) return;
      if (selectedEmojis.length >= 5) {
        setFormError('You can select up to 5 emojis maximum.');
        return;
      }
      setSelectedEmojis([...selectedEmojis, trimmed]);
      setCustomEmoji('');
      setFormError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setResult(null);

    const cleanUrl = url.trim();
    if (!cleanUrl) {
      setFormError('Please enter the WhatsApp channel post URL.');
      return;
    }
    if (!cleanUrl.includes('whatsapp.com/channel/')) {
      setFormError('Enter a valid WhatsApp channel URL (e.g. https://whatsapp.com/channel/0029VaXXXXXX/101).');
      return;
    }

    const emojisToSend = customEmoji.trim()
      ? Array.from(new Set([...selectedEmojis, customEmoji.trim()])).slice(0, 5).join(' ')
      : selectedEmojis.join(' ');

    if (!emojisToSend.trim()) {
      setFormError('Please select at least one emoji.');
      return;
    }

    try {
      const res = await sendChannelReaction({
        url: cleanUrl,
        emoji: emojisToSend,
      });
      setResult(res);
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Failed to send reaction.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* Title Header with Diode Indicator */}
      <div className="text-center space-y-1.5">
        <div className="flex items-center justify-center gap-1.5">
          <span className="skeuo-diode-cyan" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            Channel Reactions
          </h1>
        </div>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          Broadcast emoji reactions to WhatsApp channel posts across active sessions.
        </p>
      </div>

      {/* Styled Form with Skeuomorphic Console Deck */}
      <GlowingFormContainer>
        <div className="space-y-3.5 sm:space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Channel Post URL Bay */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="ch-url" className="block text-xs font-semibold text-slate-300 tracking-wide uppercase text-[10px]">
                  Channel Post URL
                </label>
                <span className="text-[10px] text-slate-500 font-mono">/channel/...</span>
              </div>
              <input
                id="ch-url"
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

            {/* Emoji Selection Keypad (3 columns of mechanical keycaps) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300 tracking-wide uppercase text-[10px]">
                  Select Emojis
                </label>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                  {selectedEmojis.length}/5 selected
                </span>
              </div>

              {/* Selected Emojis Stamped Bay */}
              <div className="skeuo-inset-bay flex items-center gap-1.5 p-2 rounded-xl min-h-[38px] flex-wrap">
                {selectedEmojis.map((em, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-b from-cyan-400/25 to-cyan-500/10 border border-cyan-400/40 text-xs text-white shadow-[0_1px_3px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]"
                  >
                    <span className="text-sm">{em}</span>
                    {selectedEmojis.length > 1 && (
                      <button
                        type="button"
                        onClick={() => toggleEmoji(em)}
                        className="text-slate-400 hover:text-white cursor-pointer ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {/* 3-Column Tactile Mechanical Keycap Grid */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {POPULAR_EMOJIS.map((em) => {
                  const isSelected = selectedEmojis.includes(em);
                  return (
                    <button
                      key={em}
                      type="button"
                      onClick={() => toggleEmoji(em)}
                      className={`h-9 sm:h-10 rounded-xl text-base flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'skeuo-keycap-selected font-bold'
                          : 'skeuo-keycap text-slate-200'
                      }`}
                    >
                      {em}
                    </button>
                  );
                })}
              </div>

              {/* Custom Emoji text input bay */}
              <div className="pt-1.5">
                <input
                  type="text"
                  value={customEmoji}
                  onChange={(e) => setCustomEmoji(e.target.value)}
                  onKeyDown={handleAddCustomEmoji}
                  placeholder="Or type custom emoji & press Enter"
                  className="skeuo-inset-bay w-full px-4 py-2 rounded-xl text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-cyan-400/80 focus:shadow-[inset_0_3px_6px_rgba(0,0,0,0.95),0_0_12px_rgba(6,182,212,0.35)] transition-all"
                />
              </div>
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
                  <span>Sending Reaction...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Reactions ({selectedEmojis.join(' ')})</span>
                </>
              )}
            </button>

            {/* Tactile 3D Quick Redirect Rocker Buttons */}
            <div className="pt-1 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigate('/services/poll-votes')}
                className="skeuo-btn-secondary py-2 px-3 rounded-xl text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Vote className="w-3.5 h-3.5 text-cyan-400" />
                <span>Try Poll Votes</span>
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
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-[11px] tracking-wide">Reaction Broadcasted</span>
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

      {/* Feature Table with real channel reactions features */}
      <FeatureTable
        title="Channel Reaction Capabilities"
        icon={Smile}
        features={CHANNEL_REACTIONS_FEATURES}
      />
    </div>
  );
};
