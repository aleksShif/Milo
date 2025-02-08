import React from 'react'
import { Settings, Clock, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"



// before trying to run the frontend app make sure to install all dependencies 
// npm install !!!inside the frontend-milo directory!!!
// run using npm run dev

import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 

const Home = () => {

  return (
    <main className="flex flex-col h-screen bg-black text-white max-w-md mx-auto relative">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <h1 className="text-xl">
          <span className="text-white">Welcome, </span>
          <span className="text-[#00F7FF]">[User]</span>
        </h1>
        <div className="flex gap-4">
          <Clock className="w-6 h-6 text-white" />
          <Settings className="w-6 h-6 text-white" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-20">
        {/* Fitness Goals Card */}
        <div className="rounded-3xl p-6 mb-8 bg-gradient-to-br from-[#9C1B9C] to-[#FF3D9A]">
          <h2 className="text-2xl font-semibold mb-4 text-[#00F7FF]">
            Start Strong and
            <br />
            Set Your Fitness
            <br />
            Goals
          </h2>
          <button className="bg-white text-black rounded-full px-6 py-2 text-sm font-medium">Begin Exercise</button>
        </div>

        {/* Previous Session */}
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-[#00F7FF] text-lg">Previous Session</h3>
          <Link href="#" className="text-[#FF3D9A] text-sm">
            See All
          </Link>
        </div>

        {/* Workout Card */}
        <div className="bg-[#121212] rounded-2xl p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="text-gray-400 text-sm">02/01/2025</div>
            {/* Progress Circle */}
            <div className="relative w-8 h-8">
              <svg className="transform -rotate-90 w-8 h-8">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-zinc-800"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="87.96"
                  strokeDashoffset="44"
                  className="text-[#FF3D9A]"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs text-[#FF3D9A]">5/12</span>
            </div>
          </div>

          <div className="text-gray-400 text-sm mb-4">
            Minutes Logged
            <div className="text-white">30 mins</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-orange-300 text-2xl">🏋️</span>
              <div>
                <div className="text-[#FF3D9A]">Barbell Squat</div>
                <div className="text-gray-400 text-sm">4 x 10 reps • 25 Min</div>
              </div>
            </div>
            <ChevronRight className="text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-[#121212] px-6 py-4 max-w-md">
        <div className="flex justify-between items-center">
          <Link href="#" className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#00F7FF] mb-1"></div>
            <span className="text-[#00F7FF] text-xs">Home</span>
          </Link>
          <Link href="#" className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-zinc-800 mb-1"></div>
            <span className="text-zinc-400 text-xs">Activity</span>
          </Link>
          <Link href="#" className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#FF3D9A] mb-1"></div>
            <span className="text-[#FF3D9A] text-xs">Calendar</span>
          </Link>
          <Link href="#" className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-zinc-800 mb-1"></div>
            <span className="text-zinc-400 text-xs">Workouts</span>
          </Link>
        </div>
      </nav>
    </main>
  )
  };
  
    // <Router>
    //   <Routes>
    //     <Route path="/login" element={<UsernamePage />} />
    //     <Route path="/loginpass" element={<PasswordPage />} />
    //     {/* <Route path="/home" element={<Home />} /> */}
    //     <Route path="/" element={<Navigate to="/login" replace />} />
    //   </Routes>
    // </Router>




// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

export default Home