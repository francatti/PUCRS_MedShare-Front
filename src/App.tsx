import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import Layout from './components/layout/Layout.tsx';

// Auth Pages
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import ForgotPassword from './pages/auth/ForgotPassword.tsx';
import ResetPassword from './pages/auth/ResetPassword.tsx';

// Dashboard Pages  
import Dashboard from './pages/dashboard/Dashboard.tsx';
import Profile from './pages/dashboard/Profile.tsx';
import MedicalInfo from './pages/dashboard/MedicalInfo.tsx';
import EmergencyContacts from './pages/dashboard/EmergencyContacts.tsx';
import PublicLink from './pages/dashboard/PublicLink.tsx';
import Settings from './pages/dashboard/Settings.tsx';

// Public Pages
import { PublicProfile } from './pages/public/PublicProfile.tsx';
import Home from './pages/Home.tsx';
import NotFound from './pages/NotFound.tsx';

// Protected Route Component
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx';

// Toast notifications
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
            {/* Public Profile Access */}
            <Route path="/perfil-publico/:uuid" element={<PublicProfile />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/medical" element={
              <ProtectedRoute>
                <Layout>
                  <MedicalInfo />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/emergency-contacts" element={
              <ProtectedRoute>
                <Layout>
                  <EmergencyContacts />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/public-link" element={
              <ProtectedRoute>
                <Layout>
                  <PublicLink />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* 404 Page */}
            <Route path="/404" element={<NotFound />} />
            
            {/* Catch all route - redirect to 404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App; 