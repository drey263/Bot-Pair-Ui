import React from 'react';
import { Menu } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';

const BOT_AVATAR_PATH = '/bot-avatar.png';

export const Navbar: React.FC = () => {
  const {
    setIsSidebarOpen,
    navigate,
    currentRoute,
  } = useWorkflow();

  const getPageTitle = () => {
    if (currentRoute === '/services/poll-votes') return 'Poll Votes';
    if (currentRoute.startsWith('/services')) return 'Channel Reactions';
    return 'Device Pairing';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-blue-500 bg-gradient-to-b from-[#161c26] via-[#0f131a] to-[#07090f] backdrop-blur-xl shadow-[0_4px_24px_rgba(59,130,246,0.35),0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark on Machined Bezel */}
        <button
          onClick={() => navigate('/pairing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none rounded-xl shrink-0 whitespace-nowrap cursor-pointer border-none bg-transparent p-0"
        >
          <div className="relative w-8 h-8 rounded-full p-0.5 bg-gradient-to-b from-[#2a3444] to-[#0e1218] shadow-[0_2px_6px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.35)] group-hover:scale-105 transition-all">
            <img
              src="/bot-avatar.png"
              width="32"
              height="32"
              loading="eager"
              decoding="sync"
              alt="Voltra Bot"
              className="w-full h-full object-cover rounded-full bg-slate-900 border border-black"
            />
            {/* Glass Lens Glare */}
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/20 via-transparent to-transparent" />
          </div>
          <div className="flex items-center gap-2">
            <span className="skeuo-diode-cyan" />
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              VOLTRA MD
            </span>
          </div>
          <span className="hidden sm:inline-block text-slate-600 font-normal">/</span>
          <span className="hidden sm:inline-block text-xs font-mono font-medium text-slate-400">
            {getPageTitle()}
          </span>
        </button>

        {/* Right: Tactile 3D Mechanical Menu Button */}
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="skeuo-btn-secondary p-2 rounded-xl text-slate-300 hover:text-white cursor-pointer active:translate-y-[2px]"
            aria-label="Open menu"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2]" />
          </button>
        </div>
      </div>
    </header>
  );
};
