import React, { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import SignIn from './components/SignIn';
import Registration from './components/Registration';

export default function App() {
  // Navigation states: 'welcome' | 'login' | 'register' | 'dashboard'
  const [currentView, setCurrentView] = useState('welcome'); 

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. Landing Welcome Interface */}
      {currentView === 'welcome' && (
        <WelcomePage onNavigate={setCurrentView} />
      )}
      
      {/* 2. Distinct Login Portal with Email/Phone switch */}
      {currentView === 'login' && (
        <SignIn onNavigate={setCurrentView} />
      )}

      {/* 3. Distinct Full Profile Parameter Form */}
      {currentView === 'register' && (
        <Registration onNavigate={setCurrentView} />
      )}

      {/* 4. Secure Main Application Dashboard */}
      {currentView === 'dashboard' && (
        <div className="min-h-screen text-slate-800 flex items-center justify-center font-sans bg-emerald-50">
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
            <h1 className="text-xl font-bold text-slate-900 mb-2">Secure Gateway Active</h1>
            <p className="text-sm text-slate-500">Welcome to your smart medical planning core module dashboard.</p>
          </div>
        </div>
      )}
      
    </div>
  );
}