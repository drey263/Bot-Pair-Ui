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
    <header className="sticky top-0 z-50 w-full border-b-2 border-blue-500 bg-[#020408]/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(59,130,246,0.4)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark */}
        <button
          onClick={() => navigate('/pairing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none rounded-xl shrink-0 whitespace-nowrap cursor-pointer border-none bg-transparent p-0"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-cyan-400 to-blue-600 shadow-md shadow-cyan-400/20 group-hover:scale-105 transition-all">
            <img
              src="/bot-avatar.png"
              width="32"
              height="32"
              loading="eager"
              decoding="sync"
              alt="Voltra Bot"
              className="w-full h-full object-cover rounded-full bg-slate-900"
            />
          </div>
          <span className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
            VOLTRA MD
          </span>
          <span className="hidden sm:inline-block text-slate-600 font-normal">/</span>
          <span className="hidden sm:inline-block text-xs font-medium text-slate-400">
            {getPageTitle()}
          </span>
        </button>

        {/* Right: Borderless Hamburger Button */}
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 focus:outline-none transition-colors cursor-pointer border-none bg-transparent"
            aria-label="Open menu"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
          </button>
        </div>
      </div>
    </header>
  );
};
