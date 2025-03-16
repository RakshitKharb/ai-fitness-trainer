import Link from 'next/link';
import { FaDumbbell, FaRobot, FaVideo, FaChartLine } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center">
        <div className="container mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Your AI Fitness Trainer
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto">
            Get real-time posture correction and workout guidance with our AI-powered fitness coach
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/workout" 
              className="inline-block py-3 px-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg transition transform hover:scale-105 hover:shadow-lg"
            >
              Start Workout
            </Link>
            <Link 
              href="/plans" 
              className="inline-block py-3 px-8 rounded-full border-2 border-blue-600 text-blue-600 font-semibold text-lg transition transform hover:scale-105 hover:shadow-lg"
            >
              View Workout Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<FaVideo className="text-blue-500 text-4xl" />}
              title="Real-time Video Analysis"
              description="Our AI analyzes your movements through your camera to provide instant feedback"
            />
            <FeatureCard 
              icon={<FaDumbbell className="text-purple-500 text-4xl" />}
              title="Perfect Form Guidance"
              description="Get corrections on your exercise form to maximize results and prevent injuries"
            />
            <FeatureCard 
              icon={<FaRobot className="text-green-500 text-4xl" />}
              title="AI-Powered Coaching"
              description="Personalized feedback and motivation from our advanced AI coaching system"
            />
            <FeatureCard 
              icon={<FaChartLine className="text-red-500 text-4xl" />}
              title="Progress Tracking"
              description="Monitor your improvements and receive customized workout recommendations"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Ready to Transform Your Workout?</h2>
          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Experience the future of fitness training with real-time AI guidance.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/workout" 
              className="inline-block py-3 px-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg transition transform hover:scale-105 hover:shadow-lg"
            >
              Start Now
            </Link>
            <Link 
              href="/plans" 
              className="inline-block py-3 px-8 rounded-full border-2 border-blue-600 text-blue-600 font-semibold text-lg transition transform hover:scale-105 hover:shadow-lg"
            >
              Explore Plans
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md transition hover:shadow-lg hover:transform hover:scale-105">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-center mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
}
