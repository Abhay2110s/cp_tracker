import React from 'react';
import { Code2, LogOut } from 'lucide-react';

export default function Header({ user, onLogout }) {
  return (
    <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-800/80 pb-5">
      
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-cyan-900/30">
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">CP Tracker Dashboard</h1>
          <nav className="flex gap-4 mt-0.5 text-xs font-medium text-gray-400">
            <span className="text-cyan-400 font-semibold border-b border-cyan-400 pb-0.5 cursor-pointer">Dashboard</span>
            <span className="hover:text-gray-200 cursor-pointer transition-colors">Problems</span>
            <span className="hover:text-gray-200 cursor-pointer transition-colors">Contests</span>
          </nav>
        </div>
      </div>

      {/* User Information & Session Termination */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-gray-200">{user?.name || 'Developer User'}</p>
          <p className="text-[10px] text-gray-500 font-mono">CF: {user?.cfHandle}</p>
        </div>
        
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs px-3.5 py-1.5 rounded-lg transition-all font-medium cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>

    </header>
  );
}