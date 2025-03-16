import axios from 'axios';

// Define types
interface Keypoint {
  name: string;
  position: {
    x: number;
    y: number;
  };
  confidence: number;
}

interface PoseData {
  keypoints: Array<{
    name: string;
    x: number;
    y: number;
    score: number;
  }>;
  score: number;
}

interface FormattedPoseData {
  exerciseType: string;
  keypoints: Keypoint[];
  timestamp: string;
}

// Gemini API service for advanced exercise analysis
export const analyzeExerciseWithGemini = async (
  poseData: PoseData,
  exerciseType: string
): Promise<string> => {
  try {
    // For a real implementation, you would use your Google Gemini API key
    // const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with actual key in production
    
    // Format pose data for Gemini
    const formattedPoseData = formatPoseDataForGemini(poseData, exerciseType);
    
    // Example request to Gemini API
    // In a real implementation, you would use your actual Google Gemini API endpoint
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
      {
        contents: [
          {
            parts: [
              {
                text: `You are a professional fitness trainer. Analyze this ${exerciseType} pose data and provide feedback on form, technique, and suggestions for improvement. Use a friendly, encouraging tone. 
                
                Pose data: ${JSON.stringify(formattedPoseData)}
                
                Focus on the following aspects:
                1. Body alignment
                2. Joint angles
                3. Common mistakes for this exercise
                4. Improvement suggestions
                
                Provide a concise response in 2-3 sentences.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 200
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        }
      }
    );
    
    // Extract Gemini's analysis from the response
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error analyzing exercise with Gemini:', error);
    return 'I cannot analyze your form right now. Please try again later.';
  }
};

// Helper to format pose data in a way that's useful for Gemini
const formatPoseDataForGemini = (poseData: PoseData, exerciseType: string): FormattedPoseData => {
  // Extract relevant keypoints and angles based on exercise type
  const keypoints = poseData.keypoints;
  
  // For demonstration, we'll just format the raw data
  // In a real implementation, you would calculate specific angles
  // and relative positions that are most relevant to the given exercise
  
  // Return formatted data object
  return {
    exerciseType,
    keypoints: keypoints.map((kp) => ({
      name: kp.name,
      position: { x: kp.x, y: kp.y },
      confidence: kp.score
    })),
    timestamp: new Date().toISOString()
  };
};

// For simulation/development when Gemini API is not available
export const simulateGeminiAnalysis = (
  exerciseType: string
): string => {
  const feedbackOptions: {[key: string]: string[]} = {
    squat: [
      "Keep your knees aligned with your toes and go deeper in your squat. Try to reach parallel with the ground for maximum benefit.",
      "Great depth on your squat, but watch your lower back position. Keep your core engaged to maintain a neutral spine.",
      "Your weight is shifting forward too much. Focus on keeping weight in your heels and maintaining an upright chest position."
    ],
    pushup: [
      "Lower your body more to get the full range of motion. Aim to bring your chest close to the floor while keeping your core tight.",
      "Your elbows are flaring out too wide. Keep them at about a 45-degree angle to your body to protect your shoulders.",
      "Great form! Maintain that straight line from head to heels and continue with controlled movements."
    ],
    lunge: [
      "Step forward a bit more to create proper knee alignment. Your front knee should be directly above your ankle.",
      "Try to lower your back knee closer to the ground while keeping your torso upright for a deeper stretch.",
      "Watch your front knee - it's moving inward. Focus on pushing it slightly outward in line with your middle toe."
    ],
    plank: [
      "Your hips are sagging down. Engage your core and glutes to maintain a straight line from head to heels.",
      "Looking good! Remember to breathe normally and keep your gaze down to maintain neutral neck alignment.",
      "Your shoulders are shrugging toward your ears. Relax them down and back while keeping your core engaged."
    ],
    'bicep-curl': [
      "You're using momentum from your back. Slow down the movement and focus on isolating the biceps muscle.",
      "Great control! Try to fully extend your arms at the bottom of the movement for full range of motion.",
      "Keep your elbows fixed at your sides throughout the entire movement to maximize bicep engagement."
    ]
  };
  
  // Get feedback options for the selected exercise, or generic feedback if not found
  const options = feedbackOptions[exerciseType] || [
    "Focus on proper form rather than speed. Slow, controlled movements are more effective.",
    "Remember to breathe steadily throughout the exercise. Don't hold your breath.",
    "Great effort! Make sure to maintain proper form as you start to fatigue."
  ];
  
  // Return a random feedback message from the available options
  return options[Math.floor(Math.random() * options.length)];
}; 