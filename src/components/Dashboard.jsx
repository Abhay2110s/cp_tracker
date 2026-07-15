import React, { useState } from 'react';
import Navbar from './Navbar';
import PlatformLinks from './PlatformLinks';
import QuestionStats from './QuestionStats';
import DaysStats from './DaysStats';
import SubmissionHeatmap from './SubmissionHeatmap';
import AwardsSection from './AwardsSections'; // Ensure this file exists

export default function Dashboard({ onNavigate }) {
  const [selectedPlatform, setSelectedPlatform] = useState('All');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar onNavigate={onNavigate} />
      
      <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Workspace Column */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <QuestionStats filter={selectedPlatform} />
            <DaysStats filter={selectedPlatform} />
          </div>

          {/* Awards Section */}
          <AwardsSection filter={selectedPlatform} />

          {/* Submission Heatmap */}
          <SubmissionHeatmap filter={selectedPlatform} />
          
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1">
          <div className="backdrop-blur-md bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl shadow-2xl">
            <PlatformLinks onSelect={setSelectedPlatform} />
          </div>
        </div>

      </main>
    </div>
  );
}