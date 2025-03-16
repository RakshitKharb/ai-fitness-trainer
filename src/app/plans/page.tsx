'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaArrowRight, FaDumbbell, FaFire, FaClock } from 'react-icons/fa';

// Define types here since imports are causing issues
interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restSeconds: number;
  description: string;
  tips: string[];
}

interface WorkoutDay {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  daysPerWeek: number;
  weeks: number;
  workoutDays: WorkoutDay[];
}

// Sample workout plans
const workoutPlans: WorkoutPlan[] = [
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
          }
        ]
      }
    ]
  }
];

export default function WorkoutPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Filter plans by selected level
  const filteredPlans = selectedLevel === 'all' 
    ? workoutPlans 
    : workoutPlans.filter(plan => plan.level === selectedLevel);

  const handlePlanSelect = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <FaHome className="mr-2" /> Back to Home
          </Link>
          
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
            Workout Plans
          </h1>
          
          <Link 
            href="/workout" 
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            Go to Workout <FaArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Plan Detail View */}
        {selectedPlan && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedPlan.name}</h2>
                <div className="flex items-center mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold mr-3 
                    ${selectedPlan.level === 'beginner' ? 'bg-green-100 text-green-800' : 
                      selectedPlan.level === 'intermediate' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'}`}
                  >
                    {selectedPlan.level.charAt(0).toUpperCase() + selectedPlan.level.slice(1)}
                  </span>
                  <span className="flex items-center text-sm text-gray-600">
                    <FaClock className="mr-1" /> {selectedPlan.daysPerWeek} days/week
                  </span>
                  <span className="flex items-center text-sm text-gray-600 ml-4">
                    <FaFire className="mr-1" /> {selectedPlan.weeks} weeks
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPlan(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Back to list
              </button>
            </div>
            
            <p className="text-gray-700 mb-6">{selectedPlan.description}</p>
            
            <div className="space-y-6">
              {selectedPlan.workoutDays.map((day) => (
                <div key={day.id} className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{day.name}</h3>
                  <div className="space-y-4">
                    {day.exercises.map((exercise) => (
                      <ExerciseCard key={exercise.id} exercise={exercise} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link
                href="/workout"
                className="inline-block py-3 px-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg transition transform hover:scale-105 hover:shadow-lg"
              >
                Start This Workout
              </Link>
            </div>
          </div>
        )}

        {/* Plan List View */}
        {!selectedPlan && (
          <>
            {/* Level Filter */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  onClick={() => setSelectedLevel('all')}
                  className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
                    selectedLevel === 'all' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  All Levels
                </button>
                <button
                  onClick={() => setSelectedLevel('beginner')}
                  className={`px-4 py-2 text-sm font-medium border-t border-b border-r ${
                    selectedLevel === 'beginner' 
                      ? 'bg-green-600 text-white border-green-600' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Beginner
                </button>
                <button
                  onClick={() => setSelectedLevel('intermediate')}
                  className={`px-4 py-2 text-sm font-medium border-t border-b border-r ${
                    selectedLevel === 'intermediate' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Intermediate
                </button>
                <button
                  onClick={() => setSelectedLevel('advanced')}
                  className={`px-4 py-2 text-sm font-medium border-t border-b border-r rounded-r-lg ${
                    selectedLevel === 'advanced' 
                      ? 'bg-red-600 text-white border-red-600' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Advanced
                </button>
              </div>
            </div>
            
            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => (
                <div 
                  key={plan.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handlePlanSelect(plan)}
                >
                  <div className={`h-2 ${
                    plan.level === 'beginner' ? 'bg-green-500' : 
                    plan.level === 'intermediate' ? 'bg-blue-500' : 
                    'bg-red-500'
                  }`} />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                        ${plan.level === 'beginner' ? 'bg-green-100 text-green-800' : 
                          plan.level === 'intermediate' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {plan.level.charAt(0).toUpperCase() + plan.level.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {plan.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center">
                        <FaDumbbell className="mr-1" /> {plan.workoutDays.length} workouts
                      </span>
                      <span className="flex items-center">
                        <FaClock className="mr-1" /> {plan.daysPerWeek} days/week
                      </span>
                      <span className="flex items-center">
                        <FaFire className="mr-1" /> {plan.weeks} weeks
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

// Exercise Card Component
function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-800">{exercise.name}</h4>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering parent click
            setShowDetails(!showDetails);
          }}
          className="text-blue-600 text-sm hover:text-blue-800"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      <div className="flex items-center text-sm text-gray-600 mt-2">
        <span>{exercise.sets} sets</span>
        <span className="mx-2">•</span>
        <span>{exercise.reps} {exercise.reps === 1 ? 'rep' : 'reps'}</span>
        <span className="mx-2">•</span>
        <span>{exercise.restSeconds}s rest</span>
      </div>
      
      {showDetails && (
        <div className="mt-4 space-y-3 text-sm">
          <p className="text-gray-700">{exercise.description}</p>
          
          <div>
            <h5 className="font-medium text-gray-800 mb-1">Tips:</h5>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {exercise.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 