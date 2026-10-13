import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWorkflow();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-slate-800';
        let bgClass = 'bg-slate-900/95';
        let textClass = 'text-slate-200';
        let Icon = Info;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/40';
          bgClass = 'bg-slate-900/95';
          textClass = 'text-emerald-300';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-500/40';
          bgClass = 'bg-slate-900/95';
          textClass = 'text-rose-300';
          Icon = AlertCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border ${borderClass} ${bgClass} shadow-xl shadow-black/50 backdrop-blur-md flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${textClass}`} />
            <div className="flex-1 text-xs text-slate-200 leading-snug">
              {toast.text}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
