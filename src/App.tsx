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

const MainLayout: React.FC = () => {
  const { currentRoute } = useWorkflow();

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
    <footer className="sticky bottom-0 z-40 w-full border-t-2 border-blue-500 shadow-[0_-4px_20px_rgba(59,130,246,0.3),0_-1px_0_rgba(255,255,255,0.15)] bg-gradient-to-b from-[#080b12] via-[#0d121b] to-[#121822] backdrop-blur-xl py-2.5 sm:py-3 text-xs text-slate-400 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className="skeuo-diode-green" />
          <span className="font-extrabold text-slate-200 text-xs sm:text-sm tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            VOLTRA-MD
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
            WhatsApp Multi-Device
          </span>
        </div>

        <div className="text-[10px] sm:text-[11px] text-slate-500 font-mono tracking-tight">
          © 2026 All Rights Reserved
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

      <main className="flex-1 flex flex-col relative z-10 w-full overflow-x-clip pb-8 sm:pb-10">
        <MainLayout />
      </main>

      {/* Footer (Sticky at the bottom like the header) */}
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
