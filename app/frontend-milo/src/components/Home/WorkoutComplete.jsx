// Desc: Workout complete alert component
import React from 'react';
import { ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkoutComplete = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate('/home');
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-black text-white p-6 rounded-lg shadow-lg">
        {/* Icon Container */}
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-transparent border-2 border-pink-500 p-3">
            <ThumbsUp className="w-6 h-6 text-pink-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-white text-xl font-semibold text-center mb-6">
          Great job! Workout completed
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Minutes */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="text-white text-2xl font-bold text-center">20</div>
            <div className="text-gray-400 text-sm text-center">Minutes</div>
          </div>

          {/* Calories */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="text-white text-2xl font-bold text-center">233</div>
            <div className="text-gray-400 text-sm text-center">Calories Burnt</div>
          </div>

          {/* Form Accuracy - Full Width */}
          <div className="col-span-2 bg-gray-800 rounded-xl p-4">
            <div className="text-white text-2xl font-bold text-center">98%</div>
            <div className="text-gray-400 text-sm text-center">Form Accuracy</div>
          </div>
        </div>

        {/* Button */}
        <button onClick={handleClose} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors">
          Back Home
        </button>
      </div>
    </div>
  );
};

export default WorkoutComplete;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const WorkoutComplete = () => {
//   const navigate = useNavigate();

//   const handleClose = () => {
//     navigate('/home');
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
//       <div className="bg-white text-black p-6 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold mb-4">Workout Complete!</h2>
//         <p className="mb-4">Great job on completing your workout!</p>
//         <button
//           onClick={handleClose}
//           className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default WorkoutComplete;