import React from 'react';
import { FileText, Calendar, ExternalLink } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { MedicalRecord, RecordType } from '../types';

interface TimelineListProps {
  records: MedicalRecord[];
  onView: (url: string) => void;
}

export const TimelineList: React.FC<TimelineListProps> = ({ records, onView }) => {
  return (
    <div className="space-y-4 relative">
      <div className="absolute left-[1.35rem] top-2 bottom-2 w-px bg-slate-200 z-0" />
      {records.sort((a, b) => b.createdAt - a.createdAt).map((record) => (
        <div key={record.id} className="relative z-10 flex space-x-4">
          <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
            <div className={record.type === RecordType.PRESCRIPTION ? 'text-blue-600' : 'text-emerald-600'}>
              <FileText size={20} />
            </div>
          </div>
          <Card className="flex-1 p-4" hoverable>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-slate-900 text-sm">
                  {record.type === RecordType.PRESCRIPTION ? 'Prescription' : 'Medical Report'}
                </p>
                <div className="flex items-center text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">
                  <Calendar size={10} className="mr-1" />
                  {new Date(record.createdAt).toLocaleDateString()}
                </div>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onView(record.fileURL)}
              >
                <ExternalLink size={14} className="mr-1.5" />
                View
              </Button>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};
