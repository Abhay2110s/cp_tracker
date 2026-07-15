import React from 'react';
import { Code2, Terminal, Cpu, Target, BookOpenText, LayoutGrid } from 'lucide-react'; // Added LayoutGrid

export default function PlatformLinks({ onSelect, active }) {
  const platforms = [
    { name: 'All' }, { name: 'LeetCode' }, { name: 'CodeChef' }, 
    { name: 'Codeforces' }, { name: 'HackerRank' }, { name: 'GFG' }
  ];

  return (
    <div className="flex flex-col gap-3">
      {platforms.map((p) => (
        <button
          key={p.name}
          onClick={() => onSelect(p.name)}
          className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
            active === p.name ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-emerald-100'
          }`}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}