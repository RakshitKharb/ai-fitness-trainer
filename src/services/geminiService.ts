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
      "Bend your knees to 90 degrees, keeping your back straight and core tight. Weight should be in your heels.",
      "Keep your knees aligned with your toes - don't let them collapse inward. Chest up, shoulders back.",
      "Lower your hips until your thighs are parallel to the ground. Keep your heels planted firmly."
    ],
    pushup: [
      "Keep your body in a straight line from head to heels. Lower until your elbows are at 90 degrees.",
      "Position your hands slightly wider than shoulder-width. Keep your elbows at about 45 degrees from your body.",
      "Engage your core throughout the movement. Don't let your hips sag or pike up."
    ],
    lunge: [
      "Step forward with alignment - front knee directly above ankle, back knee lowered toward the floor.",
      "Keep your torso upright and core engaged throughout the movement. Don't lean forward.",
      "Push through your front heel to return to starting position. Keep your movements controlled."
    ],
    plank: [
      "Maintain a straight line from head to heels. Engage your core, glutes, and quads.",
      "Position your elbows directly beneath your shoulders. Keep your neck in a neutral position.",
      "Don't let your hips sag toward the floor or pike up toward the ceiling. Breathe normally."
    ],
    'bicep-curl': [
      "Keep your elbows fixed at your sides throughout the movement. Use only your forearms to lift.",
      "Control the movement in both directions - don't swing or use momentum to lift the weight.",
      "Fully extend your arms at the bottom and fully contract your biceps at the top of each rep."
    ]
  };
  
  // Get feedback options for the selected exercise, or generic feedback if not found
  const options = feedbackOptions[exerciseType] || [
    "Focus on maintaining proper form throughout the exercise. Quality over quantity.",
    "Remember to breathe steadily - exhale during exertion and inhale during the easier phase.",
    "Keep your movements controlled and deliberate. Don't rush through repetitions."
  ];
  
  // Return a random feedback message from the available options
  return options[Math.floor(Math.random() * options.length)];
}; 