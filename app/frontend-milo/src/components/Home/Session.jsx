import React from 'react';
import { ArrowLeft, Dumbbell, MonitorIcon as Running, SmilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExerciseSession = () => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    navigate('../home');
  }
  const handleStartClick = (e) => {
    e.preventDefault();
    navigate('/tracking');
  }

  return (
    <div className="max-w-[390px] w-[390px] mx-auto bg-black text-white min-h-screen relative rounded-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={handleClick} className="text-cyan-400 p-2 rounded-full hover:bg-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-cyan-400 text-xl font-semibold">MILO Exercise Session</h1>
      </div>

      {/* Last Workout Card */}
      <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white p-6 rounded-xl mb-6">
        <div className="text-2xl font-medium">
          Last time
          <br />
          you worked out
          <br />
          biceps & upper back
        </div>
      </div>

      {/* Workout Selection */}
      <div className="flex gap-6 mb-6">
        <div className="flex flex-col gap-4">
          <Dumbbell className="h-8 w-8 text-cyan-400" />
          <Running className="h-8 w-8 text-cyan-400" />
          <SmilePlus className="h-8 w-8 text-cyan-400" />
        </div>

        <div className="flex-1 bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white p-6 rounded-xl">
          <h2 className="text-xl font-medium mb-4">What are we hitting today?</h2>
          <div className="flex flex-col gap-3">
            {["Legs", "Chest", "Back", "Arms"].map((part) => (
              <button key={part} className="bg-white text-black hover:bg-gray-100 font-medium py-3 rounded-md">
                {part}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phase Info Card */}
      <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white p-6 rounded-xl mb-6">
        <div className="text-2xl font-medium">
          You're in your <span className="text-cyan-400">luteal phase</span>
          <br />
          Take it easy today with
          <br />
          lower-intensity
          <br />
          workouts!
        </div>
      </div>

      {/* Start Button */}
      <button onClick={handleStartClick}  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6 text-lg font-medium rounded-xl">
        Start Tracking
      </button>
    </div>
  );
};

export default ExerciseSession;