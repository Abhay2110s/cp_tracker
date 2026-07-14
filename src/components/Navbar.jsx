import React from 'react';
import { LogOut } from 'lucide-react';

export default function Navbar({ onNavigate }) {
  return (
    <header className="h-16 border-b border-emerald-900 bg-emerald-950 px-6 flex items-center justify-between">
      {/* Brand Name */}
      <div 
        className="font-bold text-emerald-400 tracking-wider cursor-pointer select-none"
        onClick={() => onNavigate('dashboard')}
      >
        CP TRACKER
      </div>
      
      {/* Action Tray */}
      <div className="flex items-center gap-4">


        {/* LOG OUT BUTTON - Red Aesthetic */}
        <button 
          onClick={() => onNavigate('welcome')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-900 bg-emerald-950/50 text-sm font-semibold text-rose-500 hover:bg-rose-950/30 hover:border-rose-900 transition-all active:scale-95"
        >
          <LogOut size={15} />
          <span>Log Out</span>
        </button>
      </div>
    </header>
  );
}