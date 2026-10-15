import React from 'react';
import { Menu } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';
import botAvatar from '../assets/bot-avatar.png';

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
    <header className="sticky top-0 z-30 w-full border-b border-white/[0.04] bg-[#020408]/90 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark */}
        <button
          onClick={() => navigate('/pairing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none rounded-xl shrink-0 whitespace-nowrap cursor-pointer border-none bg-transparent p-0"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-cyan-400 to-blue-600 shadow-md shadow-cyan-400/20 group-hover:scale-105 transition-all">
            <img
              src={botAvatar}
              width="32"
              height="32"
              loading="eager"
              decoding="sync"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== 'https://files.solnets.indevs.in/image/VSmg8file_0000000090dc821192432be3544dfe6f.png') {
                  target.src = 'https://files.solnets.indevs.in/image/VSmg8file_0000000090dc821192432be3544dfe6f.png';
                }
              }}
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

        {/* Right: Borderless Hamburger Button (in place of the online card) */}
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 focus:outline-none transition-colors cursor-pointer border-none bg-transparent"
            aria-label="Open menu"
            title="Open navigation menu"
          >
            <Menu className="w-6 h-6 stroke-[2]" />
          </button>
        </div>
      </div>
    </header>
  );
};
