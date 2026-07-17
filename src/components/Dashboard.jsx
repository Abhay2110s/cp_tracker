import React, { useState } from 'react';
import Navbar from './Navbar';
import QuestionStats from './QuestionStats';
import DaysStats from './DaysStats';
import AwardsSection from './AwardsSection';
import SubmissionHeatmap from './SubmissionHeatmap';
import PlatformConnections from './PlatformConnections';
import { ALL_STATS_DATA } from '../constants';

export default function Dashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [connections, setConnections] = useState({
    LeetCode: { verified: false },
    CodeChef: { verified: false },
    Codeforces: { verified: false },
    HackerRank: { verified: false },
    GFG: { verified: false }
  });

  const getVerifiedPlatforms = () => 
    Object.keys(connections).filter(key => connections[key].verified);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <QuestionStats 
              filter={selectedPlatform} 
              verifiedPlatforms={getVerifiedPlatforms()} 
              data={ALL_STATS_DATA} 
            />
            <DaysStats 
              filter={selectedPlatform} 
              verifiedPlatforms={getVerifiedPlatforms()} 
            />
          </div>
          <AwardsSection filter={selectedPlatform} />
          <SubmissionHeatmap filter={selectedPlatform} />
        </div>
        <div className="lg:col-span-1">
          <PlatformConnections connections={connections} setConnections={setConnections} />
        </div>
      </main>
    </div>
  );
}