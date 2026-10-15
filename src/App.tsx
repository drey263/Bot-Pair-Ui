/**
 * VOLTRA MINI — WhatsApp Bot Platform
 * Seamless, borderless dark UI & Services with Google Stitch design system & right sidebar.
 */

import React, { useState } from 'react';
import { WorkflowProvider, useWorkflow } from './context/WorkflowContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CleanPairingView } from './components/CleanPairingView';
import { ChannelReactionsPage } from './components/ChannelReactionsPage';
import { PollVotesPage } from './components/PollVotesPage';
import { SplashScreen } from './components/SplashScreen';
import { PageTransitionLoader } from './components/PageTransitionLoader';
import { ToastContainer } from './components/Toast';
import botAvatar from './assets/bot-avatar.png';

const MainLayout: React.FC = () => {
  const { currentRoute, isPageLoading } = useWorkflow();

  if (isPageLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 w-full">
        <PageTransitionLoader message="Loading..." />
      </div>
    );
  }

  if (currentRoute === '/services/channel-reactions') {
    return (
      <div className="flex-1 flex flex-col justify-start items-center p-4 sm:p-6 w-full">
        <ChannelReactionsPage />
      </div>
    );
  }

  if (currentRoute === '/services/poll-votes') {
    return (
      <div className="flex-1 flex flex-col justify-start items-center p-4 sm:p-6 w-full">
        <PollVotesPage />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-start items-center p-4 sm:p-6 w-full">
      <CleanPairingView />
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.04] bg-[#020408] py-6 text-xs text-slate-500 w-full mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-cyan-400 to-blue-600 shadow-sm shrink-0">
            <img
              src={botAvatar}
              width="20"
              height="20"
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
          <span className="font-semibold text-slate-300">VOLTRA MD</span>
          <span className="text-slate-700">·</span>
          <span>WhatsApp Multi-Device Platform</span>
        </div>
        <div className="text-slate-600 text-[11px] font-mono">
          Services & Pairing Engine
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <WorkflowProvider>
      <div className="min-h-screen bg-[#020408] text-slate-100 flex flex-col font-sans selection:bg-cyan-400/25 selection:text-cyan-200 relative overflow-x-hidden">
        {/* Splash Screen Loader */}
        {showSplash && (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        )}

        {/* App Shell */}
        <Navbar />

        <main className="flex-1 flex flex-col relative z-10 w-full">
          <MainLayout />
        </main>

        <Footer />

        {/* Right-Side Drawer Sidebar */}
        <Sidebar />

        <ToastContainer />
      </div>
    </WorkflowProvider>
  );
}
