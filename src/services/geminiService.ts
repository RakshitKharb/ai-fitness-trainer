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
  keypoints: Keypoint[];
  score: number;
}

interface FormattedPoseData {
  exerciseType: string;
  keypoints: Keypoint[];
  timestamp: string;
}

// Helper to format pose data in a way that's useful for Gemini
const formatPoseDataForGemini = (poseData: PoseData, exerciseType: string) => {
  // Extract relevant keypoints and angles based on exercise type
  const keypoints = poseData.keypoints;
  
  // For demonstration, we'll just format the raw data
  // In a real implementation, you would calculate specific angles
  // and relative positions that are most relevant to the given exercise
  
  // Return formatted data object
  return {
    exerciseType,
    keypoints: keypoints.map((kp: any) => ({
      name: kp.name,
      position: { x: kp.x, y: kp.y },
      confidence: kp.score
    })),
    timestamp: new Date().toISOString()
  };
};

// Gemini API service for advanced exercise analysis
export const analyzeExerciseWithGemini = async (
  poseData: PoseData,
  exerciseType: string
): Promise<string> => {
  try {
    // Check if we should use simulation instead of real API
    if (process.env.NEXT_PUBLIC_USE_SIMULATION === 'true') {
      console.log('Using simulation mode for Gemini analysis');
      return simulateGeminiAnalysis(exerciseType, poseData);
    }
    
    // For a real implementation, you would use your Google Gemini API key
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.error('No Gemini API key found. Using simulation.');
      return simulateGeminiAnalysis(exerciseType, poseData);
    }
    
    // Format pose data for Gemini
    const formattedPoseData = formatPoseDataForGemini(poseData, exerciseType);
    
    // Example request to Gemini API
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

// For simulation/development when Gemini API is not available
export const simulateGeminiAnalysis = (
  exerciseType: string,
  poseData?: PoseData
): string => {
  // Track how many feedback calls have been made
  window.feedbackCounter = window.feedbackCounter || 0;
  window.feedbackCounter++;
  
  // Base feedback options grouped by exercise and progress stage
  const feedbackOptions: {[key: string]: {initial: string[], middle: string[], advanced: string[]}} = {
    squat: {
      initial: [
        "Begin by standing with feet shoulder-width apart. Keep your back straight as you lower into the squat position.",
        "Focus on your starting position - feet flat, weight evenly distributed, and core engaged before you begin."
      ],
      middle: [
        "Bend your knees to 90 degrees, keeping your back straight and core tight. Weight should be in your heels.",
        "Keep your knees aligned with your toes - don't let them collapse inward. Chest up, shoulders back.",
        "Lower your hips until your thighs are parallel to the ground. Keep your heels planted firmly."
      ],
      advanced: [
        "Excellent depth in your squat! Continue maintaining knee alignment and core engagement throughout.",
        "Your form is improving nicely. Focus now on consistent depth and pace with each repetition.",
        "Great work! Try adding a brief pause at the bottom of your squat to increase muscle engagement."
      ]
    },
    pushup: {
      initial: [
        "Start in a plank position with hands slightly wider than shoulders. Set your core before beginning.",
        "Ensure your starting position is solid - hands under shoulders, back flat, and gaze slightly forward."
      ],
      middle: [
        "Keep your body in a straight line from head to heels. Lower until your elbows are at 90 degrees.",
        "Position your hands slightly wider than shoulder-width. Keep your elbows at about 45 degrees from your body.",
        "Engage your core throughout the movement. Don't let your hips sag or pike up."
      ],
      advanced: [
        "Excellent push-up form! Your body alignment is perfect and your depth is consistent.",
        "Your push-up technique is looking strong. Focus on maintaining this quality as you increase repetitions.",
        "Great control through the full range of motion. Consider slowing down slightly to increase difficulty."
      ]
    },
    lunge: {
      initial: [
        "Begin with feet hip-width apart. Take a controlled step forward keeping your upper body straight.",
        "Start with shorter steps until you build stability, then gradually increase your lunge depth."
      ],
      middle: [
        "Step forward with alignment - front knee directly above ankle, back knee lowered toward the floor.",
        "Keep your torso upright and core engaged throughout the movement. Don't lean forward.",
        "Push through your front heel to return to starting position. Keep your movements controlled."
      ],
      advanced: [
        "Excellent lunge depth and knee alignment! Your balance is improving with each repetition.",
        "Your lunges are looking very controlled. Focus on equal work with both legs for balanced strength.",
        "Great work with maintaining your upright posture. Try adding a slight pause at the bottom of each lunge."
      ]
    },
    plank: {
      initial: [
        "Start by positioning your elbows directly beneath your shoulders with forearms on the ground.",
        "Set your starting position carefully - elbows under shoulders, forearms parallel, and toes grounded."
      ],
      middle: [
        "Maintain a straight line from head to heels. Engage your core, glutes, and quads.",
        "Position your elbows directly beneath your shoulders. Keep your neck in a neutral position.",
        "Don't let your hips sag toward the floor or pike up toward the ceiling. Breathe normally."
      ],
      advanced: [
        "Excellent plank position! Your body alignment is perfect from head to heels.",
        "Your core engagement is visibly improving. Try to maintain this quality for increasing duration.",
        "Great stability in your plank. Consider adding small shoulder taps while maintaining position."
      ]
    },
    'bicep-curl': {
      initial: [
        "Begin with arms fully extended, palms facing forward. Maintain a straight back before you start.",
        "Start with your feet shoulder-width apart and elbows close to your sides for stability."
      ],
      middle: [
        "Keep your elbows fixed at your sides throughout the movement. Use only your forearms to lift.",
        "Control the movement in both directions - don't swing or use momentum to lift the weight.",
        "Fully extend your arms at the bottom and fully contract your biceps at the top of each rep."
      ],
      advanced: [
        "Excellent bicep curl technique! Your elbow position is steady and your pace is controlled.",
        "Your curls are showing great improvement. Focus on the squeeze at the top of each movement.",
        "Great control through the full range of motion. Consider a brief pause at the top of each curl."
      ]
    }
  };
  
  // Select the appropriate stage based on progress (simulated by counter)
  let stage = 'initial';
  if (window.feedbackCounter > 3 && window.feedbackCounter <= 6) {
    stage = 'middle';
  } else if (window.feedbackCounter > 6) {
    stage = 'advanced';
  }
  
  // Get feedback options for the selected exercise and stage, or generic feedback if not found
  let options = feedbackOptions[exerciseType]?.[stage];
  
  if (!options) {
    options = [
      "Focus on maintaining proper form throughout the exercise. Quality over quantity.",
      "Remember to breathe steadily - exhale during exertion and inhale during the easier phase.",
      "Keep your movements controlled and deliberate. Don't rush through repetitions."
    ];
  }
  
  // Simulate analyzing the pose data (if provided) to make feedback more realistic
  if (poseData && poseData.keypoints && poseData.keypoints.length > 0) {
    // Just using the presence of pose data to add variety, not actually analyzing it
    // In a real implementation, you would analyze joint angles, etc.
    const confidence = poseData.score || Math.random();
    
    // If confidence is low, provide positioning feedback
    if (confidence < 0.6) {
      return "Try to position yourself more clearly in the camera frame. I need a better view to give accurate feedback.";
    }
  }
  
  // Return a deterministic feedback message based on the counter to simulate progression
  return options[window.feedbackCounter % options.length];
}; 