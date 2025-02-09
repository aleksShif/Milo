import React, { useState } from 'react';


import { useNavigate } from 'react-router-dom';
import { Home, Activity, Calendar, Dumbbell, ChevronRight, Bell, Grid, Settings } from 'lucide-react';
import '../Nav.css'

const UsernamePage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/home');
  };

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
    navigate('/home/activity');
  };

  const goCalendar = (e) => {
    e.preventDefault();
    navigate('/calendar');
  };



  return (
    <div className="max-w-[390px] w-[390px] mx-auto bg-black text-white min-h-screen relative rounded-3xl">
      {/* <div className="w-full max-w-md flex flex-col flex-1"> */}
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4">
        <span>9:41</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
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

          <div className="mb-6">
            <label className="block text-cyan-400 mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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
        {/* <div className="flex justify-center space-x-4 mb-8">
          <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <img src="/google-icon.png" alt="Google" className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <img src="/apple-icon.png" alt="Apple" className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <img src="/facebook-icon.png" alt="Facebook" className="w-6 h-6" />
          </button>
        </div> */}
      </div>
      {/* Bottom Navigation Bar */}
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
        <button onClick={goWorkout} className="hover-bar-button text-gray-500 flex flex-col items-center justify-center flex-1">
          <Settings className="w-6 h-6" />
          <span className="text-xs mt-1">Workouts</span>
        </button>
      </div>
      </div>
    // </div>
  );
};

export default UsernamePage;
