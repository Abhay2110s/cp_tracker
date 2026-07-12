import React from 'react';
import Header from './Header';
import ProfileSection from './ProfileSection';
import SolvedCard from './SolvedCard';
import ContestList from './ContestList';
import SubmissionsTable from './SubmissionsTable';

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-[#0f1319] text-gray-100 p-6 font-sans antialiased">
      {/* Dynamic App Header */}
      <Header user={user} onLogout={onLogout} />
      
      {/* Modern 3-Column Workspace Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Left: Profile Metrics Card */}
        <div className="lg:col-span-2">
          <ProfileSection initialHandle={user.cfHandle} />
        </div>
        
        {/* Main Right: Solved Progress Card */}
        <div className="lg:col-span-1">
          <SolvedCard />
        </div>
        
        {/* Lower Left: Upcoming Events */}
        <div className="lg:col-span-1">
          <ContestList />
        </div>
        
        {/* Lower Right: Submission Status Table */}
        <div className="lg:col-span-2">
          <SubmissionsTable />
        </div>
        
      </main>
    </div>
  );
}