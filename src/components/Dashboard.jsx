import React from 'react';
import Header from './Header';
import ProfileSection from './ProfileSection';
import SolvedCard from './SolvedCard';
import ContestList from './ContestList';
import SubmissionsTable from './SubmissionsTable';
import LinkSettings from './LinkSettings';

export default function Dashboard({ user, onLogout, onProfileUpdate }) {
  return (
    <div className="min-h-screen bg-[#0f1319] text-gray-100 p-6 font-sans antialiased">
      <Header user={user} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto">
        {/* URL Inputs + Profile Image input are inside here */}
        <LinkSettings user={user} onUpdateSuccess={onProfileUpdate} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COMPONENT: The newly structured profile card with avatar, total solved, and days active */}
          <div className="lg:col-span-2">
            <ProfileSection user={user} />
          </div>
          
          {/* RIGHT COMPONENT: Keeps the original right-side analytics cards */}
          <div className="lg:col-span-1">
            <SolvedCard 
              leetcodeUrl={user.leetcodeUrl} 
              codeforcesUrl={user.codeforcesUrl} 
              gfgUrl={user.gfgUrl} 
              githubUrl={user.githubUrl}
            />
          </div>
          
          <div className="lg:col-span-1">
            <ContestList />
          </div>
          
          <div className="lg:col-span-2">
            <SubmissionsTable />
          </div>
        </div>
      </main>
    </div>
  );
}