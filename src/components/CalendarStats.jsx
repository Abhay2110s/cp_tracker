import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../components/styles/CalendarStyles.css';// We'll create this for colors

export default function CalendarStats() {
  // Example: Array of dates that were "Active"
  const activeDates = [
    new Date(2026, 6, 1), new Date(2026, 6, 5), new Date(2026, 6, 10)
  ];

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      // Check if current date is in our activeDates array
      const isActive = activeDates.find(d => d.toDateString() === date.toDateString());
      return isActive ? 'active-day' : 'inactive-day';
    }
  };

  return (
    <div className="backdrop-blur-md bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-3xl shadow-2xl">
      <h3 className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">Activity Calendar</h3>
      <Calendar 
        tileClassName={tileClassName}
        calendarType="gregory"
      />
    </div>
  );
}