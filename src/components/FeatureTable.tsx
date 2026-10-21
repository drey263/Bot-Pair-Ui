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
      {/* Header with Title and Skeuomorphic Status */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-gradient-to-b from-[#222a36] to-[#0e1218] border border-white/10 flex items-center justify-center text-cyan-400 shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]">
            <HeaderIcon className="w-3 h-3" />
          </div>
          <h2 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
            <span>{title}</span>
          </h2>
        </div>
        {/* Subtle sideways scroll indicator for mobile */}
        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
          <ArrowRightLeft className="w-2.5 h-2.5 text-cyan-400/80" />
          <span>Scroll sideways</span>
        </span>
      </div>

      {/* Skeuomorphic Machined Specification Plate with Corner Screws and Inset Deck */}
      <div className="relative rounded-xl border border-white/10 bg-gradient-to-b from-[#161c26] via-[#0f141d] to-[#080b10] shadow-[0_12px_24px_rgba(0,0,0,0.85),0_2px_4px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] p-1">
        {/* Corner Rivet Screws */}
        <div className="pointer-events-none absolute top-1.5 left-1.5 z-20 hidden sm:block">
          <span className="skeuo-screw" />
        </div>
        <div className="pointer-events-none absolute top-1.5 right-1.5 z-20 hidden sm:block">
          <span className="skeuo-screw" />
        </div>
        <div className="pointer-events-none absolute bottom-1.5 left-1.5 z-20 hidden sm:block">
          <span className="skeuo-screw" />
        </div>
        <div className="pointer-events-none absolute bottom-1.5 right-1.5 z-20 hidden sm:block">
          <span className="skeuo-screw" />
        </div>

        {/* Inset Recessed Table Bay */}
        <div className="rounded-lg skeuo-inset-bay overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <table className="w-full text-left text-xs border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-black/80 bg-gradient-to-b from-[#111722] to-[#090d14] text-slate-400 font-semibold text-[10px] uppercase tracking-wider shadow-[0_1px_0_rgba(255,255,255,0.05)]">
                  <th className="py-2 px-3 w-36 whitespace-nowrap">Feature</th>
                  <th className="py-2 px-3 min-w-[240px]">Capability & Details</th>
                  <th className="py-2 px-3 text-right w-24 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/60">
                {features.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <tr
                      key={feat.name}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="py-2 px-3 font-medium text-slate-200 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-gradient-to-b from-[#1a2330] to-[#0d121a] border border-white/10 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform">
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
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#071310] border border-emerald-500/30 text-emerald-400 font-mono text-[10px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)]">
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
    </div>
  );
};
