import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Download, Smartphone } from 'lucide-react';
import { LogoBadge } from './LogoBadge';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    // Get current window location or fallback
    const url = typeof window !== 'undefined' ? window.location.href : 'https://ais-dev-opdnwlogjtjtr7sxeq5wsc-737574640561.asia-east1.run.app';
    setCurrentUrl(url);

    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 240,
          margin: 2,
          color: {
            dark: '#15805D', // Puskesmas emerald
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        },
        (error) => {
          if (error) console.error('QR Code generation error:', error);
        }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadQr = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'QR_Code_Ingek_Bundo_Puskesmas_Kuranji.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#F9D5E2] relative animate-in zoom-in-95 duration-200 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Title & Official Logo */}
        <div className="flex justify-center mb-3">
          <LogoBadge size="lg" />
        </div>

        <h3 className="font-heading text-lg sm:text-xl font-bold text-gray-900">
          QR Code Website INGEK BUNDO
        </h3>
        <p className="text-xs text-gray-500 font-medium mt-1">
          Puskesmas Kuranji · Kelas Ibu Hamil
        </p>

        {/* QR Canvas Box */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-b from-[#FFF5F7] to-[#E6F7F0] border border-[#F9D5E2] inline-block shadow-inner">
          <div className="bg-white p-2.5 rounded-xl shadow-xs border border-gray-100">
            <canvas ref={canvasRef} className="mx-auto rounded-lg" />
          </div>
          <p className="text-[11px] font-semibold text-gray-600 mt-2.5 flex items-center justify-center gap-1.5">
            <Smartphone size={13} className="text-[#15805D]" />
            <span>Scan dengan kamera HP untuk langsung membuka website</span>
          </p>
        </div>

        {/* URL Box with Copy Button */}
        <div className="mt-4 flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-200 text-left">
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="flex-1 text-xs text-gray-600 bg-transparent outline-none truncate px-1"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white border border-gray-300 text-gray-700 hover:text-[#15805D] hover:border-[#15805D] transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-600" />
                <span className="text-emerald-700">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Salin Tautan</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleDownloadQr}
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#15805D] hover:bg-[#0E6146] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Download size={14} />
            <span>Unduh Gambar QR</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <span>Tutup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
