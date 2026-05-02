import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';
import { Button } from './Button';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scannerRef.current.render(
      (decodedText) => {
        onScan(decodedText);
        scannerRef.current?.clear();
      },
      (error) => {
        // console.warn(error);
      }
    );

    return () => {
      scannerRef.current?.clear().catch(error => {
        console.error("Failed to clear scanner", error);
      });
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col pt-12 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-xl font-bold">Scan QR Passport</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
          <X size={24} />
        </Button>
      </div>
      
      <div id="reader" className="w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10" />
      
      <div className="mt-8 text-center">
        <p className="text-slate-400 text-sm">Align the QR code within the frame to scan</p>
      </div>
    </div>
  );
};
