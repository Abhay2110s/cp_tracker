import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Coding', value: 90, color: '#f97316' }, // Emerald
  { name: 'Problems', value: 60, color: '#059645' }, // Darker Emerald
  { name: 'System Design', value: 30, color: '#064e8b' }, // Deep Emerald
  { name: 'Learning', value: 20, color: '#0345e7' }, // Muted Emerald
];

export default function DaysStats() {
  const totalDays = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="backdrop-blur-md bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl shadow-2xl">
      <h3 className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">Days Activity</h3>
      
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
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-white">{totalDays}</span>
          </div>
        </div>

        {/* Notations / Legend */}
        <div className="flex flex-col gap-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <div className="flex justify-between w-32 text-[11px] font-medium text-emerald-100">
                <span>{entry.name}</span>
                <span className="text-emerald-400 font-bold">{entry.value} days</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}