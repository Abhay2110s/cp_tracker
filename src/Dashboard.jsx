import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import QuestionStats from './components/QuestionStats';
import DaysStats from './components/DaysStats';
import AwardsSection from './components/AwardsSection';
import SubmissionHeatmap from './components/SubmissionHeatMap';
import PlatformConnections from './components/PlatformConnections';
import ProfileCard from './components/ProfileCard';
import { supabase } from './supabaseClient';
import { fetchAllPlatforms, getPlatformColor } from './platforms';

export default function Dashboard({ onNavigate }) {
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [user, setUser] = useState(null);

  // Load logged-in user from Supabase session
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });
  }, []);

  // State for connections (none verified until the user connects & validates)
  const [connections, setConnections] = useState({
    LeetCode: { name: '', verified: false },
    CodeChef: { name: '', verified: false },
    Codeforces: { name: '', verified: false },
    HackerRank: { name: '', verified: false },
    GFG: { name: '', verified: false },
  });

  const [platformData, setPlatformData] = useState({});
  const [loading, setLoading] = useState(true);

  // Derived verified list for components
  const verifiedPlatforms = Object.keys(connections).filter(
    (key) => connections[key].verified
  );

  // Fetch live data whenever a verified connection changes
  useEffect(() => {
    let cancelled = false;
    const verifiedConnections = Object.fromEntries(
      Object.entries(connections).filter(([, c]) => c.verified && c.name)
    );
    Promise.resolve(
      Object.keys(verifiedConnections).length === 0
        ? {}
        : fetchAllPlatforms(verifiedConnections)
    ).then((data) => {
      if (cancelled) return;
      setPlatformData(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [connections]);

  // Build the stats dataset consumed by QuestionStats/DaysStats
  const statsData = useMemo(() => {
    return verifiedPlatforms
      .filter((p) => platformData[p])
      .map((p) => ({
        name: p,
        value: platformData[p].solved || 0,
        color: getPlatformColor(p),
      }));
  }, [verifiedPlatforms, platformData]);

  // Combined activity for the selected platform(s)
  const activityForFilter = useMemo(() => {
    const platforms =
      selectedPlatform === 'All'
        ? verifiedPlatforms
        : [selectedPlatform];
    const relevant = platforms
      .map((p) => platformData[p])
      .filter((d) => d && Array.isArray(d.activity) && d.activity.length > 0);
    if (relevant.length === 0) return [];
    // Merge day-by-day counts across platforms
    const base = relevant[0].activity.map((a) => ({
      date: a.date,
      count: 0,
    }));
    for (const p of relevant) {
      for (let i = 0; i < base.length; i++) {
        base[i].count += p.activity[i]?.count || 0;
      }
    }
    return base;
  }, [selectedPlatform, verifiedPlatforms, platformData]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      <Navbar onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* ================================================================= */}
        {/* SIDEBAR — Connections & Achievements                            */}
        {/* ================================================================= */}
        <aside className="w-full lg:w-80 lg:shrink-0 border-b lg:border-b-0 lg:border-r border-emerald-900/50 p-6 space-y-6">
          <ProfileCard
            user={{
              name: user?.user_metadata?.display_name,
              email: user?.email,
            }}
          />
          <PlatformConnections
            connections={connections}
            setConnections={setConnections}
            onSelectPlatform={setSelectedPlatform}
            currentFilter={selectedPlatform}
          />
        </aside>

        {/* ================================================================= */}
        {/* MAIN CONTENT — Header, Stats, Heatmap                           */}
        {/* ================================================================= */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 min-w-0">
          {/* Header */}
          <header className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-black text-emerald-400">Dashboard</h1>
              <p className="text-slate-400 text-sm">
                Welcome back, Abhay.
                {selectedPlatform !== 'All' && (
                  <span className="ml-2 text-emerald-500">
                    Viewing: {selectedPlatform}
                  </span>
                )}
              </p>
            </div>
            {loading && (
              <span className="text-xs text-emerald-400 animate-pulse">
                Syncing platforms…
              </span>
            )}
          </header>

          {/* Stats Section */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Performance Overview
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <QuestionStats
                filter={selectedPlatform}
                verifiedPlatforms={verifiedPlatforms}
                data={statsData}
              />
              <DaysStats
                filter={selectedPlatform}
                verifiedPlatforms={verifiedPlatforms}
                platformData={platformData}
              />
            </div>
          </section>

          {/* Achievements Section */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Awards & Achievements
            </h2>
            <AwardsSection
              filter={selectedPlatform}
              platformData={platformData}
              connections={connections}
            />
          </section>

          {/* Activity Section */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Submission Activity
            </h2>
            <div className="w-full overflow-hidden">
              <SubmissionHeatmap
                filter={selectedPlatform}
                activity={activityForFilter}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
