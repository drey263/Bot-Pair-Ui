import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Radio, XCircle, ShieldCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  showIcon = true,
}) => {
  const norm = (status || '').toLowerCase().replace(/[\s_-]+/g, '');

  let label = status || 'Unknown';
  let textColor = 'text-slate-400';
  let Icon = Clock;

  if (norm === 'online' || norm === 'connected' || norm === 'ok' || norm === 'success') {
    label = status === 'ok' ? 'Online' : status.replace(/_/g, ' ');
    textColor = 'text-emerald-400';
    Icon = CheckCircle2;
  } else if (
    norm === 'awaitingpairing' ||
    norm === 'pairing' ||
    norm === 'initializing' ||
    norm === 'connecting' ||
    norm === 'created'
  ) {
    label = status.replace(/_/g, ' ');
    textColor = 'text-cyan-400';
    Icon = Radio;
  } else if (norm === 'checking' || norm === 'pending') {
    label = status;
    textColor = 'text-amber-400';
    Icon = Clock;
  } else if (norm === 'unavailable' || norm === 'failed' || norm === 'error' || norm === 'disconnected') {
    label = status.replace(/_/g, ' ');
    textColor = 'text-rose-400';
    Icon = XCircle;
  } else if (norm === 'authorized' || norm === 'verified') {
    label = status;
    textColor = 'text-sky-400';
    Icon = ShieldCheck;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium capitalize ${textColor} ${className}`}>
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span>{label}</span>
    </span>
  );
};
