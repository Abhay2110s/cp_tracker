import React, { useMemo } from 'react';

export default function SubmissionHeatmap() {
  // 1. Generate data dynamically for the last 365 days
  const activityData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 365; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      data.push({
        date,
        count: Math.floor(Math.random() * 10), // Replace with your actual API fetch logic
      });
    }
    return data;
  }, []);

  // 2. Group the data by Month
  const groupedData = useMemo(() => {
    return activityData.reduce((acc, item) => {
      const monthYear = item.date.toLocaleString('default', { month: 'short' });
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(item);
      return acc;
    }, {});
  }, [activityData]);

  // 3. Logic for Green Intensity
  const getIntensityClass = (count) => {
    if (count === 0) return 'bg-slate-800';
    if (count < 3) return 'bg-emerald-500';
    if (count < 7) return 'bg-emerald-700';
    return 'bg-emerald-900';
  };

  return (
    <div className="backdrop-blur-md bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em]">Submissions</h3>
      </div>

      {/* Horizontal Scrollable Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {Object.entries(groupedData).map(([month, days]) => (
          <div key={month} className="flex flex-col items-center gap-2 min-w-[120px]">
            <div className="grid grid-cols-4 gap-1">
              {days.map((day, idx) => (
                <div 
                  key={idx}
                  title={`${day.date.toDateString()}: ${day.count} submissions`}
                  className={`w-4 h-4 rounded-sm ${getIntensityClass(day.count)}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">{month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}