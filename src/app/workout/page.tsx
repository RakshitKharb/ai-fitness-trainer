'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaHome, FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaDumbbell } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { simulateGeminiAnalysis } from '@/services/geminiService';
import { simulateSpeech } from '@/services/audioService';

// Import dynamically to avoid SSR issues with browser APIs
// @ts-expect-error - TypeScript struggles with the Webcam component types
const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

// Lazy load PoseDetection component to avoid issues with TensorFlow.js during SSR
// @ts-expect-error - TypeScript struggles with dynamic imports
const PoseDetection = dynamic(() => import('@/components/PoseDetection'), { ssr: false });

export default function WorkoutPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const webcamRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // Common exercises 
  const exercises = [
    { id: 'squat', name: 'Squats' },
    { id: 'pushup', name: 'Push-ups' },
    { id: 'lunge', name: 'Lunges' },
    { id: 'plank', name: 'Plank' },
    { id: 'bicep-curl', name: 'Bicep Curls' }
  ];

  useEffect(() => {
    // Simulating loading of MoveNet model
    const loadModel = async () => {
      try {
        console.log('Loading model...');
        // In a real implementation, we would load the MoveNet model here
        // Simulating model load time
        setTimeout(() => {
          console.log('Model loaded successfully');
          setIsModelLoaded(true);
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Failed to load model', error);
        setIsLoading(false);
      }
    };

    loadModel();

    // Check for camera permissions
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      console.log('Checking camera permissions...');
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          console.log('Camera permission granted');
          setCameraPermission(true);
        })
        .catch((err) => {
          console.error('Camera permission denied:', err);
          setCameraPermission(false);
          setFeedback('Camera access is required for workout analysis. Please allow camera access and reload the page.');
          setDebugInfo('Camera permission denied. Please check browser settings.');
        });
    } else {
      console.warn('navigator.mediaDevices not available');
      setDebugInfo('Camera API not available in this browser or context.');
    }

    // Log environment variables (without exposing actual keys)
    console.log('Environment configuration:', {
      useSimulation: process.env.NEXT_PUBLIC_USE_SIMULATION,
      enableAudio: process.env.NEXT_PUBLIC_ENABLE_AUDIO_FEEDBACK,
      hasGeminiKey: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      hasElevenLabsKey: !!process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY
    });
  }, []);

  const startWorkout = () => {
    console.log('Start workout clicked', { selectedExercise, cameraPermission, isModelLoaded });
    
    if (!selectedExercise) {
      console.warn('No exercise selected');
      setFeedback('Please select an exercise to begin');
      setDebugInfo('Error: No exercise selected');
      return;
    }
    
    if (!cameraPermission) {
      console.warn('No camera permission');
      setFeedback('Camera access is required. Please allow camera access and reload the page.');
      setDebugInfo('Error: Camera permission denied');
      return;
    }
    
    setIsStarted(true);
    setFeedback(`Starting ${getExerciseName(selectedExercise)} analysis. Please position yourself in front of the camera.`);
    console.log('Workout started for exercise:', selectedExercise);
  };

  const stopWorkout = () => {
    console.log('Stopping workout');
    setIsStarted(false);
    setFeedback('Workout paused. Press play to continue.');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getExerciseName = (id) => {
    const exercise = exercises.find(ex => ex.id === id);
    return exercise ? exercise.name : '';
  };

  // Handle pose detection results
  const handlePoseDetected = (poseData) => {
    console.log('Pose detected', { keypoints: poseData.keypoints.length });
    
    // Get AI feedback on the pose
    try {
      const aiAnalysis = simulateGeminiAnalysis(selectedExercise);
      setFeedback(aiAnalysis);
      
      // Provide audio feedback if not muted
      if (!isMuted) {
        simulateSpeech(aiAnalysis);
      }
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      setDebugInfo(`AI feedback error: ${error.message}`);
    }
  };

  // For demonstration purposes, simulate feedback if real pose detection isn't working
  useEffect(() => {
    let feedbackInterval;
    
    if (isStarted && selectedExercise) {
      console.log('Setting up feedback simulation interval');
      feedbackInterval = setInterval(() => {
        try {
          const aiAnalysis = simulateGeminiAnalysis(selectedExercise);
          setFeedback(aiAnalysis);
          
          if (!isMuted) {
            simulateSpeech(aiAnalysis);
          }
        } catch (error) {
          console.error('Error in feedback interval:', error);
          setDebugInfo(`Feedback interval error: ${error.message}`);
        }
      }, 5000); // Provide feedback every 5 seconds
    }
    
    return () => {
      if (feedbackInterval) {
        console.log('Clearing feedback interval');
        clearInterval(feedbackInterval);
      }
    };
  }, [isStarted, selectedExercise, isMuted]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 transition">
            <FaHome className="mr-2" /> Back to Home
          </Link>
          
          <h1 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            AI Fitness Trainer
          </h1>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={toggleMute} 
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition"
              aria-label="Show workout suggestions"
            >
              <FaDumbbell />
            </button>
          </div>
        </div>

        {/* Exercise Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Select Exercise</h2>
          <div className="flex flex-wrap gap-2">
            {exercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => setSelectedExercise(exercise.id)}
                className={`px-4 py-2 rounded-full transition transform hover:scale-105 ${
                  selectedExercise === exercise.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {exercise.name}
              </button>
            ))}
          </div>
        </div>

        {/* Workout Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-xl overflow-hidden aspect-video relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-white text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                    <p className="mt-4">Loading AI Fitness Trainer...</p>
                  </div>
                </div>
              ) : (
                <>
                  {isStarted && (
                    <>
                      <Webcam
                        ref={webcamRef}
                        mirrored={true}
                        className="w-full h-full object-cover"
                        audio={false}
                        screenshotFormat="image/jpeg"
                      />
                      {typeof window !== 'undefined' && (
                        <PoseDetection
                          webcamRef={webcamRef}
                          isStarted={isStarted}
                          selectedExercise={selectedExercise}
                          onPoseDetected={handlePoseDetected}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Controls */}
            <div className="mt-4 flex justify-center">
              {!isStarted ? (
                <button
                  onClick={startWorkout}
                  disabled={!selectedExercise || !cameraPermission}
                  className={`flex items-center px-6 py-3 rounded-full transition transform hover:scale-105 ${
                    !selectedExercise || !cameraPermission
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                  }`}
                >
                  <FaPlay className="mr-2" /> Start Workout
                </button>
              ) : (
                <button
                  onClick={stopWorkout}
                  className="flex items-center px-6 py-3 rounded-full bg-red-500 text-white transition transform hover:scale-105 hover:shadow-lg"
                >
                  <FaPause className="mr-2" /> Stop
                </button>
              )}
            </div>
          </div>

          {/* Feedback Panel */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {isStarted ? 'Real-time Feedback' : 'Ready to Start Your Workout'}
            </h2>
            <p className="text-gray-600">
              {feedback || 'Please select an exercise from the list'}
            </p>
            {debugInfo && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <pre className="text-sm text-gray-600">{debugInfo}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 