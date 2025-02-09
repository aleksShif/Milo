import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Home, Activity, Calendar, User, Settings, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';

const ActivityDashboard = () => {
    const [data, setData] = useState([]);

    const [left, setLeft] = useState('dataMin');
    const [right, setRight] = useState('dataMax');
    const [refAreaLeft, setRefAreaLeft] = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');

    //parse CSV emg data
    useEffect(() => {
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

                // Set initial domain based on actual data
                const timestamps = parsedData.map(item => parseFloat(item.timestamp));
                const minTimestamp = Math.min(...timestamps);
                const maxTimestamp = Math.max(...timestamps);

                setData(parsedData);
                setLeft(minTimestamp);
                setRight(maxTimestamp);
            } catch (error) {
                console.error('Error fetching or parsing CSV file:', error);
            }
        };

        parseCSV();
    }, []);

    //zoom in on highlighted portion of chart
    const zoom = () => {
        if (refAreaLeft === refAreaRight || refAreaRight === '') {
            setRefAreaLeft('');
            setRefAreaRight('');
            return;
        }

        // Convert string values to numbers for comparison
        const left = parseFloat(refAreaLeft);
        const right = parseFloat(refAreaRight);

        // Ensure proper order of coordinates
        if (left < right) {
            setLeft(left);
            setRight(right);
        } else {
            setLeft(right);
            setRight(left);
        }

        setRefAreaLeft('');
        setRefAreaRight('');
    };

    //helper function for resetting recharts zoom
    const zoomOut = () => {
        console.log(left, right);
        const timestamps = data.map(item => parseFloat(item.timestamp));
        const minTimestamp = Math.min(...timestamps);
        const maxTimestamp = Math.max(...timestamps);
        
        setLeft(minTimestamp);
        setRight(maxTimestamp);
        setRefAreaLeft('');
        setRefAreaRight('');
        console.log(left, right);
    };

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
        <main className="flex flex-col h-screen bg-black text-white max-w-md mx-auto relative">
            {/* Header */}
            <header className="flex justify-between items-center p-4">
                <h1 className="text-xl">
                    <span className="text-[#00F7FF]">My Activity</span>
                </h1>
                <div className="flex gap-4">
                    <Clock className="w-6 h-6 text-white" />
                    <Settings className="w-6 h-6 text-white" />
                </div>
            </header>

            {/* Main Content */}
            <div className="rounded-2xl bg-[#121212] p-4 mb-4">
                {/* Force Output Chart */}
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-[#00F7FF] text-lg">Force Output</h2>
                    <button
                        onClick={zoomOut}
                        className="px-2 py-1 text-xs rounded bg-[#FF3D9A] text-white hover:bg-[#FF3D9A]/80"
                    >
                        Reset Zoom
                    </button>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                        data={data}
                        onMouseDown={e => e && setRefAreaLeft(e.activeLabel)}
                        onMouseMove={e => e && refAreaLeft && setRefAreaRight(e.activeLabel)}
                        onMouseUp={zoom}
                    >
                        <XAxis
                            dataKey="timestamp"
                            stroke="#666"
                            tick={{ fill: '#666' }}
                            domain={[left, right]}
                            allowDataOverflow
                            type="number"
                        />
                        <YAxis
                            stroke="#666"
                            tick={{ fill: '#666' }}
                            domain={[0, 1000]}
                            allowDataOverflow
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#666', strokeWidth: 1 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="emg_value"
                            stroke="#00F7FF"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5, fill: '#fff', stroke: '#00F7FF' }}
                            name="Force"
                            animationBegin={0}
                            animationDuration={2000}
                            animationEasing="ease-in-out"
                            animationId={1}
                        />
                        {refAreaLeft && refAreaRight ? (
                            <ReferenceArea
                                x1={refAreaLeft}
                                x2={refAreaRight}
                                strokeOpacity={0.3}
                                fill="#FF3D9A"
                                fillOpacity={0.1}
                            />
                        ) : null}
                    </LineChart>
                </ResponsiveContainer>
            </div>


            {/* Pulse Rate Chart */}
            <div className="rounded-2xl bg-[#121212] p-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-[#00F7FF] text-lg">Pulse Rate</h2>
                    <button
                        onClick={zoomOut}
                        className="px-2 py-1 text-xs rounded bg-[#FF3D9A] text-white hover:bg-[#FF3D9A]/80"
                    >
                        Reset Zoom
                    </button>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                        data={data}
                        onMouseDown={e => e && setRefAreaLeft(e.activeLabel)}
                        onMouseMove={e => e && refAreaLeft && setRefAreaRight(e.activeLabel)}
                        onMouseUp={zoom}
                    >
                        <XAxis
                            dataKey="timestamp"
                            stroke="#666"
                            tick={{ fill: '#666' }}
                            domain={[left, right]}
                            allowDataOverflow
                            type="number"
                        />
                        <YAxis
                            stroke="#666"
                            tick={{ fill: '#666' }}
                            domain={[60, 200]}
                            allowDataOverflow
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#666', strokeWidth: 1 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="heart_rate"
                            stroke="#FF3D9A"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: '#fff', stroke: '#FF3D9A' }}
                            name="Pulse"
                            animationBegin={0}
                            animationDuration={2000}
                            animationEasing="ease-in-out"
                            animationId={2}
                        />
                        {refAreaLeft && refAreaRight ? (
                            <ReferenceArea
                                x1={refAreaLeft}
                                x2={refAreaRight}
                                strokeOpacity={0.3}
                                fill="#FF3D9A"
                                fillOpacity={0.1}
                            />
                        ) : null}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 w-full bg-[#121212] px-6 py-4 max-w-md">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 mb-1"></div>
                        <span className="text-zinc-400 text-xs">Home</span>
                    </Link>
                    <Link to="/activity" className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#FF3D9A] mb-1"></div>
                        <span className="text-[#FF3D9A] text-xs">Activity</span>
                    </Link>
                    <Link to="/calendar" className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 mb-1"></div>
                        <span className="text-zinc-400 text-xs">Calendar</span>
                    </Link>
                    <Link to="/workouts" className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 mb-1"></div>
                        <span className="text-zinc-400 text-xs">Workouts</span>
                    </Link>
                </div>
            </nav>
        </main >
    );
};

export default ActivityDashboard;