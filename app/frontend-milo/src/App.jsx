// before trying to run the frontend app make sure to install all dependencies 
// npm install !!!inside the frontend-milo directory!!!
// run using npm run dev

import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UsernamePage from './components/Auth/UsernamePage'
import PasswordPage from './components/Auth/PasswordPage'
import Home from './components/Home/Home';
import Session from './components/Home/Session';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/loginpass" element={<PasswordPage />} />
        <Route path="/home" element={<Home />} />
        <Route path='/session' element={<Session />} />
        <Route path="/" element={<UsernamePage/>} />
      </Routes>
    </Router>
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

export default App