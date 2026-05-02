import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldPlus, User, Search, UserCheck, Loader2, Mail, Lock, Chrome } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PageTransition } from '../components/PageTransition';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    if (!role) return;
    setIsLoading(true);
    setError('');
    try {
      await loginWithGoogle(role);
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role && isSignup) return;
    setIsLoading(true);
    setError('');
    try {
      if (isSignup) {
        await signupWithEmail(email, password, role!);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!role) {
    return (
      <PageTransition>
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], x: [-10, 10, -10] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], x: [10, -10, 10] }}
              transition={{ duration: 12, repeat: Infinity }}
              className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl"
            />
          </div>
          <div className="max-w-md w-full space-y-8 text-center relative z-10">
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-200 mb-4">
                <ShieldPlus className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 font-sans">MedVault</h1>
              <p className="text-slate-500 mt-2">Choose your identity to continue</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Card className="p-0 overflow-hidden" hoverable>
                <button
                  onClick={() => setRole(UserRole.PATIENT)}
                  className="w-full p-6 flex items-center space-x-4 text-left group transition-colors"
                >
                  <div className="bg-blue-50 p-4 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <User className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Patient Portal</h3>
                    <p className="text-sm text-slate-500">Access your records & share with doctors</p>
                  </div>
                </button>
              </Card>

              <Card className="p-0 overflow-hidden" hoverable>
                <button
                  onClick={() => setRole(UserRole.DOCTOR)}
                  className="w-full p-6 flex items-center space-x-4 text-left group transition-colors"
                >
                  <div className="bg-slate-50 p-4 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                    <UserCheck className="w-6 h-6 text-slate-600 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 group-hover:text-slate-900 transition-colors">Doctor Portal</h3>
                    <p className="text-sm text-slate-500">View patient records and history</p>
                  </div>
                </button>
              </Card>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 min-h-screen">
        <Card className="max-w-md w-full p-8 space-y-6">
          <div className="flex items-center space-x-2 mb-2">
            <button 
              onClick={() => setRole(null)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
               <ShieldPlus size={20} className="text-blue-600" />
            </button>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              {role} Portal
            </span>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 transition-all">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-slate-500">
              {isSignup ? 'Join MedVault to secure your records' : 'Login to your medical vault'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100 flex items-center">
              <ShieldPlus size={14} className="mr-2 rotate-45" />
              {error}
            </div>
          )}

          <Button 
            variant="outline" 
            className="w-full h-12 relative overflow-hidden group"
            onClick={handleGoogleLogin}
            isLoading={isLoading}
          >
            <Chrome size={18} className="mr-2 text-blue-600" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">Or continue with mail</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full h-12" isLoading={isLoading}>
              {isSignup ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
};
