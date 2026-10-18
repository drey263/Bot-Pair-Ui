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

      {/* Right-Side Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-72 bg-[#030509] border-l border-white/[0.04] flex flex-col justify-between p-5 shadow-2xl transition-transform duration-300 ease-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-cyan-400 to-blue-600 shadow-md shadow-cyan-400/20 shrink-0">
                <img
                  src="/bot-avatar.png"
                  width="36"
                  height="36"
                  loading="eager"
                  decoding="sync"
                  alt="Voltra Bot"
                  className="w-full h-full object-cover rounded-full bg-slate-900"
                />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wide text-white block">
                  VOLTRA MD
                </span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  Control Menu
                </span>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Menu
            </div>

            {/* 1. Device Pairing */}
            <button
              onClick={() => handleNavClick('/pairing')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                currentRoute === '/pairing'
                  ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
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
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-cyan-400" />
                <span>Services</span>
              </div>

              <div className="mt-1 space-y-1 pl-1">
                {/* 2a. Channel Reactions */}
                <button
                  onClick={() => handleNavClick('/services/channel-reactions')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    currentRoute === '/services/channel-reactions'
                      ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    currentRoute === '/services/poll-votes'
                      ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
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

        {/* Quiet Footer (NO base api, NO sessions count) */}
        <div className="pt-4 border-t border-white/5 text-[11px] text-slate-600 text-center">
          Voltra MD Platform
        </div>
      </aside>
    </>
  );
};
