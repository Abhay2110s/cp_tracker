import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function DaysStats({ filter, verifiedPlatforms = [] }) {
  // Logic: Calculate activity status for the chart
  const data = [
    { name: 'Active', value: 75, color: '#10b981' }, // Emerald
    { name: 'Idle',   value: 25, color: '#064e3b' }, // Dark Emerald
  ];

  return (
    <div className="backdrop-blur-md bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl shadow-2xl">
      <h3 className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">
        Activity Rate: {filter}
      </h3>

      <div className="flex items-center gap-6">
        {/* Pie Chart */}
        <div className="relative w-32 h-32">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                innerRadius={45}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
                cx="50%"
                cy="50%"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xl font-black text-white">75%</span>
          </div>
        </div>

        {/* Legend/Stats */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-emerald-100 text-[11px]">Active Days: 156</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-900"></div>
            <span className="text-emerald-100 text-[11px]">Best Streak: 45</span>
          </div>
        </div>
      </div>
    </div>
  );
}