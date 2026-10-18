import React from 'react';
import { LucideIcon, ArrowRightLeft } from 'lucide-react';

export interface FeatureItem {
  name: string;
  icon: LucideIcon;
  description: string;
  status: string;
  tagColor?: 'cyan' | 'emerald' | 'amber' | 'blue' | 'purple';
}

interface FeatureTableProps {
  title: string;
  countLabel?: string;
  features: FeatureItem[];
  icon: LucideIcon;
}

export const FeatureTable: React.FC<FeatureTableProps> = ({
  title,
  features,
  icon: HeaderIcon,
}) => {
  return (
    <div className="space-y-2 max-w-md mx-auto w-full">
      {/* Header with Title only (No number of features displayed) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-4.5 h-4.5 rounded-md bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
            <HeaderIcon className="w-3 h-3" />
          </div>
          <h2 className="text-xs font-bold text-white tracking-tight">
            {title}
          </h2>
        </div>
        {/* Subtle swipe / sideways indicator for mobile */}
        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
          <ArrowRightLeft className="w-2.5 h-2.5 text-cyan-400/70" />
          <span>Scroll sideways</span>
        </span>
      </div>

      {/* Clean, Compact Sideways-Scrollable Feature Table */}
      <div className="rounded-xl border border-white/10 bg-[#03060c]/90 backdrop-blur-md shadow-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <table className="w-full text-left text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-slate-400 font-medium text-[10px] uppercase tracking-wider">
                <th className="py-2 px-3 w-36 whitespace-nowrap">Feature</th>
                <th className="py-2 px-3 min-w-[240px]">Capability</th>
                <th className="py-2 px-3 text-right w-24 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <tr
                    key={feat.name}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-2 px-3 font-medium text-slate-200 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                          <Icon className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-200">
                          {feat.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-slate-400 font-normal text-[11px] leading-tight">
                      {feat.description}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                        {feat.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
