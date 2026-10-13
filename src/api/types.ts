/**
 * Voltra Mini - API Types & Data Contracts
 * Defined strictly according to the backend specification.
 */

export type PairingMethod = 'code' | 'qr';

export interface CreateBotRequest {
  name: string;
  phoneNumber: string;
  pairingMethod: PairingMethod;
}

export interface PairBotRequest {
  phoneNumber: string;
  method: PairingMethod;
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

export interface CreateBotResponse {
  // Common backend response keys
  id?: string;
  botId?: string;
  status?: string;
  managementToken?: string;
  token?: string;
  bot?: {
    id?: string;
    name?: string;
    phoneNumber?: string;
    pairingMethod?: PairingMethod;
    status?: string;
    managementToken?: string;
    token?: string;
    createdAt?: string;
    [key: string]: unknown;
  };
  message?: string;
  [key: string]: unknown;
}

export interface PairBotResponse {
  code?: string;
  pairingCode?: string;
  qr?: string;
  qrCode?: string;
  qrData?: string;
  status?: string;
  message?: string;
  data?: {
    code?: string;
    pairingCode?: string;
    qr?: string;
    qrCode?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface BotStatusResponse {
  status?: string;
  state?: string;
  botId?: string;
  id?: string;
  phoneNumber?: string;
  pairingMethod?: PairingMethod;
  updatedAt?: string;
  message?: string;
  connected?: boolean;
  bot?: {
    status?: string;
    state?: string;
    connected?: boolean;
    [key: string]: unknown;
  };
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
  managementToken: string; // Strictly kept in memory
  status: string;
  createdAt: string;
  rawCreationResponse?: unknown;
  pairingCode?: string | null;
  qrData?: string | null;
  rawPairingResponse?: unknown;
  lastStatusCheck?: string | null;
  rawStatusResponse?: unknown;
}
