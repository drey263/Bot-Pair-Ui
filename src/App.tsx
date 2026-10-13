/**
 * VOLTRA MINI — WhatsApp Bot Creator
 * Clean Pairing UI with Google Stitch design system.
 */

import React from 'react';
import { WorkflowProvider } from './context/WorkflowContext';
import { Navbar } from './components/Navbar';
import { CleanPairingView } from './components/CleanPairingView';
import { ToastContainer } from './components/Toast';
import { Zap } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 bg-[#06080e] py-6 text-xs text-slate-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Zap className="w-3 h-3 fill-cyan-400" />
          </div>
          <span className="font-semibold text-slate-300">VOLTRA MINI</span>
          <span className="text-slate-700">·</span>
          <span>WhatsApp Bot Pairing</span>
        </div>
        <div className="text-slate-500 text-[11px]">
          Multi-Device Protocol
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <WorkflowProvider>
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-400/25 selection:text-cyan-200 relative overflow-x-hidden">
        {/* Ambient Stitch background glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <Navbar />
        <main className="flex-1 flex flex-col justify-center items-center relative z-10">
          <CleanPairingView />
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </WorkflowProvider>
  );
}
