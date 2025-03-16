'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';

// Simplified mock version for when TensorFlow.js is not fully loaded
const mockDetector = {
  estimatePoses: async () => {
    console.log('Using mock detector for pose estimation');
    // Create sample pose data with minimal keypoints
    return [{
      keypoints: [
        { name: 'nose', x: 250, y: 100, score: 0.9 },
        { name: 'left_shoulder', x: 200, y: 150, score: 0.9 },
        { name: 'right_shoulder', x: 300, y: 150, score: 0.9 },
        { name: 'left_elbow', x: 150, y: 200, score: 0.8 },
        { name: 'right_elbow', x: 350, y: 200, score: 0.8 },
        { name: 'left_wrist', x: 100, y: 250, score: 0.7 },
        { name: 'right_wrist', x: 400, y: 250, score: 0.7 },
        { name: 'left_hip', x: 220, y: 250, score: 0.8 },
        { name: 'right_hip', x: 280, y: 250, score: 0.8 },
        { name: 'left_knee', x: 200, y: 350, score: 0.7 },
        { name: 'right_knee', x: 300, y: 350, score: 0.7 },
        { name: 'left_ankle', x: 180, y: 450, score: 0.6 },
        { name: 'right_ankle', x: 320, y: 450, score: 0.6 }
      ],
      score: 0.9
    }];
  }
};

interface PoseDetectionProps {
  webcamRef: React.RefObject<any>;
  isStarted: boolean;
  selectedExercise: string;
  onPoseDetected: (pose: any) => void;
}

export default function PoseDetection({
  webcamRef,
  isStarted,
  selectedExercise,
  onPoseDetected,
}: PoseDetectionProps) {
  const [detector, setDetector] = useState<any>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState(true);

  // Define startPoseDetection as useCallback to include it in dependencies
  const startPoseDetection = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    // For simulation mode, we'll use a longer interval to make it more realistic
    const intervalTime = isSimulationMode ? 1000 : 100;
    console.log(`Setting detection interval to ${intervalTime}ms (simulation: ${isSimulationMode})`);

    // Run pose detection at regular intervals
    detectionIntervalRef.current = setInterval(async () => {
      if (
        detector && 
        webcamRef.current && 
        webcamRef.current.video && 
        webcamRef.current.video.readyState === 4
      ) {
        try {
          // Get video properties
          const video = webcamRef.current.video;
          
          // Detect poses
          console.log('Detecting poses...');
          const poses = await detector.estimatePoses(video);
          console.log('Poses detected:', poses.length > 0 ? 'Yes' : 'No');
          
          if (poses && poses.length > 0) {
            // Pass the detected pose to the parent component
            onPoseDetected(poses[0]);
          }
        } catch (error) {
          console.error('Error detecting pose:', error);
          
          // If in simulation mode, still provide feedback
          if (isSimulationMode) {
            console.log('Using mock detection due to error');
            try {
              const poses = await mockDetector.estimatePoses();
              if (poses && poses.length > 0) {
                onPoseDetected(poses[0]);
              }
            } catch (e) {
              console.error('Error with mock detection:', e);
            }
          }
        }
      } else {
        console.log('Webcam not ready for pose detection', {
          hasDetector: !!detector,
          hasWebcam: !!webcamRef.current,
          hasVideo: !!(webcamRef.current && webcamRef.current.video),
          readyState: webcamRef.current && webcamRef.current.video ? webcamRef.current.video.readyState : 'N/A'
        });
      }
    }, intervalTime);
  }, [detector, isSimulationMode, onPoseDetected, webcamRef]);

  // Load the TensorFlow.js and MoveNet model (or use simulation)
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Check if we should use simulation mode (for development without TensorFlow)
        // Environment variables are always strings, so we need to check against the string 'true'
        const simulationValue = process.env.NEXT_PUBLIC_USE_SIMULATION;
        const useSimulation = simulationValue === 'true' || simulationValue === undefined;
        
        console.log('Simulation mode check:', { 
          simulationValue, 
          useSimulation,
          typeOfValue: typeof simulationValue
        });
        
        setIsSimulationMode(useSimulation);
        
        if (useSimulation) {
          console.log('Using simulation mode for pose detection');
          setDetector(mockDetector);
          return;
        }
        
        // Real implementation - load TensorFlow.js
        console.log('Loading TensorFlow.js...');
        await tf.ready();
        console.log('TensorFlow.js loaded successfully');
        
        try {
          // Dynamically import TensorFlow models to avoid SSR issues
          console.log('Importing pose detection models...');
          const poseDetection = await import('@tensorflow-models/pose-detection');
          console.log('Pose detection models imported successfully');
          
          // Create the pose detector
          console.log('Creating MoveNet detector...');
          const moveNetModel = poseDetection.SupportedModels.MoveNet;
          const detector = await poseDetection.createDetector(moveNetModel, {
            modelType: 'lightning', // 'lightning' for faster but less accurate detection
          });
          
          setDetector(detector);
          console.log('MoveNet model loaded successfully');
        } catch (error) {
          console.error('Error importing TensorFlow.js pose detection:', error);
          // Fallback to simulation mode
          console.log('Falling back to simulation mode due to error');
          setDetector(mockDetector);
          setIsSimulationMode(true);
        }
      } catch (error) {
        console.error('Error loading model:', error);
        // Fallback to simulation mode
        console.log('Falling back to simulation mode due to error');
        setDetector(mockDetector);
        setIsSimulationMode(true);
      }
    };

    loadModel();

    // Cleanup function
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  // Start/stop pose detection based on isStarted prop
  useEffect(() => {
    console.log('PoseDetection effect triggered:', { 
      isStarted, 
      hasDetector: !!detector, 
      hasWebcam: !!webcamRef.current 
    });
    
    if (isStarted && detector && webcamRef.current) {
      console.log('Starting pose detection...');
      // Start detection loop
      startPoseDetection();
    } else {
      // Stop detection loop
      if (detectionIntervalRef.current) {
        console.log('Stopping pose detection...');
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    }
    
    return () => {
      if (detectionIntervalRef.current) {
        console.log('Cleaning up pose detection interval...');
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, [isStarted, detector, webcamRef, selectedExercise, startPoseDetection]);

  // This component doesn't render anything visible
  return null;
} 