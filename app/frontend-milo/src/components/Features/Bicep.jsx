import React, { useEffect, useRef, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';

const Bicep = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('Starting');
  const [formAnalysis, setFormAnalysis] = useState({
    status: 'Ready to Start',
    feedback: 'Position your upper body for curl analysis',
    repCount: 0,
    debugInfo: ''
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const toggleRecording = () => {
    navigate('/tracking')
  };

  // Calculate angle between three points
  const calculateAngle = (a, b, c) => {
    // Calculate vectors
    const ba = [a[0] - b[0], a[1] - b[1]];
    const bc = [c[0] - b[0], c[1] - b[1]];
    
    // Calculate dot product
    const dotProduct = ba[0] * bc[0] + ba[1] * bc[1];
    
    // Calculate magnitudes
    const baLength = Math.sqrt(ba[0] * ba[0] + ba[1] * ba[1]);
    const bcLength = Math.sqrt(bc[0] * bc[0] + bc[1] * bc[1]);
    
    // Calculate angle
    const cosAngle = dotProduct / (baLength * bcLength);
    let angle = Math.acos(Math.max(Math.min(cosAngle, 1), -1));
    
    // Convert to degrees
    return angle * (180 / Math.PI);
  };

  useEffect(() => {
    let model = null;
    let stream = null;
    let animationFrameId = null;
    
    const repState = {
      phase: 'ready',
      repCount: 0,
      minCurlAngle: 20,     // Very bottom of curl
      maxExtensionAngle: 170, // Almost fully extended
      angleBuffer: 20,      // Very generous angle range
      shoulderStabilityThreshold: 30, // More lenient shoulder movement
      lastValidRepTime: 0,
      repCooldown: 500 // Minimum time between reps (milliseconds)
    };

    const initPoseNet = async () => {
      try {
        model = await posenet.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: { width: 640, height: 480 },
          multiplier: 0.75
        });

        await startWebcam();
      } catch (err) {
        console.error('PoseNet initialization error:', err);
        setError(`Initialization failed: ${err.message}`);
        setStatus('Error');
      }
    };

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 }, 
            height: { ideal: 480 } 
          } 
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setStatus('Ready');
            
            const detectPose = async () => {
              if (model && videoRef.current && !videoRef.current.paused) {
                try {
                  const pose = await model.estimateSinglePose(
                    videoRef.current, 
                    { flipHorizontal: false }
                  );
                  
                  analyzeBicepForm(pose);
                  drawPoseAndAngles(pose);
                } catch (poseError) {
                  console.error('Pose estimation error:', poseError);
                }
              }
              
              animationFrameId = requestAnimationFrame(detectPose);
            };

            detectPose();
          };
        }
      } catch (err) {
        console.error('Webcam access error:', err);
        setError(err.message || 'Could not access webcam');
        setStatus('Error');
      }
    };

    const analyzeBicepForm = (pose) => {
      // Key landmarks for bicep curl analysis
      const shoulder = pose.keypoints.find(kp => kp.part === 'leftShoulder');
      const elbow = pose.keypoints.find(kp => kp.part === 'leftElbow');
      const wrist = pose.keypoints.find(kp => kp.part === 'leftWrist');
      const hip = pose.keypoints.find(kp => kp.part === 'leftHip');

      // Ensure all required points are detected with relaxed confidence
      if (!shoulder || !elbow || !wrist || !hip || 
          shoulder.score < 0.3 || elbow.score < 0.3 || 
          wrist.score < 0.3) {
        setFormAnalysis({
          status: 'Positioning',
          feedback: 'Ensure upper body is mostly visible',
          repCount: repState.repCount,
          debugInfo: 'Landmark detection low'
        });
        return;
      }

      // Calculate key angles
      const elbowAngle = calculateAngle(
        [shoulder.position.x, shoulder.position.y],
        [elbow.position.x, elbow.position.y],
        [wrist.position.x, wrist.position.y]
      );

      const shoulderHipAngle = calculateAngle(
        [elbow.position.x, elbow.position.y],
        [shoulder.position.x, shoulder.position.y],
        [hip.position.x, hip.position.y]
      );

      // Analyze form
      let status = 'In Progress';
      let feedback = '';

      // Extremely forgiving rep detection
      const currentTime = Date.now();
      const timeSinceLastRep = currentTime - repState.lastValidRepTime;

      // Very loose rep counting criteria
      if (elbowAngle < (repState.minCurlAngle + repState.angleBuffer) && 
          timeSinceLastRep > repState.repCooldown) {
        repState.repCount++;
        repState.lastValidRepTime = currentTime;
        status = 'Rep Completed';
        feedback = 'Great job!';
      }

      // Shoulder stability check (more generous)
      if (Math.abs(shoulderHipAngle) > repState.shoulderStabilityThreshold) {
        feedback += ' Try to minimize big shoulder movements';
        status = 'Minor Form Adjustment';
      }

      // Update form analysis state
      setFormAnalysis({
        status: status,
        feedback: feedback.trim(),
        repCount: repState.repCount,
        debugInfo: `Elbow: ${elbowAngle.toFixed(2)}°, Shoulder: ${shoulderHipAngle.toFixed(2)}°`
      });
    };

    const drawPoseAndAngles = (pose) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clear previous frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw current video frame
      if (videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      }

      // Define landmark parts to draw
      const partsToTrack = [
        'leftShoulder', 'leftElbow', 'leftWrist', 
        'leftHip', 'rightShoulder', 'rightElbow', 
        'rightWrist', 'rightHip'
      ];

      // Draw landmarks and connections
      if (pose && pose.keypoints) {
        // Collect visible landmarks
        const visibleLandmarks = pose.keypoints
          .filter(kp => partsToTrack.includes(kp.part) && kp.score > 0.3);

        // Draw lines between connected landmarks
        const connections = [
          ['leftShoulder', 'leftElbow'],
          ['leftElbow', 'leftWrist'],
          ['leftShoulder', 'leftHip']
        ];

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;

        connections.forEach(([startPart, endPart]) => {
          const startPoint = pose.keypoints.find(kp => kp.part === startPart);
          const endPoint = pose.keypoints.find(kp => kp.part === endPart);

          if (startPoint && endPoint && 
              startPoint.score > 0.3 && endPoint.score > 0.4) {
            ctx.beginPath();
            ctx.moveTo(startPoint.position.x, startPoint.position.y);
            ctx.lineTo(endPoint.position.x, endPoint.position.y);
            ctx.stroke();
          }
        });

        // Draw landmarks
        visibleLandmarks.forEach((landmark) => {
          ctx.beginPath();
          ctx.arc(
            landmark.position.x, 
            landmark.position.y, 
            5, 0, 2 * Math.PI
          );
          
          // Color code different body parts
          switch (landmark.part) {
            case 'leftShoulder':
            case 'rightShoulder':
              ctx.fillStyle = 'green';
              break;
            case 'leftElbow':
            case 'rightElbow':
              ctx.fillStyle = 'blue';
              break;
            case 'leftWrist':
            case 'rightWrist':
              ctx.fillStyle = 'red';
              break;
            case 'leftHip':
            case 'rightHip':
              ctx.fillStyle = 'purple';
              break;
            default:
              ctx.fillStyle = 'white';
          }
          
          ctx.fill();
        });
      }
    };

    // Initialize PoseNet
    initPoseNet();

    // Cleanup function
    return () => {
      // Cancel animation frame
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Stop video stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Render error or component
  if (error) {
    return (
      <div className="p-4 text-center bg-red-100 text-red-700">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[390px] w-[390px] mx-auto bg-gradient-to-b from-[#1E1E1E] to-[#2C2C2C] text-white min-h-screen relative">
      <div className="absolute top-0 left-0 right-0 h-10 flex justify-between items-center px-4 text-white">
        <span className="text-sm">9:41</span>
        <div className="flex space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M17 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 17H5V7h4v10z"></path>
            <path d="M12 22h0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2z" opacity=".4"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M16 6V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1"></path>
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="m2 17 10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
      </div>

      <div className="relative border-none mt-12">
        <video 
          ref={videoRef}
          style={{ display: 'none' }}
          width={640}
          height={480}
        />
        <canvas 
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full px-4"
        />
        {status !== 'Ready' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
            {status}
          </div>
        )}
      </div>
      
      <div className="mt-4 px-4">
        <h3 className="font-bold text-lg text-center mb-2">Bicep Curl Form Analyzer</h3>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-400">Status</p>
              <p className={`font-semibold ${
                formAnalysis.status.includes('Error') ? 'text-red-500' : 
                formAnalysis.status.includes('Completed') ? 'text-green-500' : 'text-yellow-500'
              }`}>{formAnalysis.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Repetitions</p>
              <p className="font-semibold text-pink-500">{formAnalysis.repCount}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-300">{formAnalysis.feedback}</p>
          <p className="text-xs text-gray-500 mt-1">Debug: {formAnalysis.debugInfo}</p>
        </div>
        <p className="text-sm text-gray-500 text-center mt-2">
          Tip: Keep upper body in view for best tracking
        </p>
        <div className="flex flex-col items-center mt-12 gap-6">
        <button
          onClick={toggleRecording}
          className={`w-16 h-16 rounded-full border-4 border-pink-500`}
        />
        </div>
      </div>
      </div>

     
  );
};

export default Bicep;