import React, { useState, useEffect, useRef } from 'react';
import { Award, Calendar, User, RefreshCw, Eye, Edit3, X, Sun, Moon } from 'lucide-react';

export default function ProfileSection({ user }) {
  const [stats, setStats] = useState({
    leetcode: 0,
    codeforces: 0,
    gfg: 0,
    hackerrank: 0,
    loading: true
  });
  
  const [showMenu, setShowMenu] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const menuRef = useRef(null);

  // 1. Core metric configuration baselines
  const activeDaysBaseline = 12; 
  const totalDaysGoal = 30; 

  const extractUsername = (url) => {
    if (!url) return '';
    const cleanUrl = url.trim().replace(/\/$/, "");
    return cleanUrl.split('/').pop();
  };

  const fetchMetrics = async () => {
    setStats(p => ({ ...p, loading: true }));
    const lcUser = extractUsername(user.leetcodeUrl);
    const cfUser = extractUsername(user.codeforcesUrl);
    const gfgUser = extractUsername(user.gfgUrl);
    const hrUser = extractUsername(user.hackerrankUrl);

    let activeFetches = 0;
    const currentStats = { leetcode: 0, codeforces: 0, gfg: 0, hackerrank: 0 };

    const checkCompletion = () => {
      activeFetches--;
      if (activeFetches <= 0) {
        setStats({ ...currentStats, loading: false });
      }
    };

    if (lcUser) {
      activeFetches++;
      fetch(`https://leetcode-api-faisalshohag.vercel.app/${lcUser}`)
        .then(res => res.json())
        .then(data => { currentStats.leetcode = data.totalSolved || 0; })
        .catch(() => {})
        .finally(() => checkCompletion());
    }

    if (cfUser) {
      activeFetches++;
      fetch(`https://codeforces.com/api/user.status?handle=${cfUser}&from=1&count=500`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'OK') {
            const uniques = new Set(data.result.filter(s => s.verdict === 'OK').map(s => `${s.problem.contestId}-${s.problem.index}`));
            currentStats.codeforces = uniques.size;
          }
        })
        .catch(() => {})
        .finally(() => checkCompletion());
    }

    if (gfgUser) {
      activeFetches++;
      fetch(`https://geeks-for-geeks-stats-api.vercel.app/?raw=y&userName=${gfgUser}`)
        .then(res => res.json())
        .then(data => { currentStats.gfg = data.totalProblemsSolved || 0; })
        .catch(() => {})
        .finally(() => checkCompletion());
    }

    if (hrUser) {
      activeFetches++;
      fetch(`https://hackerrank-api.vercel.app/api/username/${hrUser}`)
        .then(res => res.json())
        .then(data => { currentStats.hackerrank = data.solvedChallenges || data.total_solved || 0; })
        .catch(() => {})
        .finally(() => checkCompletion());
    }

    if (activeFetches === 0) {
      setStats({ leetcode: 0, codeforces: 0, gfg: 0, hackerrank: 0, loading: false });
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [user.leetcodeUrl, user.codeforcesUrl, user.gfgUrl, user.hackerrankUrl]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
  const avatarSrc = user.avatarUrl || defaultAvatar;
  
  // 2. Pure Competitive Programming Metric Aggregator
  const totalSolved = stats.leetcode + stats.codeforces + stats.gfg + stats.hackerrank;

  // 3. SVG Donut Math Engine Calculations
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  
  const solvedPercentage = Math.min((totalSolved / 1000) * 100, 100); 
  const solvedOffset = circumference - (solvedPercentage / 100) * circumference;

  const daysPercentage = Math.min((activeDaysBaseline / totalDaysGoal) * 100, 100);
  const daysOffset = circumference - (daysPercentage / 100) * circumference;

  const scrollToSettings = () => {
    setShowMenu(false);
    const settingsPanel = document.querySelector('form');
    if (settingsPanel) {
      settingsPanel.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`w-full transition-colors duration-200 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      
      {/* HEADER NAVBAR LAYER */}
      <div className={`flex items-center justify-between border-b px-6 py-4 mb-6 rounded-xl ${isDarkMode ? 'bg-[#141922] border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider font-bold">Workspace Monitor</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={`p-2 rounded-full border transition-colors ${isDarkMode ? 'border-gray-800 hover:bg-gray-800 text-yellow-400' : 'border-gray-200 hover:bg-gray-100 text-indigo-600'}`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isDarkMode ? 'border-cyan-500/30 bg-cyan-950/20 text-cyan-400' : 'border-indigo-200 bg-indigo-50 text-indigo-600'}`}>
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3-COLUMN METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* CARD 1: PROFILE IDENTIFIER */}
        <div className={`border rounded-3xl p-6 flex flex-col items-center justify-between min-h-[340px] ${isDarkMode ? 'bg-[#141922] border-gray-800/80' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="relative mt-2" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="group relative block rounded-full border-2 border-cyan-500/40 p-1 focus:outline-none transition-transform"
            >
              <img src={avatarSrc} alt="Profile Avatar" className="w-24 h-24 rounded-full object-cover bg-gray-900" />
              <div className="absolute inset-1 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-mono text-white">
                OPTIONS
              </div>
            </button>

            {showMenu && (
              <div className={`absolute left-1/2 -translate-x-1/2 mt-2 w-40 border rounded-lg shadow-2xl py-1 z-50 ${isDarkMode ? 'bg-[#1c2331] border-gray-800' : 'bg-white border-gray-200'}`}>
                <button onClick={() => { setShowMenu(false); setShowViewModal(true); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-cyan-500/10 flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> View Image
                </button>
                <button onClick={scrollToSettings} className="w-full text-left px-3 py-1.5 text-xs hover:bg-cyan-500/10 flex items-center gap-2 border-t border-gray-800/20">
                  <Edit3 className="w-3.5 h-3.5 text-emerald-400" /> Settings
                </button>
              </div>
            )}
          </div>

          <div className={`w-full text-center py-2 px-4 rounded-xl border font-semibold tracking-wide text-sm my-4 ${isDarkMode ? 'bg-[#161b22] border-gray-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`}>
            {user.name || 'Developer'}
          </div>

          <div className={`w-full p-3 rounded-xl text-[11px] font-mono space-y-1.5 flex-1 flex flex-col justify-center ${isDarkMode ? 'bg-[#161b22]/60 border border-gray-800/40 text-gray-400' : 'bg-gray-50/60 border border-gray-200/60 text-gray-500'}`}>
            <div className="flex justify-between"><span>LeetCode:</span><span className={user.leetcodeUrl ? "text-emerald-400" : "text-gray-600"}>{user.leetcodeUrl ? "Connected" : "None"}</span></div>
            <div className="flex justify-between"><span>Codeforces:</span><span className={user.codeforcesUrl ? "text-emerald-400" : "text-gray-600"}>{user.codeforcesUrl ? "Connected" : "None"}</span></div>
            <div className="flex justify-between"><span>HackerRank:</span><span className={user.hackerrankUrl ? "text-emerald-400" : "text-gray-600"}>{user.hackerrankUrl ? "Connected" : "None"}</span></div>
          </div>
        </div>

        {/* CARD 2: TOTAL QUESTIONS DIAGRAM */}
        <div className={`border rounded-3xl p-6 flex flex-col items-center justify-center text-center ${isDarkMode ? 'bg-[#141922] border-gray-800/80' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="text-xs font-mono font-bold uppercase tracking-wider mb-6 opacity-70">Pie Diagram</div>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} className={isDarkMode ? "stroke-gray-800" : "stroke-gray-100"} strokeWidth="10" fill="transparent" />
              <circle 
                cx="50" cy="50" r={radius} stroke="#06b6d4" strokeWidth="10" fill="transparent" 
                strokeDasharray={circumference} strokeDashoffset={stats.loading ? circumference : solvedOffset}
                strokeLinecap="round" className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold font-mono">{stats.loading ? '...' : totalSolved}</span>
              <span className="text-[10px] uppercase font-mono text-gray-500">Solved</span>
            </div>
          </div>
          <div className="text-sm font-semibold tracking-wide mt-6 text-cyan-400 font-mono uppercase">Total Questions</div>
        </div>

        {/* CARD 3: TOTAL DAYS DIAGRAM */}
        <div className={`border rounded-3xl p-6 flex flex-col items-center justify-center text-center ${isDarkMode ? 'bg-[#141922] border-gray-800/80' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="text-xs font-mono font-bold uppercase tracking-wider mb-6 opacity-70">Pie Diagram</div>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} className={isDarkMode ? "stroke-gray-800" : "stroke-gray-100"} strokeWidth="10" fill="transparent" />
              <circle 
                cx="50" cy="50" r={radius} stroke="#10b981" strokeWidth="10" fill="transparent" 
                strokeDasharray={circumference} strokeDashoffset={daysOffset}
                strokeLinecap="round" className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              {/* Correctly bound to your numerical day tracking metric variable */}
              <span className="text-2xl font-bold font-mono">{activeDaysBaseline}</span>
              <span className="text-[10px] uppercase font-mono text-gray-500">/{totalDaysGoal} Days</span>
            </div>
          </div>
          <div className="text-sm font-semibold tracking-wide mt-6 text-emerald-400 font-mono uppercase">Total Days</div>
        </div>

      </div>

      {/* FULL PREVIEW MODAL */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className={`relative max-w-sm w-full border rounded-2xl p-4 shadow-2xl ${isDarkMode ? 'bg-[#141922] border-gray-800' : 'bg-white border-gray-200'}`}>
            <button onClick={() => setShowViewModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white bg-gray-500/10 p-1.5 rounded-lg">
              <X className="w-4 h-4" />
            </button>
            <div className="text-xs font-mono text-gray-400 mb-3 pb-2 border-b border-gray-800">Avatar Image Frame</div>
            <img src={avatarSrc} alt="Full View" className="w-full h-auto rounded-xl object-contain bg-gray-900 border border-gray-800/40" />
          </div>
        </div>
      )}
    </div>
  );
}