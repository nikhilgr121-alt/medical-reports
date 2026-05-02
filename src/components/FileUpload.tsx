import React, { useState } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onClear: () => void;
  selectedFile: File | null;
  isLoading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  onClear, 
  selectedFile, 
  isLoading 
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  if (selectedFile) {
    return (
      <div className="flex items-center p-4 border border-blue-100 bg-blue-50 rounded-xl relative">
        <div className="bg-blue-100 p-2 rounded-lg mr-3 text-blue-600">
          <FileText size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{selectedFile.name}</p>
          <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
        </div>
        {isLoading ? (
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        ) : (
          <button 
            onClick={onClear}
            className="p-1 hover:bg-blue-200 rounded-full transition-colors"
          >
            <X size={16} className="text-blue-600" />
          </button>
        )}
      </div>
    );
  }

  return (
    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <div className="bg-blue-50 p-4 rounded-full mb-3">
          <Upload className="w-6 h-6 text-blue-600" />
        </div>
        <p className="mb-1 text-sm text-slate-700 font-medium">Click to upload report</p>
        <p className="text-xs text-slate-400">PDF, JPG, PNG (Max 5MB)</p>
      </div>
      <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,image/*" />
    </label>
  );
};
