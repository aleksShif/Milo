import React, { useState } from 'react';
import { ChevronRight, Bell, Home, Activity, Grid, Settings } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom"
import '../Nav.css'

const Workout = () => {

    const navigate = useNavigate();
    const goHome = (e) => {
        e.preventDefault();
        navigate('/home');
      };
     
      const goActivities = (e) => {
        e.preventDefault();
        navigate('/home/activity');
      };

      const goCalendar = (e) => {
        e.preventDefault();
        navigate('/calendar');
      };

      const goWorkout = (e) => {
        e.preventDefault();
        navigate('/workout');
      };



  const categories = ['All', 'Warm Up', 'Biceps', 'Chest'];
  const workouts = [
    {
      title: 'Full Body Warm Up',
      exercises: 20,
      duration: 22,
    },
    {
      title: 'Strength Exercise',
      exercises: 12,
      duration: 14,
    },
  ];

  return (
    <div className="max-w-[390px] mx-auto bg-black text-white min-h-screen relative overflow-hidden rounded-3xl">
      {/* Mobile Status Bar Simulation */}
      <div className="bg-black h-10 flex justify-between items-center px-4 text-white">
        <span className="text-sm">9:41</span>
        <div className="flex space-x-1">
        </div>
      </div>

      {/* Top Bar */}
      <div className="flex justify-between items-center p-4">
        <button className="text-pink-500">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-lg font-semibold">Categories</h1>
        <button className="text-white">
          <Bell className="w-6 h-6" />
        </button>
      </div>

      {/* Scrollable Content Container */}
      <div className="overflow-y-auto pb-20">
        {/* Category Tabs */}
        <div className="flex space-x-3 px-4 mt-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button 
              key={category} 
              className={`px-4 py-2 rounded-full text-sm flex-shrink-0 ${
                category === 'Warm Up' 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-gray-800 text-pink-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Warm Up Section */}
        <div className="mt-6 px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Warm Up</h2>
            <button className="text-pink-500 text-sm">See All</button>
          </div>

          {/* Workout Cards */}
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div 
                key={workout.title}
                className="bg-gray-900 rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">

                  <div>
                    <h3 className="font-bold">{workout.title}</h3>
                    <p className="text-gray-400 text-sm">
                      {workout.exercises} Exercises • {workout.duration} Min
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-pink-500 w-6 h-6" />
              </div>
            ))}
          </div>
        </div>
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
        <button onClick={goCalendar} className="hover-bar-button text-gray-500 flex flex-col items-center justify-center flex-1">
          <Grid className="w-6 h-6" />
          <span className="text-xs mt-1">Calendar</span>
        </button>
        <button onClick={goWorkout} className="text-pink-500 flex flex-col items-center justify-center flex-1">
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

export default Workout;