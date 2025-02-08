import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, Home, Activity, Calendar, Dumbbell } from 'lucide-react';

const PasswordPage = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state.username;

  useEffect(() => {
    if (!username) {
      navigate('/login');
    }
  }, [username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/loginpass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        navigate('/home');
      } else {
        alert('Invalid Password. Please try again');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Status Bar */}
      <div className="h-10 flex items-center px-4">
        <span className="text-sm">9:41</span>
      </div>

      {/* Back Button */}
      <div className="px-4 mb-4">
        <button 
          className="text-cyan-400"
          onClick={() => navigate('/login')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6">
        <h1 className="text-2xl text-cyan-400 mb-6">Sign In</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-cyan-400 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-gray-800 rounded-lg p-3 pr-10 text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Eye className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white rounded-lg p-3 mb-6 hover:bg-pink-600 transition-colors"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className="text-center mb-6">
          <span className="text-gray-400">Don't have an account? </span>
          <a href="/create-account" className="text-cyan-400">Create Account</a>
        </div>

        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-gray-800"></div>
          <span className="px-4 text-gray-400">Or</span>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex justify-center space-x-4">
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
    </div>
  );
};

export default PasswordPage; 