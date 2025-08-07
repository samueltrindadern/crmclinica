import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { Dashboard } from './components/Dashboard';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showForgotPassword) {
      return (
        <ForgotPasswordForm 
          onBackToLogin={() => setShowForgotPassword(false)} 
        />
      );
    }
    
    return (
      <LoginForm 
        onForgotPassword={() => setShowForgotPassword(true)} 
      />
    );
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;