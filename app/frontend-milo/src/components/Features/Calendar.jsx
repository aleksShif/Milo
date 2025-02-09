import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, Activity, Grid, Settings } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import '../Nav.css';

const CycleTrackerCalendar = () => {

    const navigate = useNavigate();

    const goWorkout = (e) => {
        e.preventDefault();
        navigate('/workout');
    };
    
    const goHome = (e) => {
        e.preventDefault();
        navigate('/home');
    };
    
    const goActivities = (e) => {
        e.preventDefault();
        navigate('/activities');
    };

    const goCalendar = (e) => {
        e.preventDefault();
        navigate('/calendar');
    };

  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 1, 1)); // February 2025

  // Generate calendar days
  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Days from previous month
    const prevMonthDays = firstDay.getDay();
    
    // Array to hold all days
    const days = [];
    
    // Previous month's days
    for (let i = 0; i < prevMonthDays; i++) {
      const prevMonthDate = new Date(year, month, -prevMonthDays + i + 1);
      days.push({
        date: prevMonthDate,
        currentMonth: false
      });
    }
    
    // Current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      days.push({
        date: currentDate,
        currentMonth: true
      });
    }
    
    // Next month's days to fill the grid
    const totalDays = 42; // 6 rows * 7 columns
    while (days.length < totalDays) {
      const nextMonthDate = new Date(year, month + 1, days.length - prevMonthDays - lastDay.getDate() + 1);
      days.push({
        date: nextMonthDate,
        currentMonth: false
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays(currentMonth);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  // Helper to format date
  const formatDate = (date) => date.getDate();

  // Highlight logic
  const getHighlightClass = (day) => {
    // Not the current month
    if (!day.currentMonth) return 'text-gray-600';

    // Check if the day is in February 2025
    const isFebruary2025 = day.date.getMonth() === 1 && day.date.getFullYear() === 2025;

    // Specific highlight for 9th
    if (isFebruary2025 && day.date.getDate() === 9) {
      return 'bg-pink-600 text-white rounded-full';
    }

    // Highlight for days 1-10
    if (isFebruary2025 && day.date.getDate() >= 1 && day.date.getDate() <= 10) {
      return 'bg-pink-400/50 text-white rounded-full';
    }

    // Default
    return 'text-white';
  };

  return (
    <div className="max-w-[390px] w-[390px] mx-auto bg-black text-white min-h-screen relative rounded-3xl">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 pb-2">
        <button className="text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Track Your Cycle</h1>
        <div className="w-6"></div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex justify-between items-center px-2 mb-2">
        <button onClick={() => changeMonth(-1)} className="text-pink-500">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => changeMonth(1)} className="text-pink-500">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center mb-1 px-2">
        {weekdays.map((day) => (
          <div key={day} className="text-gray-400 text-xs">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5 px-2">
        {calendarDays.map((day, index) => (
          <div 
            key={index} 
            className={`text-center py-1 ${getHighlightClass(day)}`}
          >
            <span className="text-xs">{formatDate(day.date)}</span>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div 
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] 
          bg-gray-900/90 backdrop-blur-md border-t border-gray-800 
          flex justify-around items-center py-2 px-2 h-16 space-x-4"
        >
          <button onClick={goHome} className="hover-bar-button text-gray-500 flex flex-col items-center justify-center flex-1">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button onClick={goActivities} className="hover-bar-button text-gray-500 flex flex-col items-center justify-center flex-1">
            <Activity className="w-6 h-6" />
            <span className="text-xs mt-1">Activity</span>
          </button>
          <button onClick={goCalendar} className="text-pink-500 flex flex-col items-center justify-center flex-1">
            <Grid className="w-6 h-6" />
            <span className="text-xs mt-1">Calendar</span>
          </button>
          <button onClick={goWorkout} className="hover-bar-button text-gray-500 flex flex-col items-center justify-center flex-1">
            <Settings className="w-6 h-6" />
            <span className="text-xs mt-1">Workouts</span>
          </button>
        </div>

      {/* Home Indicator */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 flex justify-center">
        <div className="w-36 h-1 bg-white/30 rounded-full"></div>
      </div>
    </div>
  );
};

export default CycleTrackerCalendar;