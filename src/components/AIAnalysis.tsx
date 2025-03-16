'use client';

import { useEffect, useState, useCallback } from 'react';

// Exercise analysis criteria
const exerciseCriteria = {
  squat: {
    kneeAngle: {
      min: 60,
      max: 100,
      message: "Bend your knees more, aim for a 90 degree angle",
    },
    hipAlignment: {
      threshold: 10,
      message: "Keep your hips aligned with your shoulders",
    },
    backAngle: {
      min: 45,
      max: 60,
      message: "Keep your back straighter during the squat",
    }
  },
  pushup: {
    elbowAngle: {
      min: 85,
      max: 100,
      message: "Lower your body until your elbows are at 90 degrees",
    },
    bodyAlignment: {
      threshold: 15,
      message: "Maintain a straight line from head to toe",
    },
    shoulderPosition: {
      threshold: 10,
      message: "Keep your shoulders directly above your wrists",
    }
  },
  lunge: {
    frontKneeAngle: {
      min: 80,
      max: 100,
      message: "Front knee should be at 90 degrees",
    },
    backKneeAngle: {
      min: 80,
      max: 100,
      message: "Back knee should nearly touch the ground",
    },
    torsoAlignment: {
      threshold: 10,
      message: "Keep your torso upright",
    }
  },
  plank: {
    bodyAlignment: {
      threshold: 10,
      message: "Maintain a straight line from head to heels",
    },
    shoulderPosition: {
      threshold: 10,
      message: "Keep shoulders above elbows",
    },
    hipPosition: {
      threshold: 15,
      message: "Don't let your hips sag or pike up",
    }
  },
  'bicep-curl': {
    elbowMovement: {
      threshold: 10,
      message: "Keep your elbows stable at your sides",
    },
    wristRotation: {
      threshold: 20,
      message: "Rotate your wrists at the top of the movement",
    },
    shoulderStability: {
      threshold: 5,
      message: "Keep your shoulders stable, don't swing",
    }
  }
};

// Define keypoint type
interface Keypoint {
  x: number;
  y: number;
  score: number;
  name?: string;
}

// Define keypoints object type
interface KeypointsObject {
  [key: string]: Keypoint;
}

interface AIAnalysisProps {
  poseData: {
    keypoints: Array<{
      name: string;
      x: number;
      y: number;
      score: number;
    }>;
    score: number;
  };
  selectedExercise: string;
  onFeedback: (feedback: string) => void;
}

