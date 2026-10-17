/**
 * Voltra Mini - API Types & Data Contracts
 * Defined strictly according to the backend specification at pro-bot-production-3c56.up.railway.app
 */

export type PairingMethod = 'code' | 'qr';

export interface ChannelReactionRequest {
  url: string;
  emoji: string;
}

export interface ChannelReactionResponse {
  ok: boolean;
  message?: string;
  details?: {
    newsletterJid?: string;
    serverId?: string;
    emoji?: string;
    [key: string]: unknown;
  };
  successCount?: number;
  failCount?: number;
  error?: string;
}

export interface PollVoteRequest {
  url: string;
  option: number | string;
}

export interface PollVoteResponse {
  ok: boolean;
  message?: string;
  successCount?: number;
  failCount?: number;
  error?: string;
}

export interface PairCodeResponse {
  ok: boolean;
  sessionId?: string;
  code?: string;
  status?: string;
  error?: string;
}

export interface PairQrResponse {
  ok: boolean;
  sessionId?: string;
  qr?: string | null;
  status?: string;
  paired?: boolean;
  message?: string;
  error?: string;
}

export interface SessionInfo {
  sessionId: string;
  phone?: string;
  status?: string;
  paired?: boolean;
  pairingCode?: string | null;
}

export interface SessionsResponse {
  ok: boolean;
  count?: number;
  sessions?: SessionInfo[];
}

export interface HealthResponse {
  status?: string;
  ok?: boolean;
  message?: string;
  timestamp?: string | number;
  uptime?: number;
  service?: string;
  [key: string]: unknown;
}

export interface ApiErrorDetails {
  status: number;
  statusText: string;
  message: string;
  rawBody?: unknown;
  isCorsOrNetwork: boolean;
  endpoint: string;
  method: string;
  timestamp: string;
}

export interface ApiLogEntry {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  fullUrl: string;
  status?: number;
  durationMs: number;
  success: boolean;
  isCorsOrNetwork: boolean;
  errorMessage?: string;
  sanitizedRequestBody?: unknown;
  sanitizedResponseBody?: unknown;
}

export interface ActiveBotSession {
  botId: string;
  name: string;
  phoneNumber: string;
  pairingMethod: PairingMethod;
  managementToken: string;
  status: string;
  createdAt: string;
  rawCreationResponse?: unknown;
  pairingCode?: string | null;
  qrData?: string | null;
  rawPairingResponse?: unknown;
  lastStatusCheck?: string | null;
  rawStatusResponse?: unknown;
}
