import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial session metadata state token
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserProfile(session.user.id);
      else setLoading(false);
    });

    // 2. Active listener captures logouts or changes dynamically
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
      .select('name, cf_handle')
      .eq('id', userId)
      .single();

    if (data) setProfile(data);
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0f1319] flex items-center justify-center text-cyan-400 font-mono">Securing Cloud Session...</div>;
  }

  return session && profile ? (
    <Dashboard user={{ name: profile.name, cfHandle: profile.cf_handle }} onLogout={() => supabase.auth.signOut()} />
  ) : (
    <Auth />
  );
}