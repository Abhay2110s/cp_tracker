// src/components/QuestionStats.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// src/components/QuestionStats.jsx
export default function QuestionStats({ filter, verifiedPlatforms, data }) {
  
  // 1. Logic: If 'All', show all verified. If specific, show only that one.
  const displayData = data.filter(item => {
    const isVerified = verifiedPlatforms.includes(item.name);
    const matchesFilter = filter === 'All' || item.name === filter;
    return isVerified && matchesFilter;
  });

  // 2. Add an "Empty" state if a specific platform has 0 stats
  if (displayData.length === 0 && filter !== 'All') {
    return (
      <div className="backdrop-blur-md bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl shadow-2xl flex flex-col items-center justify-center h-48">
        <p className="text-emerald-400/50 text-sm italic">No data available for {filter}</p>
      </div>
    );
  }

  const total = displayData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="backdrop-blur-md bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl shadow-2xl">
      <h3 className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">
        {filter === 'All' ? 'Total Solved' : `${filter} Progress`}
      </h3>
      
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={displayData}
                innerRadius={45}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
                cx="50%"
                cy="50%"
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xl font-black text-white">{total}</span>
          </div>
        </div>

        {/* Dynamic Legend */}
        <div className="flex flex-col gap-2">
          {displayData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <div className="flex justify-between w-28 text-[11px] font-medium text-emerald-100">
                <span>{entry.name}</span>
                <span className="text-emerald-400 font-bold">{entry.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}