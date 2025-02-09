import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Thermometer, Home, Activity, Calendar, User } from 'lucide-react';
import WorkoutComplete from './WorkoutComplete';
import './Tracking.css';

const MiloExerciseApp = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [showWorkoutComplete, setShowWorkoutComplete] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit'
  });

  const navigate = useNavigate(); 
  const handleEndTracking = () => { 
    setShowWorkoutComplete(true);
  };
  const toggleRecording = () => {
    navigate('/bicep')
  };

  return (
    <div className="max-w-[390px] w-[390px] mx-auto bg-black text-white min-h-screen relative rounded-3xl">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4">
        <span>9:41</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl text-cyan-400 font-semibold px-6 mb-6">
        MILO Exercise Session
      </h1>

      {/* Metrics Card */}
      <div className="mx-6 bg-gray-800 rounded-3xl p-6 shadow-lg">
        <div className="text-center mb-4">{currentDate}</div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Pulse */}
          <div className="flex flex-col items-center">
            <Heart className="w-6 h-6 mb-2 text-gray-400" />
            <span className="text-sm text-gray-400">Pulse</span>
            <div className="mt-2 w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-2xl font-bold">XX</span>
            </div>
            <span className="text-xs mt-1">BPM</span>
          </div>

          {/* Force Output */}
          <div className="flex flex-col items-center">
            <Star className="w-6 h-6 mb-2 text-gray-400" />
            <span className="text-sm text-gray-400">Force Output</span>
            <div className="mt-2 w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-2xl font-bold">60</span>
            </div>
            <span className="text-xs mt-1">/100</span>
          </div>

          {/* Temperature */}
          <div className="flex flex-col items-center">
            <Thermometer className="w-6 h-6 mb-2 text-gray-400" />
            <span className="text-sm text-gray-400">Temperature</span>
            <div className="mt-2 w-16 h-16 rounded-full bg-green-400 flex items-center justify-center">
              <span className="text-2xl font-bold">90</span>
            </div>
            <span className="text-xs mt-1">°F</span>
          </div>
        </div>

        {/* Force Output Bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span>Force Output</span>
            <span className="text-red-400">High 80%</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full">
            <div className="w-4/5 h-full bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Recording Controls */}
      <div className="flex flex-col items-center mt-12 gap-6">
        <span className="text-cyan-400 text-lg">
          {isRecording ? "Recording..." : "Start Recording"}
        </span>
        <button
          onClick={toggleRecording}
          className={`w-16 h-16 rounded-full border-4 ${
            isRecording ? 'border-pink-500 bg-pink-500' : 'border-pink-500'
          }`}
        />
        <button onClick={handleEndTracking} className="end-tracking-button w-full mx-6 bg-red-600 text-white py-4 rounded-xl">
          End Tracking
        </button>
      </div>

      {/* Navigation Bar */}
      {/* <div className="fixed bottom-0 w-full bg-pink-500 text-white">
        <div className="grid grid-cols-4 gap-2 p-4">
          <div className="flex flex-col items-center">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </div>
          <div className="flex flex-col items-center">
            <Activity className="w-6 h-6" />
            <span className="text-xs">Activity</span>
          </div>
          <div className="flex flex-col items-center">
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Calendar</span>
          </div>
          <div className="flex flex-col items-center">
            <User className="w-6 h-6" />
            <span className="text-xs">Workouts</span>
          </div>
        </div>
      </div> */}
      
      {/* Workout Complete Modal */}
      {showWorkoutComplete && <WorkoutComplete onClose={() => setShowWorkoutComplete(false)}/>}
    </div>
  );
};

export default MiloExerciseApp;