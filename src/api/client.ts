/**
 * Voltra Mini - Official API Client Module
 * Communicates with the real WhatsApp Bot API at https://voltra-bot-su5n.onrender.com
 */

import {
  ChannelReactionRequest,
  ChannelReactionResponse,
  PollVoteRequest,
  PollVoteResponse,
  PairCodeResponse,
  PairQrResponse,
  SessionsResponse,
  HealthResponse,
  ApiErrorDetails,
  ApiLogEntry,
} from './types';

export const RENDER_BACKEND_URL = 'https://voltra-bot-su5n.onrender.com';
export const DEFAULT_BASE_URL = 'https://voltra-bot-su5n.onrender.com'; // Hardcoded for Render deployment
export const DEFAULT_API_PREFIX = '/api/v1';

// Custom error class with rich HTTP diagnostic metadata
export class VoltraApiError extends Error {
  public details: ApiErrorDetails;

  constructor(details: ApiErrorDetails) {
    super(details.message);
    this.name = 'VoltraApiError';
    this.details = details;
  }
}

// In-memory request log store for Diagnostics
type LogSubscriber = (logs: ApiLogEntry[]) => void;
class DiagnosticsStore {
  private logs: ApiLogEntry[] = [];
  private subscribers: Set<LogSubscriber> = new Set();
  private maxLogs = 50;

  public addLog(entry: ApiLogEntry) {
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
    this.notify();
  }

  public getLogs(): ApiLogEntry[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
    this.notify();
  }

  public subscribe(fn: LogSubscriber): () => void {
    this.subscribers.add(fn);
    fn(this.getLogs());
    return () => {
      this.subscribers.delete(fn);
    };
  }

  private notify() {
    const current = this.getLogs();
    this.subscribers.forEach((fn) => fn(current));
  }
}

export const diagnosticsStore = new DiagnosticsStore();

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  managementToken?: string;
  baseUrlOverride?: string;
}

export class VoltraApiClient {
  private baseUrl: string;
  private prefix: string;

