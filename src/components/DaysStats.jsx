import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function DaysStats({ filter, verifiedPlatforms = [], platformData = {} }) {
  // Pull real activity values from fetched platform data
  const platformsToUse =
    filter === 'All' ? verifiedPlatforms : [filter];

  const sources = platformsToUse.filter((p) => platformData[p]);

  const activeDays = sources.reduce(
    (acc, p) => acc + (platformData[p].activeDays || 0),
    0
  );
  const bestStreak = sources.reduce(
    (acc, p) => acc + (platformData[p].bestStreak || 0),
    0
  );
  const solved = sources.reduce(
    (acc, p) => acc + (platformData[p].solved || 0),
    0
  );

  // Derive an active rate from active days over the last year (365 days)
  const activeRate =
    sources.length > 0 && activeDays > 0
      ? Math.min(100, Math.round((activeDays / 365) * 100))
      : 0;

  const idleRate = 100 - activeRate;

  // At 0% active, render a single full emerald ring instead of a full dark
  // (idle) pie, so the donut stays on-brand and clearly "complete".
  const data =
    activeRate === 0
      ? [{ name: 'Active', value: 1, color: '#10b981' }]
      : [
          { name: 'Active', value: activeRate, color: '#10b981' },
          { name: 'Idle', value: idleRate, color: '#064e3b' },
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
            <span className="text-xl font-black text-white">{activeRate}%</span>
          </div>
        </div>

        {/* Legend/Stats */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-emerald-100 text-[11px]">Active Days: {activeDays}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-900"></div>
            <span className="text-emerald-100 text-[11px]">Best Streak: {bestStreak}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            <span className="text-emerald-100 text-[11px]">Solved: {solved}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
