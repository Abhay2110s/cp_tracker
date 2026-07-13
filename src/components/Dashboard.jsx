import React from 'react';
import Navbar from './Navbar';

export default function Dashboard({ onNavigate }) {
  return (
    <div>
      <Navbar onNavigate={onNavigate} />
      
      <main className="max-w-7xl mx-auto p-8">
        <div className="border border-emerald-900 bg-emerald-950/30 p-6 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold text-emerald-400 mb-2">Welcome Back, Abhay</h1>
          <p className="text-emerald-100/60">Ready to crush some LeetCode problems today?</p>
        </div>
      </main>
    </div>
  );
}