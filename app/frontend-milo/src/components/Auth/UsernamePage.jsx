

import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Home, Activity, Calendar, Dumbbell } from 'lucide-react';

const UsernamePage = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Status Bar */}
      <div className="h-10 flex items-center px-4">
        <span className="text-sm">9:41</span>
      </div>

      {/* Back Button */}
      <div className="px-4 mb-4">
        <button className="text-cyan-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        <h1 className="text-2xl text-cyan-400 mb-6">Sign In</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-cyan-400 mb-2">Username</label>
            <div className="relative">
              <input
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-gray-800 rounded-lg p-3 pr-10 text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white rounded-lg p-3 mb-6 hover:bg-pink-600 transition-colors"
          >
            {loading ? 'Loading...' : 'Continue'}
          </button>
        </form>

        <div className="text-center mb-6">
          <span className="text-gray-400">Don't have an account? </span>
          <a href="/register" className="text-cyan-400">Create Account</a>
        </div>

        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-gray-800"></div>
          <span className="px-4 text-gray-400">Or</span>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <img src="/google-icon.png" alt="Google" className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <img src="/apple-icon.png" alt="Apple" className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <img src="/facebook-icon.png" alt="Facebook" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-pink-500 mt-auto">
        <div className="flex justify-around py-4">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center transition-colors ${activeTab === 'home' ? 'text-white' : 'text-pink-200 hover:text-white'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab('activity')}
            className={`flex flex-col items-center transition-colors ${activeTab === 'activity' ? 'text-pink-200 hover:text-white' : 'text-pink-200 hover:text-white'}`}
          >
            <Activity className="w-6 h-6" />
            <span className="text-xs mt-1">Activity</span>
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center transition-colors ${activeTab === 'calendar' ? 'text-white' : 'text-pink-200 hover:text-white'}`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs mt-1">Calendar</span>
          </button>
          <button 
            onClick={() => setActiveTab('workouts')}
            className={`flex flex-col items-center transition-colors ${activeTab === 'workouts' ? 'text-white' : 'text-pink-200 hover:text-white'}`}
          >
            <Dumbbell className="w-6 h-6" />
            <span className="text-xs mt-1">Workouts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsernamePage;