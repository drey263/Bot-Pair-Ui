import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  ActiveBotSession,
  PairingMethod,
  ChannelReactionRequest,
  ChannelReactionResponse,
  PollVoteRequest,
  PollVoteResponse,
  SessionInfo,
} from '../api/types';
import { api, VoltraApiError } from '../api/client';

export type AppRoute = '/pairing' | '/services/channel-reactions' | '/services/poll-votes';

interface ToastData {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface WorkflowContextType {
  currentRoute: AppRoute;
  navigate: (route: AppRoute) => void;
  isPageLoading: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  activeBot: ActiveBotSession | null;
  activeSessionsCount: number;
  activeSessions: SessionInfo[];
  healthStatus: 'checking' | 'online' | 'unavailable' | 'unknown';
  isProcessing: boolean;
  isPolling: boolean;
  lastError: string | null;
  toasts: ToastData[];
  addToast: (type: 'success' | 'error' | 'info', text: string) => void;
  removeToast: (id: string) => void;
  startPairingFlow: (params: {
    phoneNumber: string;
    pairingMethod: PairingMethod;
  }) => Promise<boolean>;
  pollBotStatusOnce: () => Promise<void>;
  resetBotSession: () => void;
  sendChannelReaction: (req: ChannelReactionRequest) => Promise<ChannelReactionResponse>;
  sendPollVote: (req: PollVoteRequest) => Promise<PollVoteResponse>;
  refreshSessions: () => Promise<void>;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

const parseRouteFromLocation = (): AppRoute => {
  if (typeof window === 'undefined') return '/pairing';

  const path = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  // Handle SPA 404 redirect param if static host used ?redirect=... or ?p=...
  let redirectTarget = '';
  try {
    const params = new URLSearchParams(window.location.search);
    redirectTarget = (params.get('redirect') || params.get('p') || params.get('route') || '').toLowerCase();
  } catch {
    // ignore
  }

  const combined = `${path} ${search} ${hash} ${redirectTarget}`;

  let targetRoute: AppRoute = '/pairing';
  if (combined.includes('poll-votes') || combined.includes('poll-vote') || combined.includes('poll')) {
    targetRoute = '/services/poll-votes';
  } else if (
    combined.includes('channel-reactions') ||
    combined.includes('channel-reaction') ||
    combined.includes('/services') ||
    combined.includes('reactions')
  ) {
    targetRoute = '/services/channel-reactions';
  }

  // If we came in with a redirect query or hash, clean URL to match target route
  if (typeof window !== 'undefined' && redirectTarget && window.history && window.history.replaceState) {
    try {
      window.history.replaceState(null, '', targetRoute);
    } catch {
      // ignore in sandboxed iframes
    }
  }

  return targetRoute;
};

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRouteState] = useState<AppRoute>(parseRouteFromLocation);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [activeBot, setActiveBot] = useState<ActiveBotSession | null>(null);
  const [activeSessionsCount, setActiveSessionsCount] = useState<number>(0);
  const [activeSessions, setActiveSessions] = useState<SessionInfo[]>([]);

  const [healthStatus, setHealthStatus] = useState<'checking' | 'online' | 'unavailable' | 'unknown'>('checking');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const qrPollingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pageLoadingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth page switching loader (lasts ~2.3 seconds)
  const navigate = useCallback((route: AppRoute) => {
    if (route === currentRoute) {
      setIsSidebarOpen(false);
      return;
    }

    setIsPageLoading(true);
    if (pageLoadingTimerRef.current) clearTimeout(pageLoadingTimerRef.current);

    setCurrentRouteState(route);
    setIsSidebarOpen(false);

    try {
      if (window.location.pathname !== route) {
        window.history.pushState(null, '', route);
      }
    } catch {
      // Ignore in sandboxed iframes
    }

    pageLoadingTimerRef.current = setTimeout(() => {
      setIsPageLoading(false);
    }, 2400); // 2.4s transition loader
  }, [currentRoute]);

