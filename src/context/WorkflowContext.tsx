import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  ActiveBotSession,
  CreateBotRequest,
  PairBotRequest,
  HealthResponse,
  PairingMethod,
} from '../api/types';
import {
  api,
  VoltraApiError,
  RENDER_BACKEND_URL,
} from '../api/client';

interface ToastData {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface WorkflowContextType {
  activeBot: ActiveBotSession | null;
  healthStatus: 'checking' | 'online' | 'unavailable' | 'unknown';
  healthData: HealthResponse | null;
  healthError: string | null;
  lastHealthCheckTime: Date | null;
  isProcessing: boolean;
  isPolling: boolean;
  lastError: string | null;
  toasts: ToastData[];
  addToast: (type: 'success' | 'error' | 'info', text: string) => void;
  removeToast: (id: string) => void;
  checkHealth: () => Promise<void>;
  startPairingFlow: (params: {
    phoneNumber: string;
    name?: string;
    pairingMethod: PairingMethod;
  }) => Promise<boolean>;
  regeneratePairing: () => Promise<boolean>;
  pollBotStatusOnce: () => Promise<void>;
  resetBotSession: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeBot, setActiveBot] = useState<ActiveBotSession | null>(null);
  const [healthStatus, setHealthStatus] = useState<'checking' | 'online' | 'unavailable' | 'unknown'>('checking');
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [lastHealthCheckTime, setLastHealthCheckTime] = useState<Date | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Health check prober (always routes via dev server proxy)
  const checkHealth = useCallback(async () => {
    setHealthStatus('checking');
    setHealthError(null);
    try {
      const response = await api.checkHealth();
      setHealthData(response);
      setHealthStatus('online');
      setLastHealthCheckTime(new Date());
    } catch (err: unknown) {
      setLastHealthCheckTime(new Date());
      setHealthStatus('unavailable');
      if (err instanceof VoltraApiError) {
        setHealthError(err.details.message);
      } else if (err instanceof Error) {
        setHealthError(err.message);
      } else {
        setHealthError('Health check prober failed');
      }
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Unified startPairingFlow: creates bot if needed, immediately calls pair, sets code/QR
  const startPairingFlow = async ({
    phoneNumber,
    name = 'Voltra Bot',
    pairingMethod,
  }: {
    phoneNumber: string;
    name?: string;
    pairingMethod: PairingMethod;
  }): Promise<boolean> => {
    if (isProcessing) return false;
    setIsProcessing(true);
    setLastError(null);

    try {
      const cleanPhone = phoneNumber.replace(/[\s+-]/g, '');
      const botName = name.trim() || 'Voltra Bot';

      // 1. Create Bot on backend
      const createRes = await api.createBot({
        name: botName,
        phoneNumber: cleanPhone,
        pairingMethod,
      });

      const createData =
        (createRes as { data?: Record<string, unknown> }).data ||
        (createRes as Record<string, unknown>);

      const botId =
        (createData.botId as string) ||
        (createData.id as string) ||
        ((createData.bot as Record<string, unknown>)?.id as string) ||
        `bot_${Date.now()}`;

      const managementToken =
        (createData.managementToken as string) ||
        (createData.token as string) ||
        ((createData.bot as Record<string, unknown>)?.managementToken as string) ||
        '';

      const initialStatus =
        (createData.status as string) ||
        ((createData.bot as Record<string, unknown>)?.status as string) ||
        'created';

      // 2. Immediately call pair endpoint
      let pairingCode: string | null = null;
      let qrData: string | null = null;
      let pairStatus = initialStatus;
      let pairRes: unknown = null;

      if (managementToken) {
        try {
          pairRes = await api.pairBot(
            botId,
            { phoneNumber: cleanPhone, method: pairingMethod },
            managementToken
          );

          const pairData =
            (pairRes as { data?: Record<string, unknown> }).data ||
            (pairRes as Record<string, unknown>);

          pairingCode =
            (pairData.pairingCode as string) ||
            (pairData.code as string) ||
            null;

          qrData =
            (pairData.qrCode as string) ||
            (pairData.qr as string) ||
            (pairData.qrData as string) ||
            null;

          pairStatus = (pairData.status as string) || 'awaiting_pairing';
        } catch (pairErr) {
          console.error('Pair initiation error:', pairErr);
          // If pairing failed, we still have the bot created and user can retry
          if (pairErr instanceof VoltraApiError) {
            setLastError(pairErr.details.message);
          }
        }
      }

      const session: ActiveBotSession = {
        botId,
        name: botName,
        phoneNumber: cleanPhone,
        pairingMethod,
        managementToken,
        status: pairStatus,
        createdAt: new Date().toISOString(),
        rawCreationResponse: createRes,
        rawPairingResponse: pairRes,
        pairingCode,
        qrData,
      };

      setActiveBot(session);
      addToast(
        'success',
        pairingMethod === 'code'
          ? 'Pairing code generated! Link inside WhatsApp.'
          : 'QR code generated! Scan with WhatsApp.'
      );
      return true;
    } catch (err: unknown) {
      if (err instanceof VoltraApiError) {
        setLastError(err.details.message);
        addToast('error', `Pairing failed: ${err.details.message}`);
      } else if (err instanceof Error) {
        setLastError(err.message);
        addToast('error', err.message);
      } else {
        setLastError('Failed to initiate pairing');
        addToast('error', 'Unexpected error starting pairing');
      }
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-request pairing code / QR for the current active bot
  const regeneratePairing = async (): Promise<boolean> => {
    if (!activeBot || !activeBot.managementToken) {
      addToast('error', 'No active bot credentials in session');
      return false;
    }

    setIsProcessing(true);
    setLastError(null);

    try {
      const pairRes = await api.pairBot(
        activeBot.botId,
        {
          phoneNumber: activeBot.phoneNumber,
          method: activeBot.pairingMethod,
        },
        activeBot.managementToken
      );

      const pairData =
        (pairRes as { data?: Record<string, unknown> }).data ||
        (pairRes as Record<string, unknown>);

      const pairingCode =
        (pairData.pairingCode as string) ||
        (pairData.code as string) ||
        null;

      const qrData =
        (pairData.qrCode as string) ||
        (pairData.qr as string) ||
        (pairData.qrData as string) ||
        null;

      const updatedStatus = (pairData.status as string) || 'awaiting_pairing';

      setActiveBot((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: updatedStatus,
          pairingCode,
          qrData,
          rawPairingResponse: pairRes,
        };
      });

      addToast('success', 'Fresh pairing credentials generated.');
      return true;
    } catch (err: unknown) {
      if (err instanceof VoltraApiError) {
        setLastError(err.details.message);
        addToast('error', err.details.message);
      } else if (err instanceof Error) {
        setLastError(err.message);
        addToast('error', err.message);
      }
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Poll Bot Status Once
  const pollBotStatusOnce = useCallback(async () => {
    if (!activeBot || !activeBot.managementToken) return;

    try {
      const response = await api.getBotStatus(
        activeBot.botId,
        activeBot.managementToken
      );

      const respData =
        (response as { data?: Record<string, unknown> }).data ||
        (response as Record<string, unknown>);

      const updatedStatus =
        (respData.status as string) ||
        (respData.state as string) ||
        ((respData.bot as Record<string, unknown>)?.status as string) ||
        activeBot.status;

      const pairingCode =
        (respData.pairingCode as string) ||
        activeBot.pairingCode;

      const qrCode =
        (respData.qrCode as string) ||
        (respData.qr as string) ||
        activeBot.qrData;

      setActiveBot((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: updatedStatus,
          pairingCode: pairingCode || prev.pairingCode,
          qrData: qrCode || prev.qrData,
          lastStatusCheck: new Date().toISOString(),
          rawStatusResponse: response,
        };
      });

      if (updatedStatus.toLowerCase() === 'connected') {
        addToast('success', 'WhatsApp connection confirmed! Bot is now active.');
      }
    } catch {
      // Background poll silently logs in diagnostics
    }
  }, [activeBot, addToast]);

  // Auto-polling effect while pairing is pending
  useEffect(() => {
    if (!activeBot || !activeBot.managementToken) {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }
      setIsPolling(false);
      return;
    }

    const currentStatus = (activeBot.status || '').toLowerCase();
    const isTerminal =
      currentStatus === 'connected' ||
      currentStatus === 'failed' ||
      currentStatus === 'disconnected';

    if (isTerminal) {
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
    }, 4000);

    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }
      setIsPolling(false);
    };
  }, [activeBot?.status, activeBot?.managementToken, activeBot?.botId, pollBotStatusOnce]);

  const resetBotSession = () => {
    setActiveBot(null);
    setLastError(null);
    addToast('info', 'Reset pairing session.');
  };

  return (
    <WorkflowContext.Provider
      value={{
        activeBot,
        healthStatus,
        healthData,
        healthError,
        lastHealthCheckTime,
        isProcessing,
        isPolling,
        lastError,
        toasts,
        addToast,
        removeToast,
        checkHealth,
        startPairingFlow,
        regeneratePairing,
        pollBotStatusOnce,
        resetBotSession,
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
