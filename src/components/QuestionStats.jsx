// src/components/QuestionStats.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function QuestionStats({ filter, verifiedPlatforms, data }) {
  const displayData = data.filter(item => {
    const isVerified = verifiedPlatforms.includes(item.name);
    const matchesFilter = filter === 'All' || item.name === filter;
    return isVerified && matchesFilter;
  });

  const total = displayData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="backdrop-blur-md bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl shadow-2xl">
      <h3 className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">
        Total Solved: {filter}
      </h3>
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={displayData} innerRadius={45} outerRadius={60} paddingAngle={5} dataKey="value">
                {displayData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xl font-black text-white">{total}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {displayData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-emerald-100 text-[11px]">{entry.name}: {entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}