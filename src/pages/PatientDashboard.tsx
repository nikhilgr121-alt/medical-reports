import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  QrCode, 
  Upload, 
  History, 
  User as UserIcon, 
  ShieldCheck, 
  ShieldAlert,
  Droplets,
  Bell,
  Scale,
  Ruler,
  Activity,
  Plus
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Toggle } from '../components/Toggle';
import { PageTransition } from '../components/PageTransition';
import { useAuth } from '../contexts/AuthContext';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { db, updateDoc } from '../services/firebaseSimulator';
import { ReminderSystem } from '../components/ReminderSystem';

export const PatientDashboard: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [sharing, setSharing] = React.useState(user?.sharingEnabled ?? true);

  const handleToggleSharing = async (val: boolean) => {
    setSharing(val);
    if (user) {
      const docRef = db.doc(db.collection('users'), user.uid);
      await updateDoc(docRef, { sharingEnabled: val });
      await refreshProfile();
    }
  };

  // The QR code value is the patient's UID
  const qrValue = user?.uid || '';

  return (
    <PageTransition>
      <div className="flex-1 p-6 space-y-6 pt-24 pb-12 max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-200">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl" />
          
          <div className="relative flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <UserIcon size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold tracking-tight">{user?.name}</h2>
              <div className="flex items-center space-x-2 text-blue-100 text-xs font-medium mt-1">
                <span className="bg-white/20 px-2 py-0.5 rounded-full">Patient</span>
                <span>•</span>
                <span>Active Vault</span>
              </div>
            </div>
            <button className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all">
              <Bell size={20} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 relative z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
              <p className="text-[10px] text-blue-100 uppercase font-bold tracking-wider mb-1">Blood</p>
              <p className="text-lg font-bold">{user?.bloodGroup || 'N/A'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
              <p className="text-[10px] text-blue-100 uppercase font-bold tracking-wider mb-1">Weight</p>
              <p className="text-lg font-bold">{user?.weight || '--'} <span className="text-xs font-normal">kg</span></p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
              <p className="text-[10px] text-blue-100 uppercase font-bold tracking-wider mb-1">Height</p>
              <p className="text-lg font-bold">{user?.height || '--'} <span className="text-xs font-normal">cm</span></p>
            </div>
          </div>
        </div>

        {/* Reminders & Stats */}
        <div className="space-y-6">
          <ReminderSystem patientId={user?.uid || ''} />
          
          <Card className="p-5 border-none shadow-xl shadow-blue-50 bg-white rounded-[2rem] overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity size={64} className="text-blue-600" />
            </div>
            <div className="relative z-10 flex items-center space-x-3 mb-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShieldCheck size={18} />
              </div>
              <h3 className="font-bold text-slate-900 tracking-tight">Security Check</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Your records are encrypted and stored securely. Only authorized healthcare providers with your QR key can access them.
            </p>
          </Card>
        </div>

        {/* QR Code Section */}
        <QRCodeDisplay value={qrValue} label="Your Medical Passport" />

        {/* Improved Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/patient/upload')}
            className="flex flex-col items-center justify-center h-32 space-y-3 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Plus size={24} />
            </div>
            <span className="font-bold text-slate-900 text-sm">Add Record</span>
          </button>
          <button 
            onClick={() => navigate('/patient/timeline')}
            className="flex flex-col items-center justify-center h-32 space-y-3 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all">
              <History size={24} />
            </div>
            <span className="font-bold text-slate-900 text-sm">Timeline</span>
          </button>
        </div>

        {/* Privacy Control */}
        <Card className="flex items-center justify-between p-6 bg-slate-50 border-none">
          <div className="flex items-center space-x-3">
            {sharing ? (
              <ShieldCheck className="text-emerald-500" />
            ) : (
              <ShieldAlert className="text-red-500" />
            )}
            <div>
              <p className="font-semibold text-sm">Medical Sharing</p>
              <p className="text-xs text-slate-500">
                {sharing ? 'Doctors can view records' : 'Access restricted to you'}
              </p>
            </div>
          </div>
          <Toggle checked={sharing} onChange={handleToggleSharing} />
        </Card>

        <div className="text-center">
          <p className="text-[10px] text-slate-400 font-mono">Patient ID: {user?.uid}</p>
        </div>
      </div>
    </PageTransition>
  );
};
