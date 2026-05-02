import React, { useState, useEffect } from 'react';
import { Bell, Plus, X, CheckCircle, Clock } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { db, getDocs, setDoc, query, where } from '../services/firebaseSimulator';
import { motion, AnimatePresence } from 'motion/react';

interface Reminder {
  id: string;
  patientId: string;
  title: string;
  time: string;
  completed: boolean;
  createdAt: number;
}

export const ReminderSystem: React.FC<{ patientId: string }> = ({ patientId }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    const fetchReminders = async () => {
      const q = query(db.collection('reminders'), where('patientId', '==', patientId));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data() as Reminder);
      setReminders(data.sort((a, b) => b.createdAt - a.createdAt));
    };
    fetchReminders();
  }, [patientId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTime) return;

    const reminderId = Math.random().toString(36).substring(2, 11);
    const newReminder: Reminder = {
      id: reminderId,
      patientId,
      title: newTitle,
      time: newTime,
      completed: false,
      createdAt: Date.now()
    };

    const docRef = db.doc(db.collection('reminders'), reminderId);
    await setDoc(docRef, newReminder);
    
    setReminders([newReminder, ...reminders]);
    setNewTitle('');
    setNewTime('');
    setShowAdd(false);
  };

  const toggleComplete = async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;

    const updated = { ...reminder, completed: !reminder.completed };
    const docRef = db.doc(db.collection('reminders'), id);
    await setDoc(docRef, updated);

    setReminders(reminders.map(r => r.id === id ? updated : r));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 flex items-center">
          <Bell size={18} className="mr-2 text-blue-600" />
          Health Reminders
        </h3>
        <button 
          onClick={() => setShowAdd(true)}
          className="text-blue-600 text-xs font-bold uppercase tracking-wider hover:underline"
        >
          + Add New
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-4 bg-blue-50 border-blue-100 mb-4">
              <form onSubmit={handleAdd} className="space-y-3">
                <Input 
                  placeholder="Drink water, Take medicine..." 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="bg-white"
                />
                <Input 
                  type="datetime-local" 
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="bg-white"
                />
                <div className="flex space-x-2">
                  <Button type="submit" size="sm" className="flex-1">Add</Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {reminders.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6 border-2 border-dashed border-slate-100 rounded-3xl">
            No reminders set yet.
          </p>
        ) : (
          reminders.slice(0, 3).map(reminder => (
            <Card 
              key={reminder.id} 
              className={`p-4 flex items-center justify-between group transition-all ${reminder.completed ? 'opacity-60 grayscale' : ''}`}
              hoverable
            >
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => toggleComplete(reminder.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${reminder.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-transparent'}`}
                >
                  <CheckCircle size={14} />
                </button>
                <div>
                  <p className={`text-sm font-bold ${reminder.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {reminder.title}
                  </p>
                  <div className="flex items-center text-[10px] text-slate-400 font-medium">
                    <Clock size={10} className="mr-1" />
                    {new Date(reminder.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
