import React, { useState } from 'react';
import Dashboard from './Dashboard';
export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      
      {/* Dashboard View */}
      {currentView === 'dashboard' && (
        <Dashboard onNavigate={setCurrentView} />
      )}

      {/* Welcome / Log Out Gateway */}
      {currentView === 'welcome' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950">
          <div className="max-w-md w-full border border-emerald-900 bg-emerald-950/10 p-8 rounded-3xl shadow-2xl text-center">
            <h1 className="text-4xl font-black text-emerald-400 mb-3 tracking-widest">CP TRACKER</h1>
            <p className="text-emerald-100/50 mb-8 text-sm">Session ended securely.</p>
            
            <button 
              onClick={() => setCurrentView('dashboard')} 
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Launch Dashboard
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}