  useEffect(() => {
    return () => {
      if (pageLoadingTimerRef.current) clearTimeout(pageLoadingTimerRef.current);
      if (qrPollingTimerRef.current) clearInterval(qrPollingTimerRef.current);
    };
  }, []);

  // Sync on popstate
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseRouteFromLocation();
      if (parsed !== currentRoute) {
        setIsPageLoading(true);
        setCurrentRouteState(parsed);
        setTimeout(() => setIsPageLoading(false), 2400);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentRoute]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', text: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshSessions = useCallback(async () => {
    try {
      const res = await api.getSessions();
      if (res && res.ok) {
        setActiveSessionsCount(res.count ?? (res.sessions ? res.sessions.length : 0));
        setActiveSessions(res.sessions || []);
        setHealthStatus('online');
      }
    } catch {
      setHealthStatus('online');
    }
  }, []);

  useEffect(() => {
    refreshSessions();
    const interval = setInterval(refreshSessions, 12000);
    return () => clearInterval(interval);
  }, [refreshSessions]);

  const startPairingFlow = async ({
    phoneNumber,
    pairingMethod,
  }: {
    phoneNumber: string;
    pairingMethod: PairingMethod;
  }): Promise<boolean> => {
    if (isProcessing) return false;
    setIsProcessing(true);
    setLastError(null);

    if (qrPollingTimerRef.current) {
      clearInterval(qrPollingTimerRef.current);
      qrPollingTimerRef.current = null;
    }

    const cleanPhone = phoneNumber.replace(/[\s+-]/g, '');

    try {
      if (pairingMethod === 'code') {
        const res = await api.pairWithCode(cleanPhone);
        if (!res.ok) {
          throw new Error(res.error || 'Failed to generate pairing code.');
        }

        const isLinked = res.code === 'ALREADY_LINKED' || res.status === 'open';

        setActiveBot({
          botId: res.sessionId || cleanPhone,
          name: 'Voltra MD',
          phoneNumber: cleanPhone,
          pairingMethod: 'code',
          managementToken: '',
          status: isLinked ? 'connected' : 'awaiting_pairing',
          createdAt: new Date().toISOString(),
          pairingCode: isLinked ? null : res.code || null,
          qrData: null,
          rawPairingResponse: res,
        });

        if (isLinked) {
          addToast('success', 'Account is already linked and connected!');
        } else {
          addToast('success', 'Pairing code generated! Linking inside WhatsApp.');
        }
      } else {
        // QR Code mode - Strictly use the authentic QR payload from the API
        const res = await api.pairWithQr();
        if (!res.ok) {
          throw new Error(res.error || 'Failed to initialize QR pairing.');
        }

        const isLinked = res.paired || res.status === 'open';
        const liveSessionId = res.sessionId || 'qr_session';
        const apiQr =
          res.qr ||
          (res as unknown as { qrCode?: string })?.qrCode ||
          (res as unknown as { qrcode?: string })?.qrcode ||
          null;

        setActiveBot({
          botId: liveSessionId,
          name: 'Voltra MD',
          phoneNumber: 'QR Session',
          pairingMethod: 'qr',
          managementToken: '',
          status: isLinked ? 'connected' : 'pairing',
          createdAt: new Date().toISOString(),
          pairingCode: null,
          qrData: apiQr, // Strictly from API
          rawPairingResponse: res,
        });

        if (apiQr) {
          addToast('success', 'QR code received from API! Scan with WhatsApp.');
        } else {
          addToast('info', 'QR session initialized. Waiting for QR payload from API...');
        }

        // Continuously poll the API for the authentic QR code from the server
        let pollCount = 0;
        qrPollingTimerRef.current = setInterval(async () => {
          pollCount++;
          try {
            const pollRes = await api.pairWithQr(undefined, liveSessionId);
            const liveApiQr =
              pollRes.qr ||
              (pollRes as unknown as { qrCode?: string })?.qrCode ||
              (pollRes as unknown as { qrcode?: string })?.qrcode ||
              null;

            if (liveApiQr) {
              setActiveBot((prev) => (prev ? { ...prev, qrData: liveApiQr } : null));
              addToast('success', 'QR code received from API! Scan with WhatsApp.');
            }

            if (pollRes.paired || pollRes.status === 'open') {
              setActiveBot((prev) => (prev ? { ...prev, status: 'connected' } : null));
              if (qrPollingTimerRef.current) clearInterval(qrPollingTimerRef.current);
              addToast('success', 'WhatsApp connection confirmed via QR scan!');
              return;
            }
          } catch {
            // background poll error ignored
          }

          if (pollCount >= 25) {
            if (qrPollingTimerRef.current) clearInterval(qrPollingTimerRef.current);
          }
        }, 2000);
      }

      await refreshSessions();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof VoltraApiError ? err.details.message : (err as Error).message || 'Pairing failed';
      setLastError(msg);
      addToast('error', msg);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const pollBotStatusOnce = useCallback(async () => {
    if (!activeBot) return;

    try {
      const res = await api.getSessions();
      if (res && res.ok && res.sessions) {
        const found = res.sessions.find(
          (s) => s.sessionId === activeBot.botId || s.phone === activeBot.phoneNumber
        );

        if (found) {
          const isNowConnected = found.status === 'open' || found.paired === true;
          const status = isNowConnected ? 'connected' : found.status || activeBot.status;

          setActiveBot((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              status,
              pairingCode: found.pairingCode || prev.pairingCode,
              lastStatusCheck: new Date().toISOString(),
            };
          });

          if (isNowConnected && activeBot.status !== 'connected') {
            addToast('success', 'WhatsApp connection confirmed!');
          }
        }
      }
    } catch {
      // background poll
    }
  }, [activeBot, addToast]);

  useEffect(() => {
    if (!activeBot || activeBot.status === 'connected') {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }
      setIsPolling(false);
      return;
    }

    setIsPolling(true);
    pollingTimerRef.current = setInterval(() => {
      pollBotStatusOnce();
    }, 4500);

    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }
      setIsPolling(false);
    };
  }, [activeBot?.status, activeBot?.botId, pollBotStatusOnce]);

  const resetBotSession = () => {
    if (qrPollingTimerRef.current) {
      clearInterval(qrPollingTimerRef.current);
      qrPollingTimerRef.current = null;
    }
    setActiveBot(null);
    setLastError(null);
    addToast('info', 'Reset pairing session.');
  };

  const sendChannelReaction = async (
    req: ChannelReactionRequest
  ): Promise<ChannelReactionResponse> => {
    setIsProcessing(true);
    try {
      const res = await api.sendChannelReaction(req);
      if (!res.ok) {
        throw new Error(res.error || 'Failed to send channel reaction.');
      }
      addToast('success', res.message || 'Channel reaction sent successfully!');
      return res;
    } catch (err: unknown) {
      const msg = err instanceof VoltraApiError ? err.details.message : (err as Error).message;
      addToast('error', msg);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const sendPollVote = async (
    req: PollVoteRequest
  ): Promise<PollVoteResponse> => {
    setIsProcessing(true);
    try {
      const res = await api.sendPollVote(req);
      if (!res.ok) {
        throw new Error(res.error || 'Failed to send poll vote.');
      }
      addToast('success', res.message || 'Poll vote sent successfully!');
      return res;
    } catch (err: unknown) {
      const msg = err instanceof VoltraApiError ? err.details.message : (err as Error).message;
      addToast('error', msg);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <WorkflowContext.Provider
      value={{
        currentRoute,
        navigate,
        isPageLoading,
        isSidebarOpen,
        setIsSidebarOpen,
        activeBot,
        activeSessionsCount,
        activeSessions,
        healthStatus,
        isProcessing,
        isPolling,
        lastError,
        toasts,
        addToast,
        removeToast,
        startPairingFlow,
        pollBotStatusOnce,
        resetBotSession,
        sendChannelReaction,
        sendPollVote,
        refreshSessions,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
