import React, { useState, useEffect, useRef } from 'react';
import { Award, Calendar, Layers, User, RefreshCw, Eye, Edit3, X } from 'lucide-react';

export default function ProfileSection({ user }) {
  const [stats, setStats] = useState({
    leetcode: 0,
    codeforces: 0,
    gfg: 0,
    loading: true
  });
  
  // State for the click-based interaction menu and viewing states
  const [showMenu, setShowMenu] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const menuRef = useRef(null);

  const activeDaysBaseline = 12; 

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

    let activeFetches = 0;
    const currentStats = { leetcode: 0, codeforces: 0, gfg: 0 };

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

    if (activeFetches === 0) {
      setStats({ leetcode: 0, codeforces: 0, gfg: 0, loading: false });
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [user.leetcodeUrl, user.codeforcesUrl, user.gfgUrl]);

  // Close the popup menu if clicking outside of the image area
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
  const totalSolved = stats.leetcode + stats.codeforces + stats.gfg;

  const scrollToSettings = () => {
    setShowMenu(false);
    // Smooth scroll down to the customization synchronization dashboard panel
    const settingsPanel = document.querySelector('form');
    if (settingsPanel) {
      settingsPanel.scrollIntoView({ behavior: 'smooth' });
      // Brief visual indicator or focus could go here
    }
  };

  return (
    <div className="bg-[#141922] border border-gray-800/60 rounded-xl p-6 shadow-xl h-full flex flex-col justify-between relative min-h-[280px]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
      
      <div>
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider font-mono">Developer Dashboard Profile</h3>
          </div>
          <button onClick={fetchMetrics} className="text-gray-500 hover:text-white transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Interactive Image Dropdown Target */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="group relative block rounded-2xl border border-gray-800 focus:outline-none transition-transform active:scale-98 overflow-hidden"
              title="Profile Actions"
            >
              <img 
                src={avatarSrc} 
                alt="Developer Avatar" 
                className="w-28 h-28 object-cover shadow-md bg-[#161b22] group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-medium text-white">
                Manage
              </div>
            </button>
            <div className="absolute -bottom-1 -right-1 bg-cyan-600 border border-[#141922] p-1.5 rounded-lg text-white pointer-events-none">
              <Layers className="w-3.5 h-3.5" />
            </div>

            {/* Action Popup Popover Context Menu */}
            {showMenu && (
              <div className="absolute left-0 mt-2 w-44 bg-[#1c2331] border border-gray-800 rounded-lg shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-100">
                <button
                  onClick={() => { setShowMenu(false); setShowViewModal(true); }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:bg-gray-800 flex items-center gap-2 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  View Image
                </button>
                <button
                  onClick={scrollToSettings}
                  className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:bg-gray-800 flex items-center gap-2 transition-colors border-t border-gray-800/60"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                  Change Avatar
                </button>
              </div>
            )}
          </div>

          {/* Profile Name and Info Text */}
          <div className="flex-1 text-center sm:text-left space-y-2 pt-2">
            <h2 className="text-2xl font-bold tracking-wide text-white">{user.name || 'Developer'}</h2>
            <p className="text-xs font-mono text-gray-400">Sync status operational</p>
            <div className="flex flex-wrap gap-1.5 pt-1 justify-center sm:justify-start">
              {user.leetcodeUrl && <span className="text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/10 font-mono">LeetCode</span>}
              {user.codeforcesUrl && <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/10 font-mono">Codeforces</span>}
              {user.gfgUrl && <span className="text-[9px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/10 font-mono">GFG</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Display Row */}
      <div className="mt-6 pt-4 border-t border-gray-800/40 grid grid-cols-2 gap-4">
        <div className="bg-[#161b22] border border-gray-800/50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-gray-400">Total Solved</span>
          </div>
          <span className="text-xl font-bold font-mono text-white">
            {stats.loading ? <span className="text-xs text-gray-600 animate-pulse">...</span> : totalSolved}
          </span>
        </div>

        <div className="bg-[#161b22] border border-gray-800/50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-gray-400">Days Active</span>
          </div>
          <span className="text-xl font-bold font-mono text-white">{activeDaysBaseline} Days</span>
        </div>
      </div>

      {/* Lightbox / View Image Modal Overlay */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="relative max-w-md w-full bg-[#141922] border border-gray-800 rounded-2xl p-4 shadow-2xl">
            <button 
              onClick={() => setShowViewModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white bg-gray-800/40 p-1.5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-xs font-mono text-gray-400 mb-3 pb-2 border-b border-gray-800">Profile Image Preview</div>
            <img 
              src={avatarSrc} 
              alt="Full Avatar View" 
              className="w-full h-auto max-h-[70vh] rounded-xl object-contain bg-[#161b22] border border-gray-800/50 shadow-inner"
            />
          </div>
        </div>
      )}
    </div>
  );
}