// src/components/QuestionStats.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function QuestionStats({ filter, verifiedPlatforms, data }) {
  // 1. Logic: If 'All', show all verified. If specific, show only that one.
  const displayData = data.filter((item) => {
    const isVerified = verifiedPlatforms.includes(item.name);
    const matchesFilter = filter === 'All' || item.name === filter;
    return isVerified && matchesFilter;
  });

  const total = displayData.reduce((acc, curr) => acc + curr.value, 0);

  // When no data is available, render a neutral empty ring (matching the
  // DaysStats pattern) instead of bailing out with only text and no pie.
  const pieData =
    displayData.length > 0
      ? displayData
      : [{ name: 'None', value: 1, color: '#1f3d34' }];

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
                data={pieData}
                innerRadius={45}
                outerRadius={60}
                paddingAngle={displayData.length > 0 ? 5 : 0}
                dataKey="value"
                cx="50%"
                cy="50%"
              >
                {pieData.map((entry, index) => (
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
          {displayData.length > 0 ? (
            displayData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <div className="flex justify-between w-28 text-[11px] font-medium text-emerald-100">
                  <span>{entry.name}</span>
                  <span className="text-emerald-400 font-bold">{entry.value}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-emerald-400/50 text-[11px] italic">
              No data available for {filter}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
