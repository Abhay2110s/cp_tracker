import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function ContestList() {
  // Static timeline data mapped to exactly look like the design blueprint
  const upcomingContests = [
    { name: 'Codeforces Round #900 (Div. 1)', time: '2d 5h 30m', date: 'Dec 19, 2026' },
    { name: 'LeetCode Weekly Contest 420', time: '2d 5h 30m', date: 'Dec 20, 2026' },
    { name: 'AtCoder Beginner Contest 350', time: '2d 5h 30m', date: 'Dec 21, 2026' },
  ];

  return (
    <div className="bg-[#141922] border border-gray-800/60 rounded-xl p-6 shadow-xl h-full flex flex-col">
      <div className="flex items-center gap-2.5 border-b border-gray-800 pb-4 mb-4">
        <Calendar className="w-5 h-5 text-cyan-400" />
        <h3 className="text-base font-semibold text-white tracking-wide">Upcoming Contests</h3>
      </div>

      <div className="space-y-3 grow overflow-y-auto">
        {upcomingContests.map((contest, idx) => (
          <div 
            key={idx} 
            className="flex justify-between items-center p-3 bg-[#181f2a] rounded-lg border border-gray-800/40 hover:border-gray-700/60 transition-colors"
          >
            <div className="max-w-[70%]">
              <h4 className="text-xs font-semibold text-gray-200 truncate">{contest.name}</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">{contest.date}</p>
            </div>
            
            <span className="text-[11px] font-mono font-medium text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-900/30 whitespace-nowrap flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {contest.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}