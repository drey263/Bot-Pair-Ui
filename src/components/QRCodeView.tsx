import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface QRCodeViewProps {
  qrData: string;
  size?: number;
  className?: string;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  qrData,
  size = 240,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  const isImageDataUrl =
    typeof qrData === 'string' &&
    (qrData.startsWith('data:image/') || qrData.startsWith('blob:'));

  useEffect(() => {
    if (!qrData || isImageDataUrl) return;

    if (canvasRef.current) {
      setRenderError(null);
      QRCode.toCanvas(
        canvasRef.current,
        qrData,
        {
          width: size,
          margin: 2,
          color: {
            dark: '#05070a', // deep ink
            light: '#ffffff', // pure white contrast
          },
          errorCorrectionLevel: 'M',
        },
        (error) => {
          if (error) {
            setRenderError(error.message || 'Failed to render QR Code');
          }
        }
      );
    }
  }, [qrData, size, isImageDataUrl]);

  if (!qrData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-800 rounded-xl bg-slate-950/40 text-slate-400 text-xs text-center">
        <RefreshCw className="w-5 h-5 animate-spin mb-2 text-cyan-400" />
        <span>Waiting for QR payload from API...</span>
      </div>
    );
  }

  if (renderError) {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-rose-900/50 rounded-xl bg-rose-950/20 text-rose-300 text-xs text-center">
        <AlertCircle className="w-5 h-5 mb-2 text-rose-400" />
        <span className="font-medium">QR Rendering Issue</span>
        <span className="text-slate-400 mt-1 max-w-xs">{renderError}</span>
        <pre className="mt-3 p-2 bg-slate-900 rounded text-[10px] text-slate-300 font-mono break-all max-w-xs text-left">
          {qrData.slice(0, 100)}...
        </pre>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="p-3 bg-white rounded-xl shadow-lg shadow-cyan-950/30 border border-slate-700/60 transition-transform duration-200 hover:scale-[1.01]">
        {isImageDataUrl ? (
          <img
            src={qrData}
            alt="WhatsApp Pairing QR Code"
            width={size}
            height={size}
            className="rounded"
          />
        ) : (
          <canvas
            ref={canvasRef}
            className="rounded block"
            aria-label="WhatsApp Pairing QR Code"
          />
        )}
      </div>
      <p className="mt-3 text-xs text-slate-400 text-center">
        Scan within WhatsApp to connect your bot instantly
      </p>
    </div>
  );
};
