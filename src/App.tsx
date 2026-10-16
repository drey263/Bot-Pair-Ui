/**
 * VOLTRA MINI — WhatsApp Bot Platform
 * Seamless dark UI & Services with Google Stitch design system & right sidebar.
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
  const { currentRoute } = useWorkflow();

  if (currentRoute === '/services/channel-reactions') {
    return (
      <div className="flex-1 flex flex-col justify-start items-center p-3 sm:p-5 w-full">
        <ChannelReactionsPage />
      </div>
    );
  }

  if (currentRoute === '/services/poll-votes') {
    return (
      <div className="flex-1 flex flex-col justify-start items-center p-3 sm:p-5 w-full">
        <PollVotesPage />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-start items-center p-3 sm:p-5 w-full">
      <CleanPairingView />
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-blue-500 shadow-[0_-4px_20px_rgba(59,130,246,0.35)] bg-[#020408] py-4 sm:py-5 text-xs text-slate-500 w-full mt-auto relative z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300 text-xs">VOLTRA MD</span>
          <span className="text-slate-700">·</span>
          <span className="text-[11px]">WhatsApp Multi-Device Platform</span>
        </div>
        <div className="text-slate-600 text-[10px] font-mono">
          Services & Pairing Engine
        </div>
      </div>
    </footer>
  );
};

const AppContent: React.FC = () => {
  const { isPageLoading } = useWorkflow();

  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = `${window.location.pathname}${window.location.search}${window.location.hash}`.toLowerCase();
      // If user navigated to a deep link like /services/channel-reactions, go directly to the UI without splash delay
      if (
        p.includes('services') ||
        p.includes('channel') ||
        p.includes('reaction') ||
        p.includes('poll') ||
        p.includes('pairing') ||
        (window.location.pathname !== '/' && window.location.pathname !== '')
      ) {
        return false;
      }
    }
    return true;
  });

  // In the loader screen, do not show the header and footer!
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (isPageLoading) {
    return <PageTransitionLoader message="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 flex flex-col font-sans selection:bg-cyan-400/25 selection:text-cyan-200 relative">
      {/* App Shell Header (Fixed & Sticky with Blue Divider) */}
      <Navbar />

      <main className="flex-1 flex flex-col relative z-10 w-full overflow-x-clip">
        <MainLayout />
      </main>

      {/* Footer (Divided by glowing blue line) */}
      <Footer />

      {/* Right-Side Drawer Sidebar */}
      <Sidebar />

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <WorkflowProvider>
      <AppContent />
    </WorkflowProvider>
  );
}
