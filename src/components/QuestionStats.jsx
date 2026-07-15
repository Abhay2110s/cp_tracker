import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function QuestionStats({ filter }) {
  const allData = [
    { name: 'LeetCode',   value: 120, color: '#f97316' }, // Orange
    { name: 'CodeChef',   value: 80,  color: '#e11d48' }, // Rose
    { name: 'Codeforces', value: 60,  color: '#3b82f6' }, // Blue
    { name: 'HackerRank', value: 40,  color: '#10b981' }, // Emerald
    { name: 'GFG',        value: 50,  color: '#8b5cf6' }, // Violet
  ];

  const displayData = filter === 'All' ? allData : allData.filter(item => item.name === filter);
  const total = displayData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="backdrop-blur-md bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl shadow-2xl">
      <h3 className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">
        Total Solved: {filter}
      </h3>
      
      <div className="flex items-center gap-6">
        {/* Pie Chart */}
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

        {/* Dynamic Notations/Legend */}
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