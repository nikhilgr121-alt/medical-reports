import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from './Card';
import { QrCode } from 'lucide-react';

interface QRCodeDisplayProps {
  value: string;
  label?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, label }) => {
  return (
    <Card className="text-center space-y-4 py-8 flex flex-col items-center">
      <div className="p-4 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
        <QRCodeSVG 
          value={value} 
          size={200} 
          level="H"
          marginSize={2}
          imageSettings={{
            src: "/vite.svg", // Placeholder for icon if needed
            height: 40,
            width: 40,
            excavate: true,
          }}
        />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-slate-900">{label || 'Your Medical ID'}</p>
        <p className="text-xs text-slate-500">Scan to view patient profile and history</p>
      </div>
    </Card>
  );
};
