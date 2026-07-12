import React, { useState, useEffect } from 'react';
import { BarChart3, Target, RefreshCw } from 'lucide-react';

export default function SolvedCard({ leetcodeUrl, codeforcesUrl, gfgUrl, githubUrl }) {
  const [stats, setStats] = useState({
    leetcode: { solved: 0, total: 2500, loading: false },
    codeforces: { solved: 0, total: 1500, loading: false },
    gfg: { solved: 0, total: 1000, loading: false },
    github: { solved: 0, total: 100, label: 'Public Repos', loading: false }
  });

  const extractUsername = (url) => {
    if (!url) return '';
    const cleanUrl = url.trim().replace(/\/$/, "");
    return cleanUrl.split('/').pop();
  };

  const fetchAllStats = async () => {
    const lcUser = extractUsername(leetcodeUrl);
    const cfUser = extractUsername(codeforcesUrl);
    const gfgUser = extractUsername(gfgUrl);
    const ghUser = extractUsername(githubUrl);

    if (lcUser) {
      setStats(p => ({ ...p, leetcode: { ...p.leetcode, loading: true } }));
      fetch(`https://leetcode-api-faisalshohag.vercel.app/${lcUser}`)
        .then(res => res.json())
        .then(data => setStats(prev => ({
          ...prev,
          leetcode: { solved: data.totalSolved || 0, total: data.totalQuestions || 2500, loading: false }
        })))
        .catch(() => setStats(prev => ({ ...prev, leetcode: { ...prev.leetcode, loading: false } })));
    }

    if (cfUser) {
      setStats(p => ({ ...p, codeforces: { ...p.codeforces, loading: true } }));
      fetch(`https://codeforces.com/api/user.status?handle=${cfUser}&from=1&count=500`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'OK') {
            const uniques = new Set(data.result.filter(s => s.verdict === 'OK').map(s => `${s.problem.contestId}-${s.problem.index}`));
            setStats(prev => ({
              ...prev,
              codeforces: { solved: uniques.size, total: 1500, loading: false }
            }));
          }
        })
        .catch(() => setStats(prev => ({ ...prev, codeforces: { ...prev.codeforces, loading: false } })));
    }

    if (gfgUser) {
      setStats(p => ({ ...p, gfg: { ...p.gfg, loading: true } }));
      fetch(`https://geeks-for-geeks-stats-api.vercel.app/?raw=y&userName=${gfgUser}`)
        .then(res => res.json())
        .then(data => setStats(prev => ({
          ...prev,
          gfg: { solved: data.totalProblemsSolved || 0, total: 1000, loading: false }
        })))
        .catch(() => setStats(prev => ({ ...prev, gfg: { ...prev.gfg, loading: false } })));
    }

    // 4. GitHub profile public repos acquisition
    if (ghUser) {
      setStats(p => ({ ...p, github: { ...p.github, loading: true } }));
      fetch(`https://api.github.com/users/${ghUser}`)
        .then(res => res.json())
        .then(data => setStats(prev => ({
          ...prev,
          github: { solved: data.public_repos || 0, total: Math.max(data.public_repos + 20, 50), label: 'Public Repos', loading: false }
        })))
        .catch(() => setStats(prev => ({ ...prev, github: { ...prev.github, loading: false } })));
    }
  };

  useEffect(() => {
    fetchAllStats();
  }, [leetcodeUrl, codeforcesUrl, gfgUrl, githubUrl]);

  const rows = [
    { label: 'Codeforces', key: 'codeforces', color: 'bg-blue-500 shadow-blue-500/20' },
    { label: 'LeetCode', key: 'leetcode', color: 'bg-amber-500 shadow-amber-500/20' },
    { label: 'GeeksforGeeks', key: 'gfg', color: 'bg-green-500 shadow-green-500/20' },
    { label: 'GitHub Projects', key: 'github', color: 'bg-purple-500 shadow-purple-500/20' }
  ];

  const totalCombined = stats.leetcode.solved + stats.codeforces.solved + stats.gfg.solved;

  return (
    <div className="bg-[#141922] border border-gray-800/60 rounded-xl p-6 shadow-xl h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-white tracking-wide">Metrics Aggregator</h3>
          </div>
          <button onClick={fetchAllStats} className="text-gray-500 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5">
          {rows.map((row, index) => {
            const item = stats[row.key];
            const pct = Math.min(((item.solved / item.total) * 100), 100) || 0;

            return (
              <div key={index} className="space-y-2 group">
                <div className="flex justify-between items-baseline text-sm">
                  <span className="text-gray-300 font-medium group-hover:text-white transition-colors">{row.label}</span>
                  <span className="text-xs font-mono text-gray-400">
                    {item.loading ? (
                      <span className="text-gray-600 animate-pulse text-[11px]">linking...</span>
                    ) : (
                      <>
                        <strong className="text-gray-100 text-sm">{item.solved}</strong>
                        <span className="text-gray-600 px-0.5">/</span>{item.total} {row.key === 'github' && 'Repos'}
                      </>
                    )}
                  </span>
                </div>

                <div className="w-full h-2.5 bg-[#161b22] border border-gray-800/50 rounded-full overflow-hidden p-0.5">
                  <div className={`h-full ${row.color} rounded-full transition-all duration-700 ease-out`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-800/40 flex justify-between text-[11px] text-gray-500 font-medium">
        <span>Coding Platform Solved:</span>
        <span className="text-cyan-400 font-bold font-mono">{totalCombined} Index Count</span>
      </div>
    </div>
  );
}