import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  FileText, 
  ExternalLink, 
  Calendar,
  ShieldAlert,
  Droplets,
  Loader2
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PageTransition } from '../components/PageTransition';
import { UserProfile, MedicalRecord, RecordType } from '../types';
import { db, getDoc, getDocs, query, where } from '../services/firebaseSimulator';
import { TimelineList } from '../components/TimelineList';

export const DoctorPatientView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<UserProfile | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const docRef = db.doc(db.collection('users'), id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const foundPatient = docSnap.data() as UserProfile;
          if (foundPatient.sharingEnabled) {
            setPatient(foundPatient);
            const q = query(db.collection('records'), where('patientId', '==', id));
            const querySnapshot = await getDocs(q);
            const foundRecords = querySnapshot.docs.map(d => d.data() as MedicalRecord);
            setRecords(foundRecords);
          } else {
            setAccessDenied(true);
          }
        } else {
          setAccessDenied(true);
        }
      } catch (error) {
        console.error('Fetch patient failed', error);
        setAccessDenied(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleView = (url: string) => {
    window.open(url, '_blank');
  };

  if (accessDenied) {
    return (
      <PageTransition>
        <div className="flex-1 p-6 pt-24 max-w-lg mx-auto text-center space-y-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
            <ShieldAlert size={48} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
            <p className="text-slate-500">
              The patient has disabled records sharing or the ID is invalid. Please ask the patient to toggle "Medical Sharing" ON in their dashboard.
            </p>
          </div>
          <Button className="w-full" onClick={() => navigate('/doctor/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex-1 p-6 space-y-6 pt-24 pb-12 max-w-2xl mx-auto">
        {/* Patient Profile Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-200">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative flex items-center space-x-4">
            <button className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all mr-2" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <User size={32} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold tracking-tight">{patient?.name}</h2>
              <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium mt-1">
                <span>{patient?.age} yrs</span>
                <span>•</span>
                <span className="capitalize">{patient?.gender}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 relative z-10">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Blood</p>
              <p className="text-lg font-bold">{patient?.bloodGroup || 'N/A'}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Weight</p>
              <p className="text-lg font-bold">{(patient as any)?.weight || '--'} <span className="text-xs font-normal text-slate-400">kg</span></p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Height</p>
              <p className="text-lg font-bold">{(patient as any)?.height || '--'} <span className="text-xs font-normal text-slate-400">cm</span></p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 ml-1 leading-none mb-1">Medical Record Timeline</h3>
          <TimelineList records={records} onView={handleView} />
        </div>
      </div>
    </PageTransition>
  );
};
