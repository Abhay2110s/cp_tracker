import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Bell, Sun, Moon, LayoutGrid, RotateCw, CheckCircle2, ExternalLink, 
  ChevronDown, ChevronUp, MapPin, GraduationCap, Mail, Linkedin, 
  Twitter, Globe, FileText, Info, Flame, Sparkles, Award, Plus, Edit2, Save, Link2
} from 'lucide-react';

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Dropdown Toggles
  const [openProblemStats, setOpenProblemStats] = useState(true);
  const [openDevStats, setOpenDevStats] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);

  // Link Synchronization Input States
  const [lcUrl, setLcUrl] = useState('');
  const [cfUrl, setCfUrl] = useState('');
  const [gfgUrl, setGfgUrl] = useState('');
  const [hrUrl, setHrUrl] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Fixed Metrics Mock Engine (Aggregates with input URLs)
  const activeDaysBaseline = 80;
  const stats = {
    leetcode: 112,
    codeforces: 41,
    gfg: 31,
    hackerrank: 31
  };
  const totalSolved = stats.leetcode + stats.codeforces + stats.gfg + stats.hackerrank;

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
          name: data.name || 'Abhay Singh',
          avatarUrl: data.avatar_url,
          leetcodeUrl: data.leetcode_url,
          codeforcesUrl: data.codeforces_url,
          gfgUrl: data.gfg_url,
          hackerrankUrl: data.hackerrank_url
        });
        
        // Pre-fill fields
        setLcUrl(data.leetcode_url || '');
        setCfUrl(data.codeforces_url || '');
        setGfgUrl(data.gfg_url || '');
        setHrUrl(data.hackerrank_url || '');
      }
    } catch (err) {
      console.error('Error gathering system dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfiles = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');

    const { error } = await supabase
      .from('profiles')
      .update({
        leetcode_url: lcUrl || null,
        codeforces_url: cfUrl || null,
        gfg_url: gfgUrl || null,
        hackerrank_url: hrUrl || null
      })
      .eq('id', userProfile.id);

    setSaving(false);
    if (!error) {
      setStatusMsg('Profile handles successfully synchronized!');
      fetchUserProfile();
      setTimeout(() => setStatusMsg(''), 3000);
    } else {
      setStatusMsg('Error: ' + error.message);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-xs font-mono text-gray-400">
        Syncing system matrix configuration...
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-200 ${isDarkMode ? 'bg-[#0b0f17] text-gray-100' : 'bg-[#f8f9fa] text-gray-800'}`}>
      
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <header className={`sticky top-0 z-40 h-14 border-b px-4 flex items-center justify-between transition-colors ${isDarkMode ? 'bg-[#111622] border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center gap-3">
          <button className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer p-1.5 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800 transition-colors">
            <Bell className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">1</span>
          </div>

          <button className="hidden sm:flex items-center gap-1.5 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-900 transition-all">
            <span>Company Wise Kit</span>
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          </button>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={`p-2 rounded-full transition-colors border ${isDarkMode ? 'border-gray-800 bg-gray-900 text-yellow-400' : 'border-gray-200 bg-gray-50 text-gray-600'}`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="w-8 h-8 rounded-full bg-purple-700 text-white font-bold text-xs flex items-center justify-center border shadow-inner">
            {userProfile?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </header>

      {/* 2. CORE CONTENT TWO-COLUMN GRID */}
      <main className="max-w-[1650px] mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT PROFILE SIDEBAR */}
        <section className="lg:col-span-1 space-y-4">
          <div className={`border rounded-2xl p-5 transition-colors ${isDarkMode ? 'bg-[#111622] border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            
            <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <span>Public Profile</span>
                <button 
                  onClick={() => setPublicProfile(!publicProfile)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${publicProfile ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${publicProfile ? 'left-[16px]' : 'left-0.5'}`} />
                </button>
              </div>
              <button onClick={fetchUserProfile} className="flex items-center gap-1 hover:text-blue-500 transition-colors text-gray-400">
                <span>Refresh Now</span>
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center pb-5 border-b border-gray-100 dark:border-gray-800/60">
              <div className="relative group mb-4">
                <div className="w-28 h-28 rounded-full bg-purple-600 text-white font-semibold text-4xl flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-xl relative select-none">
                  {userProfile?.name?.charAt(0) || 'A'}
                </div>
                <button className="absolute bottom-0 right-1 p-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-md">
                  <Edit2 className="w-3 h-3 text-gray-500" />
                </button>
              </div>

              <h2 className="text-xl font-bold tracking-tight">{userProfile?.name || 'Abhay Singh'}</h2>
              <div className="flex items-center gap-1.5 text-xs font-medium text-blue-500 mt-1">
                <span>@abhay_2110</span>
                <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-white" />
              </div>

              <button className="w-full mt-5 bg-[#f26e11] hover:bg-[#db620d] text-white text-xs font-semibold py-2 px-4 rounded-xl shadow transition-all">
                Get your Codolio Card
              </button>

              <div className="flex items-center justify-center gap-3 mt-5 text-gray-400 dark:text-gray-500">
                <Mail className="w-4 h-4 cursor-pointer hover:text-blue-500" />
                <Linkedin className="w-4 h-4 cursor-pointer hover:text-blue-500" />
                <Twitter className="w-4 h-4 cursor-pointer hover:text-blue-500" />
                <Globe className="w-4 h-4 cursor-pointer hover:text-blue-500" />
                <FileText className="w-4 h-4 cursor-pointer hover:text-blue-500" />
              </div>
            </div>

            <div className="py-4 space-y-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>India</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                <span>Kanpur Institute of Technology</span>
              </div>
            </div>

            {/* Dropdown Lists */}
            <div className="pt-4 space-y-3">
              <div className="space-y-1">
                <button onClick={() => setOpenProblemStats(!openProblemStats)} className="w-full flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider py-1.5">
                  <span>Problem Solving Stats</span>
                  {openProblemStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openProblemStats && (
                  <div className="space-y-2 pl-1 pt-1">
                    {['LeetCode', 'GeeksForGeeks', 'CodeChef', 'HackerRank'].map((platform) => (
                      <div key={platform} className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${platform === 'LeetCode' ? 'bg-orange-500' : platform === 'GeeksForGeeks' ? 'bg-emerald-600' : platform === 'CodeChef' ? 'bg-red-500' : 'bg-cyan-500'}`} />
                          <span>{platform}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1 pt-1">
                <button onClick={() => setOpenDevStats(!openDevStats)} className="w-full flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider py-1.5">
                  <span>Development Stats</span>
                  {openDevStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openDevStats && (
                  <div className="pl-1 pt-1 flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-black dark:bg-white" />
                      <span>GitHub</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* RIGHT METRICS TELEMETRY PANELS */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* MATRIX PLOT TILES */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`border rounded-2xl p-5 relative transition-colors ${isDarkMode ? 'bg-[#111622] border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <Info className="w-3.5 h-3.5 text-gray-400 absolute top-3 right-3" />
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Questions</p>
              <h3 className="text-4xl font-extrabold font-mono mt-3">{totalSolved}</h3>
            </div>

            <div className={`border rounded-2xl p-5 relative transition-colors ${isDarkMode ? 'bg-[#111622] border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <Info className="w-3.5 h-3.5 text-gray-400 absolute top-3 right-3" />
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Active Days</p>
              <h3 className="text-4xl font-extrabold font-mono mt-3">{activeDaysBaseline}</h3>
            </div>

            {/* Simulated Contribution Map Grid */}
            <div className={`border rounded-2xl p-4 md:col-span-2 relative transition-colors ${isDarkMode ? 'bg-[#111622] border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 text-[11px] font-mono text-gray-500 dark:text-gray-400">
                  <span>Submissions <strong className="text-gray-900 dark:text-white">239</strong></span>
                  <span>Max.Streak <strong className="text-gray-900 dark:text-white">35</strong></span>
                  <span>Current <strong className="text-gray-900 dark:text-white">18</strong></span>
                </div>
                <select className={`text-[10px] bg-transparent border rounded px-1 border-gray-300 dark:border-gray-700 ${isDarkMode ? 'text-white' : ''}`}>
                  <option>Current</option>
                </select>
              </div>

              <div className="flex items-end justify-between gap-1 pt-1 overflow-x-auto">
                {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month, i) => (
                  <div key={month} className="flex flex-col items-center gap-1">
                    <div className="grid grid-cols-2 gap-0.5">
                      {Array.from({ length: 12 }).map((_, k) => {
                        const styleIdx = (i === 4 || i === 5) ? Math.floor(Math.random() * 2) + 2 : Math.floor(Math.random() * 2);
                        const colors = ['bg-gray-100 dark:bg-gray-800', 'bg-green-200 dark:bg-green-900/40', 'bg-green-400 dark:bg-green-600', 'bg-green-600 dark:bg-green-400'];
                        return <div key={k} className={`w-2.5 h-2.5 rounded-sm ${colors[styleIdx]}`} />;
                      })}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400 mt-1">{month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LOWER ANALYSIS ARCHITECTURE SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            <div className="lg:col-span-2 space-y-6">
              {/* Pure CSS Hexagonal Awards System */}
              <div className={`border rounded-2xl p-5 transition-colors ${isDarkMode ? 'bg-[#111622] border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-baseline justify-between border-b border-gray-100 dark:border-gray-800/60 pb-3 mb-4">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Awards</h4>
                  <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-400">5</span>
                </div>

                <div className="grid grid-cols-4 gap-4 py-2 justify-items-center">
                  <div className="relative w-12 h-12 bg-orange-100 dark:bg-orange-950/40 border border-orange-300 rotate-45 flex items-center justify-center rounded">
                    <div className="-rotate-45 text-center font-bold text-orange-600 text-[10px]">C ★</div>
                  </div>
                  <div className="relative w-12 h-12 bg-slate-100 dark:bg-slate-800 border border-slate-300 rotate-45 flex items-center justify-center rounded">
                    <div className="-rotate-45 text-center font-bold text-slate-700 dark:text-white text-[9px]">JAVA</div>
                  </div>
                  <div className="relative w-12 h-12 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-400 rotate-45 flex items-center justify-center rounded">
                    <div className="-rotate-45 text-center font-black text-yellow-600 text-[9px]">C++</div>
                  </div>
                  <div className="relative w-12 h-12 bg-emerald-950 border border-emerald-500/40 rounded-full flex items-center justify-center">
                    <div className="text-center text-[8px] font-bold text-emerald-400">50 Days</div>
                  </div>
                </div>
              </div>

              {/* Topic Performance List */}
              <div className={`border rounded-2xl p-5 transition-colors ${isDarkMode ? 'bg-[#111622] border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/60 pb-3 mb-4">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">DSA Topic Analysis</h4>
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                </div>

                <div className="space-y-3 font-mono text-[11px] font-semibold">
                  {[
                    { topic: 'Arrays', count: 80 },
                    { topic: 'String', count: 36 },
                    { topic: 'Two Pointers', count: 35 },
                    { topic: 'HashMap and Set', count: 33 },
                    { topic: 'Linked Lists', count: 30 }
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <span className="w-28 truncate text-gray-400 text-left">{row.topic}</span>
                      <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded relative overflow-hidden">
                        <div className="h-full bg-blue-600 dark:bg-blue-500 transition-all flex items-center justify-end pr-2" style={{ width: `${row.count}%` }}>
                          <span className="text-[9px] text-white font-bold">{row.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CIRCULAR DOMAT TIERS PANEL */}
            <div className="lg:col-span-1 space-y-6">
              <div className={`border rounded-2xl p-5 transition-colors ${isDarkMode ? 'bg-[#111622] border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h4 className="text-sm font-bold text-center uppercase pb-3 border-b border-gray-800 mb-4">Problems Solved</h4>

                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" className={isDarkMode ? 'stroke-gray-800' : 'stroke-gray-100'} strokeWidth="3" />
                        <circle cx="18" cy="18" r="15" fill="none" stroke="#eab308" strokeWidth="3" strokeDasharray="94" strokeDashoffset="40" />
                      </svg>
                      <span className="absolute text-xs font-bold font-mono">31</span>
                    </div>
                    <div className="flex-1 bg-gray-900 p-2 rounded-xl text-center text-xs font-bold text-orange-400">
                      HackerRank: 31
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-800 flex items-center justify-between gap-4">
                    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" className={isDarkMode ? 'stroke-gray-800' : 'stroke-gray-100'} strokeWidth="3" />
                        <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="94" strokeDashoffset="20" />
                      </svg>
                      <span className="absolute text-sm font-bold font-mono">184</span>
                    </div>

                    <div className="flex-1 space-y-1.5 font-mono text-[10px] font-bold">
                      <div className="bg-emerald-950/40 text-emerald-400 p-1 rounded px-2 flex justify-between"><span>Easy</span><span>112</span></div>
                      <div className="bg-amber-950/40 text-amber-500 p-1 rounded px-2 flex justify-between"><span>Medium</span><span>61</span></div>
                      <div className="bg-rose-950/40 text-rose-400 p-1 rounded px-2 flex justify-between"><span>Hard</span><span>11</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 3. PLATFORM INTEGRATION SYNCHRONIZER FORM (Structured at the bottom) */}
          <div className="w-full bg-[#111622] border border-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 border-b border-gray-800/80 pb-3 mb-5">
              <Link2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Synchronize Platform Configurations</h3>
            </div>

            <form onSubmit={handleUpdateProfiles} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[['LeetCode', lcUrl, setLcUrl], ['Codeforces', cfUrl, setCfUrl], ['GeeksforGeeks', gfgUrl, setGfgUrl], ['HackerRank', hrUrl, setHrUrl]].map(([label, val, setVal], i) => (
                  <div key={i}>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1.5">{label} Link</label>
                    <input type="url" value={val} onChange={(e) => setVal(e.target.value)} placeholder={`Profile handle URL`} className="w-full bg-[#0b0f17] text-xs text-gray-200 rounded-xl p-2.5 border border-gray-850 focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-800/40">
                <p className="text-xs font-medium text-emerald-400">{statusMsg}</p>
                <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all">
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : 'Sync Profiles'}
                </button>
              </div>
            </form>
          </div>

        </section>

      </main>
    </div>
  );
}