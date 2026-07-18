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

  // Follow the QuestionStats pattern: always render a pie. When there is no
  // activity (or no verified data), show a neutral empty ring instead of a
  // fully-filled coloured pie.
  const pieData =
    activeRate === 0
      ? [{ name: 'Idle', value: 1, color: '#1f3d34' }]
      : [
          { name: 'Active', value: activeRate, color: '#10b981' },
          { name: 'Idle', value: idleRate, color: '#064e3b' },
        ];

  // Swatch colors reflect actual values; neutral when 0 (matches QuestionStats).
  const NEUTRAL = '#334155';
  const legend = [
    { label: 'Active Days', value: activeDays, color: activeDays > 0 ? '#10b981' : NEUTRAL },
    { label: 'Best Streak', value: bestStreak, color: bestStreak > 0 ? '#059669' : NEUTRAL },
    { label: 'Solved', value: solved, color: solved > 0 ? '#34d399' : NEUTRAL },
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
                data={pieData}
                innerRadius={45}
                outerRadius={60}
                paddingAngle={activeRate === 0 ? 0 : 5}
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
            <span className="text-xl font-black text-white">{activeRate}</span>
          </div>
        </div>

        {/* Legend/Stats */}
        <div className="flex flex-col gap-2">
          {sources.length > 0 ? (
            legend.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-emerald-100 text-[11px]">
                  {item.label}: {item.value}
                </span>
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
