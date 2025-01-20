import { MapPin, Bell, Scan, ArrowLeftRight, Flag, Calendar, Signal, Gift, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  {
    title: "Location-Based Hunting",
    description: "Visit race tracks to unlock exclusive cards and special editions only available at specific locations. Get notified of nearby drops during race weekends.",
    icon: MapPin,
    color: "red",
    image: "hunting"
  },
  {
    title: "Real-Time Notifications",
    description: "Stay updated with instant alerts for nearby card drops, trade offers, and special events. Never miss an opportunity to expand your collection.",
    icon: Bell,
    color: "blue",
    image: "notifications"
  },
  {
    title: "AR Card Scanner",
    description: "Use augmented reality to see your digital collection in real-world locations. Use your phone to scan the world around you and see your cards.",
    icon: Scan,
    color: "green",
    image: "scanner"
  },
  {
    title: "Mobile Trading",
    description: "Trade cards with nearby collectors or globally, right from your phone. Chat with other collectors and negotiate deals in real-time.",
    icon: ArrowLeftRight,
    color: "yellow",
    image: "trading"
  },
  {
    title: "Live Race Integration",
    description: "Earn bonus cards and rewards during live races and qualifying sessions. Special cards unlock based on race results and memorable moments.",
    icon: Flag,
    color: "purple",
    image: "events"
  },
  {
    title: "Event Calendar",
    description: "Stay updated with upcoming races and card drop events in your area. Plan your collecting strategy around the racing calendar.",
    icon: Calendar,
    color: "orange",
    image: "calendar"
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <Link 
            href="/"
            className="inline-flex items-center text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Hero */}
        <div className="py-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            PitDeck Mobile{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
              Features
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover all the exciting features that make PitDeck Mobile the ultimate motorsport card collecting experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="relative group"
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000`} />
              <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                <div className={`w-12 h-12 rounded-lg bg-${feature.color}-500/10 flex items-center justify-center mb-6`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-500`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="py-12 text-center">
          <Link
            href="/waitlist"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full bg-white text-black hover:bg-gray-100 transition-colors"
          >
            Join the Waitlist
          </Link>
        </div>
      </div>
    </div>
  );
} 