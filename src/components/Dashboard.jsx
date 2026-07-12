import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProfileSection from './ProfileSection';
import LinkSettings from './LinkSettings';

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, leetcode_url, codeforces_url, gfg_url, hackerrank_url')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setUserProfile({
          id: data.id,
          name: data.name,
          avatarUrl: data.avatar_url,
          leetcodeUrl: data.leetcode_url,
          codeforcesUrl: data.codeforces_url,
          gfgUrl: data.gfg_url,
          hackerrankUrl: data.hackerrank_url
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-xs font-mono text-gray-400">
        Loading dashboard infrastructure...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {userProfile && (
          <div className="flex flex-col gap-8">
            
            {/* TOP LAYER: Profile Header & 3-Column Diagrams */}
            <div className="w-full">
              <ProfileSection user={userProfile} />
            </div>
            
            {/* BOTTOM LAYER: Settings & Platform Configuration */}
            <div className="w-full border-t border-gray-800/60 pt-8">
              <div className="max-w-3xl mx-auto">
                <LinkSettings user={userProfile} onUpdateSuccess={fetchUserProfile} />
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}