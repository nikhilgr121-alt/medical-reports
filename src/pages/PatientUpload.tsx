import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload as UploadIcon, 
  FileText, 
  Calendar, 
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PageTransition } from '../components/PageTransition';
import { Select } from '../components/Select';
import { RecordType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { db, setDoc, storage, uploadBytes, getDownloadURL } from '../services/firebaseSimulator';

export const PatientUpload: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<RecordType>(RecordType.PRESCRIPTION);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setIsUploading(true);
    
    try {
      const storageRef = storage.ref(`records/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      const recordId = Math.random().toString(36).substring(2, 11);
      const docRef = db.doc(db.collection('records'), recordId);
      
      await setDoc(docRef, {
        id: recordId,
        patientId: user.uid,
        fileName: file.name,
        type: type,
        fileURL,
        createdAt: Date.now()
      });
      navigate('/patient/timeline');
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex-1 p-6 space-y-6 pt-24 pb-12 max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-4">
          <button className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-slate-600 hover:text-blue-600 transition-all font-bold" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Upload Record</h1>
        </div>

        <Card className="space-y-6 border-none shadow-xl shadow-slate-100 bg-white p-8 rounded-[2rem]">
          <div className="space-y-4">
            <Select 
              label="Record Type" 
              value={type} 
              onChange={(e) => setType(e.target.value as RecordType)}
            >
              <option value={RecordType.PRESCRIPTION}>Prescription</option>
              <option value={RecordType.REPORT}>Medical Report</option>
            </Select>

            <div className="space-y-1.5 font-sans">
              <label className="text-sm font-medium text-slate-700 block">
                Select File
              </label>
              {!file ? (
                <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-blue-50/50 hover:border-blue-400 transition-all group overflow-hidden bg-slate-50/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="bg-white p-4 rounded-2xl shadow-sm mb-3 group-hover:scale-110 group-hover:text-blue-600 transition-all">
                      <UploadIcon className="w-8 h-8 text-slate-400 group-hover:text-blue-600" />
                    </div>
                    <p className="mb-1 text-sm text-slate-700 font-bold uppercase tracking-wide">Drop record here</p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest px-4 py-1 bg-white rounded-full mt-2">PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,image/*" />
                </label>
              ) : (
                <div className="flex items-center p-6 border border-blue-100 bg-blue-50 rounded-[2rem] relative shadow-inner overflow-hidden group">
                  <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-125 transition-transform">
                    <FileText size={128} className="text-blue-600" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl mr-4 text-blue-600 shadow-sm relative z-10">
                    <FileText size={28} />
                  </div>
                  <div className="flex-1 min-w-0 relative z-10">
                    <p className="text-base font-bold text-slate-900 truncate">{file.name}</p>
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button 
                    onClick={() => setFile(null)}
                    className="p-2 bg-white/50 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all relative z-10"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl flex items-start space-x-3">
            <Info size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Records are securely stored and encrypted. Ensure all text in the file is legible before uploading.
            </p>
          </div>

          <Button 
            className="w-full h-14 text-base" 
            disabled={!file} 
            isLoading={isUploading}
            onClick={handleUpload}
          >
            Upload to Vault
          </Button>
        </Card>
      </div>
    </PageTransition>
  );
};
