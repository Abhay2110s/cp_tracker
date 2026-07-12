import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('name, leetcode_url, codeforces_url, gfg_url, github_url')
      .eq('id', userId)
      .single();

    if (data) setProfile(data);
    setLoading(false);
  };

  const handleProfileRefresh = () => {
    if (session) fetchUserProfile(session.user.id);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0f1319] flex items-center justify-center text-cyan-400 font-mono animate-pulse">Securing Cloud Session...</div>;
  }

  return session && profile ? (
    <Dashboard 
      user={{ 
        id: session.user.id,
        name: profile.name, 
        leetcodeUrl: profile.leetcode_url || "",
        codeforcesUrl: profile.codeforces_url || "",
        gfgUrl: profile.gfg_url || "",
        githubUrl: profile.github_url || ""
      }} 
      onLogout={() => supabase.auth.signOut()} 
      onProfileUpdate={handleProfileRefresh}
    />
  ) : (
    <Auth />
  );
}