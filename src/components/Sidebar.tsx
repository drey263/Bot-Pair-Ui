import React from 'react';
import { Smartphone, Smile, Vote, X, Layers, ChevronRight } from 'lucide-react';
import { useWorkflow, AppRoute } from '../context/WorkflowContext';

const BOT_AVATAR_PATH = '/bot-avatar.png';

export const Sidebar: React.FC = () => {
  const {
    currentRoute,
    navigate,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useWorkflow();

  const handleNavClick = (route: AppRoute) => {
    navigate(route);
    setIsSidebarOpen(false);
  };

  const isServicesActive = currentRoute.startsWith('/services');

  return (
    <>
      {/* Right Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        />
      )}

      {/* Right-Side Machined Console Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-72 bg-gradient-to-b from-[#181f2b] via-[#111620] to-[#080b11] border-l border-white/10 flex flex-col justify-between p-5 shadow-[-20px_0_40px_rgba(0,0,0,0.95),inset_1px_0_0_rgba(255,255,255,0.1)] transition-transform duration-300 ease-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/80 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full p-0.5 bg-gradient-to-b from-[#2a3444] to-[#0e1218] shadow-[0_2px_6px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.35)] shrink-0">
                <img
                  src="/bot-avatar.png"
                  width="36"
                  height="36"
                  loading="eager"
                  decoding="sync"
                  alt="Voltra Bot"
                  className="w-full h-full object-cover rounded-full bg-slate-900 border border-black"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="skeuo-diode-cyan" />
                  <span className="font-extrabold text-sm tracking-wide text-white block drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    VOLTRA MD
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono block pl-3">
                  Control Rack
                </span>
              </div>
            </div>

            {/* Tactile 3D Close button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="skeuo-btn-secondary p-1.5 rounded-xl text-slate-400 hover:text-white cursor-pointer active:translate-y-[2px]"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <div className="px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Instrument Modes</span>
              <span className="skeuo-screw hidden sm:inline-block" />
            </div>

            {/* 1. Device Pairing */}
            <button
              onClick={() => handleNavClick('/pairing')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentRoute === '/pairing'
                  ? 'skeuo-btn-primary font-bold text-slate-950'
                  : 'skeuo-btn-secondary text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className={`w-4 h-4 ${currentRoute === '/pairing' ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>Device Pairing</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 ${currentRoute === '/pairing' ? 'text-slate-950' : 'text-slate-600'}`} />
            </button>

            {/* 2. Services Header & Sub-Routes */}
            <div className="pt-2">
              <div className="px-1 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-cyan-400" />
                <span>Automation Services</span>
              </div>

              <div className="mt-1 space-y-1.5">
                {/* 2a. Channel Reactions */}
                <button
                  onClick={() => handleNavClick('/services/channel-reactions')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentRoute === '/services/channel-reactions'
                      ? 'skeuo-btn-primary font-bold text-slate-950'
                      : 'skeuo-btn-secondary text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Smile className={`w-4 h-4 ${currentRoute === '/services/channel-reactions' ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>Channel Reactions</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${currentRoute === '/services/channel-reactions' ? 'text-slate-950' : 'text-slate-600'}`} />
                </button>

                {/* 2b. Poll Votes */}
                <button
                  onClick={() => handleNavClick('/services/poll-votes')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentRoute === '/services/poll-votes'
                      ? 'skeuo-btn-primary font-bold text-slate-950'
                      : 'skeuo-btn-secondary text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Vote className={`w-4 h-4 ${currentRoute === '/services/poll-votes' ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>Poll Votes</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${currentRoute === '/services/poll-votes' ? 'text-slate-950' : 'text-slate-600'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Footer with Diode */}
        <div className="pt-4 border-t border-black/80 text-[11px] text-slate-500 text-center flex items-center justify-center gap-2 shadow-[0_-1px_0_rgba(255,255,255,0.05)]">
          <span className="skeuo-diode-green" />
          <span className="font-mono text-[10px]">VOLTRA-MD Console Active</span>
        </div>
      </aside>
    </>
  );
};
