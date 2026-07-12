import React from 'react';
import { BarChart3, Target } from 'lucide-react';

export default function SolvedCard() {
  // Configured local object metrics mirroring the visual dashboard mockups perfectly
  const platformMetrics = [
    { platform: 'Codeforces', solved: 589, total: 1000, color: 'bg-blue-500 shadow-blue-500/20' },
    { platform: 'LeetCode', solved: 412, total: 800, color: 'bg-amber-500 shadow-amber-500/20' },
    { platform: 'AtCoder', solved: 225, total: 500, color: 'bg-red-500 shadow-red-500/20' },
  ];

  return (
    <div className="bg-[#141922] border border-gray-800/60 rounded-xl p-6 shadow-xl h-full flex flex-col justify-between">
      <div>
        {/* Module Section Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-white tracking-wide">Platform Solved Count</h3>
          </div>
          <Target className="w-4 h-4 text-gray-500" />
        </div>

        {/* Dynamic Progress Indicator Stack */}
        <div className="space-y-5">
          {platformMetrics.map((item, index) => {
            const completionPercentage = Math.min(((item.solved / item.total) * 100), 100);

            return (
              <div key={index} className="space-y-2 group">
                <div className="flex justify-between items-baseline text-sm">
                  <span className="text-gray-300 font-medium group-hover:text-white transition-colors">
                    {item.platform}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    <strong className="text-gray-100 text-sm">{item.solved}</strong>
                    <span className="text-gray-600 px-0.5">/</span>
                    {item.total}
                  </span>
                </div>

                {/* Main Track Background */}
                <div className="w-full h-2.5 bg-[#161b22] border border-gray-800/50 rounded-full overflow-hidden p-0.5">
                  {/* Active Colored Fill Slider */}
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-700 ease-out shadow-sm`}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Aggregate Metric Mini-Footer Summary */}
      <div className="mt-6 pt-4 border-t border-gray-800/40 flex justify-between text-[11px] text-gray-500 font-medium">
        <span>Combined Problems:</span>
        <span className="text-cyan-400 font-bold font-mono">1,226 Total Solved</span>
      </div>
    </div>
  );
}