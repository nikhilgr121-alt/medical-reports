import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  ExternalLink, 
  Calendar,
  Filter,
  Plus
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PageTransition } from '../components/PageTransition';
import { useAuth } from '../contexts/AuthContext';
import { MedicalRecord, RecordType } from '../types';
import { db, getDocs, query, where } from '../services/firebaseSimulator';
import { TimelineList } from '../components/TimelineList';

export const PatientTimeline: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = React.useState<MedicalRecord[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRecords = async () => {
      if (user) {
        const q = query(db.collection('records'), where('patientId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => doc.data() as MedicalRecord);
        setRecords(data);
      }
      setLoading(false);
    };
    fetchRecords();
  }, [user]);

  const handleView = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <PageTransition>
      <div className="flex-1 p-6 space-y-6 pt-24 pb-12 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold text-slate-900">Medical Timeline</h1>
          </div>
          <Button size="sm" variant="secondary" onClick={() => navigate('/patient/upload')}>
            <Plus size={18} className="mr-1" />
            New
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20 px-6 space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <FileText size={40} />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-slate-900">No records found</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                You haven't uploaded any medical records to your vault yet.
              </p>
            </div>
            <Button onClick={() => navigate('/patient/upload')}>
              Upload My First Record
            </Button>
          </div>
        ) : (
          <TimelineList records={records} onView={handleView} />
        )}
      </div>
    </PageTransition>
  );
};
