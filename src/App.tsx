import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from './types';

// Pages
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { PatientUpload } from './pages/PatientUpload';
import { PatientTimeline } from './pages/PatientTimeline';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { DoctorPatientView } from './pages/DoctorPatientView';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={user.role === UserRole.PATIENT ? '/patient/dashboard' : '/doctor/dashboard'} replace />} />
        
        {/* Onboarding */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        } />

        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute allowedRole={UserRole.PATIENT}>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patient/upload" element={
          <ProtectedRoute allowedRole={UserRole.PATIENT}>
            <PatientUpload />
          </ProtectedRoute>
        } />
        <Route path="/patient/timeline" element={
          <ProtectedRoute allowedRole={UserRole.PATIENT}>
            <PatientTimeline />
          </ProtectedRoute>
        } />

        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute allowedRole={UserRole.DOCTOR}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor/patient/:id" element={
          <ProtectedRoute allowedRole={UserRole.DOCTOR}>
            <DoctorPatientView />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AppLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
