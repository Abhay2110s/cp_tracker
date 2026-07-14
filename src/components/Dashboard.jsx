import React from 'react';
import Navbar from './Navbar';
import PlatformLinks from './PlatformLinks';
import QuestionStats from './QuestionStats';
import DaysStats from './DaysStats'; // Ensure this is imported
import CalendarStats from './CalendarStats';

export default function Dashboard({ onNavigate }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar onNavigate={onNavigate} />
      
      <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Workspace Column */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <QuestionStats />
            <DaysStats />
          </div>
          <div className="lg:col-span-3">
            <CalendarStats />
          </div>
          
          {/* You can add more workspace content here later */}
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1">
          <div className="backdrop-blur-md bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl shadow-2xl">
            <PlatformLinks />
          </div>
        </div>

      </main>
    </div>
  );
}