export default function AIAnalysis({
  poseData,
  selectedExercise,
  onFeedback,
}: AIAnalysisProps) {
  const [lastFeedbackTime, setLastFeedbackTime] = useState(0);
  
  // Define analyzePose as useCallback to include it in dependencies
  const analyzePose = useCallback((pose: typeof poseData, exercise: string) => {
    // Don't give feedback too frequently
    const now = Date.now();
    if (now - lastFeedbackTime < 2000) return; // 2-second throttle
    
    const keypoints = pose.keypoints;
    if (!keypoints || keypoints.length === 0) return;
    
    // Convert keypoints array to object for easier access
    const keypointsObj: KeypointsObject = {};
    keypoints.forEach((kp) => {
      keypointsObj[kp.name] = {
        x: kp.x,
        y: kp.y,
        score: kp.score
      };
    });
    
    let feedback = "";
    
    switch (exercise) {
      case 'squat':
        feedback = analyzeSquat(keypointsObj);
        break;
      case 'pushup':
        feedback = analyzePushup(keypointsObj);
        break;
      case 'lunge':
        feedback = analyzeLunge(keypointsObj);
        break;
      case 'plank':
        feedback = analyzePlank(keypointsObj);
        break;
      case 'bicep-curl':
        feedback = analyzeBicepCurl(keypointsObj);
        break;
      default:
        feedback = "Exercise not recognized";
    }
    
    if (feedback) {
      onFeedback(feedback);
      setLastFeedbackTime(now);
    }
  }, [lastFeedbackTime, onFeedback]);
  
  useEffect(() => {
    if (!poseData || !selectedExercise) return;
    
    // Analyze pose data based on the selected exercise
    analyzePose(poseData, selectedExercise);
  }, [poseData, selectedExercise, analyzePose]);

  // Calculate angle between three points
  const calculateAngle = (a: Keypoint, b: Keypoint, c: Keypoint) => {
    if (!a || !b || !c) return 0;
    
    const ab = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    const bc = Math.sqrt(Math.pow(b.x - c.x, 2) + Math.pow(b.y - c.y, 2));
    const ac = Math.sqrt(Math.pow(c.x - a.x, 2) + Math.pow(c.y - a.y, 2));
    
    return Math.acos((ab * ab + bc * bc - ac * ac) / (2 * ab * bc)) * (180 / Math.PI);
  };

  // Calculate distance between two points
  const calculateDistance = (a: any, b: any) => {
    if (!a || !b) return 0;
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  };

  // Exercise-specific analysis functions
  const analyzeSquat = (keypoints: KeypointsObject) => {
    // Get relevant keypoints
    const leftHip = keypoints['left_hip'];
    const leftKnee = keypoints['left_knee'];
    const leftAnkle = keypoints['left_ankle'];
    const rightHip = keypoints['right_hip'];
    const rightKnee = keypoints['right_knee'];
    const rightAnkle = keypoints['right_ankle'];
    // These variables are used in more complex implementations
    const _leftShoulder = keypoints['left_shoulder'];
    const _rightShoulder = keypoints['right_shoulder'];
    
    if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
      return "Make sure your full body is visible in the camera";
    }
    
    // Check knee angle
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    const kneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
    
    const criteria = exerciseCriteria.squat;
    
    if (kneeAngle < criteria.kneeAngle.min || kneeAngle > criteria.kneeAngle.max) {
      return criteria.kneeAngle.message;
    }
    
    // Check hip alignment
    const hipDiff = Math.abs(leftHip.y - rightHip.y);
    if (hipDiff > criteria.hipAlignment.threshold) {
      return criteria.hipAlignment.message;
    }
    
    // More checks could be added here
    
    return "Good form! Keep it up.";
  };

  const analyzePushup = (keypoints: KeypointsObject) => {
    // Get relevant keypoints
    const leftShoulder = keypoints['left_shoulder'];
    const leftElbow = keypoints['left_elbow'];
    const leftWrist = keypoints['left_wrist'];
    const rightShoulder = keypoints['right_shoulder'];
    const rightElbow = keypoints['right_elbow'];
    const rightWrist = keypoints['right_wrist'];
    
    if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist) {
      return "Make sure your upper body is visible in the camera";
    }
    
    // Check elbow angle
    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    const elbowAngle = (leftElbowAngle + rightElbowAngle) / 2;
    
    const criteria = exerciseCriteria.pushup;
    
    if (elbowAngle < criteria.elbowAngle.min || elbowAngle > criteria.elbowAngle.max) {
      return criteria.elbowAngle.message;
    }
    
    // More checks could be added here
    
    return "Good push-up form! Continue your reps.";
  };

  const analyzeLunge = (keypoints: KeypointsObject) => {
    // Check if keypoints are detected
    const hasKeypoints = keypoints['left_knee'] && keypoints['right_knee'] && 
                        keypoints['left_ankle'] && keypoints['right_ankle'];
                        
    if (!hasKeypoints) {
      return "Make sure your legs are visible in the camera";
    }
    
    // Simplified implementation
    return "Keep your front knee aligned with your ankle. Maintain an upright posture.";
  };

  const analyzePlank = (keypoints: KeypointsObject) => {
    // Check if keypoints are detected
    const hasKeypoints = keypoints['left_shoulder'] && keypoints['right_shoulder'] &&
                        keypoints['left_hip'] && keypoints['right_hip'] &&
                        keypoints['left_ankle'] && keypoints['right_ankle'];
                        
    if (!hasKeypoints) {
      return "Make sure your full body is visible in the camera";
    }
    
    // Simplified implementation
    return "Keep your body in a straight line from head to heels. Engage your core muscles.";
  };

  const analyzeBicepCurl = (keypoints: KeypointsObject) => {
    // Check if keypoints are detected
    const hasKeypoints = keypoints['left_shoulder'] && keypoints['right_shoulder'] &&
                        keypoints['left_elbow'] && keypoints['right_elbow'] &&
                        keypoints['left_wrist'] && keypoints['right_wrist'];
                        
    if (!hasKeypoints) {
      return "Make sure your arms are visible in the camera";
    }
    
    // Simplified implementation
    return "Keep your elbows close to your body. Focus on controlled movements.";
  };

  // This component doesn't render anything visible
  return null;
} 