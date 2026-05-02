import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  History, 
  Upload, 
  User, 
  MessageCircle, 
  Settings,
  LogOut,
  Sparkles,
  QrCode,
  ScanLine
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { HealthuChat } from './HealthuChat';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (!user) return <>{children}</>;

  const isPatient = user.role === 'patient';
  const isDoctor = user.role === 'doctor';

  const navItems = isPatient ? [
    { icon: Home, label: 'Home', path: '/patient/dashboard' },
    { icon: History, label: 'History', path: '/patient/timeline' },
    { icon: Upload, label: 'Upload', path: '/patient/upload' },
    { icon: User, label: 'Profile', path: '/onboarding' }
  ] : [
    { icon: Home, label: 'Home', path: '/doctor/dashboard' },
    { icon: User, label: 'Profile', path: '/onboarding' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 lg:pb-0 lg:pl-64">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex-col p-6 z-40">
        <div className="flex items-center space-x-3 mb-10">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
            <QrCode className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 font-sans tracking-tight">MedVault</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-50' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 pt-6 border-t border-slate-100">
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-blue-600 hover:bg-blue-50 transition-all font-medium text-sm"
          >
            <Sparkles size={20} />
            <span>Healthu AI</span>
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium text-sm"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-16 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex items-center justify-around px-2 z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center space-y-1 px-4 py-2 rounded-xl transition-all
              ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Floating Chat Button for Mobile */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatOpen(true)}
        className="lg:hidden fixed bottom-28 right-6 w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center z-50"
      >
        <Sparkles size={28} />
      </motion.button>

      {/* Chat Bot */}
      <HealthuChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};
