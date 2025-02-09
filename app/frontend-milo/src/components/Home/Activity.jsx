import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Home, Activity, Calendar, User } from 'lucide-react';
import Papa from 'papaparse';

const ActivityDashboard = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Function to parse CSV file
        const parseCSV = async () => {
          try {
            const response = await fetch('/activity-log-01-01-2025.csv');
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const reader = response.body.getReader();
            const result = await reader.read();
            const decoder = new TextDecoder('utf-8');
            const csv = decoder.decode(result.value);
            const parsedData = Papa.parse(csv, { header: true }).data;
            setData(parsedData);
          } catch (error) {
            console.error('Error fetching or parsing CSV file:', error);
          }
        };
    
        parseCSV();
      }, []);


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-2 rounded-lg shadow-lg">
          <p className="text-gray-300 font-medium">{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color }}>
              {item.name}: {item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
    return (
      <div className="h-screen bg-black text-white">
        {/* Header */}
        <div className="p-4 pt-8">
          <h1 className="text-2xl font-semibold text-cyan-400">My Activity</h1>
        </div>
  
        {/* Charts */}
        <div className="space-y-4 p-4">
          {/* Force Output Chart */}
          <div className="rounded-lg bg-gray-900 border border-gray-800 p-4">
            <h2 className="text-cyan-400 mb-2">Force Output</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#666"
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  stroke="#666"
                  tick={{ fill: '#666' }}
                  domain={[0, 1000]}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#666', strokeWidth: 1 }}
                />
                <Line 
                  type="monotone"
                  dataKey="emg_value"
                  stroke="#0ff"
                  strokeWidth={2}
                  dot={{ fill: '#0ff', stroke: '#0ff', r: 0}}
                  activeDot={{ r: 5, fill: '#fff', stroke: '#0ff' }}
                  name="Force"
                  animationBegin={0}
                  animationDuration={2000}
                  animationEasing="ease-in-out"
                  animationId={1}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
  
          {/* Pulse Rate Chart */}
          <div className="rounded-lg bg-gray-900 border border-gray-800 p-4">
            <h2 className="text-cyan-400 mb-2">Pulse Rate</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#666"
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  stroke="#666"
                  tick={{ fill: '#666' }}
                  domain={[60, 200]}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#666', strokeWidth: 1 }}
                />
                <Line 
                  type="monotone"
                  dataKey="heart_rate"
                  stroke="#ff69b4"
                  strokeWidth={2}
                  dot={{ fill: '#ff69b4', stroke: '#ff69b4', r: 0 }}
                  activeDot={{ r: 6, fill: '#fff', stroke: '#ff69b4' }}
                  name="Pulse"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 w-full bg-black border-t border-gray-800">
          <div className="flex justify-around p-4">
            <div className="flex flex-col items-center">
              <Home className="w-6 h-6 text-white" />
              <span className="text-xs mt-1 text-white">Home</span>
            </div>
            <div className="flex flex-col items-center">
              <Activity className="w-6 h-6 text-pink-500" />
              <span className="text-xs mt-1 text-pink-500">Activity</span>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="w-6 h-6 text-white" />
              <span className="text-xs mt-1 text-white">Calendar</span>
            </div>
            <div className="flex flex-col items-center">
              <User className="w-6 h-6 text-white" />
              <span className="text-xs mt-1 text-white">Workouts</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ActivityDashboard;