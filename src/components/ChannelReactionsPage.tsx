import React, { useState } from 'react';
import { Smile, Send, CheckCircle2, AlertCircle, RotateCw, Vote, Smartphone, X } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';
import { ChannelReactionResponse } from '../api/types';

const POPULAR_EMOJIS = ['🔥', '❤️', '👍', '👏', '😂', '🎉', '🚀', '💯', '✨', '⚡', '😍', '🤩', '🙌', '👀', '🎯', '💡', '👑', '🌟'];

export const ChannelReactionsPage: React.FC = () => {
  const { sendChannelReaction, isProcessing, navigate } = useWorkflow();

  const [url, setUrl] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>(['🔥']);
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
    <div className="w-full max-w-md mx-auto px-4 py-8 sm:py-12 space-y-6 animate-in fade-in duration-200">
      {/* Title Header (No Bot Image) */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-xs font-semibold text-cyan-300 tracking-wider">
          <Smile className="w-3.5 h-3.5 text-cyan-400" />
          <span>Voltra Service</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Channel Reactions
        </h1>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          Broadcast emoji reactions to WhatsApp channel posts across active sessions.
        </p>
      </div>

      {/* Seamless Form UI (No container box, no borders, no separate background) */}
      <div className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Channel Post URL (No autoFocus) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="ch-url" className="block text-xs font-medium text-slate-300">
                Channel Post URL
              </label>
              <span className="text-[11px] text-slate-500">e.g. /channel/0029Va.../101</span>
            </div>
            <input
              id="ch-url"
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

          {/* Emoji Selection (Compact & up to 5) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">
                Select Emojis
              </label>
              <span className="text-[11px] font-mono text-cyan-400">
                {selectedEmojis.length}/5 selected
              </span>
            </div>

            {/* Selected Emojis Bar */}
            <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-white/[0.03] min-h-[42px] flex-wrap">
              {selectedEmojis.map((em, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-400/15 border border-cyan-400/30 text-xs text-white"
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

            {/* Compact Emojis Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 pt-1">
              {POPULAR_EMOJIS.map((em) => {
                const isSelected = selectedEmojis.includes(em);
                return (
                  <button
                    key={em}
                    type="button"
                    onClick={() => toggleEmoji(em)}
                    className={`h-8 rounded-xl text-sm flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-400/40 scale-105 font-bold'
                        : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:scale-105'
                    }`}
                  >
                    {em}
                  </button>
                );
              })}
            </div>

            {/* Custom Emoji text input (No autoFocus) */}
            <div className="pt-1">
              <input
                type="text"
                value={customEmoji}
                onChange={(e) => setCustomEmoji(e.target.value)}
                onKeyDown={handleAddCustomEmoji}
                placeholder="Or type custom emoji(s) & press Enter"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all"
              />
            </div>
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
                <span>Sending Reaction...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Reactions ({selectedEmojis.join(' ')})</span>
              </>
            )}
          </button>

          {/* Quick Redirect Buttons */}
          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => navigate('/services/poll-votes')}
              className="py-2.5 px-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Vote className="w-3.5 h-3.5 text-cyan-400" />
              <span>Try Poll Votes</span>
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
              <span>Reaction Broadcasted</span>
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
