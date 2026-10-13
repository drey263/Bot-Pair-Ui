import React from 'react';
import { Zap, Clock, AlertCircle, PlusCircle } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';

export const Navbar: React.FC = () => {
  const {
    healthStatus,
    activeBot,
    resetBotSession,
  } = useWorkflow();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#07090e]/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand Wordmark */}
        <button
          onClick={() => {
            if (activeBot) resetBotSession();
          }}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl shrink-0 whitespace-nowrap cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-400/20 group-hover:shadow-cyan-400/40 transition-all">
            <Zap className="w-4 h-4 text-slate-950 fill-slate-950 stroke-[2.5]" />
          </div>
          <span className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
            VOLTRA MINI
          </span>
        </button>

        {/* Status & Action */}
        <div className="flex items-center gap-3 shrink-0">
          {activeBot && (
            <button
              onClick={() => resetBotSession()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>New Pairing</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            {healthStatus === 'online' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                <span>Online</span>
              </span>
            )}
            {healthStatus === 'checking' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Checking...</span>
              </span>
            )}
            {(healthStatus === 'unavailable' || healthStatus === 'unknown') && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Offline</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
