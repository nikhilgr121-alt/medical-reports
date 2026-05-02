import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  QrCode, 
  UserCheck, 
  Stethoscope, 
  Clock, 
  ChevronRight,
  ShieldAlert,
  Loader2,
  ScanLine
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PageTransition } from '../components/PageTransition';
import { useAuth } from '../contexts/AuthContext';

import { db, getDoc } from '../services/firebaseSimulator';

import { QRScanner } from '../components/QRScanner';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleSearch = async (e: React.FormEvent | string) => {
    const idToSearch = typeof e === 'string' ? e : patientId.trim();
    if (typeof e !== 'string') e.preventDefault();
    if (!idToSearch) return;
    
    setIsSearching(true);
    setError('');
    
    try {
      const docRef = db.doc(db.collection('users'), idToSearch);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data()?.role === 'patient') {
        navigate(`/doctor/patient/${idToSearch}`);
      } else {
        setError('Patient not found or invalid ID');
      }
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
      setIsScanning(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex-1 p-6 space-y-6 pt-24 pb-12 max-w-2xl mx-auto">
        {/* Welcome Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-200">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />
          
          <div className="relative flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Stethoscope size={32} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight">Dr. {user?.name?.split(' ')[0]}</h1>
              <p className="text-slate-400 text-xs font-medium mt-1 leading-relaxed">
                {user?.degree || 'Medical Professional'} • Licensed MD
              </p>
            </div>
            <div className="bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              <div className="flex items-center space-x-2 text-emerald-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-1">
                <UserCheck size={14} className="text-blue-400" />
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Patients Today</p>
              </div>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-1">
                <Clock size={14} className="text-blue-400" />
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Avg. Time</p>
              </div>
              <p className="text-2xl font-bold">15 <span className="text-xs font-normal">min</span></p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <Card className="space-y-4 border-none shadow-xl shadow-slate-100 bg-white p-6 rounded-[2rem]">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 tracking-tight">Patient Search</h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Secure Access</span>
          </div>
          {error && (
            <div className="text-xs text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}
          <form onSubmit={handleSearch} className="space-y-3">
            <Input
              placeholder="Enter Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="h-14"
            />
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="submit" 
                disabled={isSearching}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white rounded-2xl h-14 font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                <span>Fetch</span>
              </button>
              <button 
                type="button"
                onClick={() => setIsScanning(true)}
                className="flex items-center justify-center space-x-2 bg-slate-100 text-slate-900 rounded-2xl h-14 font-bold hover:bg-slate-200 active:scale-95 transition-all"
              >
                <ScanLine size={20} className="text-blue-600" />
                <span>Scan</span>
              </button>
            </div>
          </form>
        </Card>

        {isScanning && (
          <QRScanner 
            onScan={handleSearch} 
            onClose={() => setIsScanning(false)} 
          />
        )}

        {/* Recent Activity (UI Only for now) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Recent Patients</h3>
            <button className="text-sm text-blue-600 font-medium">Clear All</button>
          </div>

          <div className="space-y-3">
            <Card className="p-4 flex items-center justify-between opacity-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <UserCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium">History is empty</p>
                  <p className="text-xs text-slate-400">Scan a QR to get started</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Safety Tip */}
        <Card className="bg-blue-50 border-none p-4 flex items-start space-x-3 text-blue-800">
          <ShieldAlert size={20} className="shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed font-medium">
            Medical data is strictly confidential. You only have access to records that patients have actively shared with you.
          </p>
        </Card>
      </div>
    </PageTransition>
  );
};
