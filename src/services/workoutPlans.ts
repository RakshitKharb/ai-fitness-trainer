// Define workout plan types
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restSeconds: number;
  description: string;
  tips: string[];
}

export interface WorkoutDay {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  daysPerWeek: number;
  weeks: number;
  workoutDays: WorkoutDay[];
}

// Predefined workout plans
export const workoutPlans: WorkoutPlan[] = [
  {
    id: 'beginner-full-body',
    name: 'Beginner Full Body Program',
    level: 'beginner',
    description: 'A complete full-body workout program designed for beginners. Focus on learning proper form and building a solid foundation.',
    daysPerWeek: 3,
    weeks: 4,
    workoutDays: [
      {
        id: 'day1',
        name: 'Full Body Workout A',
        exercises: [
          {
            id: 'squat',
            name: 'Bodyweight Squats',
            sets: 3,
            reps: 12,
            restSeconds: 60,
            description: 'A fundamental lower body exercise targeting quadriceps, hamstrings, and glutes.',
            tips: [
              'Keep your feet shoulder-width apart',
              'Keep your back straight',
              'Push your hips back as if sitting in a chair',
              'Lower until thighs are parallel to the ground',
              'Keep your knees aligned with your toes'
            ]
          },
          {
            id: 'pushup',
            name: 'Push-ups (Modified if needed)',
            sets: 3,
            reps: 10,
            restSeconds: 60,
            description: 'An upper body exercise targeting chest, shoulders, and triceps.',
            tips: [
              'Keep your body in a straight line from head to heels',
              'Lower your chest to the ground',
              'Keep elbows at a 45-degree angle to your body',
              'Beginners can do push-ups on knees or against a wall'
            ]
          },
          {
            id: 'plank',
            name: 'Plank',
            sets: 3,
            reps: 1,
            restSeconds: 60,
            description: 'A core exercise that strengthens the abs, back, and shoulders.',
            tips: [
              'Hold position for 20-30 seconds',
              'Keep your body in a straight line',
              'Engage your core muscles',
              "Don't let your hips sag or rise"
            ]
          }
        ]
      },
      {
        id: 'day2',
        name: 'Full Body Workout B',
        exercises: [
          {
            id: 'lunge',
            name: 'Forward Lunges',
            sets: 3,
            reps: 10,
            restSeconds: 60,
            description: 'A lower body exercise targeting quadriceps, hamstrings, and glutes.',
            tips: [
              'Step forward with one leg',
              'Lower your body until both knees are bent at 90 degrees',
              'Keep your front knee above your ankle',
              'Push back to starting position',
              'Alternate legs'
            ]
          },
          {
            id: 'row',
            name: 'Seated Rows (with resistance band)',
            sets: 3,
            reps: 12,
            restSeconds: 60,
            description: 'An upper body pulling exercise targeting back muscles.',
            tips: [
              'Sit with legs extended',
              'Wrap resistance band around feet',
              'Pull the band toward your torso',
              'Keep your back straight',
              'Squeeze shoulder blades together'
            ]
          },
          {
            id: 'bicycle-crunch',
            name: 'Bicycle Crunches',
            sets: 3,
            reps: 15,
            restSeconds: 60,
            description: 'A core exercise targeting the obliques and abdominal muscles.',
            tips: [
              'Lie on your back with hands behind your head',
              'Alternate bringing opposite elbow to knee',
              'Keep movements slow and controlled',
              'Keep lower back pressed into the floor'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'intermediate-strength',
    name: 'Intermediate Strength Program',
    level: 'intermediate',
    description: 'A 5-day split program designed to build strength and muscle mass for those with some fitness experience.',
    daysPerWeek: 5,
    weeks: 8,
    workoutDays: [
      {
        id: 'day1',
        name: 'Chest and Triceps',
        exercises: [
          {
            id: 'bench-press',
            name: 'Bench Press',
            sets: 4,
            reps: 8,
            restSeconds: 90,
            description: 'A compound chest exercise that also works shoulders and triceps.',
            tips: [
              'Keep feet flat on the floor',
              'Maintain natural arch in lower back',
              'Lower the bar to mid-chest',
              'Keep wrists straight',
              'Drive the bar upward in a straight line'
            ]
          },
          {
            id: 'incline-dumbbell-press',
            name: 'Incline Dumbbell Press',
            sets: 3,
            reps: 10,
            restSeconds: 90,
            description: 'Targets the upper chest muscles.',
            tips: [
              'Set bench to 30-45 degree incline',
              'Keep back and head against the bench',
              'Lower dumbbells to chest level',
              'Press upward until arms are extended but not locked'
            ]
          },
          {
            id: 'tricep-dips',
            name: 'Tricep Dips',
            sets: 3,
            reps: 12,
            restSeconds: 90,
            description: 'Isolates and strengthens the triceps.',
            tips: [
              'Use parallel bars or bench',
              'Lower body until elbows are at 90 degrees',
              'Keep elbows close to body',
              "Don't let shoulders roll forward"
            ]
          }
        ]
      },
      {
        id: 'day2',
        name: 'Back and Biceps',
        exercises: [
          {
            id: 'pullups',
            name: 'Pull-ups or Assisted Pull-ups',
            sets: 4,
            reps: 8,
            restSeconds: 90,
            description: 'A compound back exercise that also works biceps.',
            tips: [
              'Grip the bar slightly wider than shoulder width',
              'Pull up until chin is over the bar',
              'Lower with control',
              'Use assisted machine if needed'
            ]
          },
          {
            id: 'bent-over-row',
            name: 'Bent-Over Barbell Row',
            sets: 3,
            reps: 10,
            restSeconds: 90,
            description: 'Targets the middle back muscles.',
            tips: [
              'Bend at the hips with slight knee bend',
              'Keep back straight and core engaged',
              'Pull barbell to lower chest/upper abdomen',
              'Lower with control'
            ]
          },
          {
            id: 'bicep-curl',
            name: 'Bicep Curls',
            sets: 3,
            reps: 12,
            restSeconds: 60,
            description: 'Isolates and strengthens the biceps.',
            tips: [
              'Keep elbows close to sides',
              'Curl weights toward shoulders',
              "Don't swing or use momentum",
              'Lower with control'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'advanced-hiit',
    name: 'Advanced HIIT Program',
    level: 'advanced',
    description: 'A high-intensity interval training program for advanced fitness enthusiasts looking to improve conditioning and burn fat.',
    daysPerWeek: 4,
    weeks: 6,
    workoutDays: [
      {
        id: 'day1',
        name: 'HIIT Circuit 1',
        exercises: [
          {
            id: 'burpees',
            name: 'Burpees',
            sets: 5,
            reps: 15,
            restSeconds: 30,
            description: 'A full-body exercise that combines a squat, push-up, and jump.',
            tips: [
              'Start in standing position',
              'Drop into squat position and place hands on ground',
              'Kick feet back into plank position',
              'Perform a push-up',
              'Return feet to squat position',
              'Jump up explosively'
            ]
          },
          {
            id: 'mountain-climbers',
            name: 'Mountain Climbers',
            sets: 5,
            reps: 30,
            restSeconds: 30,
            description: 'A cardio exercise that also works core, shoulders, and legs.',
            tips: [
              'Start in plank position',
              'Bring one knee toward chest, then switch quickly',
              'Keep hips stable and level',
              'Maintain strong plank position',
              'Move as quickly as possible while maintaining form'
            ]
          },
          {
            id: 'box-jumps',
            name: 'Box Jumps',
            sets: 5,
            reps: 12,
            restSeconds: 30,
            description: 'A plyometric exercise that builds explosive power in the legs.',
            tips: [
              'Stand in front of box with feet shoulder-width apart',
              'Swing arms back, then forward as you jump',
              'Land softly with knees bent',
              "Step back down (don't jump down)",
              'Choose appropriate box height for your ability'
            ]
          }
        ]
      }
    ]
  }
];

// Get a workout plan by ID
export const getWorkoutPlan = (planId: string): WorkoutPlan | undefined => {
  return workoutPlans.find(plan => plan.id === planId);
};

// Get workout plans by difficulty level
export const getWorkoutPlansByLevel = (level: 'beginner' | 'intermediate' | 'advanced'): WorkoutPlan[] => {
  return workoutPlans.filter(plan => plan.level === level);
};

// Get exercises for a specific muscle group
export const getExercisesForMuscleGroup = (muscleGroup: string): Exercise[] => {
  // This function would filter through all exercises to find those targeting a specific muscle group
  // For simplicity, we're returning a small subset based on the muscle group
  
  const allExercises: Exercise[] = workoutPlans.flatMap(plan => 
    plan.workoutDays.flatMap(day => day.exercises)
  );
  
  // This is a simplified version - in a real app, you'd have muscle group tags for each exercise
  switch (muscleGroup.toLowerCase()) {
    case 'chest':
      return allExercises.filter(ex => 
        ex.id.includes('push') || ex.id.includes('bench') || ex.id.includes('dips')
      );
    case 'back':
      return allExercises.filter(ex => 
        ex.id.includes('row') || ex.id.includes('pull')
      );
    case 'legs':
      return allExercises.filter(ex => 
        ex.id.includes('squat') || ex.id.includes('lunge') || ex.id.includes('jump')
      );
    case 'arms':
      return allExercises.filter(ex => 
        ex.id.includes('curl') || ex.id.includes('tricep') || ex.id.includes('dips')
      );
    case 'core':
      return allExercises.filter(ex => 
        ex.id.includes('plank') || ex.id.includes('crunch') || ex.id.includes('climber')
      );
    default:
      return [];
  }
}; 