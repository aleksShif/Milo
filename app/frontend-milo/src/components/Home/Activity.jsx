import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Home, Activity, Calendar, User, Settings, Clock, ChevronRight, Grid } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import '../Nav.css'; 

const ActivityDashboard = () => {
    const [data, setData] = useState([]);

    const navigate = useNavigate(); 
    const goWorkout = (e) => {
        e.preventDefault();
        navigate('../workout');
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

    const [left, setLeft] = useState('dataMin');
    const [right, setRight] = useState('dataMax');
    const [refAreaLeft, setRefAreaLeft] = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');
    const [insight, setInsight] = useState("Analyzing your workout data...");

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const baseUrl = import.meta.env.VITE_OPENAI_BASE_URL;

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

    const generateInsight = async () => {
        try {
            if (!baseUrl) {
                throw new Error('API base URL is not defined');
            }

            const csvString = Papa.unparse(data);

            const response = await fetch(`${baseUrl}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "anthropic.claude-3.5-sonnet.v2",
                    messages: [
                    {
                        role: "system",
                        content: "You are Milo, an AI fitness coach analyzing workout data. Your client is a female weightlifter who is performing bicep curls with EMG sensors attached that read muscle activation levels. Provide insight such as peak EMG activation, muscle fatigue, average rep duration, and more. Your goal is to be encouraging to the client and provide bite-sized pieces of information , 3-5 bullet points, to help them improve their workout. Be concise and use emojis to add emotion and color. Please add new lines after each piece of information to allow it to fit on a mobile screen."
                    },
                    {
                        role: "user",
                        content: "Can you analyze this data?" + csvString
                    }],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (!result.choices || !result.choices[0]?.message?.content) {
                throw new Error('Invalid response format from API');
            }

            setInsight(result.choices[0].message.content);
        } catch (error) {
            console.error('Error generating insight:', error);
            setInsight("Unable to generate insight at this time.");
        }
    };

    useEffect(() => {
        if (data.length > 0) {
            generateInsight();
        }
    }, [data]);

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
        <main className="max-w-[390px] w-[390px] mx-auto bg-black text-white min-h-screen relative rounded-3xl">
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
            <div className="flex-1 overflow-y-auto pb-24 px-4">
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

            <div className="rounded-2xl bg-[#121212] p-4 mt-4">
                <h2 className="text-[#00F7FF] text-lg mb-3">Milo's Insight</h2>
                <div className="text-gray-300 bg-[#1A1A1A] p-4 rounded-lg">
                        {insight}
                </div>
            </div>
            </div>

            {/* Bottom Navigation */}
            <div 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] 
        bg-gray-900/90 backdrop-blur-md border-t border-gray-800 
        flex justify-around items-center py-2 px-2 h-16 space-x-4"
      >
        <button onClick={goHome} className="hover-bar-button text-gray-500 flex flex-col items-center justify-center flex-1">
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button onClick={goActivities} className="text-pink-500 flex flex-col items-center justify-center flex-1">
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
        </main >
    );
};

export default ActivityDashboard;