import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { RefreshCw, QrCode, AlertCircle } from 'lucide-react';

interface QRCodeViewProps {
  qrData: string;
  size?: number;
  className?: string;
  onRefresh?: () => void;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  qrData,
  size = 220,
  className = '',
  onRefresh,
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    if (!qrData) {
      setDataUrl(null);
      setRenderError(null);
      return;
    }

    setRenderError(null);

    // 1. Direct Data URL or HTTP Image from API
    if (
      qrData.startsWith('data:image/') ||
      qrData.startsWith('http://') ||
      qrData.startsWith('https://') ||
      qrData.startsWith('blob:')
    ) {
      setDataUrl(qrData);
      setIsGenerating(false);
      return;
    }

    // 2. Raw base64 PNG/JPEG from API without data URL header
    if (qrData.startsWith('iVBORw0KGgo')) {
      setDataUrl(`data:image/png;base64,${qrData}`);
      setIsGenerating(false);
      return;
    }
    if (qrData.startsWith('/9j/')) {
      setDataUrl(`data:image/jpeg;base64,${qrData}`);
      setIsGenerating(false);
      return;
    }

    // 3. WhatsApp pairing payload string from API (e.g. 2@...)
    let isCancelled = false;
    setIsGenerating(true);

    const generateQr = async () => {
      try {
        const url = await QRCode.toDataURL(qrData, {
          width: Math.max(size * 2, 400),
          margin: 2,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#05070a', // rich dark ink
            light: '#ffffff', // pure white background
          },
        });
        if (!isCancelled) {
          setDataUrl(url);
          setIsGenerating(false);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          setRenderError((err as Error).message || 'Failed to encode QR code from API');
          setIsGenerating(false);
        }
      }
    };

    generateQr();

    return () => {
      isCancelled = true;
    };
  }, [qrData, size]);

  if (!qrData || isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/[0.02] text-slate-400 text-xs text-center min-h-[220px]">
        <RefreshCw className="w-6 h-6 animate-spin mb-2.5 text-cyan-400" />
        <span className="text-slate-300 font-medium">Generating QR scan code...</span>
        <span className="text-slate-500 text-[11px] mt-1">Processing barcode from API</span>
      </div>
    );
  }

  if (renderError) {
    return (
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center min-h-[220px]">
        <AlertCircle className="w-6 h-6 mb-2 text-rose-400" />
        <span className="font-semibold text-rose-200">Unable to render API QR</span>
        <span className="text-slate-400 mt-1 max-w-xs">{renderError}</span>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="mt-3 px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-medium cursor-pointer"
          >
            Retry from API
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* High contrast QR Frame */}
      <div className="p-3 bg-white rounded-2xl shadow-xl shadow-cyan-950/40 border border-slate-200 transition-transform duration-200 hover:scale-[1.01] flex items-center justify-center">
        {dataUrl ? (
          <img
            src={dataUrl}
            alt="WhatsApp Pairing QR Code"
            width={size}
            height={size}
            style={{ width: `${size}px`, height: `${size}px` }}
            className="rounded-lg object-contain block"
          />
        ) : (
          <div
            style={{ width: `${size}px`, height: `${size}px` }}
            className="flex flex-col items-center justify-center bg-slate-50 text-slate-500 rounded"
          >
            <QrCode className="w-10 h-10 text-slate-400 animate-pulse" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <p className="text-[11px] text-slate-400 text-center">
          Point your WhatsApp camera at the code
        </p>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-medium"
            title="Refresh QR Code from API"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        )}
      </div>
    </div>
  );
};
