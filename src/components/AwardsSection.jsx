import React, { useState } from 'react';
import { Trophy, Award } from 'lucide-react';

export default function AwardsSection({ filter, platformData = {}, connections = {} }) {
  // Derive awards from real fetched platform data
  const verified = Object.keys(connections).filter(
    (p) => connections[p]?.verified && connections[p]?.name
  );

  const allAwards = verified
    .filter((p) => platformData[p])
    .flatMap((p) => {
      const stats = platformData[p];
      const solved = stats.solved || 0;
      const awards = [];
      if (solved >= 500) awards.push({ platform: p, title: '500+ Problems Solved', year: '' });
      else if (solved >= 250) awards.push({ platform: p, title: '250+ Problems Solved', year: '' });
      else if (solved >= 100) awards.push({ platform: p, title: '100+ Problems Solved', year: '' });
      else if (solved > 0) awards.push({ platform: p, title: `${solved} Problems Solved`, year: '' });
      if (stats.activeDays >= 100)
        awards.push({ platform: p, title: '100 Active Days', year: '' });
      return awards;
    });

  const [visible, setVisible] = useState(5);

  const filteredAwards =
    filter === 'All' ? allAwards : allAwards.filter((a) => a.platform === filter);

  return (
    <div className="backdrop-blur-md bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl shadow-2xl">
      <h3 className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
        <Trophy size={16} /> Awards & Achievements
      </h3>

      {filteredAwards.length === 0 ? (
        <p className="text-emerald-400/50 text-sm italic">
          No achievements yet. Connect a platform to start tracking.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredAwards.slice(0, visible).map((award, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-emerald-900/20"
            >
              <div className="flex items-center gap-3">
                <Award className="text-emerald-500" size={18} />
                <span className="text-sm font-semibold">{award.title}</span>
              </div>
              <span className="text-[10px] text-emerald-400 uppercase font-bold">
                {award.platform}
              </span>
            </div>
          ))}
        </div>
      )}

      {visible < filteredAwards.length && (
        <button
          onClick={() => setVisible((prev) => prev + 5)}
          className="mt-4 w-full py-2 text-[11px] font-bold text-emerald-400 uppercase hover:bg-emerald-900/30 rounded-lg transition-all"
        >
          Show More
        </button>
      )}
    </div>
  );
}
