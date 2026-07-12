import React from 'react';
import Header from './Header';
import ProfileSection from './ProfileSection';
import SolvedCard from './SolvedCard';
import ContestList from './ContestList';
import SubmissionsTable from './SubmissionsTable';

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-[#0f1319] text-gray-100 p-6">
      <Header user={user} onLogout={onLogout} />
      
      {/* 3-Column Layout Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileSection initialHandle={user.cfHandle} />
        </div>
        <div>
          <SolvedCard />
        </div>
        <div>
          <ContestList />
        </div>
        <div className="lg:col-span-2">
          <SubmissionsTable />
        </div>
      </main>
    </div>
  );
}