  constructor(baseUrl = DEFAULT_BASE_URL, prefix = DEFAULT_API_PREFIX) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.prefix = prefix.startsWith('/') ? prefix : `/${prefix}`;
  }

  public setBaseUrl(newBaseUrl: string) {
    this.baseUrl = newBaseUrl.replace(/\/+$/, '');
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public getFullPrefixUrl(): string {
    return `${this.baseUrl}${this.prefix}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      timeoutMs = 30000,
      managementToken,
      baseUrlOverride,
      headers: customHeaders = {},
      ...fetchOptions
    } = options;

    const base = baseUrlOverride !== undefined ? baseUrlOverride : this.baseUrl;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Support non-prefixed routes (like /api/sessions)
    const fullUrl = cleanEndpoint.startsWith('/api/')
      ? `${base}${cleanEndpoint}`
      : `${base}${this.prefix}${cleanEndpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const headers = new Headers(customHeaders);
    if (!headers.has('Content-Type') && fetchOptions.body) {
      headers.set('Content-Type', 'application/json');
    }

    if (managementToken) {
      headers.set('Authorization', `Bearer ${managementToken}`);
      headers.set('x-management-token', managementToken);
    }

    const startTime = Date.now();
    let responseStatus: number | undefined;
    let rawBodyText = '';
    let isCorsOrNetwork = false;

    try {
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      responseStatus = response.status;
      rawBodyText = await response.text();
      const durationMs = Date.now() - startTime;

      let parsedData: unknown = null;
      try {
        parsedData = rawBodyText ? JSON.parse(rawBodyText) : {};
      } catch {
        parsedData = { raw: rawBodyText };
      }

      if (!response.ok) {
        const errorMsg =
          (parsedData as { error?: string | { message?: string } })?.error &&
          typeof (parsedData as { error?: unknown }).error === 'string'
            ? (parsedData as { error: string }).error
            : (parsedData as { message?: string })?.message ||
              `Request failed with status ${response.status}: ${response.statusText}`;

        const details: ApiErrorDetails = {
          status: response.status,
          statusText: response.statusText,
          message: errorMsg,
          rawBody: parsedData,
          isCorsOrNetwork: false,
          endpoint: cleanEndpoint,
          method: fetchOptions.method || 'GET',
          timestamp: new Date().toISOString(),
        };

        diagnosticsStore.addLog({
          id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          timestamp: details.timestamp,
          method: details.method,
          endpoint: cleanEndpoint,
          fullUrl,
          status: response.status,
          durationMs,
          success: false,
          isCorsOrNetwork: false,
          errorMessage: errorMsg,
          sanitizedRequestBody: fetchOptions.body
            ? JSON.parse(fetchOptions.body as string)
            : undefined,
          sanitizedResponseBody: parsedData,
        });

        throw new VoltraApiError(details);
      }

      diagnosticsStore.addLog({
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        method: fetchOptions.method || 'GET',
        endpoint: cleanEndpoint,
        fullUrl,
        status: response.status,
        durationMs,
        success: true,
        isCorsOrNetwork: false,
        sanitizedRequestBody: fetchOptions.body
          ? JSON.parse(fetchOptions.body as string)
          : undefined,
        sanitizedResponseBody: parsedData,
      });

      return parsedData as T;
    } catch (err: unknown) {
      const durationMs = Date.now() - startTime;
      clearTimeout(timeoutId);

      if (err instanceof VoltraApiError) {
        throw err;
      }

      let errorMsg = 'Network connection failed.';
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMsg = `Request timed out after ${timeoutMs}ms.`;
        } else if (err.message.includes('Failed to fetch')) {
          isCorsOrNetwork = true;
          errorMsg = 'Network error: could not connect to server.';
        } else {
          errorMsg = err.message;
        }
      }

      const details: ApiErrorDetails = {
        status: responseStatus || 0,
        statusText: isCorsOrNetwork ? 'CORS / Network Error' : 'Unknown Error',
        message: errorMsg,
        rawBody: rawBodyText || null,
        isCorsOrNetwork,
        endpoint: cleanEndpoint,
        method: fetchOptions.method || 'GET',
        timestamp: new Date().toISOString(),
      };

      diagnosticsStore.addLog({
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: details.timestamp,
        method: details.method,
        endpoint: cleanEndpoint,
        fullUrl,
        status: responseStatus,
        durationMs,
        success: false,
        isCorsOrNetwork,
        errorMessage: errorMsg,
        sanitizedRequestBody: fetchOptions.body
          ? JSON.parse(fetchOptions.body as string)
          : undefined,
      });

      throw new VoltraApiError(details);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // 1. Health check
  public async checkHealth(): Promise<HealthResponse> {
    try {
      return await this.request<HealthResponse>('/api/v1/health', {
        method: 'GET',
        timeoutMs: 12000,
      });
    } catch {
      // Fallback to /api/sessions check if /health is not defined
      return await this.request<HealthResponse>('/api/sessions', {
        method: 'GET',
        timeoutMs: 12000,
      });
    }
  }

  // 2. Pair with Code: POST /api/v1/pair/code (with fallback to /api/pair)
  public async pairWithCode(phone: string): Promise<PairCodeResponse> {
    const cleanPhone = phone.replace(/[\s+-]/g, '');
    try {
      return await this.request<PairCodeResponse>('/pair/code', {
        method: 'POST',
        body: JSON.stringify({
          phone: cleanPhone,
        }),
      });
    } catch {
      // Fallback to /api/pair route
      return this.request<PairCodeResponse>('/api/pair', {
        method: 'POST',
        body: JSON.stringify({
          phone: cleanPhone,
        }),
      });
    }
  }

  // 3. Pair with QR: POST /api/v1/pair/qr
  public async pairWithQr(phone?: string, sessionId?: string): Promise<PairQrResponse> {
    const payload: Record<string, string> = {};
    if (phone) payload.phone = phone.replace(/[\s+-]/g, '');
    if (sessionId) payload.sessionId = sessionId;

    return this.request<PairQrResponse>('/pair/qr', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // 4. Channel Reaction: POST /api/v1/services/chreact
  public async sendChannelReaction(
    request: ChannelReactionRequest
  ): Promise<ChannelReactionResponse> {
    return this.request<ChannelReactionResponse>('/services/chreact', {
      method: 'POST',
      body: JSON.stringify({
        url: request.url.trim(),
        emoji: request.emoji.trim(),
      }),
    });
  }

  // 5. Poll Vote: POST /api/v1/services/pollvt
  public async sendPollVote(
    request: PollVoteRequest
  ): Promise<PollVoteResponse> {
    const optionNum = Number(request.option) || request.option;
    return this.request<PollVoteResponse>('/services/pollvt', {
      method: 'POST',
      body: JSON.stringify({
        url: request.url.trim(),
        option: optionNum,
      }),
    });
  }

  // 6. Active Sessions: GET /api/sessions
  public async getSessions(): Promise<SessionsResponse> {
    return this.request<SessionsResponse>('/api/sessions', {
      method: 'GET',
      timeoutMs: 10000,
    });
  }
}

export const api = new VoltraApiClient();
