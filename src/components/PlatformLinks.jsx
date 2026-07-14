import React from 'react';
import { Code2, Terminal, Cpu, Target, BookOpenText } from 'lucide-react';

export default function PlatformLinks() {
  const platforms = [
    { name: 'LeetCode', icon: <Code2 size={18} />, color: 'hover:border-orange-500 hover:text-orange-500' },
    { name: 'CodeChef', icon: <Terminal size={18} />, color: 'hover:border-amber-600 hover:text-amber-600' },
    { name: 'Codeforces', icon: <Cpu size={18} />, color: 'hover:border-blue-500 hover:text-blue-500' },
    { name: 'HackerRank', icon: <Target size={18} />, color: 'hover:border-emerald-500 hover:text-emerald-500' },
    { name: 'GFG', icon: <BookOpenText size={18} />, color: 'hover:border-green-600 hover:text-green-600' },
  ];

  const handlePlatformClick = (name) => {
    console.log(`Clicked on: ${name}`);
    // Add your custom logic here (e.g., opening a modal, navigating)
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-emerald-400 font-bold text-xs mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
        Platforms
      </h3>
      
      {platforms.map((p) => (
        <button
          key={p.name}
          onClick={() => handlePlatformClick(p.name)}
          className={`flex items-center gap-3 w-full px-4 py-3 bg-slate-900 border border-emerald-900/30 rounded-xl text-emerald-100 text-sm font-semibold transition-all duration-300 group ${p.color}`}
        >
          <span className="opacity-70 group-hover:opacity-100">{p.icon}</span>
          {p.name}
        </button>
      ))}
    </div>
  );
}